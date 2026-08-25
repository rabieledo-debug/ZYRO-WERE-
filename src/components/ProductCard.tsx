import React, { useState } from 'react';
import { Heart, Plus, Star, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onOpenProductModal: (product: Product) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenProductModal,
  isWishlisted = false,
  onToggleWishlist,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const displayName = product.nameEn || product.name;

  return (
    <div
      className="group relative flex flex-col bg-white border border-neutral-200 hover:border-neutral-900 transition-all duration-200 font-brand overflow-hidden h-full shadow-xs hover:shadow-md"
      dir="ltr"
    >
      {/* Square 1:1 Image Container */}
      <div
        className="relative aspect-square w-full overflow-hidden bg-neutral-50 flex items-center justify-center p-2 sm:p-3 cursor-pointer border-b border-neutral-100"
        onClick={() => onOpenProductModal(product)}
        onMouseEnter={() => {
          if (product.images && product.images.length > 1) setCurrentImageIndex(1);
        }}
        onMouseLeave={() => {
          setCurrentImageIndex(0);
        }}
      >
        {product.images && product.images.length > 0 && (product.images[currentImageIndex] || product.images[0]) ? (
          <img
            src={product.images[currentImageIndex] || product.images[0]}
            alt={displayName}
            className="w-full h-full object-contain object-center transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-neutral-300 group-hover:text-neutral-400 transition-colors select-none">
            <span className="font-brand font-black text-xl sm:text-2xl tracking-widest text-neutral-300 mb-1">ZYRO</span>
            <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-neutral-400">Official Apparel</span>
          </div>
        )}

        {/* Badges / Tags */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start pointer-events-none z-10">
          {product.isNew && (
            <span className="bg-black text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-wider flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" />
              NEW
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-amber-400 text-black text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 uppercase tracking-wider">
              HOT
            </span>
          )}
          {hasDiscount && (
            <span className="bg-rose-600 text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-wider">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        {onToggleWishlist && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className={`absolute top-2 right-2 p-1.5 rounded-full transition-all duration-200 z-10 cursor-pointer ${
              isWishlisted
                ? 'bg-rose-50 text-rose-600 shadow-sm scale-105'
                : 'bg-white/90 text-neutral-500 hover:text-black hover:bg-white shadow-xs'
            }`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
          </button>
        )}

        {/* Quick View Button Hover */}
        <div className="absolute inset-x-2 bottom-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 hidden sm:block z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenProductModal(product);
            }}
            className="w-full bg-black/90 hover:bg-black text-white text-[11px] font-bold py-2 transition-colors uppercase tracking-wider shadow-sm flex items-center justify-center gap-1 cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Compact Product Details */}
      <div className="p-2.5 sm:p-3 flex flex-col flex-1 justify-between gap-1.5 text-left bg-white">
        <div>
          {/* Fit & Rating Meta */}
          <div className="flex items-center justify-between text-[10px] text-neutral-500 mb-1">
            <span className="uppercase tracking-wider font-semibold truncate max-w-[70%]">
              {product.fitType || 'Streetwear'}
            </span>
            <div className="flex items-center gap-0.5 text-neutral-800 font-bold shrink-0">
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              <span>{product.rating ? product.rating.toFixed(1) : '5.0'}</span>
            </div>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onOpenProductModal(product)}
            className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-black transition-colors line-clamp-1 cursor-pointer leading-snug"
            title={displayName}
          >
            {displayName}
          </h3>
        </div>

        {/* Price & Colors Bar */}
        <div className="flex items-center justify-between pt-1 border-t border-neutral-100 mt-0.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs sm:text-sm font-black text-black">
              {product.price} <span className="text-[10px] font-bold text-neutral-500">EGP</span>
            </span>
            {hasDiscount && (
              <span className="text-[10px] sm:text-xs text-neutral-400 line-through">
                {product.originalPrice}
              </span>
            )}
          </div>

          {/* Color Indicators */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1 shrink-0">
              {product.colors.slice(0, 3).map((c, i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full border border-neutral-300"
                  style={{ backgroundColor: c.hex || (c as any).code }}
                  title={c.name}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-[9px] text-neutral-400 font-medium">
                  +{product.colors.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Mobile View Button */}
        <button
          onClick={() => onOpenProductModal(product)}
          className="sm:hidden w-full bg-neutral-900 text-white text-[11px] font-bold py-1.5 mt-1 uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
        >
          <Plus className="w-3 h-3" />
          <span>Select Size</span>
        </button>
      </div>
    </div>
  );
};
