import React, { useState } from 'react';
import { X, Star, Check, Truck, ShieldCheck, RotateCcw, Ruler, ShoppingBag, Heart } from 'lucide-react';
import { Product } from '../types';
import { getEnglishColorName } from '../lib/translations';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, selectedColor: string, selectedSize: string, quantity: number) => void;
  onOpenSizeGuide: () => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onOpenSizeGuide,
  isWishlisted = false,
  onToggleWishlist,
}) => {
  if (!isOpen || !product) return null;

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Standard');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'L');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const handleAddToCart = () => {
    onAddToCart(product, selectedColor, selectedSize, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 900);
  };

  const displayName = product.nameEn || product.name;
  const englishColorDisplay = getEnglishColorName(selectedColor);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn font-brand" dir="ltr">
      <div className="relative bg-white w-full max-w-4xl shadow-2xl overflow-hidden my-auto border border-neutral-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/90 hover:bg-black hover:text-white rounded-full transition-all duration-200 shadow-xs cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Product Gallery */}
          <div className="p-4 sm:p-6 bg-neutral-50 flex flex-col justify-between">
            {/* Main Preview Image */}
            <div className="relative aspect-square w-full bg-white overflow-hidden border border-neutral-200 flex items-center justify-center p-4">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[selectedImage] || product.images[0]}
                  alt={displayName}
                  className="max-h-full max-w-full w-full h-full object-contain object-center"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-neutral-300 select-none">
                  <span className="font-brand font-black text-3xl tracking-widest text-neutral-300 mb-2">ZYRO</span>
                  <span className="text-xs uppercase font-bold tracking-widest text-neutral-400">Streetwear Apparel</span>
                </div>
              )}

              {hasDiscount && (
                <span className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-black px-2.5 py-1 uppercase tracking-widest">
                  SAVE {discountPercent}%
                </span>
              )}
            </div>

            {/* Thumbnail Selectors */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-16 aspect-square bg-white shrink-0 overflow-hidden border-2 transition-all cursor-pointer flex items-center justify-center p-1 ${
                      selectedImage === idx ? 'border-black opacity-100' : 'border-neutral-200 opacity-60 hover:opacity-90'
                    }`}
                  >
                    <img src={img} alt={`${displayName} ${idx + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Purchasing Controls */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6 max-h-[85vh] overflow-y-auto">
            
            <div>
              {/* Brand & Category */}
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                <span className="font-semibold uppercase tracking-widest text-neutral-500">
                  {product.fitType || 'Oversized Fit'}
                </span>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 font-bold text-[11px]">
                  In Stock • Ready to Ship
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900 leading-tight">
                {displayName}
              </h2>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-neutral-500 font-medium">
                  ({product.reviewsCount || 18} verified customer reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-3 pb-4 border-b border-neutral-100">
                <span className="text-2xl sm:text-3xl font-black text-black">
                  {product.price} <span className="text-sm font-bold text-neutral-600">EGP</span>
                </span>
                {hasDiscount && (
                  <span className="text-sm text-neutral-400 line-through">
                    {product.originalPrice} EGP
                  </span>
                )}
              </div>

              {/* Color Selection */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                    Color: <span className="text-neutral-500 font-medium">{englishColorDisplay}</span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`relative w-8 h-8 rounded-full border transition-all flex items-center justify-center cursor-pointer ${
                        selectedColor === c.name ? 'ring-2 ring-black ring-offset-2 scale-110' : 'border-neutral-300'
                      }`}
                      style={{ backgroundColor: c.hex || (c as any).code }}
                      title={getEnglishColorName(c.name)}
                    >
                      {selectedColor === c.name && (
                        <Check className={`w-3.5 h-3.5 ${['#FFFFFF', '#F5F5F0', '#E5E5E5'].includes(c.hex || (c as any).code) ? 'text-black' : 'text-white'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                    Size: <span className="text-neutral-500 font-medium">{selectedSize}</span>
                  </span>
                  <button
                    onClick={onOpenSizeGuide}
                    className="text-xs text-neutral-800 hover:text-black font-semibold flex items-center gap-1 underline underline-offset-4 cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide</span>
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`py-2.5 text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                        selectedSize === s
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-neutral-800 border-neutral-300 hover:border-black'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mt-6 flex items-center gap-4">
                <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Quantity:
                </span>
                <div className="flex items-center border border-neutral-300">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 text-sm font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-bold text-black min-w-[2.5rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 text-sm font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Product Description */}
              <div className="mt-6 text-xs text-neutral-600 space-y-2 border-t border-neutral-100 pt-4">
                <h4 className="font-bold text-neutral-900 uppercase tracking-wider text-xs">
                  Product Overview:
                </h4>
                <p className="leading-relaxed">
                  {product.description && !/[\u0600-\u06FF]/.test(product.description)
                    ? product.description
                    : 'Crafted with premium heavyweight Egyptian combed cotton. Designed with an authentic relaxed streetwear cut, drop shoulders, and durable reinforced stitching for daily comfort.'}
                </p>
                {product.fabric && (
                  <p className="font-medium text-neutral-800">
                    Fabric: <span className="text-neutral-600">{product.fabric}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Actions & Guarantees */}
            <div className="space-y-4 pt-2">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdded}
                  className={`flex-1 py-4 px-6 font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-black hover:bg-neutral-800 text-white'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag Successfully!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag • {product.price * quantity} EGP</span>
                    </>
                  )}
                </button>

                {onToggleWishlist && (
                  <button
                    onClick={() => onToggleWishlist(product)}
                    className={`p-4 border border-neutral-300 hover:border-black transition-colors flex items-center justify-center cursor-pointer ${
                      isWishlisted ? 'bg-rose-50 text-rose-600 border-rose-300' : 'text-neutral-600'
                    }`}
                    title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
                  </button>
                )}
              </div>

              {/* Guarantees List */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-neutral-500 pt-2 border-t border-neutral-100">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-neutral-800 shrink-0" />
                  <span>1 - 3 Days Delivery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-800 shrink-0" />
                  <span>Inspect Before Payment</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-neutral-800 shrink-0" />
                  <span>14-Day Returns</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
