import React, { Suspense, useState, useEffect } from 'react';
import { SaaSProvider, useSaaS } from './context/SaaSContext';
import { findTenantBySlug } from './utils/navigation';
import { Scissors } from 'lucide-react';

// Code splitting via React.lazy for performance (Section 17)
const MiniCentralView = React.lazy(() => import('./components/views/MiniCentralView'));
const NotFoundView = React.lazy(() => import('./components/views/NotFoundView'));
const BarberLoginPage = React.lazy(() => import('./components/auth/BarberLoginPage'));
const BarberLayout = React.lazy(() => import('./components/barber/BarberLayout'));
const SuperAdminLoginPage = React.lazy(() => import('./components/auth/SuperAdminLoginPage'));
const SuperAdminLayout = React.lazy(() => import('./components/superadmin/SuperAdminLayout'));

function LoadingFallback() {
  return (
    <div className="min-h-screen w-full bg-neutral-950 flex flex-col items-center justify-center p-4 text-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-[#f8c105]/15 border border-[#f8c105]/40 flex items-center justify-center text-[#f8c105] animate-pulse">
          <Scissors size={24} />
        </div>
        <div className="text-center">
          <span className="text-xs font-mono font-bold tracking-widest text-[#f8c105] uppercase block">
            SNAKE BARBER
          </span>
          <span className="text-[11px] text-zinc-400">Carregando ambiente...</span>
        </div>
      </div>
    </div>
  );
}

function MainRouter() {
  const {
    tenants,
    currentTenantId,
    switchTenant,
    isBarberLoggedIn,
    isSuperAdminLoggedIn,
    currentView,
  } = useSaaS();

  const [pathname, setPathname] = useState<string>(() => {
    return typeof window !== 'undefined' ? window.location.pathname : '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Clean raw segment (e.g. '/barbearialupumba' -> 'barbearialupumba')
  const cleanSegment = pathname.replace(/^\/+|\/+$/g, '').toLowerCase();

  // ROUTE 1: SUPER ADMIN (/super-admin or /admin)
  if (cleanSegment === 'super-admin' || cleanSegment === 'admin' || cleanSegment === 'super-admin-login' || currentView === 'super-admin-login' || currentView === 'super-admin') {
    if (isSuperAdminLoggedIn && currentView !== 'super-admin-login') {
      return (
        <Suspense fallback={<LoadingFallback />}>
          <SuperAdminLayout />
        </Suspense>
      );
    }
    return (
      <Suspense fallback={<LoadingFallback />}>
        <SuperAdminLoginPage />
      </Suspense>
    );
  }

  // ROUTE 2: ROOT PATH (/) or /login or /barber-login -> ÁREA DO BARBEIRO (Section 2 & 8)
  if (cleanSegment === '' || cleanSegment === 'login' || cleanSegment === 'barber-login' || cleanSegment === 'barbeiro') {
    // If authenticated, open Dashboard
    if (isBarberLoggedIn) {
      return (
        <Suspense fallback={<LoadingFallback />}>
          <BarberLayout />
        </Suspense>
      );
    }
    // Otherwise open Barber Login Page
    return (
      <Suspense fallback={<LoadingFallback />}>
        <BarberLoginPage />
      </Suspense>
    );
  }

  // ROUTE 3: SPECIFIC TENANT SLUG (e.g. /barbearialupumba, /barbearianavalhaouro)
  const matchedTenant = findTenantBySlug(tenants, cleanSegment);

  if (matchedTenant) {
    // Synchronize active tenant if different
    if (currentTenantId !== matchedTenant.id) {
      switchTenant(matchedTenant.id);
    }

    return (
      <Suspense fallback={<LoadingFallback />}>
        <MiniCentralView />
      </Suspense>
    );
  }

  // ROUTE 4: FALLBACK (Section 5) — NÃO abrir automaticamente Lupumba
  return (
    <Suspense fallback={<LoadingFallback />}>
      <NotFoundView attemptedSlug={cleanSegment} />
    </Suspense>
  );
}

export default function App() {
  return (
    <SaaSProvider>
      <MainRouter />
    </SaaSProvider>
  );
}
