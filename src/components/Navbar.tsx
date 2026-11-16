import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  Globe,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Check,
  LogOut,
} from 'lucide-react';
import { useCart, type CurrencyCode } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import type { ActiveView, Category } from '../types';

interface NavbarProps {
  activeView: ActiveView;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNavigateHome: () => void;
  onNavigateShop: (options?: {
    category?: Category;
    brand?: string;
    bestSellersOnly?: boolean;
  }) => void;
  onNavigateCart: () => void;
  brandNames: string[];
}

const CURRENCIES: CurrencyCode[] = ['USD', 'EUR', 'GBP'];

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  searchQuery,
  onSearchChange,
  onNavigateHome,
  onNavigateShop,
  brandNames,
}) => {
  const { totalItems, subtotal, openDrawer, currency, setCurrency, formatPrice } = useCart();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const firstName = user?.name ? user.name.split(' ')[0] : 'Account';
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'D';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigateShop();
    setMobileMenuOpen(false);
  };

  const handleCurrencyCycle = () => {
    const nextIndex = (CURRENCIES.indexOf(currency) + 1) % CURRENCIES.length;
    setCurrency(CURRENCIES[nextIndex]);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      {/* Announcement Banner Bar */}
      <div className="bg-neutral-900 text-neutral-100 text-[11px] sm:text-xs tracking-[0.14em] uppercase py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <span className="hidden md:inline text-neutral-400">
            Authorized Retailer • 100% Authentic Clinical Formulas
          </span>
          <p className="mx-auto md:mx-0 text-center font-medium">
            Free shipping on orders over $50{' '}
            <span className="hidden sm:inline text-neutral-400 mx-1.5">|</span>
            <span className="hidden sm:inline text-amber-200/90">
              Use code DERM15 for 15% off
            </span>
          </p>
          <button
            type="button"
            onClick={() => onNavigateShop({ bestSellersOnly: true })}
            className="hidden md:inline underline underline-offset-4 hover:text-white transition-colors"
          >
            Shop Best Sellers
          </button>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 -ml-2 text-neutral-800 hover:text-neutral-950"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Brand Logo */}
          <button
            type="button"
            onClick={onNavigateHome}
            className="text-left group shrink-0"
          >
            <span className="block text-xl sm:text-2xl font-bold tracking-[0.26em] text-neutral-900 group-hover:opacity-80 transition-opacity">
              DERMSTORE
            </span>
            <span className="hidden sm:block text-[9px] tracking-[0.24em] uppercase text-neutral-500 -mt-0.5">
              Clinical Skin &amp; Luxury Care
            </span>
          </button>

          {/* Search Input Bar (Desktop & Tablet) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md lg:max-w-lg mx-4"
          >
            <div className="relative w-full">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (activeView !== 'shop') {
                    onNavigateShop();
                  }
                }}
                placeholder="Search SkinCeuticals, SPF 46, vitamin C, retinol..."
                aria-label="Search products and brands"
                className="w-full bg-[#F6F5F2] border border-neutral-200 focus:border-neutral-900 focus:bg-white rounded-none pl-10 pr-9 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-800"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </form>

          {/* Header Utility Actions: Currency, Account, Cart Badge */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={handleCurrencyCycle}
              title="Switch display currency"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium tracking-wider text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
            >
              <Globe className="w-4 h-4 stroke-[1.6]" />
              <span>{currency}</span>
            </button>

            {/* Account Menu Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium tracking-wider text-neutral-800 hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
                aria-expanded={accountOpen}
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover border border-neutral-300"
                  />
                ) : (
                  <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-[11px] font-semibold flex items-center justify-center">
                    {userInitial}
                  </span>
                )}
                <span className="hidden lg:inline max-w-[100px] truncate">
                  {firstName}
                </span>
              </button>

              {accountOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setAccountOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-white border border-neutral-200 shadow-xl p-4 z-20">
                    {user && (
                      <div className="pb-3 mb-3 border-b border-neutral-100">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-neutral-950 truncate">
                            {user.name}
                          </p>
                          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#F6F5F2] border border-neutral-200 text-neutral-700 shrink-0">
                            {user.provider === 'google' ? 'Google OAuth' : 'Email Auth'}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-900">
                      <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                      Dermstore Rewards Active
                    </div>
                    <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
                      Earn 5 points per $1 spent on SkinCeuticals, EltaMD, and clinical favorites.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setAccountOpen(false);
                        onNavigateShop({ bestSellersOnly: true });
                      }}
                      className="mt-3 w-full bg-[#F6F5F2] text-neutral-900 border border-neutral-300 text-xs font-semibold uppercase tracking-widest py-2 hover:border-neutral-900 transition-colors"
                    >
                      Explore Member Favorites
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAccountOpen(false);
                        signOut();
                      }}
                      className="mt-2 w-full bg-neutral-900 text-white text-xs font-semibold uppercase tracking-widest py-2.5 hover:bg-neutral-800 transition-colors inline-flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Interactive Cart Drawer Trigger & Counter Badge */}
            <button
              type="button"
              onClick={openDrawer}
              className="inline-flex items-center gap-2 px-2.5 sm:px-3.5 py-2 bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
              aria-label={`Open shopping bag with ${totalItems} items`}
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 stroke-[1.75]" />
                <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-200 text-neutral-950 text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              </div>
              <span className="hidden sm:inline text-xs font-medium tracking-wider uppercase ml-1">
                Bag
              </span>
              {subtotal > 0 && (
                <span className="hidden xl:inline text-xs text-neutral-300 border-l border-neutral-700 pl-2">
                  {formatPrice(subtotal)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <form onSubmit={handleSearchSubmit} className="md:hidden pb-3">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (activeView !== 'shop') {
                  onNavigateShop();
                }
              }}
              placeholder="Search clinical skincare, brands..."
              aria-label="Search products"
              className="w-full bg-[#F6F5F2] border border-neutral-200 focus:border-neutral-900 focus:bg-white pl-10 pr-8 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Category Navigation Bar (Desktop) */}
      <nav
        aria-label="Primary categories"
        className="hidden lg:block border-t border-neutral-100 bg-white"
      >
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-center gap-8 h-11">
          <button
            type="button"
            onClick={() => onNavigateShop()}
            className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-700 hover:text-neutral-950 transition-colors"
          >
            Shop All
          </button>
          <button
            type="button"
            onClick={() => onNavigateShop({ category: 'Skin Care' })}
            className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-700 hover:text-neutral-950 transition-colors"
          >
            Skin Care
          </button>
          <button
            type="button"
            onClick={() => onNavigateShop({ category: 'Sun Care' })}
            className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-700 hover:text-neutral-950 transition-colors"
          >
            Sun &amp; SPF
          </button>
          <button
            type="button"
            onClick={() => onNavigateShop({ category: 'Hair Care' })}
            className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-700 hover:text-neutral-950 transition-colors"
          >
            Hair Care
          </button>
          <button
            type="button"
            onClick={() => onNavigateShop({ category: 'Eye & Lash' })}
            className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-700 hover:text-neutral-950 transition-colors"
          >
            Eye &amp; Lash
          </button>

          {/* Brands Dropdown */}
          <div
            className="relative h-full flex items-center"
            onMouseEnter={() => setBrandsOpen(true)}
            onMouseLeave={() => setBrandsOpen(false)}
          >
            <button
              type="button"
              onClick={() => setBrandsOpen((prev) => !prev)}
              className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-[0.16em] text-neutral-700 hover:text-neutral-950 transition-colors"
              aria-expanded={brandsOpen}
            >
              Brands
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {brandsOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-80 bg-white border border-neutral-200 shadow-xl p-5 z-30">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-3">
                  Authorized Clinical Brands
                </p>
                <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
                  {brandNames.map((brand) => (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => {
                        setBrandsOpen(false);
                        onNavigateShop({ brand });
                      }}
                      className="text-left text-xs text-neutral-700 hover:text-neutral-950 hover:underline underline-offset-4 transition-colors"
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => onNavigateShop({ bestSellersOnly: true })}
            className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-900 hover:text-neutral-950 transition-colors"
          >
            Best Sellers
          </button>
        </div>
      </nav>

      {/* Mobile Slide-Down Category Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 bg-white px-4 py-5 space-y-4 shadow-lg">
          <div className="flex flex-col space-y-3">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateHome();
              }}
              className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-neutral-900 py-1"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateShop();
              }}
              className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-neutral-900 py-1"
            >
              Shop All Products
            </button>
            {(['Skin Care', 'Sun Care', 'Hair Care', 'Eye & Lash'] as Category[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateShop({ category: cat });
                }}
                className="text-left text-xs uppercase tracking-[0.16em] text-neutral-700 py-1"
              >
                {cat}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateShop({ bestSellersOnly: true });
              }}
              className="text-left text-xs font-semibold uppercase tracking-[0.16em] text-amber-900 py-1"
            >
              Best Sellers
            </button>
          </div>

          <div className="pt-3 border-t border-neutral-100">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2.5">
              Top Clinical Brands
            </p>
            <div className="flex flex-wrap gap-2">
              {brandNames.slice(0, 6).map((brand) => (
                <button
                  key={brand}
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigateShop({ brand });
                  }}
                  className="text-xs px-2.5 py-1 bg-[#F6F5F2] border border-neutral-200 text-neutral-800"
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-xs text-neutral-500 uppercase tracking-wider">Currency</span>
            <div className="flex gap-1.5">
              {CURRENCIES.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setCurrency(code)}
                  className={`px-2.5 py-1 text-xs border inline-flex items-center gap-1 ${
                    currency === code
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white text-neutral-700 border-neutral-200'
                  }`}
                >
                  {currency === code && <Check className="w-3 h-3" />}
                  {code}
                </button>
              ))}
            </div>
          </div>

          {user && (
            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-neutral-900 truncate">{user.name}</p>
                <p className="text-[11px] text-neutral-500 truncate">{user.email}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white text-xs uppercase tracking-wider shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
