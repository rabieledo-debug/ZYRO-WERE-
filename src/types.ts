export type Category = string;

export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  category: string; // Category slug (e.g. 'tshirts', 'hoodies', 'pants', etc.)
  price: number;
  originalPrice?: number;
  images: string[];
  description: string;
  colors: ProductColor[];
  sizes: string[];
  fitType: string;
  fabricSpecs: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  isSale?: boolean;
  rating?: number;
  reviewsCount?: number;
  inStock: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  nameEn?: string;
  slug: string;
  image?: string;
  order: number;
  isActive: boolean;
  description?: string;
}

export interface CartItem {
  id: string; // unique item composite key: productId-color-size
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}

export interface Coupon {
  id?: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number; // e.g. 10 for 10% or 100 for 100 EGP
  minSpend?: number;
  minOrderAmount?: number;
  isActive: boolean;
  description: string;
  createdAt?: string;
}

export interface Governorate {
  id: string;
  name: string;
  shippingFee: number;
  deliveryDays: string;
  isActive?: boolean;
  order?: number;
}

export interface OrderData {
  id?: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  altPhone?: string;
  governorate: string;
  cityArea: string;
  detailedAddress: string;
  notes?: string;
  paymentMethod: 'cod' | 'instapay' | 'vodafone_cash';
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode?: string;
  date: string;
  status: 'تم الاستلام' | 'قيد التجهيز' | 'في الطريق' | 'تم التسليم' | 'ملغي';
  createdAt?: string;
}

export interface StoreSettings {
  storeName: string;
  logoText: string;
  logoImage?: string;
  announcementText: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroMediaType?: 'image' | 'video' | 'auto';
  heroVideoUrl?: string;
  heroMediaPosition?: 'center' | 'top' | 'bottom';
  heroCtaText: string;
  freeShippingThreshold: number;
  currency: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl?: string;
  whatsappNumber: string;
  phone: string;
  email: string;
  address: string;
  workingHours: string;
  aboutText: string;
  footerCopy: string;
  refundPolicy: string;
  termsText: string;
}

export interface CustomerSummary {
  phone: string;
  customerName: string;
  governorate: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
}
