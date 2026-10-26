import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, IconPresetType } from '../types';
import { ProductIcon } from '../components/ProductIcon';
import {
  Lock,
  Upload,
  Trash2,
  Edit2,
  Check,
  LogOut,
  KeyRound,
  Sparkles,
  Plus,
  FolderPlus,
  AlertTriangle,
  X,
  Mail,
  ArrowLeft,
  RefreshCw,
  Key,
  Copy,
  Shield,
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const {
    products,
    categories,
    checkoutSettings,
    adminAuth,
    isAdminLoggedIn,
    verifyAdminCredentials,
    setAdminAuthenticated,
    logoutAdmin,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    renameCategory,
    deleteCategory,
    updateCheckoutSettings,
    updateAdminAuth,
    loadTemplateProducts,
    clearAllProducts,
  } = useStore();

  // Two-step login state with OTP
  const [authStep, setAuthStep] = useState<'credentials' | 'otp'>('credentials');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [wrongOtpPopup, setWrongOtpPopup] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [simulatedEmailBanner, setSimulatedEmailBanner] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState(false);

  // Manage Product Form state
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>(categories[0] || 'Cybersecurity');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [iconPreset, setIconPreset] = useState<IconPresetType>('shield');
  const [badge, setBadge] = useState('');

  // Category Management state
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [editingCategoryOldName, setEditingCategoryOldName] = useState<string | null>(null);
  const [editingCategoryNewName, setEditingCategoryNewName] = useState('');

  // Delete Category Modal state
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [deleteAssociatedProducts, setDeleteAssociatedProducts] = useState(false);

  // Checkout Instructions Form state
  const [accountTitle, setAccountTitle] = useState(checkoutSettings.accountTitle);
  const [accountNumber, setAccountNumber] = useState(checkoutSettings.accountNumber);
  const [step1, setStep1] = useState(checkoutSettings.step1);
  const [step2, setStep2] = useState(checkoutSettings.step2);
  const [step3, setStep3] = useState(checkoutSettings.step3);
  const [instagramHandle, setInstagramHandle] = useState(checkoutSettings.instagramHandle);
  const [instructionsSaved, setInstructionsSaved] = useState(false);

  // Admin Credentials form state
  const [newEmail, setNewEmail] = useState(adminAuth.email);
  const [newPassword, setNewPassword] = useState('');
  const [credentialsSaved, setCredentialsSaved] = useState(false);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((t) => t - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  // Step 1: Handle Credentials Submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // Check if email and password are both correct
    const isValid = verifyAdminCredentials(loginEmail, loginPassword);
    if (!isValid) {
      setLoginError('Invalid access credentials. Please verify your email and password.');
      return;
    }

    // Both email & password are valid: Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpDigits(['', '', '', '', '', '']);
    setAuthStep('otp');
    setResendTimer(30);
    setSimulatedEmailBanner(true);

    // Auto focus first OTP input after DOM renders
    setTimeout(() => {
      document.getElementById('otp-input-0')?.focus();
    }, 150);
  };

  // Step 2: Handle OTP input navigation
  const handleOtpDigitChange = (index: number, value: string) => {
    const clean = value.replace(/\D/g, '');
    if (!clean && value !== '') return;

    const next = [...otpDigits];
    next[index] = clean.slice(-1);
    setOtpDigits(next);

    // Auto-advance to next box
    if (clean && index < 5) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const next = [...otpDigits];
      for (let i = 0; i < 6; i++) {
        next[i] = pasted[i] || '';
      }
      setOtpDigits(next);
      const focusIndex = Math.min(pasted.length, 5);
      document.getElementById(`otp-input-${focusIndex}`)?.focus();
    }
  };

  // Step 3: Handle OTP Verification
  const handleVerifyOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpDigits.join('').trim();
    if (entered.length < 6) return;

    if (entered === generatedOtp) {
      // Correct OTP: Login approved!
      setAdminAuthenticated(true);
      setAuthStep('credentials');
      setLoginPassword('');
      setSimulatedEmailBanner(false);
    } else {
      // Wrong OTP: Show "Try Again" pop-up as requested!
      setWrongOtpPopup(true);
      setOtpDigits(['', '', '', '', '', '']);
    }
  };

  // Resend OTP
  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newCode);
    setOtpDigits(['', '', '', '', '', '']);
    setResendTimer(30);
    setSimulatedEmailBanner(true);
    setTimeout(() => {
      document.getElementById('otp-input-0')?.focus();
    }, 100);
  };

  // Back to credentials screen
  const handleBackToCredentials = () => {
    setAuthStep('credentials');
    setLoginError('');
    setOtpDigits(['', '', '', '', '', '']);
    setSimulatedEmailBanner(false);
  };

  const handleCopyOtp = () => {
    navigator.clipboard.writeText(generatedOtp);
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  // Start Editing Product
  const startEditing = (p: Product) => {
    setEditingProductId(p.id);
    setTitle(p.title);
    setCategory(p.category || categories[0] || 'Cybersecurity');
    setShortDesc(p.shortDescription);
    setFullDesc(p.fullDescription);
    setPrice(p.priceRs.toString());
    setImageUrl(p.imageUrl || '');
    setIconPreset(p.iconPreset || 'shield');
    setBadge(p.badge || '');
  };

  const cancelEditing = () => {
    setEditingProductId(null);
    setTitle('');
    setCategory(categories[0] || 'Cybersecurity');
    setShortDesc('');
    setFullDesc('');
    setPrice('');
    setImageUrl('');
    setIconPreset('shield');
    setBadge('');
  };

  // Save / Add Product
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price.trim()) return;

    const priceNum = parseInt(price, 10) || 0;

    if (editingProductId) {
      updateProduct(editingProductId, {
        title,
        category,
        shortDescription: shortDesc,
        fullDescription: fullDesc,
        priceRs: priceNum,
        imageUrl: imageUrl.trim() || undefined,
        iconPreset,
        badge: badge.trim() || undefined,
      });
      cancelEditing();
    } else {
      addProduct({
        title,
        category,
        shortDescription: shortDesc,
        fullDescription: fullDesc,
        priceRs: priceNum,
        imageUrl: imageUrl.trim() || undefined,
        iconPreset,
        badge: badge.trim() || undefined,
      });
      cancelEditing();
    }
  };

  // Category CRUD Handlers
  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCategoryError('');
    if (!newCategoryName.trim()) return;
    const ok = addCategory(newCategoryName.trim());
    if (ok) {
      setNewCategoryName('');
    } else {
      setCategoryError('Category already exists or name is invalid.');
    }
  };

  const startRenameCategory = (name: string) => {
    setEditingCategoryOldName(name);
    setEditingCategoryNewName(name);
  };

  const handleRenameCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategoryOldName || !editingCategoryNewName.trim()) return;
    const ok = renameCategory(editingCategoryOldName, editingCategoryNewName.trim());
    if (ok) {
      setEditingCategoryOldName(null);
      setEditingCategoryNewName('');
    } else {
      alert('Could not rename: category name already exists.');
    }
  };

  const triggerDeleteCategoryModal = (name: string) => {
    setCategoryToDelete(name);
    setDeleteAssociatedProducts(false);
  };

  const confirmDeleteCategory = () => {
    if (!categoryToDelete) return;
    deleteCategory(categoryToDelete, deleteAssociatedProducts);
    setCategoryToDelete(null);
    setDeleteAssociatedProducts(false);
  };

  // Handle Image File Upload for Product
  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle QR Code Image Upload
  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateCheckoutSettings({ qrCodeUrl: event.target.result as string, showQrCode: true });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Checkout Instructions
  const handleSaveInstructions = (e: React.FormEvent) => {
    e.preventDefault();
    updateCheckoutSettings({
      accountTitle,
      accountNumber,
      step1,
      step2,
      step3,
      instagramHandle,
    });
    setInstructionsSaved(true);
    setTimeout(() => setInstructionsSaved(false), 2500);
  };

  // Save Admin Credentials
  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmail.trim() && newPassword.trim()) {
      updateAdminAuth({ email: newEmail.trim(), password: newPassword.trim() });
      setCredentialsSaved(true);
      setTimeout(() => setCredentialsSaved(false), 2500);
      setNewPassword('');
    }
  };

  // Authentication Lock Screen with Two-Step OTP Protection
  if (!isAdminLoggedIn) {
    return (
      <div className="relative z-10 min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md p-8 sm:p-10 rounded-2xl bg-[#0e0e14]/95 border border-[#c59b57]/40 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(197,155,87,0.18)] text-center relative overflow-hidden">
          {authStep === 'credentials' ? (
            /* STEP 1: Email & Password */
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#20190f] border border-[#dfb776]/50 flex items-center justify-center shadow-lg">
                <Lock className="w-7 h-7 text-[#dfb776]" />
              </div>

              <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-widest text-white font-cinzel mb-2">
                RESTRICTED ACCESS
              </h1>
              <p className="text-xs text-neutral-400 font-medium tracking-wide mb-8">
                DIVA LABS Administrative Command Terminal.
              </p>

              <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 font-cinzel">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-neutral-700 focus:border-[#dfb776] text-sm text-white placeholder-neutral-600 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 font-cinzel">
                    Access Key / Password
                  </label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-neutral-700 focus:border-[#dfb776] text-sm text-white placeholder-neutral-600 outline-none transition-colors"
                  />
                </div>

                {loginError && (
                  <p className="text-xs text-red-400 bg-red-950/40 border border-red-800/40 p-2.5 rounded-lg flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{loginError}</span>
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-widest text-[#f7e7c4] bronze-btn mt-4 cursor-pointer"
                >
                  AUTHENTICATE SESSION
                </button>
              </form>
            </>
          ) : (
            /* STEP 2: 6-Digit OTP Verification Screen */
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#20190f] border border-[#dfb776]/50 flex items-center justify-center shadow-lg">
                <Mail className="w-7 h-7 text-[#dfb776]" />
              </div>

              <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-widest text-white font-cinzel mb-2">
                SECURITY VERIFICATION
              </h1>
              <p className="text-xs text-neutral-300 font-medium tracking-wide mb-2">
                A 6-digit OTP code has been sent to:
              </p>
              <div className="inline-block text-xs font-mono font-semibold text-[#dfb776] bg-black/60 border border-[#c59b57]/30 px-3 py-1 rounded-full mb-6">
                {loginEmail}
              </div>

              {/* Simulated Inbound Email Dispatcher Box for Zero-Friction Access */}
              {simulatedEmailBanner && (
                <div className="mb-6 p-3 rounded-xl bg-[#181510] border border-[#c59b57]/40 text-left shadow-inner">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#dfb776] flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#dfb776]" />
                      <span>Security Email Dispatched</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyOtp}
                      className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-1 bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded cursor-pointer"
                    >
                      {copiedOtp ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy OTP</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="text-xs text-neutral-300 flex items-center justify-between">
                    <span>Your Verification OTP:</span>
                    <span className="font-mono text-base font-extrabold text-[#dfb776] tracking-widest bg-black px-2 py-0.5 rounded border border-[#dfb776]/40">
                      {generatedOtp}
                    </span>
                  </div>
                </div>
              )}

              <form onSubmit={handleVerifyOtpSubmit} className="space-y-6">
                {/* 6 Digit Inputs Grid */}
                <div className="flex justify-center items-center gap-2 sm:gap-2.5" onPaste={handleOtpPaste}>
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-input-${index}`}
                      type="text"
                      maxLength={1}
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-11 sm:w-12 h-13 sm:h-14 rounded-xl bg-black/80 border border-neutral-700 focus:border-[#dfb776] text-center text-xl sm:text-2xl font-bold font-mono text-[#dfb776] outline-none shadow-inner transition-colors"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={otpDigits.join('').trim().length < 6}
                  className="w-full py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-widest text-[#f7e7c4] bronze-btn cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  VERIFY CODE & APPROVE LOGIN
                </button>
              </form>

              {/* Resend and Back Navigation */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-800 text-xs">
                <button
                  type="button"
                  onClick={handleBackToCredentials}
                  className="text-neutral-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0}
                  className={`flex items-center gap-1 transition-colors ${
                    resendTimer > 0
                      ? 'text-neutral-600 cursor-not-allowed'
                      : 'text-[#dfb776] hover:underline cursor-pointer'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${resendTimer > 0 ? '' : 'text-[#dfb776]'}`} />
                  <span>
                    {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend Code'}
                  </span>
                </button>
              </div>
            </>
          )}

          {/* "Try Again" Popup Modal when OTP is wrong */}
          {wrongOtpPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
              <div className="relative w-full max-w-sm p-6 sm:p-7 rounded-2xl bg-[#141217] border border-red-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(239,68,68,0.2)] text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-950/60 border border-red-600/50 flex items-center justify-center text-red-400 shadow-lg">
                  <AlertTriangle className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-white font-cinzel mb-2 tracking-wider">
                  INCORRECT OTP
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed mb-6">
                  The verification code you entered is invalid. Please check your email and try again.
                </p>
                <button
                  onClick={() => {
                    setWrongOtpPopup(false);
                    setTimeout(() => {
                      document.getElementById('otp-input-0')?.focus();
                    }, 100);
                  }}
                  className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-red-800/80 hover:bg-red-700 border border-red-600 transition-colors cursor-pointer shadow-lg"
                >
                  TRY AGAIN
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div className="relative z-10 min-h-[calc(100vh-140px)] px-4 sm:px-6 pt-24 pb-20 max-w-7xl mx-auto">
      {/* Admin Title */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-widest text-white font-cinzel">
            <span className="bronze-gradient-text">ADMIN CONTROL PANEL</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time management for catalog products, dynamic categories, checkout directions, and payment QR.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadTemplateProducts()}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#f7e7c4] bg-[#2a2215] border border-[#dfb776]/40 hover:bg-[#382b18] transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Load 4 original bundles from screenshot"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#dfb776]" />
            <span>Load 4 Templates</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-neutral-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-neutral-400" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* 3-Column Core Management Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 text-left items-start">
        {/* =========================================
            COLUMN 1: MANAGE PRODUCTS & CATEGORIES
        ========================================= */}
        <div className="space-y-6">
          {/* Products Panel */}
          <div className="rounded-2xl bg-[#0d0d12]/90 border border-[#c59b57]/25 p-5 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.7)]">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#dfb776] text-center mb-6 font-cinzel">
              Manage Products
            </h2>

            {/* Product Items List */}
            <div className="space-y-3 mb-6 max-h-56 overflow-y-auto pr-1">
              {products.length === 0 ? (
                <div className="text-center py-6 text-xs text-neutral-500 border border-dashed border-neutral-800 rounded-xl">
                  No products in catalog yet.
                </div>
              ) : (
                products.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-[#c59b57]/15 hover:border-[#c59b57]/35 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-black border border-[#c59b57]/30 flex items-center justify-center shrink-0 overflow-hidden p-1">
                        <ProductIcon preset={p.iconPreset} imageUrl={p.imageUrl} />
                      </div>
                      <div className="truncate">
                        <span className="text-xs font-semibold text-white truncate block">
                          {p.title}
                        </span>
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="text-[#dfb776] font-mono">
                            Rs. {p.priceRs}
                          </span>
                          <span className="text-neutral-500">·</span>
                          <span className="text-neutral-400">
                            {p.category || 'General'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <button
                        onClick={() => startEditing(p)}
                        className="px-2 py-1 rounded bg-white/5 hover:bg-[#2a2215] text-[11px] text-neutral-300 hover:text-[#f7e7c4] border border-neutral-700 hover:border-[#dfb776]/40 transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="px-2 py-1 rounded bg-white/5 hover:bg-red-950/40 text-[11px] text-neutral-400 hover:text-red-400 border border-neutral-700 hover:border-red-800/40 transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add / Edit Product Form */}
            <form onSubmit={handleProductSubmit} className="pt-4 border-t border-[#c59b57]/15 space-y-3.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white font-cinzel">
                  {editingProductId ? 'Edit Product' : 'Add New Product'}
                </h3>
                {editingProductId && (
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="text-[10px] text-neutral-400 hover:text-white cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Product Title"
                  className="w-full px-3 py-2 rounded-lg bg-black/50 border border-neutral-800 focus:border-[#dfb776] text-xs text-white placeholder-neutral-600 outline-none"
                />
              </div>

              {/* Dynamic Category Choice */}
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Category</label>
                <div className="flex flex-wrap gap-1.5 p-1 rounded-lg bg-black/50 border border-neutral-800 max-h-24 overflow-y-auto">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`py-1 px-2.5 rounded text-[10px] font-semibold tracking-wider transition-colors truncate cursor-pointer ${
                        category === cat
                          ? 'bg-[#c59b57] text-black shadow'
                          : 'text-neutral-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Description (Short)</label>
                <input
                  type="text"
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="Key summary / highlights"
                  className="w-full px-3 py-2 rounded-lg bg-black/50 border border-neutral-800 focus:border-[#dfb776] text-xs text-white placeholder-neutral-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">
                  Full Masterclass Syllabus / Details
                </label>
                <textarea
                  rows={2}
                  value={fullDesc}
                  onChange={(e) => setFullDesc(e.target.value)}
                  placeholder="Detailed curriculum, modules, blueprints included..."
                  className="w-full px-3 py-2 rounded-lg bg-black/50 border border-neutral-800 focus:border-[#dfb776] text-xs text-white placeholder-neutral-600 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Price (Rs.)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="500"
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-neutral-800 focus:border-[#dfb776] text-xs text-white placeholder-neutral-600 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="POPULAR / NEW"
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-neutral-800 focus:border-[#dfb776] text-xs text-white placeholder-neutral-600 outline-none"
                  />
                </div>
              </div>

              {/* Icon / Image Selection */}
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">
                  Rectangular Image (URL / File Upload / Preset)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Image URL or upload file below"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-black/50 border border-neutral-800 focus:border-[#dfb776] text-xs text-white placeholder-neutral-600 outline-none truncate"
                  />
                  <label className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-neutral-700 cursor-pointer text-xs flex items-center gap-1 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProductImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Preset Icon Choice */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] text-neutral-500 uppercase">Presets:</span>
                  {(['shield', 'code', 'eye', 'cpu'] as IconPresetType[]).map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => {
                        setIconPreset(icon);
                        setImageUrl('');
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono transition-colors cursor-pointer ${
                        iconPreset === icon && !imageUrl
                          ? 'bg-[#c59b57] text-black font-bold'
                          : 'bg-white/5 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#f7e7c4] bronze-btn cursor-pointer mt-2"
              >
                {editingProductId ? 'UPDATE PRODUCT' : 'ADD PRODUCT'}
              </button>
            </form>

            {products.length > 0 && (
              <div className="pt-3 mt-3 border-t border-neutral-800 text-center">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Clear all products from catalog?')) {
                      clearAllProducts();
                    }
                  }}
                  className="text-[10px] text-neutral-500 hover:text-red-400 flex items-center justify-center gap-1 mx-auto cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear Catalog</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* =========================================
            COLUMN 2: MANAGE CATEGORIES & CHECKOUT
        ========================================= */}
        <div className="space-y-6">
          {/* CATEGORY MANAGEMENT PANEL */}
          <div className="rounded-2xl bg-[#0d0d12]/90 border border-[#c59b57]/25 p-5 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.7)]">
            <div className="flex items-center justify-center gap-2 mb-4">
              <FolderPlus className="w-4 h-4 text-[#dfb776]" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#dfb776] font-cinzel">
                Manage Categories
              </h2>
            </div>
            <p className="text-[11px] text-neutral-400 text-center mb-5">
              Add new categories, rename existing ones, or delete them with product removal controls.
            </p>

            {/* List of existing categories */}
            <div className="space-y-2 mb-5">
              {categories.map((cat) => {
                const count = products.filter((p) => p.category?.toLowerCase() === cat.toLowerCase()).length;
                const isEditing = editingCategoryOldName === cat;

                return (
                  <div
                    key={cat}
                    className="p-2.5 rounded-xl bg-black/40 border border-[#c59b57]/15 flex items-center justify-between gap-2"
                  >
                    {isEditing ? (
                      <form onSubmit={handleRenameCategorySubmit} className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          required
                          autoFocus
                          value={editingCategoryNewName}
                          onChange={(e) => setEditingCategoryNewName(e.target.value)}
                          className="flex-1 px-2.5 py-1 rounded bg-black/80 border border-[#dfb776] text-xs text-white outline-none"
                        />
                        <button
                          type="submit"
                          className="px-2 py-1 rounded bg-[#c59b57] text-black font-bold text-[11px] cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingCategoryOldName(null)}
                          className="p-1 text-neutral-400 hover:text-white cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xs font-semibold text-white truncate">{cat}</span>
                          <span className="text-[10px] text-neutral-400 font-mono bg-white/5 px-1.5 py-0.5 rounded">
                            {count} {count === 1 ? 'item' : 'items'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => startRenameCategory(cat)}
                            className="p-1.5 text-neutral-400 hover:text-[#dfb776] rounded bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                            title="Rename category"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => triggerDeleteCategoryModal(cat)}
                            className="p-1.5 text-neutral-400 hover:text-red-400 rounded bg-white/5 hover:bg-red-950/30 transition-colors cursor-pointer"
                            title="Delete category"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add New Category Form */}
            <form onSubmit={handleAddCategorySubmit} className="pt-3 border-t border-[#c59b57]/15">
              <label className="block text-[11px] text-neutral-400 mb-1.5">Add New Category</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Exploits, Blueprints..."
                  className="flex-1 px-3 py-2 rounded-lg bg-black/50 border border-neutral-800 focus:border-[#dfb776] text-xs text-white placeholder-neutral-600 outline-none"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-lg text-xs font-bold uppercase text-[#f7e7c4] bronze-btn flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
              {categoryError && (
                <p className="text-[11px] text-red-400 mt-1.5">{categoryError}</p>
              )}
            </form>
          </div>

          {/* EDIT CHECKOUT INSTRUCTIONS */}
          <div className="rounded-2xl bg-[#0d0d12]/90 border border-[#c59b57]/25 p-5 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.7)]">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#dfb776] text-center mb-6 font-cinzel">
              Edit Checkout Instructions
            </h2>

            <form onSubmit={handleSaveInstructions} className="space-y-4">
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">
                  JazzCash Account Title
                </label>
                <input
                  type="text"
                  required
                  value={accountTitle}
                  onChange={(e) => setAccountTitle(e.target.value)}
                  placeholder="[Aapka Naam Yahan Aayega]"
                  className="w-full px-3 py-2 rounded-lg bg-black/50 border border-neutral-800 focus:border-[#dfb776] text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">
                  JazzCash Account Number
                </label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="[Aapka JazzCash Number Yahan Aayega]"
                  className="w-full px-3 py-2 rounded-lg bg-black/50 border border-neutral-800 focus:border-[#dfb776] text-xs text-white outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">
                  Instagram Fulfillment Handle
                </label>
                <input
                  type="text"
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value)}
                  placeholder="@diva.ltd"
                  className="w-full px-3 py-2 rounded-lg bg-black/50 border border-neutral-800 focus:border-[#dfb776] text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">
                  Step 1 Instructions
                </label>
                <textarea
                  rows={2}
                  value={step1}
                  onChange={(e) => setStep1(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/50 border border-neutral-800 focus:border-[#dfb776] text-xs text-neutral-200 outline-none resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">
                  Step 2 Instructions
                </label>
                <textarea
                  rows={2}
                  value={step2}
                  onChange={(e) => setStep2(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/50 border border-neutral-800 focus:border-[#dfb776] text-xs text-neutral-200 outline-none resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">
                  Step 3 Instructions
                </label>
                <textarea
                  rows={2}
                  value={step3}
                  onChange={(e) => setStep3(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/50 border border-neutral-800 focus:border-[#dfb776] text-xs text-neutral-200 outline-none resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#f7e7c4] bronze-btn flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {instructionsSaved ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>INSTRUCTIONS SAVED!</span>
                  </>
                ) : (
                  <span>SAVE INSTRUCTIONS</span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* =========================================
            COLUMN 3: MANAGE QR CODE & ADMIN SECURITY
        ========================================= */}
        <div className="space-y-6">
          {/* QR Code Container */}
          <div className="rounded-2xl bg-[#0d0d12]/90 border border-[#c59b57]/25 p-5 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.7)]">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#dfb776] text-center mb-6 font-cinzel">
              Manage QR Code
            </h2>

            {/* Toggle switch: Show QR Code on Checkout */}
            <div className="flex items-center justify-between mb-6 p-3 rounded-xl bg-black/40 border border-white/5">
              <span className="text-xs font-medium text-neutral-300">
                Show QR Code on Checkout
              </span>

              <button
                type="button"
                onClick={() =>
                  updateCheckoutSettings({ showQrCode: !checkoutSettings.showQrCode })
                }
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors cursor-pointer ${
                  checkoutSettings.showQrCode ? 'bg-[#c59b57]' : 'bg-neutral-800'
                }`}
                aria-label="Toggle QR code checkout display"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    checkoutSettings.showQrCode ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Current QR Code Image Preview Box */}
            <div className="text-center mb-6">
              <span className="text-xs text-neutral-400 block mb-3 font-medium">
                Current QR Code Image
              </span>

              <div className="w-44 h-44 mx-auto rounded-xl bg-black/80 border border-[#c59b57]/40 p-3 flex items-center justify-center relative overflow-hidden shadow-inner">
                {checkoutSettings.qrCodeUrl ? (
                  <img
                    src={checkoutSettings.qrCodeUrl}
                    alt="Active QR"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-neutral-500 text-xs">No QR Code Image Set</div>
                )}
              </div>
            </div>

            {/* Action buttons: UPLOAD NEW QR and REMOVE QR */}
            <div className="space-y-2">
              <label className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#f7e7c4] bronze-btn flex items-center justify-center gap-2 cursor-pointer text-center">
                <Upload className="w-3.5 h-3.5" />
                <span>UPLOAD NEW QR</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleQrUpload}
                  className="hidden"
                />
              </label>

              {checkoutSettings.qrCodeUrl && (
                <button
                  type="button"
                  onClick={() => updateCheckoutSettings({ qrCodeUrl: undefined })}
                  className="w-full py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-red-400 bg-white/5 hover:bg-red-950/20 border border-neutral-800 hover:border-red-800/30 transition-colors uppercase cursor-pointer"
                >
                  REMOVE QR
                </button>
              )}
            </div>
          </div>

          {/* Admin Security & Credentials Settings */}
          <div className="rounded-2xl bg-[#0d0d12]/90 border border-[#c59b57]/25 p-5 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.7)]">
            <div className="flex items-center gap-2 mb-4 justify-center">
              <KeyRound className="w-4 h-4 text-[#dfb776]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-cinzel">
                Update Admin Login Credentials
              </h3>
            </div>

            <form onSubmit={handleSaveCredentials} className="space-y-3">
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Login Email</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/50 border border-neutral-800 focus:border-[#dfb776] text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Set new secure password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/50 border border-neutral-800 focus:border-[#dfb776] text-xs text-white outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-neutral-200 bg-white/5 hover:bg-white/10 border border-neutral-700 hover:border-[#dfb776]/40 transition-colors cursor-pointer"
              >
                {credentialsSaved ? (
                  <span className="text-emerald-400 flex items-center justify-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Credentials Updated!
                  </span>
                ) : (
                  'SAVE NEW CREDENTIALS'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Delete Category Confirmation Modal with Product Cascade Checkbox */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md p-6 sm:p-7 rounded-2xl bg-[#101016] border border-[#c59b57]/40 shadow-2xl text-left">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-950/50 border border-red-800/40 flex items-center justify-center text-red-400 shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-cinzel">
                  Delete Category: {categoryToDelete}
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  How would you like to handle products currently assigned to this category?
                </p>
              </div>
            </div>

            {/* Checkbox requested by user */}
            <div className="my-5 p-4 rounded-xl bg-black/60 border border-neutral-800 space-y-2">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={deleteAssociatedProducts}
                  onChange={(e) => setDeleteAssociatedProducts(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded accent-[#c59b57] cursor-pointer"
                />
                <span className="text-xs font-semibold text-white leading-snug">
                  Remove the products listed under this category from your website
                </span>
              </label>

              <p className="text-[11px] text-neutral-400 pl-7 leading-relaxed">
                {deleteAssociatedProducts ? (
                  <span className="text-red-400">
                    ⚠ Warning: All products in "{categoryToDelete}" will be permanently removed from your storefront.
                  </span>
                ) : (
                  <span className="text-[#dfb776]">
                    ✓ Safe: Products will stay on your website and be moved to the general catalog ("All").
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-neutral-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteCategory}
                className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-red-800/80 hover:bg-red-700 border border-red-600 transition-colors cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
