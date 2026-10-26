import React from 'react';
import { useStore } from '../context/StoreContext';
import { Home } from 'lucide-react';

export const GlobalNavbar: React.FC = () => {
  const { activeView, setActiveView, isAdminLoggedIn } = useStore();

  return (
    <header className="fixed top-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav
        aria-label="Main Navigation"
        className="pointer-events-auto inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#121217]/85 backdrop-blur-xl border border-[#c59b57]/30 shadow-[0_8px_32px_rgba(0,0,0,0.65),0_0_15px_rgba(197,155,87,0.12)] transition-all duration-300"
      >
        {/* [ 🏠 HOME ] */}
        <button
          onClick={() => setActiveView('home')}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider transition-all duration-200 ${
            activeView === 'home'
              ? 'text-[#f7e7c4] bg-[#2a2215]/80 shadow-[inset_0_0_8px_rgba(223,183,118,0.3)] border border-[#dfb776]/50'
              : 'text-neutral-400 hover:text-[#f3dfb2] hover:bg-white/5'
          }`}
        >
          <span className="text-neutral-500 font-mono text-xs opacity-60">[</span>
          <Home className="w-3.5 h-3.5 text-[#dfb776]" />
          <span>HOME</span>
          <span className="text-neutral-500 font-mono text-xs opacity-60">]</span>
        </button>

        <span className="text-neutral-700 select-none">|</span>

        {/* [ PRODUCTS ] */}
        <button
          onClick={() => setActiveView('products')}
          className={`flex items-center gap-1 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider transition-all duration-200 ${
            activeView === 'products'
              ? 'text-[#f7e7c4] bg-[#2a2215]/80 shadow-[inset_0_0_8px_rgba(223,183,118,0.3)] border border-[#dfb776]/50'
              : 'text-neutral-400 hover:text-[#f3dfb2] hover:bg-white/5'
          }`}
        >
          <span className="text-neutral-500 font-mono text-xs opacity-60">[</span>
          <span>PRODUCTS</span>
          <span className="text-neutral-500 font-mono text-xs opacity-60">]</span>
        </button>

        <span className="text-neutral-700 select-none">|</span>

        {/* [ CHECKOUT ] */}
        <button
          onClick={() => setActiveView('checkout')}
          className={`flex items-center gap-1 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider transition-all duration-200 ${
            activeView === 'checkout'
              ? 'text-[#f7e7c4] bg-[#2a2215]/80 shadow-[inset_0_0_8px_rgba(223,183,118,0.3)] border border-[#dfb776]/50'
              : 'text-neutral-400 hover:text-[#f3dfb2] hover:bg-white/5'
          }`}
        >
          <span className="text-neutral-500 font-mono text-xs opacity-60">[</span>
          <span>CHECKOUT</span>
          <span className="text-neutral-500 font-mono text-xs opacity-60">]</span>
        </button>

        {/* Admin Dashboard tab: Only visible when activeView is 'admin' or admin is authenticated */}
        {(activeView === 'admin' || isAdminLoggedIn) && (
          <>
            <span className="text-neutral-700 select-none">|</span>
            <button
              onClick={() => setActiveView('admin')}
              className={`flex items-center gap-1 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider transition-all duration-200 ${
                activeView === 'admin'
                  ? 'text-[#f7e7c4] bg-[#3a2c16] shadow-[inset_0_0_12px_rgba(223,183,118,0.4)] border border-[#dfb776]/70'
                  : 'text-[#dfb776]/80 hover:text-[#f3dfb2] hover:bg-white/5'
              }`}
            >
              <span className="text-neutral-500 font-mono text-xs opacity-60">[</span>
              <span>ADMIN DASHBOARD</span>
              <span className="text-neutral-500 font-mono text-xs opacity-60">]</span>
            </button>
          </>
        )}
      </nav>
    </header>
  );
};
