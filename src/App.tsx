/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { lazy, Suspense, useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ServicesPricing from './components/ServicesPricing';
import PriceCalculatorQuiz from './components/PriceCalculatorQuiz';
import WorkflowAndAdvantages from './components/WorkflowAndAdvantages';
import ReviewsSection from './components/ReviewsSection';
import FaqSection from './components/FaqSection';
import ContactsFooter from './components/ContactsFooter';
import OrderModal from './components/OrderModal';
import PrivacyModal from './components/PrivacyModal';
import FloatingWhatsApp from './components/FloatingWhatsApp';

// Админ-панель грузится отдельным файлом только при открытии #admin
const AdminPanel = lazy(() => import('./admin/AdminPanel'));

function useIsAdminRoute(): boolean {
  const [isAdmin, setIsAdmin] = useState(() => window.location.hash === '#admin');
  useEffect(() => {
    const onHashChange = () => setIsAdmin(window.location.hash === '#admin');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  return isAdmin;
}

export default function App() {
  const isAdmin = useIsAdminRoute();
  if (isAdmin) {
    return (
      <Suspense fallback={null}>
        <AdminPanel />
      </Suspense>
    );
  }
  return <Site />;
}

function Site() {
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderPrefill, setOrderPrefill] = useState('');
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  const handleOpenOrderModal = (prefill = '') => {
    setOrderPrefill(prefill);
    setOrderModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header onOpenOrderModal={handleOpenOrderModal} />
      <main>
        <Hero onOpenOrderModal={handleOpenOrderModal} />
        <ServicesPricing onSelectService={handleOpenOrderModal} />
        <PriceCalculatorQuiz />
        <WorkflowAndAdvantages />
        <ReviewsSection />
        <FaqSection />
      </main>
      <ContactsFooter
        onOpenOrderModal={handleOpenOrderModal}
        onOpenPrivacy={() => setPrivacyModalOpen(true)}
      />
      <FloatingWhatsApp />
      <OrderModal
        isOpen={orderModalOpen}
        initialProblem={orderPrefill}
        onClose={() => setOrderModalOpen(false)}
      />
      <PrivacyModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />
    </div>
  );
}
