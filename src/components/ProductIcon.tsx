import React from 'react';
import { IconPresetType } from '../types';

interface ProductIconProps {
  preset?: IconPresetType;
  imageUrl?: string;
  className?: string;
}

export const ProductIcon: React.FC<ProductIconProps> = ({
  preset = 'shield',
  imageUrl,
  className = 'w-full h-full',
}) => {
  if (imageUrl) {
    return (
      <div className={`relative overflow-hidden bg-neutral-950 flex items-center justify-center ${className}`}>
        <img
          src={imageUrl}
          alt="Product visual"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback gracefully on broken images
            (e.currentTarget as HTMLElement).style.display = 'none';
          }}
        />
      </div>
    );
  }

  // Bespoke Luxury Bronze Line-Art SVGs matching the user screenshots
  switch (preset) {
    case 'code':
      // Browser window with </ > and lock
      return (
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`stroke-[#d4af65] ${className}`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Browser frame */}
          <rect x="14" y="22" width="72" height="56" rx="6" stroke="#c59b57" strokeWidth="2.5" />
          <line x1="14" y1="36" x2="86" y2="36" stroke="#87652e" strokeWidth="1.5" />
          {/* Browser dots */}
          <circle cx="24" cy="29" r="2" fill="#c59b57" />
          <circle cx="31" cy="29" r="2" fill="#c59b57" />
          <circle cx="38" cy="29" r="2" fill="#c59b57" />
          {/* Code tags */}
          <path d="M30 54 L24 60 L30 66" stroke="#e4c896" strokeWidth="2.5" />
          <path d="M48 50 L42 70" stroke="#e4c896" strokeWidth="2.5" />
          <path d="M60 54 L66 60 L60 66" stroke="#e4c896" strokeWidth="2.5" />
          {/* Lock symbol at lower right */}
          <rect x="64" y="60" width="18" height="15" rx="3" fill="#0d0d10" stroke="#dfb776" strokeWidth="2" />
          <path d="M68 60 V55 A5 5 0 0 1 78 55 V60" stroke="#dfb776" strokeWidth="2" fill="none" />
          <circle cx="73" cy="67.5" r="1.5" fill="#dfb776" />
        </svg>
      );

    case 'eye':
      // Cybernetic eye with radiant iris and nodes (Dark Psychology Vault)
      return (
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`stroke-[#d4af65] ${className}`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Outer almond eye */}
          <path
            d="M18 50 C28 32, 72 32, 82 50 C72 68, 28 68, 18 50 Z"
            stroke="#c59b57"
            strokeWidth="2.5"
          />
          {/* Concentric rings */}
          <circle cx="50" cy="50" r="14" stroke="#e4c896" strokeWidth="2" />
          <circle cx="50" cy="50" r="7" fill="#dfb776" />
          {/* Neural nodes / spikes */}
          <line x1="50" y1="26" x2="50" y2="16" stroke="#87652e" strokeWidth="2" />
          <circle cx="50" cy="14" r="2.5" fill="#c59b57" />
          <line x1="50" y1="74" x2="50" y2="84" stroke="#87652e" strokeWidth="2" />
          <circle cx="50" cy="86" r="2.5" fill="#c59b57" />
          <line x1="32" y1="32" x2="24" y2="24" stroke="#87652e" strokeWidth="2" />
          <circle cx="22" cy="22" r="2.5" fill="#c59b57" />
          <line x1="68" y1="32" x2="76" y2="24" stroke="#87652e" strokeWidth="2" />
          <circle cx="78" cy="22" r="2.5" fill="#c59b57" />
          <line x1="32" y1="68" x2="24" y2="76" stroke="#87652e" strokeWidth="2" />
          <circle cx="22" cy="78" r="2.5" fill="#c59b57" />
          <line x1="68" y1="68" x2="76" y2="76" stroke="#87652e" strokeWidth="2" />
          <circle cx="78" cy="78" r="2.5" fill="#c59b57" />
        </svg>
      );

    case 'cpu':
      // Microchip / CPU connected to flowchart nodes (Elite Software Engineer Roadmap)
      return (
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`stroke-[#d4af65] ${className}`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Main processor core */}
          <rect x="20" y="24" width="34" height="34" rx="4" stroke="#c59b57" strokeWidth="2.5" />
          <rect x="28" y="32" width="18" height="18" fill="#18181f" stroke="#e4c896" strokeWidth="1.5" />
          {/* Chip pins */}
          <line x1="28" y1="24" x2="28" y2="18" stroke="#87652e" strokeWidth="2" />
          <line x1="37" y1="24" x2="37" y2="18" stroke="#87652e" strokeWidth="2" />
          <line x1="46" y1="24" x2="46" y2="18" stroke="#87652e" strokeWidth="2" />
          <line x1="20" y1="33" x2="14" y2="33" stroke="#87652e" strokeWidth="2" />
          <line x1="20" y1="41" x2="14" y2="41" stroke="#87652e" strokeWidth="2" />
          <line x1="20" y1="49" x2="14" y2="49" stroke="#87652e" strokeWidth="2" />
          {/* Flowchart nodes on right */}
          <rect x="66" y="22" width="22" height="14" rx="2" stroke="#dfb776" strokeWidth="2" />
          <rect x="66" y="44" width="22" height="14" rx="2" stroke="#dfb776" strokeWidth="2" />
          <rect x="66" y="66" width="22" height="14" rx="2" stroke="#dfb776" strokeWidth="2" />
          {/* Flow arrows and traces */}
          <path d="M54 41 H60 V29 H66" stroke="#c59b57" strokeWidth="1.5" />
          <path d="M54 41 H66" stroke="#c59b57" strokeWidth="1.5" />
          <path d="M37 58 V73 H66" stroke="#c59b57" strokeWidth="1.5" />
        </svg>
      );

    case 'shield':
    default:
      // Shield with circuit tracks (Mega-Bundle)
      return (
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`stroke-[#d4af65] ${className}`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Crest shield */}
          <path
            d="M50 16 L76 26 C76 56, 50 82, 50 82 C50 82, 24 56, 24 26 Z"
            stroke="#c59b57"
            strokeWidth="2.5"
          />
          {/* Inner circuit lines */}
          <path d="M50 30 V68" stroke="#e4c896" strokeWidth="2" />
          <circle cx="50" cy="30" r="2.5" fill="#dfb776" />
          <circle cx="50" cy="68" r="2.5" fill="#dfb776" />
          <path d="M40 38 H46 V56 H40" stroke="#87652e" strokeWidth="1.75" />
          <circle cx="38" cy="38" r="2" fill="#c59b57" />
          <circle cx="38" cy="56" r="2" fill="#c59b57" />
          <path d="M60 38 H54 V56 H60" stroke="#87652e" strokeWidth="1.75" />
          <circle cx="62" cy="38" r="2" fill="#c59b57" />
          <circle cx="62" cy="56" r="2" fill="#c59b57" />
          {/* Side pulse nodes */}
          <circle cx="16" cy="40" r="2" fill="#c59b57" />
          <circle cx="84" cy="40" r="2" fill="#c59b57" />
          <line x1="16" y1="40" x2="24" y2="40" stroke="#87652e" strokeWidth="1.5" />
          <line x1="84" y1="40" x2="76" y2="40" stroke="#87652e" strokeWidth="1.5" />
        </svg>
      );
  }
};
