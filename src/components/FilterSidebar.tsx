import React from 'react';
import { RotateCcw } from 'lucide-react';
import type { Category, FilterState, PriceRange, SkinType } from '../types';

interface FilterSidebarProps {
  filters: FilterState;
  availableBrands: string[];
  categoryCounts: Record<Category, number>;
  onToggleCategory: (category: Category) => void;
  onToggleBrand: (brand: string) => void;
  onToggleSkinType: (skinType: SkinType) => void;
  onPriceRangeChange: (range: PriceRange) => void;
  onToggleBestSellers: () => void;
  onResetFilters: () => void;
}

const CATEGORIES: Category[] = ['Skin Care', 'Sun Care', 'Hair Care', 'Eye & Lash'];

const SKIN_TYPES: SkinType[] = [
  'Normal',
  'Dry',
  'Oily',
  'Combination',
  'Sensitive',
  'Acne-Prone',
  'Mature',
];

const PRICE_RANGES: { value: PriceRange; label: string }[] = [
  { value: 'all', label: 'All Prices' },
  { value: 'under-50', label: 'Under $50' },
  { value: '50-100', label: '$50 – $100' },
  { value: '100-200', label: '$100 – $200' },
  { value: 'over-200', label: '$200 & Above' },
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  availableBrands,
  categoryCounts,
  onToggleCategory,
  onToggleBrand,
  onToggleSkinType,
  onPriceRangeChange,
  onToggleBestSellers,
  onResetFilters,
}) => {
  const activeCount =
    filters.categories.length +
    filters.brands.length +
    filters.skinTypes.length +
    (filters.priceRange !== 'all' ? 1 : 0) +
    (filters.bestSellersOnly ? 1 : 0);

  return (
    <aside aria-label="Product filters" className="space-y-6">
      {/* Header & Clear */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-900">
          Refine By {activeCount > 0 && `(${activeCount})`}
        </span>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 underline underline-offset-4"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Best Sellers Toggle */}
      <div className="pb-5 border-b border-neutral-200">
        <label className="flex items-center justify-between cursor-pointer select-none">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-800">
            Best Sellers Only
          </span>
          <input
            type="checkbox"
            checked={filters.bestSellersOnly}
            onChange={onToggleBestSellers}
            className="w-4 h-4 accent-neutral-900 rounded-none"
          />
        </label>
      </div>

      {/* Category Filter */}
      <div className="pb-5 border-b border-neutral-200 space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-900">
          Category
        </h3>
        <div className="space-y-2.5">
          {CATEGORIES.map((category) => {
            const checked = filters.categories.includes(category);
            return (
              <label
                key={category}
                className="flex items-center justify-between text-sm text-neutral-700 hover:text-neutral-950 cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleCategory(category)}
                    className="w-4 h-4 accent-neutral-900"
                  />
                  <span>{category}</span>
                </span>
                <span className="text-xs text-neutral-400">
                  ({categoryCounts[category] ?? 0})
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Skin Type Filter */}
      <div className="pb-5 border-b border-neutral-200 space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-900">
          Skin Type
        </h3>
        <div className="space-y-2.5">
          {SKIN_TYPES.map((skinType) => {
            const checked = filters.skinTypes.includes(skinType);
            return (
              <label
                key={skinType}
                className="flex items-center gap-2.5 text-sm text-neutral-700 hover:text-neutral-950 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggleSkinType(skinType)}
                  className="w-4 h-4 accent-neutral-900"
                />
                <span>{skinType}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="pb-5 border-b border-neutral-200 space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-900">
          Price Range
        </h3>
        <div className="space-y-2.5">
          {PRICE_RANGES.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2.5 text-sm text-neutral-700 hover:text-neutral-950 cursor-pointer"
            >
              <input
                type="radio"
                name="price-range"
                checked={filters.priceRange === option.value}
                onChange={() => onPriceRangeChange(option.value)}
                className="w-4 h-4 accent-neutral-900"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-900">
          Brand
        </h3>
        <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
          {availableBrands.map((brand) => {
            const checked = filters.brands.includes(brand);
            return (
              <label
                key={brand}
                className="flex items-center gap-2.5 text-sm text-neutral-700 hover:text-neutral-950 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggleBrand(brand)}
                  className="w-4 h-4 accent-neutral-900"
                />
                <span>{brand}</span>
              </label>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
