// Hospedagem estatica (ex.: GitHub Pages) nao reescreve rotas: copia index.html para 404.html
// para que links diretos como /mentoria abram o app em vez de dar 404.
import { copyFileSync, existsSync } from 'node:fs';
const src = new URL('../dist/index.html', import.meta.url);
if (existsSync(src)) copyFileSync(src, new URL('../dist/404.html', import.meta.url));
