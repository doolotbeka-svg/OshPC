import {createRoot, hydrateRoot} from 'react-dom/client';
import App from './App.tsx';
import {ContentProvider} from './content/ContentContext.tsx';
import type {SiteContent} from './data/serviceData.ts';
import './index.css';

declare global {
  interface Window {
    /** Содержимое сайта, встроенное сервером (api/render.ts) */
    __SITE_CONTENT__?: SiteContent;
  }
}

const container = document.getElementById('root')!;
const initialContent = window.__SITE_CONTENT__;
const app = (
  <ContentProvider initialContent={initialContent}>
    <App />
  </ContentProvider>
);

// Сервер уже отрисовал страницу — «оживляем» готовую разметку без перерисовки.
// Админку сервер не рисует (он не видит #admin), поэтому ее рисуем с нуля.
if (initialContent && container.hasChildNodes() && window.location.hash !== '#admin') {
  hydrateRoot(container, app);
} else {
  container.replaceChildren();
  createRoot(container).render(app);
}
