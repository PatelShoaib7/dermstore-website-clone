import React, { useState } from 'react';
import { Star, Heart, Check, ShoppingBag } from 'lucide-react';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onSelectBrand?: (brand: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectBrand,
}) => {
  const { addToCart, formatPrice } = useCart();
  const [imgSrc, setImgSrc] = useState<string>(product.image);
  const [imgFailed, setImgFailed] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleImageError = () => {
    if (imgSrc !== product.fallbackImage && product.fallbackImage) {
      setImgSrc(product.fallbackImage);
    } else {
      setImgFailed(true);
    }
  };

  const handleQuickAdd = () => {
    addToCart(product, 1, true);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <article className="group bg-white border border-neutral-200/90 hover:border-neutral-400 transition-all duration-300 flex flex-col h-full">
      {/* Studio Image Container */}
      <div className="relative aspect-square bg-[#F7F6F3] p-6 flex items-center justify-center overflow-hidden">
        {product.badge && (
          <span className="absolute top-3 left-3 z-10 bg-neutral-900 text-white text-[10px] font-semibold uppercase tracking-[0.15em] px-2.5 py-1">
            {product.badge}
          </span>
        )}

        <button
          type="button"
          onClick={() => setWishlisted((prev) => !prev)}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 border border-neutral-200 flex items-center justify-center text-neutral-600 hover:text-neutral-950 transition-colors"
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors ${
              wishlisted ? 'fill-neutral-900 text-neutral-900' : ''
            }`}
          />
        </button>

        {!imgFailed ? (
          <img
            src={imgSrc}
            alt={`${product.brand} ${product.title}`}
            loading="lazy"
            onError={handleImageError}
            className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center px-4">
            <div className="w-14 h-24 border border-neutral-300 bg-white flex items-center justify-center mb-2">
              <span className="font-serif text-xl text-neutral-700">
                {product.brand.charAt(0)}
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-neutral-400">
              {product.brand}
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2">
          {onSelectBrand ? (
            <button
              type="button"
              onClick={() => onSelectBrand(product.brand)}
              className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500 hover:text-neutral-900 transition-colors text-left"
            >
              {product.brand}
            </button>
          ) : (
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
              {product.brand}
            </span>
          )}
          <span className="text-[11px] text-neutral-400">{product.size}</span>
        </div>

        <h3 className="text-sm font-medium text-neutral-900 mt-1.5 line-clamp-2 leading-snug min-h-[2.5rem]">
          {product.title}
        </h3>

        {/* Rating Row */}
        <div className="flex items-center gap-1.5 mt-2.5">
          <div className="flex items-center" aria-label={`Rated ${product.rating} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, idx) => {
              const filled = idx < Math.round(product.rating);
              return (
                <Star
                  key={idx}
                  className={`w-3.5 h-3.5 ${
                    filled
                      ? 'fill-neutral-900 text-neutral-900'
                      : 'fill-neutral-200 text-neutral-200'
                  }`}
                />
              );
            })}
          </div>
          <span className="text-xs font-medium text-neutral-800">{product.rating}</span>
          <span className="text-xs text-neutral-400">
            ({product.reviewCount.toLocaleString()})
          </span>
        </div>

        {/* Price & Quick Add */}
        <div className="mt-auto pt-4">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base font-semibold text-neutral-950">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-neutral-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleQuickAdd}
            className={`w-full py-2.5 px-4 text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-center gap-2 border transition-colors ${
              justAdded
                ? 'bg-emerald-900 border-emerald-900 text-white'
                : 'bg-neutral-900 border-neutral-900 text-white hover:bg-white hover:text-neutral-900'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Added to Bag
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                Quick Add
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
