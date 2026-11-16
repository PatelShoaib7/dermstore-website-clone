import React, { useState } from 'react';
import { Check, ShieldCheck } from 'lucide-react';
import type { Category } from '../types';

interface FooterProps {
  onNavigateHome: () => void;
  onNavigateShop: (options?: {
    category?: Category;
    brand?: string;
    bestSellersOnly?: boolean;
  }) => void;
  onNavigateCart: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateHome,
  onNavigateShop,
  onNavigateCart,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-neutral-950 text-neutral-300 border-t border-neutral-800 mt-20">
      {/* Newsletter Banner */}
      <div className="border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-200/90">
              The Dermstore Edit
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-white mt-1">
              Receive 15% Off Your First Clinical Skincare Order
            </h2>
            <p className="text-sm text-neutral-400 mt-1.5">
              Subscribe for dermatologist-curated routines, new clinical launches, and private member events.
            </p>
          </div>

          <div className="w-full lg:w-auto lg:min-w-[400px]">
            {subscribed ? (
              <div className="flex items-center gap-2.5 bg-neutral-900 border border-neutral-700 px-4 py-3.5 text-xs text-amber-200">
                <Check className="w-4 h-4 shrink-0" />
                <span>
                  Welcome to Dermstore! Apply code <strong>DERM15</strong> in your Shopping Bag.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  aria-label="Email address for newsletter"
                  className="flex-1 bg-neutral-900 border border-neutral-700 focus:border-white px-4 py-3 text-sm text-white placeholder:text-neutral-500 outline-none"
                />
                <button
                  type="submit"
                  className="bg-white text-neutral-950 px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] hover:bg-neutral-200 transition-colors shrink-0"
                >
                  Sign Up
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Directory Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 text-sm">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white mb-4">
            Shop Categories
          </h3>
          <ul className="space-y-2.5 text-neutral-400">
            <li>
              <button
                type="button"
                onClick={() => onNavigateShop({ bestSellersOnly: true })}
                className="hover:text-white transition-colors"
              >
                Best Sellers
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onNavigateShop({ category: 'Skin Care' })}
                className="hover:text-white transition-colors"
              >
                Clinical Skin Care
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onNavigateShop({ category: 'Sun Care' })}
                className="hover:text-white transition-colors"
              >
                Mineral Sun &amp; SPF
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onNavigateShop({ category: 'Hair Care' })}
                className="hover:text-white transition-colors"
              >
                Luxury Hair Care
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onNavigateShop({ category: 'Eye & Lash' })}
                className="hover:text-white transition-colors"
              >
                Eye &amp; Lash Treatments
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white mb-4">
            Featured Brands
          </h3>
          <ul className="space-y-2.5 text-neutral-400">
            {['SkinCeuticals', 'EltaMD', 'Obagi Medical', 'Sunday Riley', "Paula's Choice"].map(
              (brand) => (
                <li key={brand}>
                  <button
                    type="button"
                    onClick={() => onNavigateShop({ brand })}
                    className="hover:text-white transition-colors"
                  >
                    {brand}
                  </button>
                </li>
              )
            )}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white mb-4">
            Client Concierge
          </h3>
          <ul className="space-y-2.5 text-neutral-400">
            <li>
              <button
                type="button"
                onClick={onNavigateCart}
                className="hover:text-white transition-colors"
              >
                View Shopping Bag
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onNavigateShop()}
                className="hover:text-white transition-colors"
              >
                Auto-Replenish &amp; Save
              </button>
            </li>
            <li>
              <span className="text-neutral-400">Free US Shipping Over $50</span>
            </li>
            <li>
              <span className="text-neutral-400">60-Day Hassle-Free Returns</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white mb-4">
            Authenticity Guarantee
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Every formula on Dermstore is sourced directly from the authorized brand or physician laboratory—stored in climate-controlled facilities for peak active potency.
          </p>
          <div className="inline-flex items-center gap-2 mt-4 text-xs text-neutral-200">
            <ShieldCheck className="w-4 h-4 text-amber-200" />
            <span>100% Authorized Clinical Partner</span>
          </div>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <button
            type="button"
            onClick={onNavigateHome}
            className="text-sm font-bold tracking-[0.26em] text-white"
          >
            DERMSTORE
          </button>
          <p>© {new Date().getFullYear()} Dermstore Clone • Built with React, TypeScript &amp; Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
};
