import React, { useState, useEffect, useMemo } from 'react';
import { Category, Product, CartItem, Coupon, OrderData, CategoryItem, Governorate, StoreSettings } from './types';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SearchModal } from './components/SearchModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SizeGuideModal } from './components/SizeGuideModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { ContactModal } from './components/ContactModal';
import { AccountModal } from './components/AccountModal';
import { DashboardModal } from './components/DashboardModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { Footer } from './components/Footer';
import { Toast, ToastMessage } from './components/Toast';
import { PlusCircle, PackageOpen } from 'lucide-react';
import { getEnglishCategoryName } from './lib/translations';
import {
  subscribeProducts,
  subscribeCategories,
  subscribeOrders,
  subscribeCoupons,
  subscribeGovernorates,
  subscribeSettings,
  seedInitialDatabaseIfEmpty,
  DEFAULT_STORE_SETTINGS,
} from './lib/db';

export default function App() {
  // Real-time Firestore States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [settings, setSettings] = useState<StoreSettings | undefined>(undefined);

  // Category & Sorting
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Interactive Modals and Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [isAccountOpen, setIsAccountOpen] = useState<boolean>(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState<boolean>(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  const handleOpenAdminSettings = () => {
    if (isAdminAuthenticated) {
      setIsDashboardOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setIsAdminLoginOpen(false);
    setIsDashboardOpen(true);
    addToast('success', 'مرحباً بك! تم تسجيل الدخول إلى لوحة التحكم بنجاح');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setIsDashboardOpen(false);
    addToast('info', 'تم تسجيل الخروج من لوحة التحكم');
  };

  // Cart & Wishlist with localStorage hydration
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('zyro_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('zyro_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Seed & Initialize Firestore subscriptions
  useEffect(() => {
    document.title = 'ZYRO';
    
    // Ensure favicon is present with ZYRO SVG icon
    let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23111111'/%3E%3Ctext x='50' y='68' font-family='sans-serif' font-weight='900' font-size='56' fill='%23ffffff' text-anchor='middle'%3EZ%3C/text%3E%3C/svg%3E";

    seedInitialDatabaseIfEmpty();

    const unsubProducts = subscribeProducts((items) => {
      setProducts(items);
    });

    const unsubCategories = subscribeCategories((cats) => {
      setCategories(cats);
    });

    const unsubOrders = subscribeOrders((ords) => {
      setOrders(ords);
    });

    const unsubCoupons = subscribeCoupons((cpns) => {
      setCoupons(cpns);
    });

    const unsubGovs = subscribeGovernorates((govs) => {
      setGovernorates(govs);
    });

    const unsubSettings = subscribeSettings((st) => {
      setSettings(st);
      const titleName = (st?.storeName || 'ZYRO').replace(/savix/gi, 'ZYRO').trim();
      document.title = titleName ? `${titleName}` : 'ZYRO';
    });

    return () => {
      unsubProducts();
      unsubCategories();
      unsubOrders();
      unsubCoupons();
      unsubGovs();
      unsubSettings();
    };
  }, []);

  // Sync cart and wishlist with remaining active products
  useEffect(() => {
    if (selectedProduct && !products.some((p) => p.id === selectedProduct.id)) {
      setSelectedProduct(null);
    }
  }, [products, selectedProduct]);

  // Save Cart & Wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('zyro_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('zyro_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Filter by Category
    if (activeCategory === 'new') {
      list = list.filter((p) => p.isNew);
    } else if (activeCategory === 'sale') {
      list = list.filter((p) => p.isSale || (p.originalPrice && p.originalPrice > p.price));
    } else if (activeCategory !== 'all') {
      list = list.filter((p) => p.category === activeCategory);
    }

    // Sort
    if (sortBy === 'price-asc') {
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'featured') {
      list.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    }

    return list;
  }, [products, activeCategory, sortBy]);

  // Cart operations
  const handleAddToCart = (product: Product, color: string, size: string, qty: number = 1) => {
    const displayName = product.nameEn || product.name;
    const itemKey = `${product.id}-${color}-${size}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.selectedColor === color && item.selectedSize === size);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.selectedColor === color && item.selectedSize === size
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [
        ...prev,
        {
          id: itemKey,
          product,
          selectedColor: color,
          selectedSize: size,
          quantity: qty,
        },
      ];
    });

    addToast('success', `"${displayName}" (${size}) added to your shopping bag`);
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(index);
      return;
    }
    setCart((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, idx) => idx !== index));
    addToast('info', 'Item removed from shopping bag');
  };

  // Wishlist operations
  const handleToggleWishlist = (product: Product) => {
    const displayName = product.nameEn || product.name;
    const exists = wishlist.some((p) => p.id === product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((p) => p.id !== product.id));
      addToast('info', `"${displayName}" removed from wishlist`);
    } else {
      setWishlist((prev) => [...prev, product]);
      addToast('success', `"${displayName}" added to wishlist`);
    }
  };

  const handleOrderCompleted = (order: OrderData) => {
    setCart([]);
    setAppliedCoupon(null);
    addToast('success', `Order placed successfully! Reference: ${order.orderNumber}`);
  };

  const handleShopNow = () => {
    setActiveCategory('all');
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreSale = () => {
    setActiveCategory('sale');
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Active category display title
  const activeCategoryObj = categories.find((c) => c.slug === activeCategory);
  const activeCategoryTitle =
    activeCategory === 'all'
      ? 'All Products & Drops'
      : activeCategory === 'new'
      ? 'New Arrivals ✨'
      : activeCategory === 'sale'
      ? 'Special Offers & Clearance 🔥'
      : activeCategoryObj
      ? (activeCategoryObj.nameEn || getEnglishCategoryName(activeCategoryObj.name, activeCategoryObj.slug))
      : 'Curated Collection';

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-brand selection:bg-black selection:text-white" dir="ltr">
      
      {/* Navigation Header */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        cartCount={totalCartCount}
        categories={categories}
        settings={settings}
      />

      {/* Hero Banner Section */}
      <HeroBanner
        onShopNow={handleShopNow}
        onExploreSale={handleExploreSale}
        settings={settings}
      />

      {/* Filter / Category Bar */}
      <CategoryFilter
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        totalProductsCount={filteredProducts.length}
        sortBy={sortBy}
        onSortChange={setSortBy}
        categories={categories}
      />

      {/* Main Product Catalog Grid */}
      <main id="products-section" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-10 sm:py-12 flex-1 w-full font-brand">
        
        {/* Section Heading */}
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-1">
            {settings?.storeName || 'ZYRO'} STREETWEAR
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight">
            {activeCategoryTitle}
          </h2>
          <div className="w-12 h-0.5 bg-black mx-auto mt-3" />
        </div>

        {/* Product Grid / Empty State */}
        {products.length === 0 ? (
          <div className="text-center py-20 bg-neutral-50 border border-neutral-200 p-8 space-y-4 max-w-2xl mx-auto">
            <div className="w-14 h-14 bg-white border border-neutral-300 rounded-full flex items-center justify-center mx-auto text-neutral-400">
              <PackageOpen className="w-7 h-7 stroke-[1.25]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900">No Products Available Currently</h3>
              <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                The product catalog is currently empty. You can add new products, categories, photos, and prices from the Admin Dashboard.
              </p>
            </div>
            <button
              onClick={handleOpenAdminSettings}
              className="inline-flex items-center gap-2 bg-black text-white px-7 py-3 text-xs font-bold hover:bg-neutral-800 transition-colors uppercase tracking-wider shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Products from Dashboard</span>
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-neutral-50 border border-neutral-200 p-8 space-y-4 max-w-xl mx-auto">
            <p className="text-base font-bold text-neutral-800">No products found matching this category</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setActiveCategory('all')}
                className="bg-black text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                View All Products ({products.length})
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6 lg:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenProductModal={(p) => setSelectedProduct(p)}
                isWishlisted={wishlist.some((w) => w.id === product.id)}
                onToggleWishlist={handleToggleWishlist}
              />
            ))}
          </div>
        )}

      </main>

      {/* Footer Section */}
      <Footer
        onSelectCategory={setActiveCategory}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        onOpenAdminLogin={handleOpenAdminSettings}
        categories={categories}
        settings={settings}
      />

      {/* Modals and Drawers */}
      <ProductModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        isWishlisted={selectedProduct ? wishlist.some((w) => w.id === selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={(c) => {
          setAppliedCoupon(c);
          if (c) addToast('success', `Coupon code ${c.code} applied successfully!`);
        }}
        onOpenCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        coupons={coupons}
        settings={settings}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        appliedCoupon={appliedCoupon}
        onOrderCompleted={handleOrderCompleted}
        governorates={governorates}
        settings={settings}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveWishlist={handleToggleWishlist}
        onOpenProduct={(p) => setSelectedProduct(p)}
      />

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        savedOrders={orders}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        settings={settings}
      />

      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        savedOrders={orders}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        settings={settings}
      />

      {/* Admin Login Modal (Arabic) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Admin Dashboard (Arabic) */}
      <DashboardModal
        isOpen={isDashboardOpen && isAdminAuthenticated}
        onClose={() => setIsDashboardOpen(false)}
        onLogout={handleAdminLogout}
        products={products}
        categories={categories}
        orders={orders}
        coupons={coupons}
        governorates={governorates}
        settings={settings || DEFAULT_STORE_SETTINGS}
        onShowToast={addToast}
      />

      {/* Global Toast Feedback */}
      <Toast toasts={toasts} onDismiss={handleDismissToast} />

    </div>
  );
}
