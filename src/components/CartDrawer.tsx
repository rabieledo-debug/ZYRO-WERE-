import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, Check } from 'lucide-react';
import { CartItem, Coupon, StoreSettings } from '../types';
import { VALID_COUPONS, FREE_SHIPPING_THRESHOLD } from '../data/products';
import { getEnglishColorName } from '../lib/translations';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onOpenCheckout: () => void;
  appliedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon | null) => void;
  settings?: StoreSettings;
  coupons?: Coupon[];
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onOpenCheckout,
  appliedCoupon,
  onApplyCoupon,
  settings,
  coupons = VALID_COUPONS,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isOpen) return null;

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Free shipping threshold logic
  const threshold = settings?.freeShippingThreshold !== undefined ? settings.freeShippingThreshold : FREE_SHIPPING_THRESHOLD;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / threshold) * 100));
  const amountNeededForFreeShipping = Math.max(0, threshold - subtotal);

  // Discount calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else {
      discountAmount = Math.min(subtotal, appliedCoupon.value);
    }
  }

  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponError('Please enter a promo code');
      return;
    }

    const availableCoupons = coupons && coupons.length > 0 ? coupons : VALID_COUPONS;
    const found = availableCoupons.find(
      (c) => c.code.toUpperCase() === code && c.isActive !== false
    );

    if (!found) {
      setCouponError('Invalid or expired promo code');
      return;
    }

    const minAmount = found.minSpend || found.minOrderAmount;
    if (minAmount && subtotal < minAmount) {
      setCouponError(`Minimum order amount for this code is ${minAmount} EGP`);
      return;
    }

    onApplyCoupon(found);
    setCouponSuccess(`Coupon ${found.code} applied successfully!`);
    setCouponInput('');
  };

  const handleRemoveCoupon = () => {
    onApplyCoupon(null);
    setCouponSuccess('');
    setCouponError('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fadeIn font-brand" dir="ltr">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between text-left animate-slideInRight">
        
        {/* Cart Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-black" />
            <h2 className="font-black text-base sm:text-lg text-neutral-900 uppercase tracking-wider">
              Shopping Bag ({totalItemsCount})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-500 hover:text-black hover:bg-neutral-200 rounded-full transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-neutral-900 text-white p-3.5 text-xs font-medium space-y-2">
          {amountNeededForFreeShipping === 0 ? (
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Check className="w-4 h-4 shrink-0" />
              <span>Congratulations! You've unlocked FREE Shipping nationwide 🚚</span>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span>Add <strong className="text-amber-400 font-bold">{amountNeededForFreeShipping} EGP</strong> more for Free Shipping!</span>
              <span className="font-bold text-[11px] opacity-75">{progressToFreeShipping}%</span>
            </div>
          )}
          <div className="w-full bg-neutral-800 h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-neutral-900 font-bold text-base">Your shopping bag is empty</p>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  Explore our latest streetwear collection and add your favorite pieces.
                </p>
              </div>
              <button
                onClick={onClose}
                className="bg-black hover:bg-neutral-800 text-white text-xs font-bold py-3 px-6 uppercase tracking-wider transition-colors cursor-pointer"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            cart.map((item, index) => {
              const displayName = item.product.nameEn || item.product.name;
              const englishColor = getEnglishColorName(item.selectedColor);
              return (
                <div
                  key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}-${index}`}
                  className="flex gap-3 p-3 bg-neutral-50 border border-neutral-200 transition-all hover:border-neutral-300"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 aspect-square bg-white shrink-0 overflow-hidden border border-neutral-200 flex items-center justify-center p-1">
                    {item.product.images && item.product.images.length > 0 && item.product.images[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={displayName}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-[10px] font-black tracking-widest text-neutral-400 select-none">
                        ZYRO
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs sm:text-sm font-bold text-neutral-900 line-clamp-1">
                          {displayName}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(index)}
                          className="text-neutral-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                          aria-label="Remove item"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-[11px] text-neutral-500 mt-0.5 space-x-2">
                        <span>Color: <strong className="text-neutral-700">{englishColor}</strong></span>
                        <span>•</span>
                        <span>Size: <strong className="text-neutral-700">{item.selectedSize}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-200/60">
                      {/* Quantity Controller */}
                      <div className="flex items-center border border-neutral-300 bg-white">
                        <button
                          onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                          className="px-2 py-0.5 text-neutral-600 hover:text-black font-bold text-xs cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-bold text-black">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                          className="px-2 py-0.5 text-neutral-600 hover:text-black font-bold text-xs cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      {/* Total for item */}
                      <div className="font-black text-sm text-black">
                        {item.product.price * item.quantity} <span className="text-xs font-bold text-neutral-500">EGP</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Cart Bottom Checkout Area */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-neutral-200 bg-white space-y-4">
            
            {/* Promo Code Input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span>
                      Promo Code <strong>{appliedCoupon.code}</strong> Applied (-{discountAmount} EGP)
                    </span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-rose-600 hover:text-rose-800 font-bold text-[11px] underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. ZYRO10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 border border-neutral-300 px-3 py-2 text-xs uppercase font-brand tracking-wider focus:outline-none focus:border-black"
                    />
                    <button
                      type="submit"
                      className="bg-black hover:bg-neutral-800 text-white px-4 py-2 text-xs font-bold uppercase transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>
                  )}
                  {couponSuccess && (
                    <p className="text-[11px] text-emerald-600 font-medium">{couponSuccess}</p>
                  )}
                </form>
              )}
            </div>

            {/* Calculations Summary */}
            <div className="space-y-1.5 text-xs text-neutral-600 border-t border-neutral-100 pt-3">
              <div className="flex justify-between">
                <span>Subtotal ({totalItemsCount} items):</span>
                <span className="font-bold text-black">{subtotal} EGP</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Discount ({appliedCoupon.code}):</span>
                  <span>-{discountAmount} EGP</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="font-medium text-neutral-800">
                  {subtotal >= threshold ? (
                    <span className="text-emerald-700 font-bold">FREE 🚚</span>
                  ) : (
                    'Calculated at checkout'
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-black text-black pt-2 border-t border-neutral-200">
                <span>Estimated Total:</span>
                <span className="text-lg">{finalTotal} EGP</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={() => {
                onClose();
                onOpenCheckout();
              }}
              className="w-full bg-black hover:bg-neutral-800 text-white py-4 font-bold text-xs sm:text-sm tracking-widest uppercase transition-all duration-150 flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust Footer */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Inspect items before payment • 14-day returns</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
