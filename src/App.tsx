import React, { useMemo, useState } from 'react';
import catalogJson from './data/products.json';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Cart } from './pages/Cart';
import type {
  ActiveView,
  CatalogData,
  Category,
  FilterState,
  PriceRange,
  SkinType,
  SortOption,
} from './types';

const catalog = catalogJson as CatalogData;

const INITIAL_FILTERS: FilterState = {
  categories: [],
  brands: [],
  skinTypes: [],
  priceRange: 'all',
  bestSellersOnly: false,
};

export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const allBrandNames = useMemo(
    () => Array.from(new Set(catalog.products.map((p) => p.brand))).sort(),
    []
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setActiveView('home');
    setSearchQuery('');
    scrollToTop();
  };

  const handleNavigateShop = (options?: {
    category?: Category;
    brand?: string;
    bestSellersOnly?: boolean;
  }) => {
    if (options) {
      setSearchQuery('');
      setFilters({
        categories: options.category ? [options.category] : [],
        brands: options.brand ? [options.brand] : [],
        skinTypes: [],
        priceRange: 'all',
        bestSellersOnly: Boolean(options.bestSellersOnly),
      });
    }
    setActiveView('shop');
    scrollToTop();
  };

  const handleNavigateCart = () => {
    setActiveView('cart');
    scrollToTop();
  };

  const toggleCategory = (category: Category) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const toggleBrand = (brand: string) => {
    setFilters((prev) => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter((b) => b !== brand)
        : [...prev.brands, brand],
    }));
  };

  const toggleSkinType = (skinType: SkinType) => {
    setFilters((prev) => ({
      ...prev,
      skinTypes: prev.skinTypes.includes(skinType)
        ? prev.skinTypes.filter((s) => s !== skinType)
        : [...prev.skinTypes, skinType],
    }));
  };

  const setPriceRange = (priceRange: PriceRange) => {
    setFilters((prev) => ({ ...prev, priceRange }));
  };

  const toggleBestSellers = () => {
    setFilters((prev) => ({ ...prev, bestSellersOnly: !prev.bestSellersOnly }));
  };

  const resetAllFilters = () => {
    setFilters(INITIAL_FILTERS);
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F7] text-neutral-900">
      <Navbar
        activeView={activeView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNavigateHome={handleNavigateHome}
        onNavigateShop={handleNavigateShop}
        onNavigateCart={handleNavigateCart}
        brandNames={allBrandNames}
      />

      <main className="flex-1">
        {activeView === 'home' && (
          <Home
            brands={catalog.brands}
            products={catalog.products}
            onNavigateShop={handleNavigateShop}
          />
        )}

        {activeView === 'shop' && (
          <Shop
            products={catalog.products}
            filters={filters}
            searchQuery={searchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onClearSearch={() => setSearchQuery('')}
            onToggleCategory={toggleCategory}
            onToggleBrand={toggleBrand}
            onToggleSkinType={toggleSkinType}
            onPriceRangeChange={setPriceRange}
            onToggleBestSellers={toggleBestSellers}
            onResetAll={resetAllFilters}
            onNavigateHome={handleNavigateHome}
          />
        )}

        {activeView === 'cart' && (
          <Cart onContinueShopping={() => handleNavigateShop()} />
        )}
      </main>

      <Footer
        onNavigateHome={handleNavigateHome}
        onNavigateShop={handleNavigateShop}
        onNavigateCart={handleNavigateCart}
      />

      <CartDrawer
        onViewFullCart={handleNavigateCart}
        onContinueShopping={() => handleNavigateShop({ bestSellersOnly: true })}
      />
    </div>
  );
};

export default App;
