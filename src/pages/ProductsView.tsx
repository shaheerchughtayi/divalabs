import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductIcon } from '../components/ProductIcon';
import { Product } from '../types';
import {
  Shield,
  Sparkles,
  ArrowRight,
  PlusCircle,
  Search,
  X,
  LayoutGrid,
  Map,
  BookOpen,
  Filter,
  Check,
  RotateCcw,
  Layers,
} from 'lucide-react';

// Get appropriate icon for any custom category name
const getCategoryIcon = (catName: string) => {
  const lower = catName.toLowerCase();
  if (lower.includes('cyber') || lower.includes('security') || lower.includes('hack') || lower.includes('exploit')) {
    return Shield;
  }
  if (lower.includes('roadmap') || lower.includes('path') || lower.includes('engineer') || lower.includes('dev')) {
    return Map;
  }
  if (lower.includes('master') || lower.includes('class') || lower.includes('course') || lower.includes('vault') || lower.includes('psych')) {
    return BookOpen;
  }
  return Layers;
};

export const ProductsView: React.FC = () => {
  const { products, categories, setProductDetailModal, selectProductForCheckout, setActiveView, loadTemplateProducts } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: products.length,
    };
    categories.forEach((cat) => {
      counts[cat] = products.filter((p) => p.category?.toLowerCase() === cat.toLowerCase()).length;
    });
    return counts;
  }, [products, categories]);

  // Combined search and category filter
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category check
      if (selectedCategory !== 'All') {
        const prodCat = product.category || '';
        if (prodCat.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      }
      // Search check
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = product.title.toLowerCase().includes(q);
        const matchesDesc = product.shortDescription.toLowerCase().includes(q);
        const matchesCategory = (product.category || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesCategory) return false;
      }
      return true;
    });
  }, [products, selectedCategory, searchQuery]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
  };

  return (
    <div className="relative z-10 min-h-[calc(100vh-140px)] px-4 sm:px-6 pt-24 pb-20 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-wider text-white font-cinzel mb-3">
          <span className="bronze-gradient-text drop-shadow-[0_2px_18px_rgba(223,183,118,0.2)]">
            OUR ELITE DIGITAL ASSETS & ROADMAPS
          </span>
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 font-medium tracking-wide">
          Choose your weapon and start mastering today.
        </p>
      </div>

      {/* Catalog Empty Slate */}
      {products.length === 0 ? (
        <div className="max-w-xl mx-auto text-center p-8 sm:p-12 rounded-2xl bg-[#0f0f14]/80 border border-[#c59b57]/25 shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#251e13] border border-[#dfb776]/40 flex items-center justify-center">
            <Shield className="w-8 h-8 text-[#dfb776]" />
          </div>
          <h2 className="text-xl font-bold uppercase tracking-wider text-white font-cinzel mb-2">
            CATALOG INITIALIZING
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed mb-8">
            The catalog currently contains no active listings. You can log into the secure Admin Control Panel to add custom assets, or instantly load the four verified blueprint templates with one click.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => loadTemplateProducts()}
              className="w-full sm:w-auto px-6 py-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider text-[#f7e7c4] bronze-btn flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#dfb776]" />
              <span>LOAD 4 BLUEPRINT TEMPLATES</span>
            </button>
            <button
              onClick={() => setActiveView('admin')}
              className="w-full sm:w-auto px-6 py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wider text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-neutral-700 hover:border-[#c59b57]/40 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-[#dfb776]" />
              <span>OPEN ADMIN PANEL</span>
            </button>
          </div>
        </div>
      ) : (
        /* Main Layout: Category Sidebar + Products Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* =========================================
              CATEGORY FILTER SIDEBAR (Desktop & Mobile)
          ========================================= */}
          <aside className="lg:col-span-3 w-full">
            <div className="rounded-2xl bg-[#0e0e13]/90 border border-[#c59b57]/25 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl lg:sticky lg:top-24">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#c59b57]/15">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#dfb776] font-cinzel">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Asset Categories</span>
                </div>
                {(selectedCategory !== 'All' || searchQuery) && (
                  <button
                    onClick={resetFilters}
                    className="text-[11px] text-neutral-400 hover:text-[#dfb776] flex items-center gap-1 transition-colors cursor-pointer"
                    title="Reset all active filters"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Dynamic Category Buttons List */}
              <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                {/* "All Digital Assets" pill */}
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`group w-full flex items-center justify-between p-3 rounded-xl text-left transition-all duration-200 cursor-pointer shrink-0 sm:shrink ${
                    selectedCategory === 'All'
                      ? 'bg-[#2a2215] text-[#f7e7c4] border border-[#dfb776]/60 shadow-[0_4px_16px_rgba(197,155,87,0.18)]'
                      : 'bg-black/40 text-neutral-400 hover:text-white hover:bg-white/5 border border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                        selectedCategory === 'All'
                          ? 'bg-[#c59b57] text-black shadow'
                          : 'bg-white/5 text-[#dfb776] group-hover:bg-white/10'
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap">
                      All Digital Assets
                    </span>
                  </div>

                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                      selectedCategory === 'All'
                        ? 'bg-[#dfb776]/20 text-[#dfb776]'
                        : 'bg-white/5 text-neutral-500 group-hover:text-neutral-400'
                    }`}
                  >
                    {categoryCounts.All}
                  </span>
                </button>

                {/* Custom dynamic categories from store */}
                {categories.map((catName) => {
                  const Icon = getCategoryIcon(catName);
                  const isSelected = selectedCategory.toLowerCase() === catName.toLowerCase();
                  const count = categoryCounts[catName] || 0;

                  return (
                    <button
                      key={catName}
                      onClick={() => setSelectedCategory(catName)}
                      className={`group w-full flex items-center justify-between p-3 rounded-xl text-left transition-all duration-200 cursor-pointer shrink-0 sm:shrink ${
                        isSelected
                          ? 'bg-[#2a2215] text-[#f7e7c4] border border-[#dfb776]/60 shadow-[0_4px_16px_rgba(197,155,87,0.18)]'
                          : 'bg-black/40 text-neutral-400 hover:text-white hover:bg-white/5 border border-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-[#c59b57] text-black shadow'
                              : 'bg-white/5 text-[#dfb776] group-hover:bg-white/10'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap">
                          {catName}
                        </span>
                      </div>

                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                          isSelected
                            ? 'bg-[#dfb776]/20 text-[#dfb776]'
                            : 'bg-white/5 text-neutral-500 group-hover:text-neutral-400'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Sidebar Quick Directory Summary Info */}
              <div className="hidden lg:block mt-6 pt-5 border-t border-[#c59b57]/15 text-left">
                <div className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold mb-2 font-cinzel">
                  Arsenal Verification
                </div>
                <div className="space-y-2 text-xs text-neutral-400">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#dfb776] shrink-0" />
                    <span>Instant Manual Drive Dispatch</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#dfb776] shrink-0" />
                    <span>JazzCash Verified Payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#dfb776] shrink-0" />
                    <span>Peer-to-Peer Fulfillment</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* =========================================
              MAIN CONTENT (Search Bar + Products Grid)
          ========================================= */}
          <section className="lg:col-span-9 w-full">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative flex items-center rounded-2xl bg-[#0d0d12]/90 border border-[#c59b57]/30 shadow-[0_4px_24px_rgba(0,0,0,0.5)] focus-within:border-[#dfb776] focus-within:shadow-[0_0_20px_rgba(197,155,87,0.25)] transition-all duration-200 px-4 py-3">
                <Search className="w-4 h-4 text-[#dfb776] shrink-0 mr-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search in ${selectedCategory === 'All' ? 'all assets' : selectedCategory}...`}
                  className="w-full bg-transparent text-sm text-white placeholder-neutral-500 outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition-colors shrink-0 ml-2 cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Active Filter Indicators */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-400 mt-2.5 px-2">
                <div className="flex items-center gap-2">
                  <span>
                    Showing <strong className="text-[#dfb776] font-mono">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'asset' : 'assets'}
                  </span>
                  {selectedCategory !== 'All' && (
                    <span className="flex items-center gap-1 text-[11px] text-[#f7e7c4] bg-[#2a2215] border border-[#dfb776]/40 px-2 py-0.5 rounded-full">
                      <span>{selectedCategory}</span>
                      <button
                        onClick={() => setSelectedCategory('All')}
                        className="hover:text-white cursor-pointer"
                        aria-label="Remove category filter"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>

                {(selectedCategory !== 'All' || searchQuery) && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-[#dfb776] hover:underline cursor-pointer text-xs"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>

            {/* Empty Search/Filter Result */}
            {filteredProducts.length === 0 ? (
              <div className="text-center p-12 rounded-2xl bg-[#0f0f14]/80 border border-[#c59b57]/20 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
                <Search className="w-10 h-10 text-neutral-500 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white uppercase font-cinzel tracking-wider mb-2">
                  No Matching Digital Assets
                </h3>
                <p className="text-xs text-neutral-400 mb-6 leading-relaxed max-w-md mx-auto">
                  No assets found under category "{selectedCategory}" {searchQuery ? `matching "${searchQuery}"` : ''}. Try another category or reset your filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 rounded-full text-xs font-semibold text-[#f7e7c4] bg-[#2a2215] border border-[#dfb776]/40 hover:bg-[#382b18] transition-colors cursor-pointer"
                >
                  View All Products
                </button>
              </div>
            ) : (
              /* Products Grid */
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {filteredProducts.map((product) => {
                  const cat = product.category || 'General';

                  return (
                    <div
                      key={product.id}
                      className="group relative rounded-2xl bg-[#0c0c10]/90 border border-[#c59b57]/20 p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:border-[#dfb776]/60 hover:shadow-[0_16px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(197,155,87,0.22)] transition-all duration-300 flex flex-col sm:flex-row gap-4 sm:gap-5 items-stretch text-left overflow-hidden"
                    >
                      {/* Left rectangular image placeholder box */}
                      <div className="w-full sm:w-28 md:w-32 h-28 sm:h-auto rounded-xl bg-[#08080a] border border-[#c59b57]/20 flex items-center justify-center p-2.5 shrink-0 overflow-hidden group-hover:border-[#dfb776]/40 transition-colors">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
                          <ProductIcon
                            preset={product.iconPreset}
                            imageUrl={product.imageUrl}
                          />
                        </div>
                      </div>

                      {/* Right content area: Title, Category, Price, Action buttons */}
                      <div className="flex flex-col justify-between flex-1 min-w-0">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-bold tracking-widest text-[#dfb776] uppercase font-cinzel">
                              {cat}
                            </span>
                            {product.badge && (
                              <>
                                <span className="text-neutral-600 text-xs">·</span>
                                <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                                  {product.badge}
                                </span>
                              </>
                            )}
                          </div>

                          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#f7e7c4] transition-colors leading-snug line-clamp-2 mb-2 font-cinzel">
                            {product.title}
                          </h3>

                          <div className="text-xl sm:text-2xl font-black text-[#dfb776] font-mono tracking-tight mb-4">
                            Rs. {product.priceRs.toLocaleString()}
                          </div>
                        </div>

                        {/* Card Action Buttons: Kept strictly inside the card box */}
                        <div className="flex items-center gap-2 pt-2 w-full mt-auto">
                          <button
                            onClick={() => setProductDetailModal(product)}
                            className="px-3 py-1.5 sm:py-2 rounded-full text-xs font-semibold tracking-wider text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-neutral-700/80 hover:border-[#dfb776]/50 transition-all cursor-pointer whitespace-nowrap shrink-0"
                          >
                            See Details
                          </button>

                          <button
                            onClick={() => selectProductForCheckout(product)}
                            className="flex-1 min-w-0 py-1.5 sm:py-2 px-3 rounded-full text-xs font-bold tracking-wider uppercase text-[#f7e7c4] bronze-btn flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap overflow-hidden"
                          >
                            <span className="truncate">Buy Now</span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#dfb776] shrink-0" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};
