import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Copy, Check, QrCode, Instagram, ShieldCheck, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export const CheckoutView: React.FC = () => {
  const { checkoutSettings, selectedProduct, products, selectProductForCheckout } = useStore();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [clientShowQr, setClientShowQr] = useState<boolean>(checkoutSettings.showQrCode);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const currentProduct = selectedProduct || (products.length > 0 ? products[0] : null);

  const instagramTemplate = currentProduct
    ? `Hello DIVA LABS, I have completed payment for "${currentProduct.title}" (Rs. ${currentProduct.priceRs}).\n\n• Trx ID: [YOUR_TRANSACTION_ID]\n• Attached: Payment Screenshot\n\nPlease verify and deliver my Google Drive masterclass access link. Thank you!`
    : `Hello DIVA LABS, I have transferred my course payment via JazzCash.\n\n• Course: [COURSE_NAME]\n• Trx ID: [YOUR_TRANSACTION_ID]\n• Attached: Payment Screenshot\n\nPlease send my Google Drive access link!`;

  return (
    <div className="relative z-10 min-h-[calc(100vh-140px)] px-4 sm:px-6 pt-24 pb-20 max-w-4xl mx-auto">
      {/* Page Header matching screenshot */}
      <div className="text-center mb-10 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-wider text-white font-cinzel mb-2">
          <span className="bronze-gradient-text drop-shadow-[0_2px_18px_rgba(223,183,118,0.2)]">
            SECURE CHECKOUT & MANUAL DELIVERY
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 font-medium tracking-wide">
          Direct peer-to-peer verification with guaranteed Google Drive vault dispatch.
        </p>
      </div>

      {/* Selected Order Summary Banner */}
      {currentProduct && (
        <div className="mb-6 p-4 rounded-xl bg-[#14141b]/90 border border-[#c59b57]/30 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-bold tracking-widest text-[#dfb776] uppercase font-cinzel mb-0.5">
              Selected Digital Asset:
            </div>
            <div className="text-base sm:text-lg font-bold text-white truncate font-cinzel">
              {currentProduct.title}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Total Amount</span>
              <span className="text-xl font-black text-[#dfb776] font-mono">
                Rs. {currentProduct.priceRs.toLocaleString()}
              </span>
            </div>

            {/* Change product dropdown if more than 1 available */}
            {products.length > 1 && (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-300 hover:text-white bg-white/5 border border-neutral-700 hover:border-[#dfb776]/40 flex items-center gap-1 transition-colors"
                >
                  <span>Switch</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#dfb776]" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 rounded-xl bg-[#121217] border border-[#c59b57]/40 shadow-2xl p-2 z-30">
                    <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold px-2 py-1">
                      Choose another asset
                    </div>
                    {products.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          selectProductForCheckout(p);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                          p.id === currentProduct.id
                            ? 'bg-[#2a2215] text-[#f7e7c4] font-semibold'
                            : 'text-neutral-300 hover:bg-white/5'
                        }`}
                      >
                        <span className="truncate mr-2">{p.title}</span>
                        <span className="text-[#dfb776] font-mono font-bold shrink-0">
                          Rs. {p.priceRs}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Payment Container matching Screenshot 160651_826d7611.png */}
      <div className="rounded-2xl bg-[#0e0e13]/90 border border-[#c59b57]/35 shadow-[0_16px_50px_rgba(0,0,0,0.8),0_0_25px_rgba(197,155,87,0.12)] p-6 sm:p-10 text-left">
        {/* Payment header */}
        <h2 className="text-center text-sm sm:text-base font-bold tracking-[0.18em] uppercase text-[#dfb776] mb-8 font-cinzel">
          PAYMENT INSTRUCTIONS (JAZZCASH)
        </h2>

        {/* Account Details Box */}
        <div className="rounded-xl bg-[#15151c]/90 border border-[#c59b57]/20 p-5 sm:p-6 mb-8 relative">
          <div className="space-y-3">
            {/* Account Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm sm:text-base">
              <span className="text-neutral-400 font-medium">Account Title:</span>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold tracking-wide font-cinzel">
                  {checkoutSettings.accountTitle}
                </span>
                <button
                  onClick={() => handleCopy(checkoutSettings.accountTitle, 'title')}
                  className="p-1.5 text-neutral-400 hover:text-[#dfb776] rounded bg-white/5 hover:bg-white/10 transition-colors"
                  title="Copy Account Title"
                  aria-label="Copy Account Title"
                >
                  {copiedField === 'title' ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Account Number */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm sm:text-base pt-2 border-t border-white/5">
              <span className="text-neutral-400 font-medium">Account Number:</span>
              <div className="flex items-center gap-2">
                <span className="text-[#dfb776] font-mono font-bold tracking-wider text-base sm:text-lg">
                  {checkoutSettings.accountNumber}
                </span>
                <button
                  onClick={() => handleCopy(checkoutSettings.accountNumber, 'number')}
                  className="p-1.5 text-neutral-400 hover:text-[#dfb776] rounded bg-white/5 hover:bg-white/10 transition-colors"
                  title="Copy JazzCash Number"
                  aria-label="Copy JazzCash Number"
                >
                  {copiedField === 'number' ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {copiedField && (
            <div className="absolute right-4 -bottom-3 text-[11px] text-emerald-400 bg-[#0c1810] border border-emerald-500/30 px-2 py-0.5 rounded shadow">
              Copied to clipboard
            </div>
          )}
        </div>

        {/* Step-by-Step Instructions */}
        <div className="space-y-4 mb-8 text-neutral-300 text-sm sm:text-base leading-relaxed">
          <div className="flex items-start gap-3">
            <span className="font-bold text-white shrink-0 font-cinzel">Step 1:</span>
            <p className="text-neutral-300 font-normal">
              {checkoutSettings.step1}
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="font-bold text-white shrink-0 font-cinzel">Step 2:</span>
            <p className="text-neutral-300 font-normal">
              {checkoutSettings.step2}
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="font-bold text-white shrink-0 font-cinzel">Step 3:</span>
            <p className="text-neutral-300 font-normal">
              {checkoutSettings.step3}
            </p>
          </div>
        </div>

        {/* Optional QR Code Feature with Interactive Toggle */}
        <div className="pt-6 border-t border-[#c59b57]/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-[#dfb776]" />
              <span className="text-sm sm:text-base font-semibold text-white">
                Scan QR Code for Payment
              </span>
            </div>

            {/* Interactive Toggle Switch */}
            <button
              onClick={() => setClientShowQr(!clientShowQr)}
              className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                clientShowQr ? 'bg-[#c59b57]' : 'bg-neutral-800'
              }`}
              aria-label="Toggle QR code visibility"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  clientShowQr ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Collapsible QR Code Box with smooth motion transition */}
          <AnimatePresence>
            {clientShowQr && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="p-6 rounded-xl bg-[#09090c] border border-[#c59b57]/30 text-center max-w-xs mx-auto my-4 shadow-inner">
                  <div className="w-48 h-48 mx-auto rounded-lg overflow-hidden border border-[#dfb776]/40 p-2 bg-black flex items-center justify-center">
                    {checkoutSettings.qrCodeUrl ? (
                      <img
                        src={checkoutSettings.qrCodeUrl}
                        alt="JazzCash Payment QR"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-neutral-500 text-xs">No QR Code Image Uploaded</div>
                    )}
                  </div>
                  <p className="text-xs text-[#dfb776] mt-3 font-medium">
                    Open JazzCash App → Tap "Scan QR"
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Customer Helper: Instagram DM Template Generator */}
        <div className="mt-8 pt-6 border-t border-[#c59b57]/15 rounded-xl bg-white/[0.02] p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#dfb776]">
              <Instagram className="w-4 h-4" />
              <span>Instagram Verification Assistant ({checkoutSettings.instagramHandle})</span>
            </div>
            <button
              onClick={() => handleCopy(instagramTemplate, 'dm')}
              className="text-xs font-semibold text-[#f7e7c4] hover:text-white flex items-center gap-1.5 px-3 py-1 rounded bg-[#2a2215] border border-[#dfb776]/40 hover:bg-[#382b18] transition-colors"
            >
              {copiedField === 'dm' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied DM Format!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy DM Format</span>
                </>
              )}
            </button>
          </div>
          <pre className="text-xs text-neutral-300 font-mono whitespace-pre-wrap bg-black/40 p-3 rounded-lg border border-white/5 leading-relaxed">
            {instagramTemplate}
          </pre>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-neutral-400">
            <ShieldCheck className="w-3.5 h-3.5 text-[#dfb776]" />
            <span>
              Direct manual fulfillment: Our Instagram team responds within 15–30 minutes with your private Google Drive vault link.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
