import { useState } from 'react';
import { Cpu, Menu, Phone, MessageCircle, X } from 'lucide-react';
import { phoneHref, whatsappUrl } from '../data/serviceData';
import { useContent } from '../content/ContentContext';

interface HeaderProps {
  onOpenOrderModal: (prefill?: string) => void;
}

const NAV_LINKS = [
  { href: '#services', label: 'Услуги' },
  { href: '#prices', label: 'Цены' },
  { href: '#advantages', label: 'Преимущества' },
  { href: '#reviews', label: 'Отзывы' },
  { href: '#contacts', label: 'Контакты' },
];

export default function Header({ onOpenOrderModal }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { contacts, hero } = useContent();
  const SITE_CONTACTS = {
    ...contacts,
    phoneHref: phoneHref(contacts),
    whatsappUrl: whatsappUrl(contacts),
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:gap-8 lg:px-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#"
          className="inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap text-lg font-bold tracking-tight text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Cpu className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <span className="font-display">{SITE_CONTACTS.brand}</span>
        </a>

        {/* Zone 2: Clean single-line Navigation Links */}
        <nav
          aria-label="Основная навигация"
          className="hidden items-center gap-6 text-sm font-medium text-slate-600 lg:flex"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="shrink-0 whitespace-nowrap py-1 transition-colors duration-150 hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Primary Contact / WhatsApp Action + Mobile Menu Trigger */}
        <div className="flex shrink-0 items-center gap-3">
          <a
            href={SITE_CONTACTS.phoneHref}
            className="hidden items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-slate-900 tabular-nums transition-colors hover:text-blue-600 sm:inline-flex"
          >
            <Phone className="h-4 w-4 text-blue-600" aria-hidden="true" />
            <span>{SITE_CONTACTS.phoneDisplay}</span>
          </a>

          <a
            href={SITE_CONTACTS.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg bg-[#16A34A] px-3.5 py-2 text-xs font-semibold text-white transition-colors duration-150 hover:bg-[#15803D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16A34A] sm:text-sm"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            <span>WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition-colors hover:bg-slate-50 lg:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 pb-5 pt-3 lg:hidden">
          <p className="mb-3 text-xs font-medium text-slate-500">
            {SITE_CONTACTS.cityLabel} · {SITE_CONTACTS.schedule}
          </p>
          <nav className="flex flex-col gap-1" aria-label="Мобильное меню">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50 hover:text-blue-600"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2.5 border-t border-slate-100 pt-4">
            <a
              href={SITE_CONTACTS.phoneHref}
              className="flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-900 tabular-nums"
            >
              <Phone className="h-4 w-4 text-blue-600" aria-hidden="true" />
              <span>{SITE_CONTACTS.phoneDisplay}</span>
            </a>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOrderModal();
              }}
              className="flex min-h-[44px] items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              {hero.ctaLabel}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
