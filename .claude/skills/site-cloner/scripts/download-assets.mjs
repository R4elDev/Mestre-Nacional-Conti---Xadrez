#!/usr/bin/env node
// download-assets.mjs — baixa assets listados em content.json (assets[]) para um diretorio NOVO.
// Uso: node download-assets.mjs --content content/content.json --out downloads/isabellaconti-2026-11-26 [--origin https://isabellaconti.com.br]
// Seguranca: conteudo baixado e NAO CONFIAVEL. Nao executa nada; so grava bytes.
//  - exige diretorio de saida inexistente/vazio (nunca sobrescreve);
//  - so http/https, so o host do site-alvo (ou hosts em --allow-host);
//  - limite de tamanho (25MB) e tipos permitidos (imagem/fonte/video/pdf); SVG e salvo mas marcado "revisar" (pode conter script);
//  - nomes saneados (sem ../), sha256 gravado em manifest.json;
//  - nunca roda interpretador a partir da pasta baixada (rode Node com o script em OUTRA pasta).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => (v.startsWith('--') ? [...a, [v.slice(2), arr[i + 1]]] : a), []));
if (!args.content || !args.out) { console.error('Uso: node download-assets.mjs --content content.json --out <dir-novo> [--origin URL] [--allow-host h1,h2]'); process.exit(2); }
const content = JSON.parse(fs.readFileSync(args.content, 'utf8'));
const origin = new URL(args.origin || content.site.url);
const allowed = new Set([origin.host, ...(args['allow-host'] || '').split(',').filter(Boolean)]);
const OUT = path.resolve(args.out);
if (fs.existsSync(OUT) && fs.readdirSync(OUT).length) { console.error(`ERRO: ${OUT} ja existe e nao esta vazio. Use um diretorio novo.`); process.exit(2); }
fs.mkdirSync(OUT, { recursive: true });

const MAX = 25 * 1024 * 1024;
const OKTYPE = /^(image\/|font\/|video\/|audio\/|application\/(pdf|font|x-font|octet-stream|vnd\.ms-fontobject))|^text\/css$/;
const safe = (s) => s.split('/').filter((p) => p && p !== '.' && p !== '..').map((p) => p.replace(/[^\w.\-@]/g, '_')).join('/');
const manifest = [];

for (const a of content.assets || []) {
  const url = new URL(a.url || a.src, origin);
  const rec = { src: a.src, url: url.href, status: 'erro' };
  try {
    if (!/^https?:$/.test(url.protocol)) throw new Error('protocolo nao permitido');
    if (!allowed.has(url.host)) throw new Error(`host nao permitido: ${url.host} (use --allow-host)`);
    const res = await fetch(url, { redirect: 'follow', headers: { 'user-agent': 'site-cloner/1.0 (autorizado pelo cliente)' } });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const ct = (res.headers.get('content-type') || '').split(';')[0];
    if (!OKTYPE.test(ct) && ct !== '') throw new Error('tipo nao permitido: ' + ct);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > MAX) throw new Error('arquivo grande demais');
    const rel = safe(a.src.replace(/^https?:\/\/[^/]+\//, '')) || 'asset';
    const dest = path.join(OUT, rel);
    if (!dest.startsWith(OUT + path.sep)) throw new Error('caminho fora do diretorio');
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, buf, { flag: 'wx' });
    Object.assign(rec, { status: 'ok', local: path.relative(OUT, dest).replace(/\\/g, '/'), bytes: buf.length, contentType: ct, sha256: crypto.createHash('sha256').update(buf).digest('hex') });
    if (/svg/.test(ct) || /\.svg$/i.test(rel)) rec.aviso = 'SVG pode conter <script>/handlers: sanitizar antes de usar inline';
  } catch (e) { rec.erro = String(e.message || e); }
  manifest.push(rec);
  console.log(`${rec.status === 'ok' ? 'OK  ' : 'ERRO'} ${rec.src} ${rec.erro ? '- ' + rec.erro : `(${rec.bytes} B)`}`);
}
fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify({ origin: origin.href, downloaded_at: new Date().toISOString(), files: manifest }, null, 2));
console.log(`\nmanifest: ${path.join(OUT, 'manifest.json')}`);
process.exit(manifest.some((m) => m.status !== 'ok') ? 1 : 0);
