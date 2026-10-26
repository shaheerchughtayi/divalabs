import React from 'react';
import { useStore } from '../context/StoreContext';
import { KeyRound } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView } = useStore();

  return (
    <footer className="relative z-10 py-8 px-4 mt-auto border-t border-[#c59b57]/10 flex flex-col items-center justify-center gap-2">
      <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-500 font-medium tracking-wider">
        <span
          className="cursor-default select-none"
          title="DIVA LABS Digital Authority"
        >
          © DIVA LABS 2024
        </span>

        {/* Subtle admin secret keyhole trigger */}
        <button
          onClick={() => setActiveView('admin')}
          className="opacity-20 hover:opacity-90 hover:text-[#dfb776] transition-opacity p-1 rounded hover:bg-white/5"
          title="Secure Terminal Gateway"
          aria-label="Secure Terminal Gateway"
        >
          <KeyRound className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
};
