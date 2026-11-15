import { MessageCircle } from 'lucide-react';
import { SITE_CONTACTS } from '../data/serviceData';

export default function FloatingWhatsApp() {
  return (
    <a
      href={SITE_CONTACTS.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Написать мастеру в WhatsApp"
      className="fixed bottom-5 right-5 z-40 inline-flex h-13 items-center gap-2.5 rounded-full bg-[#16A34A] px-4 text-sm font-semibold text-white shadow-lg transition-transform duration-150 hover:scale-[1.03] hover:bg-[#15803D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16A34A] sm:bottom-6 sm:right-6"
    >
      <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
      <span className="hidden sm:inline">Написать в WhatsApp</span>
    </a>
  );
}
