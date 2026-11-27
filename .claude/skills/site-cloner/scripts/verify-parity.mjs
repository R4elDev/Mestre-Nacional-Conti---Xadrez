#!/usr/bin/env node
// verify-parity.mjs — compara o CLONE com content.json (fonte da verdade).
// Uso:
//   node verify-parity.mjs --content content/content.json --dump clone-dump.json
//   node verify-parity.mjs --content content/content.json --html-dir dist/ [--html-links]
// --html-links: clone estatico com links internos .html ("/mentoria" -> "mentoria.html", "/" -> "index.html").
// --dump: JSON gerado por scripts/extract-page.js no clone (array de paginas {path,text,hrefs,imgs,title}).
//         Use para SPAs/JS: rode extract-page.js no portal do clone, uma vez por rota.
// --html-dir: pasta com HTML estatico (path "/" -> index.html, "/x" -> x/index.html ou x.html).
// Saida: relatorio + exit code 1 se houver FALHA. Texto verbatim: so normaliza espacos/quebras.
import fs from 'node:fs';
import path from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => (v.startsWith('--') ? [...a, [v.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true]] : a), []));
if (!args.content || (!args.dump && !args['html-dir'])) {
  console.error('Uso: node verify-parity.mjs --content content.json (--dump clone-dump.json | --html-dir dist/)');
  process.exit(2);
}
const content = JSON.parse(fs.readFileSync(args.content, 'utf8'));
const norm = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
const decode = (s) => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n));

function fromHtml(html) {
  const text = decode(html.replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' '));
  const hrefs = [...html.matchAll(/<a\b[^>]*\bhref=["']([^"']*)["']/gi)].map((m) => decode(m[1]));
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => ({
    src: (m[0].match(/\bsrc=["']([^"']*)["']/i) || [])[1] || '',
    alt: decode((m[0].match(/\balt=["']([^"']*)["']/i) || [])[1] || ''),
  }));
  const title = decode((html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || '');
  const lang = (html.match(/<html[^>]*\blang=["']([^"']*)["']/i) || [])[1] || '';
  return { text, hrefs, imgs, title, lang };
}

const pagesClone = {};
if (args.dump) {
  for (const p of JSON.parse(fs.readFileSync(args.dump, 'utf8'))) pagesClone[p.path] = p;
} else {
  const dir = args['html-dir'];
  for (const pg of content.pages) {
    const rel = pg.path === '/' ? 'index.html' : pg.path.replace(/^\//, '');
    const cands = [path.join(dir, rel, 'index.html'), path.join(dir, rel + '.html'), path.join(dir, rel)];
    const f = cands.find((c) => fs.existsSync(c) && fs.statSync(c).isFile());
    if (f) pagesClone[pg.path] = { path: pg.path, ...fromHtml(fs.readFileSync(f, 'utf8')) };
  }
}

let fail = 0, warn = 0, ok = 0;
const out = [];
const FAIL = (m) => { fail++; out.push('  FALHA  ' + m); };
const WARN = (m) => { warn++; out.push('  AVISO  ' + m); };
const OK = () => { ok++; };

// coleta itens esperados de uma secao (qualquer campo conhecido)
function expected(sec) {
  const t = [], c = [], im = [];
  const addCta = (x) => x && c.push(x);
  if (sec.heading?.text) t.push(sec.heading.text);
  (sec.texts || []).forEach((x) => t.push(x));
  (sec.bullets || []).forEach((x) => t.push(x));
  if (sec.price) { t.push(sec.price.display); if (sec.price.period_display) t.push(sec.price.period_display.replace(/^\//, '').trim()); }
  (sec.ctas || []).forEach(addCta);
  (sec.cards || []).forEach((k) => { ['tag', 'title', 'text', 'for_you'].forEach((f) => k[f] && t.push(k[f])); addCta(k.cta); });
  (sec.steps || []).forEach((s) => { t.push(s.title, s.text); });
  (sec.subsections || []).forEach((s) => { t.push(s.heading.text, ...(s.texts || [])); });
  (sec.images || []).forEach((i) => { im.push(i); if (i.caption) t.push(i.caption); });
  (sec.videos || []).forEach((v) => v.src && c.push({ label: v.title || 'video', url: v.src, _video: true }));
  (sec.items || []).forEach((q) => { if (q.question) t.push(q.question, q.answer); });
  return { t, c, im };
}

for (const pg of content.pages) {
  out.push(`\n[${pg.path}] ${pg.id}`);
  const cl = pagesClone[pg.path];
  if (!cl) { FAIL('pagina ausente no clone'); continue; }
  const text = norm(cl.text);
  const hrefs = (cl.hrefs || []).map(norm);
  const imgs = cl.imgs || [];
  if (pg.title && norm(cl.title) !== norm(pg.title)) FAIL(`<title> "${cl.title}" != "${pg.title}"`); else OK();
  for (const sec of pg.sections) {
    const e = expected(sec);
    for (const s of e.t) { if (!text.includes(norm(s))) FAIL(`${sec.id}: texto ausente/diferente: "${norm(s).slice(0, 90)}"`); else OK(); }
    for (const x of e.c) {
      if (!x._video) { const l = (x.label || '').trim(); if (l && !text.includes(norm(l))) FAIL(`${sec.id}: rotulo de CTA ausente: "${l}"`); else OK(); }
      const url = x.url;
      const alt = args['html-links'] && url.startsWith('/') ? (url === '/' ? 'index.html' : url.slice(1) + '.html') : null;
      const hit = hrefs.some((h) => h === url || (alt && (h === alt || h === './' + alt)) || (!/^https?:/.test(url) && !alt && h.endsWith(url)));
      if (!hit) FAIL(`${sec.id}: link ausente/diferente: ${url}`); else OK();
    }
    for (const i of e.im) {
      const base = path.basename(i.src);
      const m = imgs.find((x) => (x.src || '').endsWith(base) || (x.src || '').includes(base.replace(/\.[^.]+$/, '')));
      if (!m) FAIL(`${sec.id}: imagem ausente: ${i.src}`);
      else { OK(); if (norm(m.alt) !== norm(i.alt)) FAIL(`${sec.id}: alt "${m.alt}" != "${i.alt}" (${base})`); else OK(); }
    }
  }
  // texto inventado: heuristica — avisa se clone tem muito mais texto que o conteudo
  const expLen = pg.sections.flatMap((s) => expected(s).t).join(' ').length;
  const navLen = content.nav.map((n) => n.label).join(' ').length + 12;
  if (norm(cl.text).length > (expLen + navLen) * 1.25) WARN(`clone tem >25% mais texto que content.json (${norm(cl.text).length} vs ~${expLen + navLen}) — possivel texto inventado`);
}

out.push('\n[global]');
for (const n of content.nav) {
  const nh = args['html-links'] ? (n.href === '/' ? 'index.html' : n.href.slice(1) + '.html') : n.href;
  const any = Object.values(pagesClone).some((p) => (p.hrefs || []).some((h) => h === n.href || h === nh));
  if (!any) FAIL(`nav: link ${n.href} (${n.label}) ausente`); else OK();
}
for (const u of content.external_links || []) {
  const any = Object.values(pagesClone).some((p) => (p.hrefs || []).includes(u));
  if (!any) FAIL(`link externo ausente em todo o clone: ${u}`); else OK();
}
for (const k of ['whatsapp', 'email', 'phone']) {
  const v = content.contacts?.[k];
  if (v) { const any = Object.values(pagesClone).some((p) => (p.hrefs || []).some((h) => h.includes(String(v).replace(/\D/g, '') || v)) || norm(p.text).includes(String(v))); if (!any) FAIL(`contato ${k} ausente: ${v}`); else OK(); }
}
const langs = Object.values(pagesClone).map((p) => p.lang).filter((x) => x !== undefined);
if (langs.length && langs.some((l) => l && !/^pt/i.test(l))) WARN(`<html lang> do clone nao e pt-BR: ${[...new Set(langs)].join(',')}`);
const todos = JSON.stringify(content).match(/TODO-confirmar[^"]*/g) || [];
out.push(`  INFO   ${todos.length} TODO-confirmar pendentes no content.json (nao bloqueiam, mas devem ser resolvidos com o cliente)`);

console.log(out.join('\n'));
console.log(`\nRESULTADO: ${ok} ok, ${warn} aviso(s), ${fail} falha(s) -> ${fail ? 'REPROVADO' : 'APROVADO'}`);
process.exit(fail ? 1 : 0);
