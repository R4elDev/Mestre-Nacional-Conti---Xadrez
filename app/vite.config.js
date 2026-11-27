import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Endereço padrão do GitHub Pages: https://r4eldev.github.io/Mestre-Nacional-Monti---Xadrez/
// O build (e o `npm run preview` do build) vive nesse subcaminho; o `npm run dev` fica na raiz.
// Para domínio próprio, gere com VITE_BASE=/ npm run build (e rode o preview com a mesma variável).
const REPO_BASE = '/Mestre-Nacional-Monti---Xadrez/';
const isPreview = process.argv.includes('preview');

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: process.env.VITE_BASE ?? (command === 'build' || isPreview ? REPO_BASE : '/'),
  build: { outDir: 'dist', sourcemap: false }
}));
