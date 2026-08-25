import React, { useState } from 'react';
import { Check, Instagram, Facebook, MessageCircle, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Category, CategoryItem, StoreSettings } from '../types';
import { getEnglishCategoryName } from '../lib/translations';

interface FooterProps {
  onSelectCategory: (cat: Category) => void;
  onOpenTracking: () => void;
  onOpenContact: () => void;
  onOpenSizeGuide: () => void;
  onOpenAdminLogin?: () => void;
  categories?: CategoryItem[];
  settings?: StoreSettings;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenTracking,
  onOpenContact,
  onOpenSizeGuide,
  onOpenAdminLogin,
  categories = [],
  settings,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const brandName = settings?.storeName || 'ZYRO';
  const aboutText =
    settings?.aboutText && !/[\u0600-\u06FF]/.test(settings.aboutText)
      ? settings.aboutText
      : 'A leading streetwear fashion brand committed to high-standard Egyptian combed cotton, minimalist design aesthetics, and modern oversized silhouettes.';
  const instagram = settings?.instagramUrl || 'https://instagram.com';
  const facebook = settings?.facebookUrl || 'https://facebook.com';
  const whatsapp = settings?.whatsappNumber ? `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}` : 'https://wa.me/201000000000';
  const footerCopy =
    settings?.footerCopy && !/[\u0600-\u06FF]/.test(settings.footerCopy)
      ? settings.footerCopy
      : `© 2026 ${brandName} Apparel Inc. All rights reserved.`;

  const activeCategories = categories.filter((c) => c.isActive !== false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 3000);
  };

  return (
    <footer className="bg-white border-t border-neutral-200 mt-20 pt-16 pb-8 font-brand text-left" dir="ltr">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Trust Badges Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-12 mb-12 border-b border-neutral-200 text-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neutral-100 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-black" />
            </div>
            <div>
              <h5 className="font-bold text-sm text-black">Fast Nationwide Delivery</h5>
              <p className="text-xs text-neutral-500">Express delivery with right of inspection before payment</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neutral-100 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5 text-black" />
            </div>
            <div>
              <h5 className="font-bold text-sm text-black">14-Day Easy Returns</h5>
              <p className="text-xs text-neutral-500">Hassle-free exchange and return policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neutral-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-black" />
            </div>
            <div>
              <h5 className="font-bold text-sm text-black">100% Egyptian Combed Cotton</h5>
              <p className="text-xs text-neutral-500">Premium heavyweight yarns engineered for durability</p>
            </div>
          </div>
        </div>

        {/* 4-column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <h4 className="font-light text-2xl tracking-[0.25em] text-black uppercase">
              {brandName}
            </h4>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              {aboutText}
            </p>
            <div className="flex gap-3 pt-2">
              <a
                href={instagram}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 bg-neutral-100 hover:bg-black hover:text-white rounded-full flex items-center justify-center transition-colors text-neutral-700"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={facebook}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 bg-neutral-100 hover:bg-black hover:text-white rounded-full flex items-center justify-center transition-colors text-neutral-700"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 bg-neutral-100 hover:bg-emerald-600 hover:text-white rounded-full flex items-center justify-center transition-colors text-neutral-700"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs sm:text-sm text-black uppercase tracking-wider">
              Collections
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-neutral-600">
              <li>
                <button
                  onClick={() => onSelectCategory('all')}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  All Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('new')}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  New Arrivals ✨
                </button>
              </li>
              {activeCategories.slice(0, 4).map((cat) => {
                const displayName = cat.nameEn || getEnglishCategoryName(cat.name, cat.slug);
                return (
                  <li key={cat.id || cat.slug}>
                    <button
                      onClick={() => onSelectCategory(cat.slug)}
                      className="hover:text-black transition-colors cursor-pointer"
                    >
                      {displayName}
                    </button>
                  </li>
                );
              })}
              <li>
                <button
                  onClick={() => onSelectCategory('sale')}
                  className="hover:text-rose-600 font-bold transition-colors cursor-pointer"
                >
                  Sale & Offers 🔥
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs sm:text-sm text-black uppercase tracking-wider">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-neutral-600">
              <li>
                <button
                  onClick={onOpenTracking}
                  className="hover:text-black transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Track Your Order</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenSizeGuide}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  Size & Fit Guide
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  Exchange & Return Policy
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  Contact & Support
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs sm:text-sm text-black uppercase tracking-wider">
              Newsletter
            </h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Subscribe to get exclusive early drops, promo codes, and private seasonal sales.
            </p>
            <form onSubmit={handleNewsletter} className="space-y-2">
              <div className="flex">
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-neutral-300 px-3 py-2 text-xs focus:outline-none focus:border-black font-brand"
                />
                <button
                  type="submit"
                  className="bg-black hover:bg-neutral-800 text-white text-xs font-bold px-3 shrink-0 uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Join
                </button>
              </div>
              {subscribed && (
                <div className="text-[11px] text-emerald-700 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Thank you for subscribing!</span>
                </div>
              )}
            </form>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <div>{footerCopy}</div>
          <div className="flex items-center gap-4 flex-wrap">
            <span>Crafted with pride in Egypt 🇪🇬</span>
            <span>•</span>
            <button onClick={onOpenContact} className="hover:text-black transition-colors cursor-pointer">
              Terms & Conditions
            </button>
            <span>•</span>
            <button
              onClick={onOpenAdminLogin}
              className="hover:text-black transition-colors cursor-pointer text-neutral-500"
              title="Dashboard"
            >
              Management Portal
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
