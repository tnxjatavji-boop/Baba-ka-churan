import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import { cn } from './lib/utils';
import { BottomNav } from './components/BottomNav';
import { TradeScreen } from './screens/TradeScreen';
import { AssetSelectorScreen } from './screens/AssetSelectorScreen';
import { DealsScreen } from './screens/DealsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { LoginScreen } from './screens/LoginScreen';
import { NewsScreen } from './screens/NewsScreen';
import { HelpScreen } from './screens/HelpScreen';
import { DepositScreen } from './screens/DepositScreen';
import { WithdrawScreen } from './screens/WithdrawScreen';
import { TransactionHistoryScreen } from './screens/TransactionHistoryScreen';
import { AdminControlScreen } from './screens/AdminControlScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { AboutScreen } from './screens/AboutScreen';
import { ReferralScreen } from './screens/ReferralScreen';
import { AnimatePresence, motion } from 'motion/react';

export const ADMIN_SECRET_PATH = '/alina-rovergo90-crownpic/rahulraj';
export const ADMIN_STANDARD_PATH = '/admin';
export const ADMIN_PATHS = [
  ADMIN_SECRET_PATH,
  ADMIN_STANDARD_PATH,
  '/administrator',
  '/control'
];

export const isAdminRoute = (pathname: string) => {
  const normPath = (pathname || '').toLowerCase().trim();
  const search = (typeof window !== 'undefined' ? window.location.search : '').toLowerCase();
  const hash = (typeof window !== 'undefined' ? window.location.hash : '').toLowerCase();
  
  return ADMIN_PATHS.some(p => normPath === p.toLowerCase() || normPath.startsWith(p.toLowerCase() + '/') || normPath.startsWith(p.toLowerCase())) ||
         hash.includes('admin') ||
         hash.includes('alina-rovergo90-crownpic/rahulraj') ||
         search.includes('admin') ||
         search.includes('alina-rovergo90-crownpic/rahulraj');
};

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5, scale: 0.995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -5, scale: 0.995 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="flex-1 min-h-0 w-full h-full relative flex flex-col"
    >
      {children}
    </motion.div>
  );
};

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { isFullScreen, isExpandedLayout } = useAppContext();
  const isTradeScreen = location.pathname === '/';
  const isExpanded = isFullScreen || isExpandedLayout;

  return (
    <div className={cn(
      "h-full w-full relative mx-auto bg-white flex flex-col overflow-hidden transition-all duration-200",
      isExpanded 
        ? "max-w-none rounded-none border-none shadow-none" 
        : "max-w-md md:max-w-lg shadow-2xl sm:rounded-3xl sm:border sm:border-slate-200/80"
    )}>
      <div className={cn(
        "flex-1 min-h-0 relative flex flex-col bg-slate-50 no-scrollbar",
        isTradeScreen ? "overflow-hidden" : "overflow-y-auto overflow-x-hidden"
      )}>
        <PageTransition>{children}</PageTransition>
      </div>
      <BottomNav />
    </div>
  );
};

const SubpageLayout = ({ children }: { children: React.ReactNode }) => {
  const { isFullScreen, isExpandedLayout } = useAppContext();
  const isExpanded = isFullScreen || isExpandedLayout;

  return (
    <div className={cn(
      "h-full w-full relative mx-auto bg-white overflow-y-auto transition-all duration-200",
      isExpanded 
        ? "max-w-none rounded-none border-none shadow-none" 
        : "max-w-md md:max-w-lg shadow-2xl sm:rounded-3xl sm:border sm:border-slate-200/80"
    )}>
      <PageTransition>{children}</PageTransition>
    </div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence>
      <motion.div key={location.pathname} className="h-full w-full absolute inset-0">
        <Routes location={location}>
          {/* Primary Trading Dashboard */}
          <Route path="/" element={<MainLayout><TradeScreen /></MainLayout>} />
          
          {/* Dedicated Navigation Screens */}
          <Route path="/assets" element={<SubpageLayout><AssetSelectorScreen /></SubpageLayout>} />
          <Route path="/deals" element={<MainLayout><DealsScreen /></MainLayout>} />
          <Route path="/news" element={<MainLayout><NewsScreen /></MainLayout>} />
          <Route path="/help" element={<MainLayout><HelpScreen /></MainLayout>} />
          <Route path="/me" element={<MainLayout><ProfileScreen /></MainLayout>} />
          <Route path="/about" element={<SubpageLayout><AboutScreen /></SubpageLayout>} />
          <Route path="/referral" element={<SubpageLayout><ReferralScreen /></SubpageLayout>} />

          {/* Dedicated Financial Pages */}
          <Route path="/deposit" element={<SubpageLayout><DepositScreen /></SubpageLayout>} />
          <Route path="/checkout" element={<div className="h-full w-full relative overflow-y-auto"><CheckoutScreen /></div>} />
          <Route path="/withdraw" element={<SubpageLayout><WithdrawScreen /></SubpageLayout>} />
          <Route path="/history" element={<SubpageLayout><TransactionHistoryScreen /></SubpageLayout>} />

          {/* Master Admin Operating System (Direct Link & Secret Path) */}
          <Route path="/admin" element={<div className="h-full w-full min-h-screen bg-[#0b0f17] overflow-y-auto"><AdminControlScreen /></div>} />
          <Route path="/admin/*" element={<div className="h-full w-full min-h-screen bg-[#0b0f17] overflow-y-auto"><AdminControlScreen /></div>} />
          <Route path="/administrator" element={<div className="h-full w-full min-h-screen bg-[#0b0f17] overflow-y-auto"><AdminControlScreen /></div>} />
          <Route path="/control" element={<div className="h-full w-full min-h-screen bg-[#0b0f17] overflow-y-auto"><AdminControlScreen /></div>} />
          <Route path={ADMIN_SECRET_PATH} element={<div className="h-full w-full min-h-screen bg-[#0b0f17] overflow-y-auto"><AdminControlScreen /></div>} />
          <Route path={`${ADMIN_SECRET_PATH}/*`} element={<div className="h-full w-full min-h-screen bg-[#0b0f17] overflow-y-auto"><AdminControlScreen /></div>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const AppShell = () => {
  const { isFullScreen, isExpandedLayout } = useAppContext();
  const isExpanded = isFullScreen || isExpandedLayout;

  return (
    <div className={cn(
      "h-[100dvh] max-h-[100dvh] w-full font-sans overflow-hidden flex items-center justify-center transition-all duration-200",
      isExpanded ? "p-0 bg-white" : "bg-slate-100 p-0 sm:p-3"
    )}>
      <Router>
        <AnimatedRoutes />
      </Router>
    </div>
  );
};

export default function App() {
  const [userId, setUserId] = useState<string>(() => {
    try {
      return localStorage.getItem('tradexora_user') || "";
    } catch {
      return "";
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem('tradexora_user');
    } catch {
      return false;
    }
  });

  const handleLoginSuccess = (id: string) => {
    try {
      localStorage.setItem('tradexora_user', id);
    } catch {}
    setUserId(id);
    setIsAuthenticated(true);
  };

  if (isAdminRoute(window.location.pathname)) {
    return (
      <Router>
        <div className="min-h-screen w-full bg-[#0b0f17] text-slate-100 font-sans p-0 overflow-x-hidden flex flex-col">
          <AnimatedRoutes />
        </div>
      </Router>
    );
  }

  if (window.location.pathname.startsWith('/checkout')) {
    return (
      <Router>
        <div className="h-full w-full bg-slate-900 overflow-y-auto">
          <CheckoutScreen />
        </div>
      </Router>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="h-full w-full bg-slate-100 flex items-center justify-center p-0 sm:p-4 font-sans">
        <div className="w-full max-w-md md:max-w-lg h-full sm:h-auto sm:max-h-[94vh] bg-white shadow-2xl sm:rounded-3xl sm:border sm:border-slate-200/80 relative overflow-hidden flex flex-col">
          <LoginScreen onLogin={handleLoginSuccess} />
        </div>
      </div>
    );
  }

  return (
    <AppProvider userId={userId}>
      <AppShell />
    </AppProvider>
  );
}
