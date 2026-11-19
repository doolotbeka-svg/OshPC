import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { DEFAULT_CONTENT, mergeContent, type SiteContent } from '../data/serviceData';

interface ContentState {
  content: SiteContent;
  setContent: (content: SiteContent) => void;
}

const ContentContext = createContext<ContentState>({
  content: DEFAULT_CONTENT,
  setContent: () => {},
});

/** Сколько ждать сохраненное содержимое, прежде чем показать значения по умолчанию. */
const LOAD_TIMEOUT_MS = 2500;

export async function fetchSavedContent(signal?: AbortSignal): Promise<SiteContent> {
  const res = await fetch('/api/content', { signal, cache: 'no-store' });
  if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) {
    return DEFAULT_CONTENT;
  }
  const data: unknown = await res.json();
  return data ? mergeContent(DEFAULT_CONTENT, data) : DEFAULT_CONTENT;
}

export function ContentProvider({
  children,
  initialContent,
}: {
  children: ReactNode;
  /** Содержимое, уже встроенное в страницу сервером: тогда ничего не загружаем */
  initialContent?: SiteContent;
}) {
  const [content, setContent] = useState<SiteContent>(initialContent ?? DEFAULT_CONTENT);
  const [ready, setReady] = useState(initialContent !== undefined);

  useEffect(() => {
    if (initialContent) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => setReady(true), LOAD_TIMEOUT_MS);
    fetchSavedContent(controller.signal)
      .then(setContent)
      .catch(() => {
        // Нет API (локальный запуск) или сеть недоступна — остаемся на значениях по умолчанию
      })
      .finally(() => {
        window.clearTimeout(timer);
        setReady(true);
      });
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [initialContent]);

  useEffect(() => {
    document.title = content.seo.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', content.seo.description);
  }, [content.seo]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white" aria-busy="true">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <ContentContext.Provider value={{ content, setContent }}>{children}</ContentContext.Provider>
  );
}

export function useContent(): SiteContent {
  return useContext(ContentContext).content;
}

export function useSetContent(): (content: SiteContent) => void {
  return useContext(ContentContext).setContent;
}
