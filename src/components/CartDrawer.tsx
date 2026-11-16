import React, { useEffect } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, Gift, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  onViewFullCart: () => void;
  onContinueShopping: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onViewFullCart,
  onContinueShopping,
}) => {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeFromCart,
    totalItems,
    subtotal,
    freeShippingThreshold,
    amountToFreeShipping,
    qualifiesForFreeShipping,
    formatPrice,
  } = useCart();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  const progressPercentage = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100)
  );

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/45 backdrop-blur-[2px] transition-opacity"
        onClick={closeDrawer}
      />

      {/* Slide-over Panel */}
      <div className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-4 h-4 text-neutral-900" />
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-900">
              Shopping Bag ({totalItems})
            </h2>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close shopping bag"
            className="p-1.5 text-neutral-500 hover:text-neutral-950 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Threshold Progress */}
        <div className="px-6 py-3.5 bg-[#F6F5F2] border-b border-neutral-200">
          <p className="text-xs text-neutral-800 font-medium text-center">
            {qualifiesForFreeShipping ? (
              <span>You&apos;ve unlocked <strong>FREE US Standard Shipping</strong>!</span>
            ) : (
              <span>
                Add <strong>{formatPrice(amountToFreeShipping)}</strong> more for{' '}
                <strong>FREE Shipping</strong>
              </span>
            )}
          </p>
          <div className="w-full h-1.5 bg-neutral-200 mt-2 overflow-hidden">
            <div
              className="h-full bg-neutral-900 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
            <div className="w-14 h-14 rounded-full bg-[#F6F5F2] flex items-center justify-center mb-4">
              <ShoppingBag className="w-6 h-6 text-neutral-400" />
            </div>
            <h3 className="font-serif text-2xl text-neutral-900 font-medium">
              Your bag is currently empty
            </h3>
            <p className="text-sm text-neutral-500 mt-2 max-w-xs">
              Explore dermatologist-recommended serums, mineral sunscreens, and restorative treatments.
            </p>
            <button
              type="button"
              onClick={() => {
                closeDrawer();
                onContinueShopping();
              }}
              className="mt-6 bg-neutral-900 text-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] hover:bg-neutral-800 transition-colors"
            >
              Shop Best Sellers
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto divide-y divide-neutral-200 px-6">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="py-5 flex gap-4">
                  <div className="w-20 h-20 bg-[#F7F6F3] border border-neutral-200/80 p-2 shrink-0 flex items-center justify-center">
                    <img
                      src={product.fallbackImage || product.image}
                      alt={product.title}
                      className="max-h-full max-w-full object-contain mix-blend-multiply"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                        {product.brand}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        aria-label={`Remove ${product.title}`}
                        className="text-neutral-400 hover:text-neutral-900 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h3 className="text-xs sm:text-sm font-medium text-neutral-900 line-clamp-2 mt-0.5">
                      {product.title}
                    </h3>
                    <p className="text-[11px] text-neutral-400 mt-0.5">{product.size}</p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="inline-flex items-center border border-neutral-300">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          aria-label="Decrease quantity"
                          className="p-1.5 text-neutral-700 hover:bg-neutral-100 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-medium text-neutral-900 min-w-[2rem] text-center">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          aria-label="Increase quantity"
                          className="p-1.5 text-neutral-700 hover:bg-neutral-100 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-semibold text-neutral-900">
                        {formatPrice(product.price * quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Complimentary Sample Perk */}
              <div className="py-4">
                <div className="flex items-center gap-3 p-3 bg-[#F7F6F3] border border-neutral-200/80">
                  <Gift className="w-4 h-4 text-amber-800 shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-neutral-900">
                      Complimentary Deluxe Clinical Sample
                    </p>
                    <p className="text-neutral-500">
                      SkinCeuticals Hydrating B5 Gel (4ml) included free
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Drawer Footer */}
            <div className="border-t border-neutral-200 p-6 space-y-3 bg-white">
              <div className="flex items-center justify-between text-sm">
                <span className="uppercase tracking-[0.14em] text-xs font-medium text-neutral-600">
                  Estimated Subtotal
                </span>
                <span className="text-lg font-semibold text-neutral-950">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Taxes and promo codes calculated in full shopping bag.
              </p>

              <button
                type="button"
                onClick={() => {
                  closeDrawer();
                  onViewFullCart();
                }}
                className="w-full bg-neutral-900 text-white py-3.5 px-4 text-xs font-semibold uppercase tracking-[0.18em] hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
              >
                Review Bag &amp; Checkout
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={closeDrawer}
                className="w-full bg-white text-neutral-800 border border-neutral-300 py-2.5 px-4 text-xs font-semibold uppercase tracking-[0.16em] hover:border-neutral-900 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
