import React, { useState } from 'react';
import {
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Tag,
  ShoppingBag,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartProps {
  onContinueShopping: () => void;
}

export const Cart: React.FC<CartProps> = ({ onContinueShopping }) => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    subtotal,
    amountToFreeShipping,
    qualifiesForFreeShipping,
    formatPrice,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [orderCompletedId, setOrderCompletedId] = useState<string | null>(null);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = promoInput.trim().toUpperCase();
    if (normalized === 'DERM15') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid code. Try DERM15 for 15% off.');
    }
  };

  const discount = promoApplied ? subtotal * 0.15 : 0;
  const discountedSubtotal = Math.max(0, subtotal - discount);
  const shippingCost = subtotal === 0 || qualifiesForFreeShipping ? 0 : 7.0;
  const estimatedTax = discountedSubtotal * 0.08;
  const orderTotal = discountedSubtotal + shippingCost + estimatedTax;

  const handlePlaceOrder = () => {
    const generatedId = `DS-${Math.floor(100000 + Math.random() * 900000)}`;
    clearCart();
    setOrderCompletedId(generatedId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (orderCompletedId) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="bg-white border border-neutral-200 p-8 sm:p-12 space-y-5">
          <CheckCircle2 className="w-12 h-12 text-emerald-800 mx-auto stroke-[1.5]" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Confirmation #{orderCompletedId}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-neutral-950">
            Thank You for Your Dermstore Order
          </h1>
          <p className="text-sm text-neutral-600 leading-relaxed max-w-md mx-auto">
            Your clinical formulas are being prepared in our temperature-controlled fulfillment center. A confirmation receipt has been generated.
          </p>
          <div className="pt-4">
            <button
              type="button"
              onClick={() => {
                setOrderCompletedId(null);
                onContinueShopping();
              }}
              className="bg-neutral-900 text-white px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] hover:bg-neutral-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="bg-white border border-neutral-200 p-10 sm:p-14">
          <ShoppingBag className="w-10 h-10 text-neutral-300 mx-auto mb-4" />
          <h1 className="font-serif text-3xl text-neutral-950 font-semibold">
            Your Shopping Bag is Empty
          </h1>
          <p className="text-sm text-neutral-500 mt-2 max-w-md mx-auto">
            Discover dermatologist-trusted vitamin C serums, broad-spectrum mineral sunscreens, and luxury hair care.
          </p>
          <button
            type="button"
            onClick={onContinueShopping}
            className="mt-7 bg-neutral-900 text-white px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] hover:bg-neutral-800 transition-colors"
          >
            Explore Clinical Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-neutral-950">
            Shopping Bag ({totalItems} {totalItems === 1 ? 'Item' : 'Items'})
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            {qualifiesForFreeShipping
              ? 'Your order qualifies for complimentary US Standard Shipping.'
              : `Add ${formatPrice(amountToFreeShipping)} more to unlock complimentary US Standard Shipping.`}
          </p>
        </div>
        <button
          type="button"
          onClick={onContinueShopping}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-700 hover:text-neutral-950"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Continue Shopping
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-8">
        {/* Line Items Column */}
        <div className="lg:col-span-8 divide-y divide-neutral-200 bg-white border border-neutral-200 px-6">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="py-6 flex flex-col sm:flex-row sm:items-center gap-5"
            >
              <div className="w-24 h-24 bg-[#F7F6F3] border border-neutral-200/80 p-3 shrink-0 flex items-center justify-center">
                <img
                  src={product.fallbackImage || product.image}
                  alt={product.title}
                  className="max-h-full max-w-full object-contain mix-blend-multiply"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                  {product.brand}
                </p>
                <h2 className="text-base font-medium text-neutral-900 mt-0.5">
                  {product.title}
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Size: {product.size} • Unit Price: {formatPrice(product.price)}
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6">
                <div className="inline-flex items-center border border-neutral-300">
                  <button
                    type="button"
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    aria-label="Decrease quantity"
                    className="p-2 text-neutral-700 hover:bg-neutral-100 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-sm font-medium text-neutral-900 min-w-[2.5rem] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    aria-label="Increase quantity"
                    className="p-2 text-neutral-700 hover:bg-neutral-100 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="text-base font-semibold text-neutral-950 min-w-[5rem] text-right">
                  {formatPrice(product.price * quantity)}
                </span>

                <button
                  type="button"
                  onClick={() => removeFromCart(product.id)}
                  aria-label={`Remove ${product.title}`}
                  className="text-neutral-400 hover:text-neutral-950 p-1 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-neutral-200 p-6 sm:p-7 space-y-6 sticky top-36">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900 pb-4 border-b border-neutral-200">
              Order Summary
            </h2>

            {/* Promo Code Form */}
            <div>
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Promo code (DERM15)"
                    disabled={promoApplied}
                    className="w-full bg-[#F6F5F2] border border-neutral-300 pl-9 pr-3 py-2.5 text-xs text-neutral-900 uppercase placeholder:normal-case outline-none focus:border-neutral-900 disabled:opacity-60"
                  />
                </div>
                <button
                  type="submit"
                  disabled={promoApplied}
                  className="px-4 py-2.5 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50"
                >
                  {promoApplied ? 'Applied' : 'Apply'}
                </button>
              </form>
              {promoError && (
                <p className="text-xs text-red-700 mt-1.5">{promoError}</p>
              )}
              {promoApplied && (
                <p className="text-xs text-emerald-800 mt-1.5">
                  Code DERM15 applied — 15% savings unlocked!
                </p>
              )}
            </div>

            {/* Totals Breakdown */}
            <div className="space-y-3 text-sm border-t border-neutral-200 pt-4">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="text-neutral-900 font-medium">
                  {formatPrice(subtotal)}
                </span>
              </div>

              {promoApplied && (
                <div className="flex justify-between text-emerald-800">
                  <span>Promo Discount (15%)</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-neutral-600">
                <span>Standard Shipping</span>
                <span className="text-neutral-900 font-medium">
                  {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                </span>
              </div>

              <div className="flex justify-between text-neutral-600">
                <span>Estimated Tax</span>
                <span className="text-neutral-900 font-medium">
                  {formatPrice(estimatedTax)}
                </span>
              </div>

              <div className="flex justify-between text-base font-semibold text-neutral-950 border-t border-neutral-200 pt-4">
                <span>Estimated Total</span>
                <span>{formatPrice(orderTotal)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePlaceOrder}
              className="w-full bg-neutral-900 text-white py-4 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors"
            >
              Complete Secure Checkout
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-neutral-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-neutral-700" />
              <span>Authorized Retailer • Free Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
