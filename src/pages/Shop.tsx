import React, { useMemo, useState } from 'react';
import { SlidersHorizontal, X, SearchX } from 'lucide-react';
import { FilterSidebar } from '../components/FilterSidebar';
import { ProductCard } from '../components/ProductCard';
import type {
  Category,
  FilterState,
  PriceRange,
  Product,
  SkinType,
  SortOption,
} from '../types';

interface ShopProps {
  products: Product[];
  filters: FilterState;
  searchQuery: string;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onClearSearch: () => void;
  onToggleCategory: (category: Category) => void;
  onToggleBrand: (brand: string) => void;
  onToggleSkinType: (skinType: SkinType) => void;
  onPriceRangeChange: (range: PriceRange) => void;
  onToggleBestSellers: () => void;
  onResetAll: () => void;
  onNavigateHome: () => void;
}

const PRICE_LABELS: Record<PriceRange, string> = {
  all: 'All Prices',
  'under-50': 'Under $50',
  '50-100': '$50 – $100',
  '100-200': '$100 – $200',
  'over-200': '$200+',
};

export const Shop: React.FC<ShopProps> = ({
  products,
  filters,
  searchQuery,
  sortBy,
  onSortChange,
  onClearSearch,
  onToggleCategory,
  onToggleBrand,
  onToggleSkinType,
  onPriceRangeChange,
  onToggleBestSellers,
  onResetAll,
  onNavigateHome,
}) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const availableBrands = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.brand))).sort();
  }, [products]);

  const categoryCounts = useMemo(() => {
    return products.reduce(
      (acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
      },
      {
        'Skin Care': 0,
        'Sun Care': 0,
        'Hair Care': 0,
        'Eye & Lash': 0,
      } as Record<Category, number>
    );
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filtered = products.filter((product) => {
      if (normalizedQuery) {
        const searchable = [
          product.brand,
          product.title,
          product.category,
          product.description,
          ...product.skinTypes,
        ]
          .join(' ')
          .toLowerCase();
        if (!searchable.includes(normalizedQuery)) {
          return false;
        }
      }

      if (filters.bestSellersOnly && !product.isBestSeller) {
        return false;
      }

      if (
        filters.categories.length > 0 &&
        !filters.categories.includes(product.category)
      ) {
        return false;
      }

      if (
        filters.brands.length > 0 &&
        !filters.brands.includes(product.brand)
      ) {
        return false;
      }

      if (
        filters.skinTypes.length > 0 &&
        !filters.skinTypes.some(
          (type) =>
            product.skinTypes.includes(type) ||
            product.skinTypes.includes('All Skin Types')
        )
      ) {
        return false;
      }

      if (filters.priceRange === 'under-50' && product.price >= 50) return false;
      if (
        filters.priceRange === '50-100' &&
        (product.price < 50 || product.price > 100)
      )
        return false;
      if (
        filters.priceRange === '100-200' &&
        (product.price <= 100 || product.price > 200)
      )
        return false;
      if (filters.priceRange === 'over-200' && product.price <= 200) return false;

      return true;
    });

    const sorted = [...filtered];
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      case 'featured':
      default:
        sorted.sort(
          (a, b) => Number(b.isBestSeller) - Number(a.isBestSeller) || b.reviewCount - a.reviewCount
        );
        break;
    }

    return sorted;
  }, [products, searchQuery, filters, sortBy]);

  const pageHeading = useMemo(() => {
    if (searchQuery.trim()) return `Search Results for "${searchQuery.trim()}"`;
    if (filters.brands.length === 1 && filters.categories.length === 0) {
      return filters.brands[0];
    }
    if (filters.categories.length === 1 && filters.brands.length === 0) {
      return filters.categories[0];
    }
    if (filters.bestSellersOnly) return 'Dermatologist Best Sellers';
    return 'All Clinical Skincare & Beauty';
  }, [searchQuery, filters]);

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.skinTypes.length > 0 ||
    filters.priceRange !== 'all' ||
    filters.bestSellersOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-neutral-500 mb-6 flex items-center gap-2">
        <button
          type="button"
          onClick={onNavigateHome}
          className="hover:text-neutral-900 transition-colors"
        >
          Home
        </button>
        <span>/</span>
        <span className="text-neutral-900 font-medium">Shop</span>
      </nav>

      {/* Shop Header & Sort Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-neutral-950">
            {pageHeading}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Showing <strong>{filteredAndSortedProducts.length}</strong> of{' '}
            {products.length} dermatologist-approved formulas
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Trigger */}
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-300 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-900"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
          </button>

          {/* Sort Select */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="sort-select"
              className="hidden sm:inline text-xs uppercase tracking-[0.14em] text-neutral-500"
            >
              Sort By
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-white border border-neutral-300 focus:border-neutral-900 px-3.5 py-2.5 text-xs font-medium text-neutral-900 outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Best Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 py-4 border-b border-neutral-200">
          {searchQuery.trim() && (
            <button
              type="button"
              onClick={onClearSearch}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-900 text-white text-xs"
            >
              <span>&ldquo;{searchQuery.trim()}&rdquo;</span>
              <X className="w-3 h-3" />
            </button>
          )}
          {filters.bestSellersOnly && (
            <button
              type="button"
              onClick={onToggleBestSellers}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-neutral-300 text-xs text-neutral-800 hover:border-neutral-900"
            >
              <span>Best Sellers</span>
              <X className="w-3 h-3" />
            </button>
          )}
          {filters.categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onToggleCategory(cat)}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-neutral-300 text-xs text-neutral-800 hover:border-neutral-900"
            >
              <span>{cat}</span>
              <X className="w-3 h-3" />
            </button>
          ))}
          {filters.brands.map((brand) => (
            <button
              key={brand}
              type="button"
              onClick={() => onToggleBrand(brand)}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-neutral-300 text-xs text-neutral-800 hover:border-neutral-900"
            >
              <span>{brand}</span>
              <X className="w-3 h-3" />
            </button>
          ))}
          {filters.skinTypes.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => onToggleSkinType(st)}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-neutral-300 text-xs text-neutral-800 hover:border-neutral-900"
            >
              <span>{st}</span>
              <X className="w-3 h-3" />
            </button>
          ))}
          {filters.priceRange !== 'all' && (
            <button
              type="button"
              onClick={() => onPriceRangeChange('all')}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-neutral-300 text-xs text-neutral-800 hover:border-neutral-900"
            >
              <span>{PRICE_LABELS[filters.priceRange]}</span>
              <X className="w-3 h-3" />
            </button>
          )}
          <button
            type="button"
            onClick={onResetAll}
            className="text-xs text-neutral-500 hover:text-neutral-900 underline underline-offset-4 ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Layout: Sidebar + Product Grid */}
      <div className="flex flex-col lg:flex-row gap-10 pt-8">
        {/* Desktop Left Sidebar */}
        <div className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-36">
            <FilterSidebar
              filters={filters}
              availableBrands={availableBrands}
              categoryCounts={categoryCounts}
              onToggleCategory={onToggleCategory}
              onToggleBrand={onToggleBrand}
              onToggleSkinType={onToggleSkinType}
              onPriceRangeChange={onPriceRangeChange}
              onToggleBestSellers={onToggleBestSellers}
              onResetFilters={onResetAll}
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {filteredAndSortedProducts.length === 0 ? (
            <div className="bg-white border border-neutral-200 py-16 px-6 text-center">
              <SearchX className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
              <h2 className="font-serif text-2xl text-neutral-900 font-medium">
                No matching formulas found
              </h2>
              <p className="text-sm text-neutral-500 mt-1.5 max-w-md mx-auto">
                Try adjusting your selected skin type, price range, or search terms to view all available treatments.
              </p>
              <button
                type="button"
                onClick={onResetAll}
                className="mt-6 bg-neutral-900 text-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] hover:bg-neutral-800 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectBrand={(brand) => {
                    if (!filters.brands.includes(brand)) {
                      onToggleBrand(brand);
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Slide-Over Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-neutral-950/45"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative z-10 w-full max-w-xs bg-white h-full overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-200">
              <span className="text-sm font-semibold uppercase tracking-[0.18em]">
                Filter Products
              </span>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <FilterSidebar
              filters={filters}
              availableBrands={availableBrands}
              categoryCounts={categoryCounts}
              onToggleCategory={onToggleCategory}
              onToggleBrand={onToggleBrand}
              onToggleSkinType={onToggleSkinType}
              onPriceRangeChange={onPriceRangeChange}
              onToggleBestSellers={onToggleBestSellers}
              onResetFilters={onResetAll}
            />

            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-8 w-full bg-neutral-900 text-white py-3 text-xs font-semibold uppercase tracking-[0.18em]"
            >
              Show {filteredAndSortedProducts.length} Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
