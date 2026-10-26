import React, { useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductIcon } from './ProductIcon';
import { X, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export const ProductDetailModal: React.FC = () => {
  const { productDetailModal, setProductDetailModal, selectProductForCheckout } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setProductDetailModal(null);
      }
    };
    if (productDetailModal) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [productDetailModal, setProductDetailModal]);

  return (
    <AnimatePresence>
      {productDetailModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setProductDetailModal(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0f0f14] border border-[#c59b57]/40 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(197,155,87,0.18)] p-6 sm:p-8 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setProductDetailModal(null)}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Top rectangular image/asset display box */}
            <div className="relative w-full h-48 sm:h-56 rounded-xl bg-black/70 border border-[#c59b57]/25 flex items-center justify-center overflow-hidden mb-6 p-4">
              <div className="w-28 h-28 sm:w-32 sm:h-32">
                <ProductIcon
                  preset={productDetailModal.iconPreset}
                  imageUrl={productDetailModal.imageUrl}
                />
              </div>
              {productDetailModal.badge && (
                <span className="absolute top-3 left-3 text-[10px] font-bold tracking-widest text-[#dfb776] bg-[#2a2215]/90 border border-[#c59b57]/40 px-2.5 py-1 rounded">
                  {productDetailModal.badge}
                </span>
              )}
            </div>

            {/* Left-aligned Title */}
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 font-cinzel tracking-tight leading-snug">
              {productDetailModal.title}
            </h2>

            {/* Price */}
            <div className="text-2xl sm:text-3xl font-extrabold text-[#dfb776] font-mono tracking-tight mb-4">
              Rs. {productDetailModal.priceRs.toLocaleString()}
            </div>

            {/* Short Summary */}
            <p className="text-sm text-neutral-300 font-medium leading-relaxed mb-4 border-b border-[#c59b57]/15 pb-4">
              {productDetailModal.shortDescription}
            </p>

            {/* Full Details & Syllabus */}
            <div className="mb-6 space-y-3">
              <h3 className="text-xs uppercase tracking-widest font-semibold text-[#c59b57] font-cinzel">
                Asset Specifications & Masterclass Access
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed whitespace-pre-line">
                {productDetailModal.fullDescription ||
                  'Complete masterclass archive including source blueprints, adversarial playbooks, and video walkthroughs with guaranteed lifetime Google Drive access.'}
              </p>

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#dfb776]" />
                  <span>Full Google Drive Vault Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#dfb776]" />
                  <span>Verified Manual Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#dfb776]" />
                  <span>Downloadable Blueprints & Tools</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#dfb776]" />
                  <span>Direct Verification via Instagram</span>
                </div>
              </div>
            </div>

            {/* Full-width CTA: BUY NOW / ACCESS NOW placed directly at bottom */}
            <button
              onClick={() => selectProductForCheckout(productDetailModal)}
              className="w-full py-4 rounded-xl font-bold uppercase tracking-[0.15em] text-[#f7e7c4] bronze-btn flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
            >
              <span>BUY NOW / ACCESS NOW</span>
              <ArrowRight className="w-4 h-4 text-[#dfb776]" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
