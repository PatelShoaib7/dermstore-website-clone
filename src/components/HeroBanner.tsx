import React from 'react';
import { ArrowRight, ShieldCheck, Award, Truck } from 'lucide-react';

interface HeroBannerProps {
  onShopBestSellers: () => void;
  onShopBrand: (brand: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onShopBestSellers,
  onShopBrand,
}) => {
  const [heroImgSrc, setHeroImgSrc] = React.useState(
    'https://static.thcdn.com/images/large/webp//productimg/original/11289609-1174892770940184.jpg'
  );
  const [heroImgFailed, setHeroImgFailed] = React.useState(false);

  return (
    <section className="bg-[#F3EFEA] border-b border-neutral-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Editorial Copy Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 border border-neutral-300/80 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-800">
              <span>Dermatologist Curated</span>
              <span className="text-neutral-300">•</span>
              <span>Clinical Potency</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-neutral-950 leading-[1.08] tracking-tight">
              The Gold Standard in{' '}
              <span className="italic font-normal">Medical-Grade</span> Skin Longevity.
            </h1>

            <p className="text-neutral-600 text-base sm:text-lg max-w-xl leading-relaxed">
              Discover uncompromising antioxidant serums, mineral sunscreens, and barrier-restoring treatments trusted by board-certified dermatologists.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={onShopBestSellers}
                className="inline-flex items-center gap-2.5 bg-neutral-900 text-white px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] hover:bg-neutral-800 transition-colors"
              >
                Shop Best Sellers
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onShopBrand('SkinCeuticals')}
                className="inline-flex items-center gap-2 bg-white text-neutral-900 border border-neutral-300 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] hover:border-neutral-900 transition-colors"
              >
                Explore SkinCeuticals
              </button>
            </div>

            {/* Clinical Trust Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-neutral-300/70">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-neutral-800 shrink-0" />
                <span className="text-xs text-neutral-700 font-medium">
                  100% Authorized Retailer
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-neutral-800 shrink-0" />
                <span className="text-xs text-neutral-700 font-medium">
                  Physician-Tested Actives
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-neutral-800 shrink-0" />
                <span className="text-xs text-neutral-700 font-medium">
                  Free Shipping Over $50
                </span>
              </div>
            </div>
          </div>

          {/* Luxury Clinical Showcase Card */}
          <div className="lg:col-span-5">
            <div className="relative bg-white border border-neutral-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500 pb-4 border-b border-neutral-100">
                <span>Iconic Formula No. 01</span>
                <span className="text-neutral-900">15% L-Ascorbic Acid</span>
              </div>

              <div className="aspect-[4/3] bg-[#F7F6F3] my-5 flex items-center justify-center p-6 relative overflow-hidden">
                {!heroImgFailed ? (
                  <img
                    src={heroImgSrc}
                    alt="SkinCeuticals C E Ferulic Antioxidant Serum"
                    onError={() => {
                      const smallUrl =
                        'https://static.thcdn.com/images/small/webp//productimg/original/11289609-1174892770940184.jpg';
                      if (heroImgSrc !== smallUrl) {
                        setHeroImgSrc(smallUrl);
                      } else {
                        setHeroImgFailed(true);
                      }
                    }}
                    className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-28 border border-neutral-300 bg-white flex items-center justify-center mb-2">
                      <span className="font-serif text-2xl text-neutral-800">S</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-neutral-500">
                      SkinCeuticals
                    </span>
                  </div>
                )}
                <span className="absolute bottom-3 left-3 bg-neutral-900 text-white text-[10px] font-semibold uppercase tracking-[0.16em] px-2.5 py-1">
                  36x Beauty Award Winner
                </span>
              </div>

              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    SkinCeuticals
                  </p>
                  <h2 className="font-serif text-2xl font-semibold text-neutral-900 mt-0.5">
                    C E Ferulic® Serum
                  </h2>
                  <p className="text-xs text-neutral-600 mt-1">
                    8x environmental protection &amp; visible radiance.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onShopBrand('SkinCeuticals')}
                  className="shrink-0 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-900 underline underline-offset-4 hover:text-neutral-600"
                >
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
