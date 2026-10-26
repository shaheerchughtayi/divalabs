import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, ShieldCheck, Terminal, Sparkles } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { setActiveView } = useStore();

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-140px)] px-4 sm:px-6 pt-24 pb-16 text-center max-w-4xl mx-auto">
      {/* Brand Title in luxurious bronze/gold metallic typography */}
      <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-[0.25em] bronze-gradient-text uppercase mb-3">
        DIVA LABS
      </h2>

      {/* Main Slogan in bold, elegant typography matching screenshot */}
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-6 uppercase leading-tight font-cinzel">
        <span className="drop-shadow-[0_4px_24px_rgba(223,183,118,0.25)]">
          DOMINATE THE MODERN ERA
        </span>
      </h1>

      {/* Sub-text */}
      <p className="text-sm sm:text-base md:text-lg text-neutral-300/90 font-normal leading-relaxed max-w-2xl mx-auto mb-10 tracking-wide">
        DIVA LABS is a premier digital authority providing elite roadmaps, exclusive cybersecurity blueprints, and advanced arsenals for dominating the digital landscape. Elevate your digital strategy with our high-end assets and masterclasses.
      </p>

      {/* Call To Action: Prominent bronze-bordered button reading "EXPLORE PRODUCTS" */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={() => setActiveView('products')}
          className="group relative inline-flex items-center justify-center gap-3 px-8 sm:px-12 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-bold uppercase tracking-[0.15em] text-[#f7e7c4] bronze-btn cursor-pointer overflow-hidden"
        >
          {/* Subtle button sheen */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
          <span>EXPLORE PRODUCTS</span>
          <ArrowRight className="w-4 h-4 text-[#dfb776] group-hover:translate-x-1 transition-transform duration-200" />
        </button>
      </div>

      {/* Subtle Authority Trust Markers below the fold */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 pt-10 border-t border-[#c59b57]/15 w-full text-left max-w-3xl">
        <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-[#c59b57]/10">
          <ShieldCheck className="w-5 h-5 text-[#dfb776] shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-semibold text-[#f7e7c4] tracking-wider uppercase font-cinzel">
              Hardened Blueprints
            </div>
            <div className="text-xs text-neutral-400 mt-1">
              Field-tested exploit models & verified zero-day defense playbooks.
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-[#c59b57]/10">
          <Terminal className="w-5 h-5 text-[#dfb776] shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-semibold text-[#f7e7c4] tracking-wider uppercase font-cinzel">
              Architectural Roadmaps
            </div>
            <div className="text-xs text-neutral-400 mt-1">
              High-concurrency systems & engineering tradecraft from root level.
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-[#c59b57]/10">
          <Sparkles className="w-5 h-5 text-[#dfb776] shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-semibold text-[#f7e7c4] tracking-wider uppercase font-cinzel">
              Direct Drive Delivery
            </div>
            <div className="text-xs text-neutral-400 mt-1">
              Verified manual delivery with lifetime updates & direct support.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
