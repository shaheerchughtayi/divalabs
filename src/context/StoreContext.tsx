import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, CheckoutSettings, AdminAuth } from '../types';
import { DEFAULT_CHECKOUT_SETTINGS, DEFAULT_ADMIN_AUTH, TEMPLATE_PRODUCTS, DEFAULT_CATEGORIES } from '../data/defaults';

interface StoreContextType {
  products: Product[];
  categories: string[];
  checkoutSettings: CheckoutSettings;
  adminAuth: AdminAuth;
  isAdminLoggedIn: boolean;
  selectedProduct: Product | null;
  activeView: 'home' | 'products' | 'checkout' | 'admin';
  productDetailModal: Product | null;
  setActiveView: (view: 'home' | 'products' | 'checkout' | 'admin') => void;
  setProductDetailModal: (product: Product | null) => void;
  selectProductForCheckout: (product: Product) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (name: string) => boolean;
  renameCategory: (oldName: string, newName: string) => boolean;
  deleteCategory: (categoryName: string, deleteAssociatedProducts: boolean) => void;
  updateCheckoutSettings: (settings: Partial<CheckoutSettings>) => void;
  updateAdminAuth: (auth: Partial<AdminAuth>) => void;
  verifyAdminCredentials: (email: string, pass: string) => boolean;
  loginAdmin: (email: string, pass: string) => boolean;
  setAdminAuthenticated: (status: boolean) => void;
  logoutAdmin: () => void;
  loadTemplateProducts: () => void;
  clearAllProducts: () => void;
}

const LOCAL_STORAGE_KEY = 'diva_labs_store_v1';

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Empty catalog initially as selected by user
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [checkoutSettings, setCheckoutSettings] = useState<CheckoutSettings>(DEFAULT_CHECKOUT_SETTINGS);
  const [adminAuth, setAdminAuth] = useState<AdminAuth>(DEFAULT_ADMIN_AUTH);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productDetailModal, setProductDetailModal] = useState<Product | null>(null);
  const [activeView, setActiveView] = useState<'home' | 'products' | 'checkout' | 'admin'>('home');

  // Sync route from URL hash or pathname
  useEffect(() => {
    const handleUrlChange = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();

      if (hash.includes('admin') || path.includes('admin')) {
        setActiveView('admin');
      } else if (hash.includes('checkout') || path.includes('checkout')) {
        setActiveView('checkout');
      } else if (hash.includes('product') || hash.includes('store') || path.includes('store')) {
        setActiveView('products');
      } else {
        setActiveView('home');
      }
    };

    handleUrlChange();
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  // Update hash when activeView changes
  const navigateToView = (view: 'home' | 'products' | 'checkout' | 'admin') => {
    setActiveView(view);
    if (view === 'home') {
      window.history.pushState(null, '', '#home');
    } else if (view === 'products') {
      window.history.pushState(null, '', '#products');
    } else if (view === 'checkout') {
      window.history.pushState(null, '', '#checkout');
    } else if (view === 'admin') {
      window.history.pushState(null, '', '#admin');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Initial Load: Try LocalStorage first, then reconcile with server API
  useEffect(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed.products)) setProducts(parsed.products);
        if (Array.isArray(parsed.categories) && parsed.categories.length > 0) setCategories(parsed.categories);
        if (parsed.checkoutSettings) setCheckoutSettings(parsed.checkoutSettings);
        if (parsed.adminAuth) setAdminAuth(parsed.adminAuth);
      }
    } catch {
      // Ignore JSON parse errors
    }

    // Server fetch (defensive guard)
    try {
      if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
        window.fetch('/api/diva/data')
          .then(res => res.ok ? res.json() : null)
          .then(data => {
            if (data && data.initialized) {
              if (Array.isArray(data.products)) setProducts(data.products);
              if (Array.isArray(data.categories) && data.categories.length > 0) setCategories(data.categories);
              if (data.checkoutSettings) setCheckoutSettings(data.checkoutSettings);
              if (data.adminAuth) setAdminAuth(data.adminAuth);
            }
          })
          .catch(() => {
            // Fallback to local storage silently
          });
      }
    } catch {
      // Ignore network errors
    }
  }, []);

  // Save changes to localStorage and server API
  const persistState = useCallback((
    updatedProducts: Product[],
    updatedCategories: string[],
    updatedSettings: CheckoutSettings,
    updatedAuth: AdminAuth
  ) => {
    const payload = {
      initialized: true,
      products: updatedProducts,
      categories: updatedCategories,
      checkoutSettings: updatedSettings,
      adminAuth: updatedAuth,
      updatedAt: Date.now(),
    };

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // LocalStorage error handling
    }

    try {
      if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
        window.fetch('/api/diva/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).catch(() => {
          // Server error handling
        });
      }
    } catch {
      // Ignore
    }
  }, []);

  const addProduct = (newProd: Omit<Product, 'id' | 'createdAt'>) => {
    const created: Product = {
      ...newProd,
      id: 'prod_' + Math.random().toString(36).substring(2, 9),
      createdAt: Date.now(),
    };
    const nextProds = [created, ...products];
    setProducts(nextProds);
    persistState(nextProds, categories, checkoutSettings, adminAuth);
  };

  const updateProduct = (id: string, patch: Partial<Product>) => {
    const nextProds = products.map(p => (p.id === id ? { ...p, ...patch } : p));
    setProducts(nextProds);
    persistState(nextProds, categories, checkoutSettings, adminAuth);
  };

  const deleteProduct = (id: string) => {
    const nextProds = products.filter(p => p.id !== id);
    setProducts(nextProds);
    persistState(nextProds, categories, checkoutSettings, adminAuth);
  };

  // Category Management Handlers
  const addCategory = (name: string): boolean => {
    const trimmed = name.trim();
    if (!trimmed) return false;
    if (categories.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      return false;
    }
    const nextCats = [...categories, trimmed];
    setCategories(nextCats);
    persistState(products, nextCats, checkoutSettings, adminAuth);
    return true;
  };

  const renameCategory = (oldName: string, newName: string): boolean => {
    const trimmed = newName.trim();
    if (!trimmed) return false;
    if (categories.some(c => c.toLowerCase() === trimmed.toLowerCase() && c.toLowerCase() !== oldName.toLowerCase())) {
      return false;
    }
    const nextCats = categories.map(c => (c.toLowerCase() === oldName.toLowerCase() ? trimmed : c));
    const nextProds = products.map(p => {
      if (p.category && p.category.toLowerCase() === oldName.toLowerCase()) {
        return { ...p, category: trimmed };
      }
      return p;
    });
    setCategories(nextCats);
    setProducts(nextProds);
    persistState(nextProds, nextCats, checkoutSettings, adminAuth);
    return true;
  };

  const deleteCategory = (categoryName: string, deleteAssociatedProducts: boolean) => {
    const nextCats = categories.filter(c => c.toLowerCase() !== categoryName.toLowerCase());
    let nextProds = products;

    if (deleteAssociatedProducts) {
      // Remove all products listed under this category from website
      nextProds = products.filter(p => p.category?.toLowerCase() !== categoryName.toLowerCase());
    } else {
      // Keep products on website and move them to general 'All' category
      nextProds = products.map(p => {
        if (p.category?.toLowerCase() === categoryName.toLowerCase()) {
          const updated = { ...p };
          delete updated.category;
          return updated;
        }
        return p;
      });
    }

    setCategories(nextCats);
    setProducts(nextProds);
    persistState(nextProds, nextCats, checkoutSettings, adminAuth);
  };

  const updateCheckoutSettings = (patch: Partial<CheckoutSettings>) => {
    const next = { ...checkoutSettings, ...patch };
    setCheckoutSettings(next);
    persistState(products, categories, next, adminAuth);
  };

  const updateAdminAuth = (patch: Partial<AdminAuth>) => {
    const next = { ...adminAuth, ...patch };
    setAdminAuth(next);
    persistState(products, categories, checkoutSettings, next);
  };

  const verifyAdminCredentials = (email: string, pass: string): boolean => {
    return email.trim().toLowerCase() === adminAuth.email.toLowerCase() && pass === adminAuth.password;
  };

  const loginAdmin = (email: string, pass: string): boolean => {
    if (verifyAdminCredentials(email, pass)) {
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const setAdminAuthenticated = (status: boolean) => {
    setIsAdminLoggedIn(status);
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
  };

  const loadTemplateProducts = () => {
    setProducts(TEMPLATE_PRODUCTS);
    setCategories(DEFAULT_CATEGORIES);
    persistState(TEMPLATE_PRODUCTS, DEFAULT_CATEGORIES, checkoutSettings, adminAuth);
  };

  const clearAllProducts = () => {
    setProducts([]);
    persistState([], categories, checkoutSettings, adminAuth);
  };

  const selectProductForCheckout = (prod: Product) => {
    setSelectedProduct(prod);
    setProductDetailModal(null);
    navigateToView('checkout');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        checkoutSettings,
        adminAuth,
        isAdminLoggedIn,
        selectedProduct,
        activeView,
        productDetailModal,
        setActiveView: navigateToView,
        setProductDetailModal,
        selectProductForCheckout,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        renameCategory,
        deleteCategory,
        updateCheckoutSettings,
        updateAdminAuth,
        verifyAdminCredentials,
        loginAdmin,
        setAdminAuthenticated,
        logoutAdmin,
        loadTemplateProducts,
        clearAllProducts,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};
