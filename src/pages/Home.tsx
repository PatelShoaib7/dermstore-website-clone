import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { HeroBanner } from '../components/HeroBanner';
import { ProductCard } from '../components/ProductCard';
import type { BrandInfo, Category, Product } from '../types';

interface HomeProps {
  brands: BrandInfo[];
  products: Product[];
  onNavigateShop: (options?: {
    category?: Category;
    brand?: string;
    bestSellersOnly?: boolean;
  }) => void;
}

export const Home: React.FC<HomeProps> = ({
  brands,
  products,
  onNavigateShop,
}) => {
  const featuredProducts = products.filter((p) => p.isBestSeller).slice(0, 8);

  return (
    <div>
      {/* Hero Banner */}
      <HeroBanner
        onShopBestSellers={() => onNavigateShop({ bestSellersOnly: true })}
        onShopBrand={(brand) => onNavigateShop({ brand })}
      />

      {/* Authorized Luxury Brand Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Authorized Partner
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-neutral-950 mt-1">
              Shop Iconic Clinical Brands
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigateShop()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-900 hover:text-neutral-600 transition-colors"
          >
            View Full Catalog
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {brands.map((brand) => (
            <button
              key={brand.name}
              type="button"
              onClick={() => onNavigateShop({ brand: brand.name })}
              style={{ backgroundColor: brand.accentBg }}
              className="group text-left p-5 border border-neutral-200/90 hover:border-neutral-900 transition-all duration-300 flex flex-col justify-between min-h-[148px]"
            >
              <div>
                <span className="block font-serif text-xl font-semibold text-neutral-950 tracking-tight group-hover:translate-x-0.5 transition-transform">
                  {brand.name}
                </span>
                <span className="block text-[11px] text-neutral-600 mt-1.5 leading-snug">
                  {brand.specialty}
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-800 mt-4 pt-3 border-t border-neutral-300/60">
                Shop Brand
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Best Sellers Product Grid */}
      <section className="bg-white border-y border-neutral-200 py-14 sm:py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-900">
                <Sparkles className="w-3.5 h-3.5" />
                Most Loved Formulas
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-neutral-950 mt-1">
                Dermatologist Best Sellers
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigateShop({ bestSellersOnly: true })}
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-900 underline underline-offset-4 hover:text-neutral-600"
            >
              Shop All Best Sellers
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectBrand={(brand) => onNavigateShop({ brand })}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Curated Regimen Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Build Your Clinical Regimen
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-neutral-950 mt-1">
            Targeted Solutions by Category
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              category: 'Skin Care' as Category,
              eyebrow: 'Step 01 • Correct & Renew',
              title: 'Clinical Serums & Exfoliants',
              copy: 'L-ascorbic acid, lactic acid, peptides, and lipid-replenishing moisturizers.',
              bg: 'bg-[#F3EFEA]',
            },
            {
              category: 'Sun Care' as Category,
              eyebrow: 'Step 02 • Daily Defense',
              title: 'Broad-Spectrum Mineral SPF',
              copy: 'Sheer zinc oxide and niacinamide sun protection with zero chalky cast.',
              bg: 'bg-[#ECEAE4]',
            },
            {
              category: 'Hair Care' as Category,
              eyebrow: 'Step 03 • Salon Restoration',
              title: 'Bio-Restorative Hair Care',
              copy: 'Botanical oil complexes and bond-strengthening shampoos & conditioners.',
              bg: 'bg-[#F4F1ED]',
            },
          ].map((card) => (
            <div
              key={card.category}
              className={`${card.bg} border border-neutral-200 p-8 flex flex-col justify-between min-h-[240px]`}
            >
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                  {card.eyebrow}
                </span>
                <h3 className="font-serif text-2xl font-semibold text-neutral-950 mt-2">
                  {card.title}
                </h3>
                <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
                  {card.copy}
                </p>
              </div>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => onNavigateShop({ category: card.category })}
                  className="inline-flex items-center gap-2 bg-neutral-900 text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] hover:bg-neutral-800 transition-colors"
                >
                  Shop {card.category}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
