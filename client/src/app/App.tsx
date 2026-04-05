import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

const RegistrationModal = lazy(() =>
  import('./components/RegistrationModal').then((module) => ({ default: module.RegistrationModal }))
);
const HomePage = lazy(() => import('./pages/HomePage').then((module) => ({ default: module.HomePage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((module) => ({ default: module.AboutPage })));
const ProductsPage = lazy(() =>
  import('./pages/ProductsPage').then((module) => ({ default: module.ProductsPage }))
);
const CategoryDetailPage = lazy(() =>
  import('./pages/CategoryDetailPage').then((module) => ({ default: module.CategoryDetailPage }))
);
const ProductDetailPage = lazy(() =>
  import('./pages/ProductDetailPage').then((module) => ({ default: module.ProductDetailPage }))
);
const RegisterPage = lazy(() => import('./pages/RegisterPage').then((module) => ({ default: module.RegisterPage })));
const AdminPage = lazy(() => import('./pages/AdminPage').then((module) => ({ default: module.AdminPage })));

function AppShell() {
  const [showRegistration, setShowRegistration] = useState(false);
  const reopenTimerRef = useRef<number | null>(null);
  const location = useLocation();
  const suppressPopupRoutes = new Set(['/register', '/admin']);
  const shouldShowPopup = !suppressPopupRoutes.has(location.pathname);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    });
  }, [location.pathname]);

  useEffect(() => {
    if (!shouldShowPopup) {
      setShowRegistration(false);
      if (reopenTimerRef.current) {
        clearTimeout(reopenTimerRef.current);
        reopenTimerRef.current = null;
      }
      return;
    }

    const alreadyRegistered = sessionStorage.getItem('registration_completed') === 'true';
    if (alreadyRegistered) {
      return;
    }

    const timer = setTimeout(() => {
      setShowRegistration(true);
    }, 5000);

    return () => {
      clearTimeout(timer);
      if (reopenTimerRef.current) {
        clearTimeout(reopenTimerRef.current);
      }
    };
  }, [shouldShowPopup]);

  const handleRegistrationComplete = () => {
    sessionStorage.setItem('registration_completed', 'true');
    setShowRegistration(false);
    if (reopenTimerRef.current) {
      clearTimeout(reopenTimerRef.current);
      reopenTimerRef.current = null;
    }
  };

  const handleRegistrationCancel = () => {
    const alreadyRegistered = sessionStorage.getItem('registration_completed') === 'true';
    if (alreadyRegistered) {
      return;
    }

    setShowRegistration(false);

    if (reopenTimerRef.current) {
      clearTimeout(reopenTimerRef.current);
    }

    reopenTimerRef.current = window.setTimeout(() => {
      const isDone = sessionStorage.getItem('registration_completed') === 'true';
      if (!isDone) {
        setShowRegistration(true);
      }
    }, 10000);
  };

  const handleOpenRegistration = () => {
    const alreadyRegistered = sessionStorage.getItem('registration_completed') === 'true';
    if (!alreadyRegistered) {
      setShowRegistration(true);
    }
  };

  const whatsappNumber = '918140075714';
  const whatsappMessage = encodeURIComponent('Hi, I want to know more about your products');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
  const brochureUrl = '/airdrop-brochure.pdf';

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header onRegisterClick={handleOpenRegistration} />
        <main className="flex-grow">
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[40vh]">
                <div className="text-muted-foreground">Loading...</div>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:categoryId" element={<CategoryDetailPage />} />
              <Route path="/products/:categoryId/:productId" element={<ProductDetailPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer onRegisterClick={handleOpenRegistration} />
      </div>
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
        <a
          href={brochureUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open brochure PDF"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-600 shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600"
          title="Brochure"
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true" fill="none">
            <path
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 5.25A2.25 2.25 0 0 1 6.75 3h4.5c.93 0 1.82.369 2.48 1.03l.74.74c.66.66 1.03 1.55 1.03 2.48v11.25A2.25 2.25 0 0 1 13.25 21h-6.5A2.25 2.25 0 0 1 4.5 18.75V5.25Z"
            />
            <path
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 7.5h3M9 10.5h4.5M9 13.5h4.5M15.75 6.75h1.5A2.25 2.25 0 0 1 19.5 9v9.75A2.25 2.25 0 0 1 17.25 21h-1.5"
            />
          </svg>
        </a>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366]"
          title="WhatsApp"
        >
          <svg viewBox="0 0 448 512" className="h-7 w-7" aria-hidden="true">
            <path
              fill="white"
              d="M380.9 97.1C339 55.1 283.2 32 224.8 32c-118.9 0-216 96.9-216 216 0 38 10 75.1 29.3 108.3L0 480l126.2-36.9c32.7 17.9 69.5 27.4 98.3 27.4h.1c118.9 0 216-96.9 216-216 0-58.4-23.1-114.2-65.1-156.4zM224.6 438.7h-.1c-31.8 0-63-8.5-90.7-24.7l-6.5-3.8-75.1 22 20-73.2-4.3-7c-17.8-29-27.2-62.4-27.2-96.5 0-101.7 82.9-184.6 184.7-184.6 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 54 81.3 54 130.6 0 101.7-82.8 184.6-184.5 184.6zm101.6-138.3c-5.5-2.8-32.5-16-37.5-17.8-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.5-14.3 17.8-17.5 21.4-3.2 3.7-6.4 4.1-11.9 1.4-32.5-16.2-53.8-28.9-75.1-65.5-5.6-9.6 5.6-8.9 16.2-29.6 1.8-3.7.9-6.9-.5-9.6-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.6 1.4-14.7 6.9-5.1 5.5-19.2 18.8-19.2 45.9 0 27.1 19.7 53.3 22.4 57 2.8 3.7 38.8 59.2 94 83 13.1 5.7 23.4 9.1 31.4 11.7 13.2 4.2 25.3 3.6 34.8 2.2 10.6-1.6 32.5-13.3 37.1-26.2 4.6-12.9 4.6-24 3.2-26.2-1.3-2.2-5-3.5-10.5-6.3z"
            />
          </svg>
        </a>
      </div>
      {showRegistration && (
        <Suspense fallback={null}>
          <RegistrationModal
            isOpen={showRegistration}
            onComplete={handleRegistrationComplete}
            onCancel={handleRegistrationCancel}
          />
        </Suspense>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
