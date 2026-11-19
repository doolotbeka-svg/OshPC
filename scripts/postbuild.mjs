// После сборки: шаблон страницы переезжает к серверной части, а dist/index.html
// удаляется, чтобы главную страницу отдавал api/render.ts (с готовым текстом).
import { copyFile, rm } from 'node:fs/promises';

await copyFile('dist/index.html', 'dist-server/template.html');
await rm('dist/index.html');
console.log('postbuild: dist/index.html -> dist-server/template.html');
