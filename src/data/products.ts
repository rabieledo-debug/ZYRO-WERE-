import { Product, Governorate, Coupon } from '../types';

export const PRODUCTS: Product[] = [];

export const GOVERNORATES: Governorate[] = [
  { id: 'cairo', name: 'القاهرة', shippingFee: 45, deliveryDays: '1 - 2 يوم عمل', isActive: true },
  { id: 'giza', name: 'الجيزة', shippingFee: 45, deliveryDays: '1 - 2 يوم عمل', isActive: true },
  { id: 'alex', name: 'الإسكندرية', shippingFee: 55, deliveryDays: '2 - 3 أيام عمل', isActive: true },
  { id: 'qalyubia', name: 'القليوبية', shippingFee: 50, deliveryDays: '2 - 3 أيام عمل', isActive: true },
  { id: 'sharqia', name: 'الشرقية', shippingFee: 55, deliveryDays: '2 - 3 أيام عمل', isActive: true },
  { id: 'daqahlia', name: 'الدقهلية (المنصورة)', shippingFee: 55, deliveryDays: '2 - 3 أيام عمل', isActive: true },
  { id: 'gharbia', name: 'الغربية (طنطا)', shippingFee: 55, deliveryDays: '2 - 3 أيام عمل', isActive: true },
  { id: 'menofia', name: 'المنوفية', shippingFee: 55, deliveryDays: '2 - 3 أيام عمل', isActive: true },
  { id: 'beheira', name: 'البحيرة (دمنهور)', shippingFee: 60, deliveryDays: '2 - 3 أيام عمل', isActive: true },
  { id: 'kafr_el_sheikh', name: 'كفر الشيخ', shippingFee: 60, deliveryDays: '2 - 4 أيام عمل', isActive: true },
  { id: 'damietta', name: 'دمياط', shippingFee: 60, deliveryDays: '2 - 4 أيام عمل', isActive: true },
  { id: 'port_said', name: 'بورسعيد', shippingFee: 60, deliveryDays: '2 - 4 أيام عمل', isActive: true },
  { id: 'ismailia', name: 'الإسماعيلية', shippingFee: 60, deliveryDays: '2 - 4 أيام عمل', isActive: true },
  { id: 'suez', name: 'السويس', shippingFee: 60, deliveryDays: '2 - 4 أيام عمل', isActive: true },
  { id: 'fayoum', name: 'الفيوم', shippingFee: 65, deliveryDays: '3 - 4 أيام عمل', isActive: true },
  { id: 'beni_suef', name: 'بني سويف', shippingFee: 65, deliveryDays: '3 - 4 أيام عمل', isActive: true },
  { id: 'minya', name: 'المنيا', shippingFee: 70, deliveryDays: '3 - 5 أيام عمل', isActive: true },
  { id: 'assiut', name: 'أسيوط', shippingFee: 70, deliveryDays: '3 - 5 أيام عمل', isActive: true },
  { id: 'sohag', name: 'سوهاج', shippingFee: 75, deliveryDays: '3 - 5 أيام عمل', isActive: true },
  { id: 'qena', name: 'قنا', shippingFee: 75, deliveryDays: '3 - 5 أيام عمل', isActive: true },
  { id: 'luxor', name: 'الأقصر', shippingFee: 80, deliveryDays: '3 - 5 أيام عمل', isActive: true },
  { id: 'aswan', name: 'أسوان', shippingFee: 80, deliveryDays: '3 - 5 أيام عمل', isActive: true },
  { id: 'red_sea', name: 'البحر الأحمر (الغردقة)', shippingFee: 85, deliveryDays: '3 - 6 أيام عمل', isActive: true },
  { id: 'matrouh', name: 'مطروح والساحل الشمالي', shippingFee: 85, deliveryDays: '3 - 6 أيام عمل', isActive: true },
];

export const VALID_COUPONS: Coupon[] = [
  { code: 'ZYRO10', discountType: 'percentage', value: 10, isActive: true, description: 'خصم 10% على إجمالي الطلب' },
  { code: 'FIRST50', discountType: 'fixed', value: 50, isActive: true, description: 'خصم 50 ج.م للطلب الأول' },
  { code: 'SUMMER2026', discountType: 'percentage', value: 15, isActive: true, description: 'خصم 15% عروض الصيف' },
];

export const FREE_SHIPPING_THRESHOLD = 1000;
