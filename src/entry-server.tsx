/**
 * Серверная отрисовка главной страницы.
 * Собирается отдельно (`vite build --ssr`) в dist-server/entry-server.js
 * и вызывается из api/render.ts.
 */
import { renderToString } from 'react-dom/server';
import App from './App';
import { ContentProvider } from './content/ContentContext';
import { DEFAULT_CONTENT, mergeContent, type SiteContent } from './data/serviceData';

export function render(saved: unknown): { html: string; content: SiteContent } {
  const content = saved ? mergeContent(DEFAULT_CONTENT, saved) : DEFAULT_CONTENT;
  const html = renderToString(
    <ContentProvider initialContent={content}>
      <App />
    </ContentProvider>
  );
  return { html, content };
}
