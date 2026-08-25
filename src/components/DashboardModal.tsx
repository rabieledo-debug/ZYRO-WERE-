import React, { useState, useMemo } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit3,
  Image as ImageIcon,
  Check,
  Sparkles,
  Layers,
  ShoppingBag,
  Package,
  Users,
  Tag,
  Truck,
  Settings,
  DollarSign,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Phone,
  MessageCircle,
  ExternalLink,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Percent,
  Sliders,
  Globe,
  Share2,
  LogOut,
  Upload,
  RefreshCw,
  Crop,
  Video,
  Play,
  Monitor,
  Smartphone,
} from 'lucide-react';
import {
  Product,
  ProductColor,
  CategoryItem,
  OrderData,
  Coupon,
  Governorate,
  StoreSettings,
  CustomerSummary,
} from '../types';
import {
  saveProduct,
  deleteProduct,
  saveCategory,
  deleteCategory,
  reorderCategories,
  updateOrderStatus,
  deleteOrder,
  saveCoupon,
  deleteCoupon,
  saveGovernorate,
  deleteGovernorate,
  saveStoreSettings,
  isVideoMedia,
} from '../lib/db';
import { ColorPickerManager } from './ColorPickerManager';
import { resizeImageToAspect, optimizeProductImage } from '../lib/imageUtils';

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
  products: Product[];
  categories: CategoryItem[];
  orders: OrderData[];
  coupons: Coupon[];
  governorates: Governorate[];
  settings: StoreSettings;
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

type TabType =
  | 'overview'
  | 'products'
  | 'categories'
  | 'orders'
  | 'customers'
  | 'coupons'
  | 'shipping'
  | 'settings';

export const DashboardModal: React.FC<DashboardModalProps> = ({
  isOpen,
  onClose,
  onLogout,
  products,
  categories,
  orders,
  coupons,
  governorates,
  settings,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Product Form State
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodNameEn, setProdNameEn] = useState('');
  const [prodCategory, setProdCategory] = useState('');
  const [prodPrice, setProdPrice] = useState<number | ''>('');
  const [prodOriginalPrice, setProdOriginalPrice] = useState<number | ''>('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodFitType, setProdFitType] = useState('Oversized / Boxy Fit');
  const [prodFabricSpecs, setProdFabricSpecs] = useState('100% قطن مصري فاخر');
  const [prodImageUrl, setProdImageUrl] = useState('');
  const [prodImagesList, setProdImagesList] = useState<string[]>([]);
  const [isProcessingProdImage, setIsProcessingProdImage] = useState(false);
  const [prodImageUploadStatus, setProdImageUploadStatus] = useState<string | null>(null);
  const [prodSizes, setProdSizes] = useState<string[]>(['M', 'L', 'XL']);
  const [prodColors, setProdColors] = useState<ProductColor[]>([
    { name: 'أسود كربوني', hex: '#111111' },
    { name: 'أبيض ناصع', hex: '#FFFFFF' },
  ]);
  const [prodIsNew, setProdIsNew] = useState(true);
  const [prodIsSale, setProdIsSale] = useState(false);
  const [prodIsBestSeller, setProdIsBestSeller] = useState(false);
  const [prodInStock, setProdInStock] = useState(true);

  // Category Form State - Simplified (Name required, Details optional)
  const [isCatFormOpen, setIsCatFormOpen] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catName, setCatName] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [catImage, setCatImage] = useState('');
  const [isProcessingCatImage, setIsProcessingCatImage] = useState(false);
  const [catIsActive, setCatIsActive] = useState(true);

  // Coupon Form State
  const [isCouponFormOpen, setIsCouponFormOpen] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponType, setCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [couponValue, setCouponValue] = useState<number | ''>('');
  const [couponMinSpend, setCouponMinSpend] = useState<number | ''>('');
  const [couponDesc, setCouponDesc] = useState('');
  const [couponIsActive, setCouponIsActive] = useState(true);

  // Governorate Form State
  const [isGovFormOpen, setIsGovFormOpen] = useState(false);
  const [editingGovId, setEditingGovId] = useState<string | null>(null);
  const [govName, setGovName] = useState('');
  const [govFee, setGovFee] = useState<number | ''>('');
  const [govDays, setGovDays] = useState('1 - 3 أيام عمل');
  const [govIsActive, setGovIsActive] = useState(true);

  // Settings State Form
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(settings);
  const [isProcessingHeroMedia, setIsProcessingHeroMedia] = useState(false);
  const [heroMediaStatus, setHeroMediaStatus] = useState<string | null>(null);
  const [heroPreviewDevice, setHeroPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  const handleHeroImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingHeroMedia(true);
      setHeroMediaStatus('جاري ملاءمة ومعالجة أبعاد الصورة تلقائياً لتناسب البانر بدقة...');
      
      // Automatically resize to standard 16:9 (1920x1080) proportional cover
      const processedDataUrl = await resizeImageToAspect(file, {
        targetWidth: 1920,
        targetHeight: 1080,
        quality: 0.88,
        mimeType: 'image/jpeg',
      });

      setSettingsForm((prev) => ({
        ...prev,
        heroImage: processedDataUrl,
        heroVideoUrl: '',
        heroMediaType: 'image',
      }));
      setHeroMediaStatus('تمت ملاءمة الصورة وتثبيت أبعادها بنجاح (1920×1080 - 16:9)!');
      setTimeout(() => setHeroMediaStatus(null), 3500);
    } catch (err) {
      console.error('Error processing hero banner image:', err);
      onShowToast('error', 'تعذر معالجة الصورة. يرجى التأكد من اختيار ملف صورة صالح.');
      setHeroMediaStatus(null);
    } finally {
      setIsProcessingHeroMedia(false);
      e.target.value = '';
    }
  };

  const handleHeroVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      onShowToast('error', 'يرجى اختيار ملف فيديو صالح (MP4, WebM, MOV, OGG)');
      return;
    }

    try {
      setIsProcessingHeroMedia(true);
      setHeroMediaStatus('جاري تحميل وتجهيز ملف الفيديو للبانر...');

      if (file.size > 20 * 1024 * 1024) {
        onShowToast('info', 'حجم الفيديو كبير (>20MB). يفضل استخدام فيديو مضغوط لضمان سرعة تحميل فائقة للزوار.');
      }

      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const videoDataUrl = uploadEvent.target?.result as string;
        setSettingsForm((prev) => ({
          ...prev,
          heroImage: videoDataUrl,
          heroVideoUrl: videoDataUrl,
          heroMediaType: 'video',
        }));
        setHeroMediaStatus('تم رفع الفيديو وتفعيله للبانر بنجاح مع التغطية التلقائية المتجاوبة!');
        setIsProcessingHeroMedia(false);
        setTimeout(() => setHeroMediaStatus(null), 3500);
      };
      reader.onerror = () => {
        setIsProcessingHeroMedia(false);
        setHeroMediaStatus(null);
        onShowToast('error', 'فشل قراءة ملف الفيديو');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error processing video file:', err);
      setIsProcessingHeroMedia(false);
      setHeroMediaStatus(null);
      onShowToast('error', 'حدث خطأ أثناء رفع ملف الفيديو');
    } finally {
      e.target.value = '';
    }
  };

  const handleAutoFitCurrentHeroUrl = async () => {
    if (!settingsForm.heroImage) return;
    try {
      setIsProcessingHeroMedia(true);
      setHeroMediaStatus('جاري ملاءمة أبعاد الصورة وتنسيقها...');
      const processed = await resizeImageToAspect(settingsForm.heroImage, {
        targetWidth: 1920,
        targetHeight: 1080,
        quality: 0.88,
      });
      setSettingsForm((prev) => ({ ...prev, heroImage: processed, heroMediaType: 'image' }));
      setHeroMediaStatus('تمت ملاءمة أبعاد الصورة بنجاح!');
      setTimeout(() => setHeroMediaStatus(null), 3500);
    } catch (err) {
      console.warn('External image CORS limitation for canvas export:', err);
      setHeroMediaStatus('تم تطبيق وضعية التناسب الكامل والتغطية (Object Cover) بنجاح.');
      setTimeout(() => setHeroMediaStatus(null), 3500);
    } finally {
      setIsProcessingHeroMedia(false);
    }
  };

  // Dedicated In-App Deletion Confirmation State
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'product' | 'category' | 'coupon' | 'governorate' | 'order';
    id: string;
    name: string;
    extraInfo?: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sync settings form when prop changes
  React.useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  // Search queries
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Customers aggregated list
  const customersList: CustomerSummary[] = useMemo(() => {
    const map = new Map<string, CustomerSummary>();
    orders.forEach((o) => {
      const phone = o.phone ? o.phone.trim() : 'N/A';
      if (!map.has(phone)) {
        map.set(phone, {
          phone,
          customerName: o.customerName,
          governorate: o.governorate,
          ordersCount: 1,
          totalSpent: o.total,
          lastOrderDate: o.date,
        });
      } else {
        const c = map.get(phone)!;
        c.ordersCount += 1;
        c.totalSpent += o.total;
        if (new Date(o.date) > new Date(c.lastOrderDate)) {
          c.lastOrderDate = o.date;
        }
      }
    });
    return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  if (!isOpen) return null;

  // Overall statistics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const averageOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  // ================= PRODUCT HANDLERS =================
  const resetProductForm = () => {
    setEditingProductId(null);
    setProdName('');
    setProdNameEn('');
    setProdCategory(categories[0]?.slug || 'tshirts');
    setProdPrice('');
    setProdOriginalPrice('');
    setProdDescription('');
    setProdFitType('Oversized / Boxy Fit');
    setProdFabricSpecs('100% قطن مصري فاخر');
    setProdImageUrl('');
    setProdImagesList([]);
    setIsProcessingProdImage(false);
    setProdImageUploadStatus(null);
    setProdSizes(['M', 'L', 'XL']);
    setProdColors([
      { name: 'أسود', hex: '#111111' },
      { name: 'أبيض', hex: '#FFFFFF' },
    ]);
    setProdIsNew(true);
    setProdIsSale(false);
    setProdIsBestSeller(false);
    setProdInStock(true);
    setIsProductFormOpen(false);
  };

  const handleProductFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsProcessingProdImage(true);
      setProdImageUploadStatus(`جاري معالجة وضغط ${files.length} صورة للمنتج...`);

      const optimizedList: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        const optimized = await optimizeProductImage(file, 900, 0.85);
        if (optimized) {
          optimizedList.push(optimized);
        }
      }

      if (optimizedList.length > 0) {
        setProdImagesList((prev) => [...prev, ...optimizedList]);
        setProdImageUploadStatus(`تم رفع وتجهيز ${optimizedList.length} صورة بنجاح!`);
        onShowToast('success', `تم إضافة ${optimizedList.length} صورة للمنتج بنجاح`);
        setTimeout(() => setProdImageUploadStatus(null), 3500);
      }
    } catch (err) {
      console.error('Error processing product image upload:', err);
      onShowToast('error', 'حدث خطأ أثناء معالجة ورفع صورة المنتج');
      setProdImageUploadStatus(null);
    } finally {
      setIsProcessingProdImage(false);
      e.target.value = '';
    }
  };

  const handleAddImageUrl = () => {
    const trimmed = prodImageUrl.trim();
    if (!trimmed) return;
    setProdImagesList((prev) => [...prev, trimmed]);
    setProdImageUrl('');
    onShowToast('info', 'تمت إضافة رابط الصورة إلى قائمة صور المنتج');
  };

  const handleMakeCoverImage = (index: number) => {
    if (index === 0 || index >= prodImagesList.length) return;
    setProdImagesList((prev) => {
      const copy = [...prev];
      const selected = copy.splice(index, 1)[0];
      return [selected, ...copy];
    });
    onShowToast('info', 'تم تعيين الصورة كغلاف رئيسي للمنتج');
  };

  const handleRemoveProductImage = (index: number) => {
    setProdImagesList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setProdName(p.name);
    setProdNameEn(p.nameEn || '');
    setProdCategory(p.category);
    setProdPrice(p.price);
    setProdOriginalPrice(p.originalPrice || '');
    setProdDescription(p.description || '');
    setProdFitType(p.fitType || 'Oversized');
    setProdFabricSpecs(p.fabricSpecs || '100% قطن مصري');
    const existingImgs = Array.isArray(p.images) && p.images.length > 0
      ? p.images
      : (p as any).image ? [(p as any).image] : [];
    setProdImagesList(existingImgs);
    setProdImageUrl('');
    setIsProcessingProdImage(false);
    setProdImageUploadStatus(null);
    setProdSizes(p.sizes || ['M', 'L', 'XL']);
    setProdColors(p.colors || [{ name: 'أسود', hex: '#111111' }]);
    setProdIsNew(!!p.isNew);
    setProdIsSale(!!p.isSale);
    setProdIsBestSeller(!!p.isBestSeller);
    setProdInStock(p.inStock !== false);
    setIsProductFormOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim() || !prodPrice || Number(prodPrice) <= 0) {
      alert('يرجى كتابة اسم المنتج وتحديد السعر.');
      return;
    }

    // Include any typed image URL that wasn't explicitly added via button
    let finalImages = [...prodImagesList];
    if (prodImageUrl.trim() && !finalImages.includes(prodImageUrl.trim())) {
      finalImages.push(prodImageUrl.trim());
    }

    finalImages = finalImages.filter((img) => typeof img === 'string' && img.trim().length > 0);

    const newProd: Product = {
      id: editingProductId || `prod-${Date.now()}`,
      name: prodName.trim(),
      nameEn: prodNameEn.trim() || prodName.trim(),
      category: prodCategory || categories[0]?.slug || 'tshirts',
      price: Number(prodPrice),
      originalPrice: prodOriginalPrice ? Number(prodOriginalPrice) : undefined,
      images: finalImages,
      description: prodDescription.trim() || 'منتج عالي الجودة بتصميم أنيق ومميز من تشكيلة ZYRO الرسمية.',
      colors: prodColors.length > 0 ? prodColors : [{ name: 'أساسي', hex: '#111111' }],
      sizes: prodSizes.length > 0 ? prodSizes : ['M', 'L', 'XL'],
      fitType: prodFitType.trim() || 'Regular Fit',
      fabricSpecs: prodFabricSpecs.trim() || 'قطن مصري 100%',
      isNew: prodIsNew,
      isSale: prodIsSale,
      isBestSeller: prodIsBestSeller,
      inStock: prodInStock,
      rating: 5.0,
      reviewsCount: 1,
    };

    try {
      await saveProduct(newProd);
      onShowToast('success', editingProductId ? 'تم تحديث المنتج وحفظ الصور بنجاح في قاعدة البيانات' : 'تم إضافة المنتج والصور وحفظها سحابياً');
      resetProductForm();
    } catch (err) {
      console.error(err);
      onShowToast('error', 'حدث خطأ أثناء حفظ المنتج في Firebase');
    }
  };

  // ================= UNIFIED ASYNC DELETION LOGIC =================
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      if (deleteTarget.type === 'product') {
        await deleteProduct(deleteTarget.id);
        onShowToast('success', `تم حذف المنتج "${deleteTarget.name}" نهائياً من قاعدة البيانات`);
      } else if (deleteTarget.type === 'category') {
        await deleteCategory(deleteTarget.id);
        onShowToast('success', `تم حذف قسم "${deleteTarget.name}" بنجاح`);
      } else if (deleteTarget.type === 'coupon') {
        await deleteCoupon(deleteTarget.id);
        onShowToast('success', `تم حذف كود الخصم "${deleteTarget.name}" بنجاح`);
      } else if (deleteTarget.type === 'governorate') {
        await deleteGovernorate(deleteTarget.id);
        onShowToast('success', `تم حذف المحافظة "${deleteTarget.name}" بنجاح`);
      } else if (deleteTarget.type === 'order') {
        await deleteOrder(deleteTarget.id);
        onShowToast('success', `تم حذف الطلب "${deleteTarget.name}" نهائياً`);
      }
      setDeleteTarget(null);
    } catch (err) {
      console.error('Delete error:', err);
      onShowToast('error', `فشل حذف ${deleteTarget.name}. يرجى التحقق من اتصالك بالإنترنت`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Quick toggle in-stock
  const handleToggleStock = async (p: Product) => {
    try {
      await saveProduct({ ...p, inStock: !p.inStock });
      onShowToast('info', p.inStock ? `تم تحويل "${p.name}" إلى غير متوفر` : `تم تفعيل توفر "${p.name}"`);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= CATEGORY HANDLERS =================
  const resetCategoryForm = () => {
    setEditingCatId(null);
    setCatName('');
    setCatDescription('');
    setCatImage('');
    setIsProcessingCatImage(false);
    setCatIsActive(true);
    setIsCatFormOpen(false);
  };

  const handleEditCategory = (cat: CategoryItem) => {
    setEditingCatId(cat.id);
    setCatName(cat.name);
    setCatDescription(cat.description || '');
    setCatImage(cat.image || '');
    setIsProcessingCatImage(false);
    setCatIsActive(cat.isActive !== false);
    setIsCatFormOpen(true);
  };

  const handleCategoryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsProcessingCatImage(true);
      const optimized = await optimizeProductImage(file, 800, 0.85);
      if (optimized) {
        setCatImage(optimized);
        onShowToast('success', 'تم رفع وتجهيز صورة القسم بنجاح');
      }
    } catch (err) {
      console.error(err);
      onShowToast('error', 'فشل معالجة صورة القسم');
    } finally {
      setIsProcessingCatImage(false);
      e.target.value = '';
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) {
      alert('يرجى كتابة اسم القسم.');
      return;
    }

    const existingCat = editingCatId ? categories.find((c) => c.id === editingCatId) : null;
    
    // Auto-generate clean slug from name or preserve existing
    const autoSlug = existingCat?.slug || 
      catName
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\u0600-\u06FF-]/g, '') || `cat-${Date.now()}`;

    const newCat: CategoryItem = {
      id: editingCatId || `cat-${Date.now()}`,
      name: catName.trim(),
      nameEn: catName.trim(),
      slug: autoSlug,
      description: catDescription.trim() || '',
      image: catImage.trim() || undefined,
      order: existingCat?.order || categories.length + 1,
      isActive: catIsActive,
    };

    try {
      await saveCategory(newCat);
      onShowToast('success', editingCatId ? 'تم تحديث بيانات القسم بنجاح' : 'تم إنشاء القسم الجديد بنجاح');
      resetCategoryForm();
    } catch (err) {
      console.error(err);
      onShowToast('error', 'فشل حفظ القسم');
    }
  };

  const handleMoveCategory = async (index: number, direction: 'up' | 'down') => {
    const newCats = [...categories];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newCats.length) return;

    const temp = newCats[index];
    newCats[index] = newCats[targetIndex];
    newCats[targetIndex] = temp;

    try {
      await reorderCategories(newCats);
      onShowToast('success', 'تم تعديل ترتيب ظهور الأقسام في الموقع');
    } catch (err) {
      console.error(err);
    }
  };

  // ================= COUPON HANDLERS =================
  const resetCouponForm = () => {
    setEditingCouponId(null);
    setCouponCode('');
    setCouponType('percentage');
    setCouponValue('');
    setCouponMinSpend('');
    setCouponDesc('');
    setCouponIsActive(true);
    setIsCouponFormOpen(false);
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim() || !couponValue || Number(couponValue) <= 0) {
      alert('يرجى إدخال كود الكوبون وقيمة الخصم.');
      return;
    }

    const newCoupon: Coupon = {
      id: editingCouponId || `coupon-${couponCode.toLowerCase().trim()}`,
      code: couponCode.toUpperCase().trim(),
      discountType: couponType,
      value: Number(couponValue),
      minSpend: couponMinSpend ? Number(couponMinSpend) : 0,
      description: couponDesc.trim() || (couponType === 'percentage' ? `خصم ${couponValue}% على الطلب` : `خصم ${couponValue} ج.م`),
      isActive: couponIsActive,
    };

    try {
      await saveCoupon(newCoupon);
      onShowToast('success', 'تم حفظ كود الخصم في قاعدة البيانات');
      resetCouponForm();
    } catch (err) {
      console.error(err);
      onShowToast('error', 'فشل حفظ الكوبون');
    }
  };

  const handleEditCoupon = (c: Coupon) => {
    setEditingCouponId(c.id || `coupon-${c.code.toLowerCase()}`);
    setCouponCode(c.code);
    setCouponType(c.discountType);
    setCouponValue(c.value);
    setCouponMinSpend(c.minSpend || '');
    setCouponDesc(c.description || '');
    setCouponIsActive(c.isActive !== false);
    setIsCouponFormOpen(true);
  };

  const handleToggleCoupon = async (c: Coupon) => {
    try {
      await saveCoupon({ ...c, isActive: !c.isActive });
      onShowToast('info', c.isActive ? `تم تعطيل كود "${c.code}"` : `تم تفعيل كود "${c.code}"`);
    } catch (err) {
      console.error(err);
      onShowToast('error', 'فشل تغيير حالة الكود');
    }
  };

  // ================= GOVERNORATE HANDLERS =================
  const resetGovForm = () => {
    setEditingGovId(null);
    setGovName('');
    setGovFee('');
    setGovDays('1 - 3 أيام عمل');
    setGovIsActive(true);
    setIsGovFormOpen(false);
  };

  const handleEditGovernorate = (g: Governorate) => {
    setEditingGovId(g.id);
    setGovName(g.name);
    setGovFee(g.shippingFee);
    setGovDays(g.deliveryDays || '1 - 3 أيام عمل');
    setGovIsActive(g.isActive !== false);
    setIsGovFormOpen(true);
  };

  const handleToggleGovernorate = async (g: Governorate) => {
    try {
      await saveGovernorate({ ...g, isActive: !g.isActive });
      onShowToast('info', g.isActive ? `تم تعطيل شحن "${g.name}"` : `تم تفعيل شحن "${g.name}"`);
    } catch (err) {
      console.error(err);
      onShowToast('error', 'فشل تغيير حالة المحافظة');
    }
  };

  const handleSaveGovernorate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!govName.trim() || govFee === '') {
      alert('يرجى كتابة اسم المحافظة وسعر الشحن.');
      return;
    }

    const existingGov = editingGovId ? governorates.find((g) => g.id === editingGovId) : null;

    const newGov: Governorate = {
      id: editingGovId || `gov-${Date.now()}`,
      name: govName.trim(),
      shippingFee: Number(govFee),
      deliveryDays: govDays.trim() || '1 - 3 أيام عمل',
      isActive: govIsActive,
      order: existingGov?.order || governorates.length + 1,
    };

    try {
      await saveGovernorate(newGov);
      onShowToast('success', editingGovId ? 'تم تحديث بيانات المحافظة وسعر الشحن بنجاح' : 'تم حفظ بيانات الشحن والمحافظة');
      resetGovForm();
    } catch (err) {
      console.error(err);
      onShowToast('error', 'فشل حفظ المحافظة');
    }
  };

  // ================= SETTINGS HANDLER =================
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveStoreSettings(settingsForm);
      onShowToast('success', 'تم حفظ وتحديث إعدادات المتجر والموقع بنجاح');
    } catch (err) {
      console.error(err);
      onShowToast('error', 'فشل حفظ الإعدادات');
    }
  };

  // Filtered lists
  const filteredProductsList = products.filter((p) => {
    const matchesSearch =
      productSearch === '' ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.nameEn.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase());
    return matchesSearch;
  });

  const filteredOrdersList = orders.filter((o) => {
    const matchesSearch =
      orderSearch === '' ||
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.phone.includes(orderSearch);
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const navTabs: { id: TabType; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'overview', label: 'لوحة المؤشرات', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'products', label: 'المنتجات', icon: <ShoppingBag className="w-4 h-4" />, count: products.length },
    { id: 'categories', label: 'الأقسام والتصنيفات', icon: <Layers className="w-4 h-4" />, count: categories.length },
    { id: 'orders', label: 'الطلبات والمبيعات', icon: <Package className="w-4 h-4" />, count: orders.length },
    { id: 'customers', label: 'العملاء', icon: <Users className="w-4 h-4" />, count: customersList.length },
    { id: 'coupons', label: 'كوبونات الخصم', icon: <Tag className="w-4 h-4" />, count: coupons.length },
    { id: 'shipping', label: 'الشحن والمحافظات', icon: <Truck className="w-4 h-4" />, count: governorates.length },
    { id: 'settings', label: 'إعدادات الموقع', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/70 backdrop-blur-sm font-arabic animate-fadeIn"
      dir="rtl"
    >
      <div className="bg-white w-full max-w-6xl h-[94vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden">
        
        {/* Main Dashboard Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-neutral-200 bg-neutral-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white text-black font-brand font-light text-xl flex items-center justify-center tracking-widest">
              ZY
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base sm:text-lg text-white">لوحة تحكم المتجر (Admin Dashboard)</h2>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 font-bold border border-emerald-500/30">
                  قاعدة بيانات سحابية متصلة
                </span>
              </div>
              <p className="text-xs text-neutral-400">إدارة شاملة للمنتجات، الأقسام، الطلبات، الكوبونات، والإعدادات</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors text-xs font-medium cursor-pointer"
                title="تسجيل الخروج من لوحة التحكم"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>خروج</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="إغلاق لوحة التحكم"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Responsive Tabs Navigation Bar */}
        <div className="flex overflow-x-auto bg-neutral-100 border-b border-neutral-200 scrollbar-none shrink-0 text-xs font-bold">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsProductFormOpen(false);
                  setIsCatFormOpen(false);
                  setIsCouponFormOpen(false);
                  setIsGovFormOpen(false);
                }}
                className={`flex items-center gap-2 px-4 sm:px-5 py-3.5 whitespace-nowrap transition-all border-b-2 ${
                  isActive
                    ? 'bg-white border-black text-black shadow-xs'
                    : 'border-transparent text-neutral-600 hover:text-black hover:bg-neutral-200/60'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content View Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-neutral-50/50">
          
          {/* ================= 1. OVERVIEW TAB ================= */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 border border-neutral-200 space-y-2">
                  <div className="flex items-center justify-between text-neutral-500 text-xs">
                    <span>إجمالي المبيعات</span>
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-black font-brand">
                    {totalRevenue.toLocaleString()} <span className="text-xs font-arabic text-neutral-500 font-normal">ج.م</span>
                  </div>
                  <p className="text-[11px] text-neutral-400">إجمالي قيمة الطلبات المستلمة</p>
                </div>

                <div className="bg-white p-5 border border-neutral-200 space-y-2">
                  <div className="flex items-center justify-between text-neutral-500 text-xs">
                    <span>عدد الطلبات</span>
                    <Package className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-black font-brand">
                    {orders.length}
                  </div>
                  <p className="text-[11px] text-neutral-400">متوسط الطلب: {averageOrderValue} ج.م</p>
                </div>

                <div className="bg-white p-5 border border-neutral-200 space-y-2">
                  <div className="flex items-center justify-between text-neutral-500 text-xs">
                    <span>المنتجات بالموقع</span>
                    <ShoppingBag className="w-4 h-4 text-neutral-800" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-black font-brand">
                    {products.length}
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    {products.filter((p) => p.inStock).length} متوفر • {products.filter((p) => !p.inStock).length} نفد المخزون
                  </p>
                </div>

                <div className="bg-white p-5 border border-neutral-200 space-y-2">
                  <div className="flex items-center justify-between text-neutral-500 text-xs">
                    <span>الأقسام النشطة</span>
                    <Layers className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-black font-brand">
                    {categories.filter((c) => c.isActive).length} <span className="text-xs text-neutral-400">/ {categories.length}</span>
                  </div>
                  <p className="text-[11px] text-neutral-400">تصنيفات المنتجات المعروضة</p>
                </div>
              </div>

              {/* Quick Actions Shortcuts */}
              <div className="bg-white p-5 border border-neutral-200">
                <h3 className="font-bold text-sm text-neutral-900 mb-4">إجراءات سريعة</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={() => {
                      setActiveTab('products');
                      resetProductForm();
                      setIsProductFormOpen(true);
                    }}
                    className="p-3 bg-neutral-900 text-white hover:bg-black text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة منتج جديد</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('categories');
                      resetCategoryForm();
                      setIsCatFormOpen(true);
                    }}
                    className="p-3 bg-white border border-neutral-300 text-neutral-800 hover:border-black text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Layers className="w-4 h-4" />
                    <span>إنشاء قسم جديد</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('coupons');
                      resetCouponForm();
                      setIsCouponFormOpen(true);
                    }}
                    className="p-3 bg-white border border-neutral-300 text-neutral-800 hover:border-black text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Tag className="w-4 h-4" />
                    <span>إنشاء كود خصم</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className="p-3 bg-white border border-neutral-300 text-neutral-800 hover:border-black text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>تعديل إعدادات الموقع</span>
                  </button>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white p-5 border border-neutral-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm text-neutral-900">أحدث الطلبات المستلمة</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-neutral-600 hover:text-black font-bold flex items-center gap-1"
                  >
                    <span>عرض كافة الطلبات ({orders.length})</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-8 text-neutral-400 text-xs">
                    لم يتم تسجيل أي طلبات بعد. ستظهر طلبات العملاء فور إتمامها هنا تلقائياً.
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-100 text-xs">
                    {orders.slice(0, 5).map((o) => (
                      <div key={o.id || o.orderNumber} className="py-3 flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <span className="font-brand font-bold text-black ml-2">{o.orderNumber}</span>
                          <span className="text-neutral-700 font-semibold">{o.customerName}</span>
                          <span className="text-neutral-400 mx-2">•</span>
                          <span className="text-neutral-500">{o.governorate}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-black font-brand">{o.total} ج.م</span>
                          <span className="bg-neutral-100 text-neutral-800 px-2 py-0.5 font-bold">
                            {o.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= 2. PRODUCTS TAB ================= */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              
              {/* Top Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="بحث في المنتجات..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-3 pr-9 py-2 border border-neutral-300 bg-white text-xs focus:outline-none focus:border-black"
                  />
                </div>

                <button
                  onClick={() => {
                    resetProductForm();
                    setIsProductFormOpen(true);
                  }}
                  className="w-full sm:w-auto bg-black text-white px-5 py-2.5 text-xs font-bold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 uppercase tracking-wider font-brand"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة منتج جديد</span>
                </button>
              </div>

              {/* Product Form Modal / Section */}
              {isProductFormOpen && (
                <div className="bg-white border-2 border-black p-5 sm:p-7 space-y-6 shadow-xl animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                    <h3 className="font-bold text-base text-black">
                      {editingProductId ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد للمتجر'}
                    </h3>
                    <button
                      onClick={resetProductForm}
                      className="text-neutral-400 hover:text-black p-1"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="space-y-5 text-sm">
                    {/* Basic names */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-neutral-700">اسم المنتج بالعربية *</label>
                        <input
                          type="text"
                          required
                          placeholder="مثال: تيشيرت قطن أوفرسايز أسود"
                          value={prodName}
                          onChange={(e) => setProdName(e.target.value)}
                          className="w-full border border-neutral-300 p-2.5 text-xs focus:border-black focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-neutral-700 font-brand">Product English Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Oversized Black Cotton Tee"
                          value={prodNameEn}
                          onChange={(e) => setProdNameEn(e.target.value)}
                          className="w-full border border-neutral-300 p-2.5 text-xs focus:border-black focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Category & Prices */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-neutral-700">القسم / التصنيف *</label>
                        <select
                          value={prodCategory}
                          onChange={(e) => setProdCategory(e.target.value)}
                          className="w-full border border-neutral-300 p-2.5 text-xs focus:border-black focus:outline-none bg-white cursor-pointer"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.slug}>
                              {c.name} ({c.slug})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-neutral-700">سعر البيع (ج.م) *</label>
                        <input
                          type="number"
                          required
                          min="1"
                          placeholder="450"
                          value={prodPrice}
                          onChange={(e) => setProdPrice(e.target.value ? Number(e.target.value) : '')}
                          className="w-full border border-neutral-300 p-2.5 text-xs focus:border-black focus:outline-none font-brand"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-neutral-700">السعر قبل الخصم (اختياري)</label>
                        <input
                          type="number"
                          min="1"
                          placeholder="550"
                          value={prodOriginalPrice}
                          onChange={(e) => setProdOriginalPrice(e.target.value ? Number(e.target.value) : '')}
                          className="w-full border border-neutral-300 p-2.5 text-xs focus:border-black focus:outline-none font-brand"
                        />
                      </div>
                    </div>

                    {/* Product Images Management */}
                    <div className="space-y-3 p-4 bg-neutral-50 border border-neutral-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="block text-xs font-bold text-neutral-900">
                            صور المنتج (Product Images)
                          </label>
                          <p className="text-[11px] text-neutral-500">
                            الصورة الأولى هي الغلاف الرئيسي للمنتج في المتجر وكروت العرض. يمكنك رفع عدة صور معاً.
                          </p>
                        </div>
                        <span className="text-xs font-bold bg-neutral-200 text-neutral-800 px-2 py-0.5 font-brand">
                          {prodImagesList.length} صور
                        </span>
                      </div>

                      {/* Upload and URL Inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Direct File Upload */}
                        <div>
                          <label className="flex items-center justify-center gap-2 w-full p-2.5 bg-white border-2 border-dashed border-neutral-300 hover:border-black text-neutral-700 hover:text-black text-xs font-bold transition-all cursor-pointer">
                            <Upload className="w-4 h-4 text-neutral-500" />
                            <span>{isProcessingProdImage ? 'جاري المعالجة...' : 'رفع صور من جهازك (JPG / PNG)'}</span>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              disabled={isProcessingProdImage}
                              onChange={handleProductFileUpload}
                              className="hidden"
                            />
                          </label>
                        </div>

                        {/* Direct Web URL */}
                        <div className="flex gap-1.5">
                          <input
                            type="url"
                            placeholder="أو الصق رابط صورة مباشر..."
                            value={prodImageUrl}
                            onChange={(e) => setProdImageUrl(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddImageUrl();
                              }
                            }}
                            className="flex-1 border border-neutral-300 bg-white p-2 text-xs focus:border-black focus:outline-none font-brand"
                          />
                          <button
                            type="button"
                            onClick={handleAddImageUrl}
                            className="bg-neutral-900 text-white px-3 text-xs font-bold hover:bg-black transition-colors shrink-0 cursor-pointer"
                          >
                            إضافة
                          </button>
                        </div>
                      </div>

                      {/* Processing / Upload status */}
                      {prodImageUploadStatus && (
                        <div className="text-xs text-blue-700 bg-blue-50 border border-blue-200 p-2 flex items-center gap-2">
                          <RefreshCw className={`w-3.5 h-3.5 ${isProcessingProdImage ? 'animate-spin' : ''}`} />
                          <span>{prodImageUploadStatus}</span>
                        </div>
                      )}

                      {/* Image Thumbnails Gallery */}
                      {prodImagesList.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
                          {prodImagesList.map((img, idx) => (
                            <div
                              key={idx}
                              className={`relative group border overflow-hidden bg-white shadow-sm flex flex-col ${
                                idx === 0 ? 'border-black ring-2 ring-black/10' : 'border-neutral-200'
                              }`}
                            >
                              <div className="relative w-full aspect-square bg-neutral-100 overflow-hidden">
                                <img
                                  src={img}
                                  alt={`Product ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                                {idx === 0 && (
                                  <div className="absolute top-1 right-1 bg-black text-white text-[10px] font-bold px-1.5 py-0.5 shadow">
                                    الغلاف الرئيسي ★
                                  </div>
                                )}
                              </div>
                              <div className="p-1.5 bg-neutral-50 flex items-center justify-between border-t border-neutral-100 text-[11px]">
                                {idx !== 0 ? (
                                  <button
                                    type="button"
                                    onClick={() => handleMakeCoverImage(idx)}
                                    className="text-neutral-700 hover:text-black font-bold text-[10px] hover:underline cursor-pointer"
                                  >
                                    تعيين كغلاف
                                  </button>
                                ) : (
                                  <span className="text-neutral-500 font-bold text-[10px]">الصورة #1</span>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveProductImage(idx)}
                                  className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer transition-colors"
                                  title="حذف الصورة"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center border border-dashed border-neutral-300 bg-white text-neutral-400 text-xs">
                          لا توجد صور مضافة للمنتج بعد. يمكنك رفع صورة أو أكثر من جهازك أو وضع رابط صورة مباشر.
                        </div>
                      )}
                    </div>

                    {/* Sizes Selection */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-neutral-700">المقاسات المتوفرة</label>
                      <div className="flex flex-wrap gap-2">
                        {['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'].map((s) => {
                          const isSelected = prodSizes.includes(s);
                          return (
                            <button
                              key={s}
                              type="button"
                              onClick={() => {
                                setProdSizes((prev) =>
                                  prev.includes(s) ? prev.filter((i) => i !== s) : [...prev, s]
                                );
                              }}
                              className={`w-11 h-9 border text-xs font-bold font-brand transition-colors ${
                                isSelected ? 'bg-black text-white border-black' : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                              }`}
                            >
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Professional Color Picker Manager */}
                    <div className="pt-1 pb-2 border-t border-b border-neutral-200">
                      <ColorPickerManager
                        colors={prodColors}
                        onChange={(newColors) => setProdColors(newColors)}
                      />
                    </div>

                    {/* Description, Fit & Specs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-neutral-700">نوع القصة (Fit Type)</label>
                        <input
                          type="text"
                          value={prodFitType}
                          onChange={(e) => setProdFitType(e.target.value)}
                          className="w-full border border-neutral-300 p-2.5 text-xs focus:border-black focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-neutral-700">مواصفات القماش (Fabric Specs)</label>
                        <input
                          type="text"
                          value={prodFabricSpecs}
                          onChange={(e) => setProdFabricSpecs(e.target.value)}
                          className="w-full border border-neutral-300 p-2.5 text-xs focus:border-black focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-neutral-700">وصف المنتج</label>
                      <textarea
                        rows={3}
                        value={prodDescription}
                        onChange={(e) => setProdDescription(e.target.value)}
                        placeholder="اكتب وصفاً جذاباً ومفصلاً للمنتج..."
                        className="w-full border border-neutral-300 p-2.5 text-xs focus:border-black focus:outline-none"
                      />
                    </div>

                    {/* Flags */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      <label className="flex items-center gap-2 text-xs font-bold text-neutral-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={prodIsNew}
                          onChange={(e) => setProdIsNew(e.target.checked)}
                          className="accent-black"
                        />
                        <span>وصل حديثاً (New)</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs font-bold text-neutral-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={prodIsSale}
                          onChange={(e) => setProdIsSale(e.target.checked)}
                          className="accent-black"
                        />
                        <span>خصومات وعروض (Sale)</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs font-bold text-neutral-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={prodIsBestSeller}
                          onChange={(e) => setProdIsBestSeller(e.target.checked)}
                          className="accent-black"
                        />
                        <span>الأكثر طلباً (Best Seller)</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs font-bold text-neutral-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={prodInStock}
                          onChange={(e) => setProdInStock(e.target.checked)}
                          className="accent-black"
                        />
                        <span>متوفر بالمخزون</span>
                      </label>
                    </div>

                    {/* Submit Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
                      <button
                        type="button"
                        onClick={resetProductForm}
                        className="px-5 py-2.5 border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-colors"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="bg-black text-white px-8 py-2.5 text-xs font-bold hover:bg-neutral-800 transition-colors uppercase tracking-wider font-brand"
                      >
                        {editingProductId ? 'حفظ التعديلات' : 'نشر المنتج الآن'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Products List Table / Cards */}
              {products.length === 0 ? (
                <div className="text-center py-16 px-4 bg-white border border-neutral-200 space-y-4">
                  <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto stroke-[1.25]" />
                  <h4 className="font-bold text-neutral-800">لا توجد منتجات مضافة حالياً</h4>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    المتجر يبدأ فارغاً تماماً كما طلبت. اضغط على زر "إضافة منتج جديد" لإضافة أول منتج لمتجرك وحفظه في Firebase.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredProductsList.map((p) => {
                    const catObj = categories.find((c) => c.slug === p.category);
                    return (
                      <div
                        key={p.id}
                        className="bg-white p-4 border border-neutral-200 flex items-center justify-between gap-4 flex-wrap hover:border-black transition-colors"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <img
                            src={p.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80'}
                            alt={p.name}
                            className="w-16 h-16 aspect-square object-cover bg-neutral-100 border border-neutral-200 shrink-0"
                          />
                          <div className="truncate">
                            <h4 className="font-bold text-sm text-neutral-900 truncate">{p.name}</h4>
                            <p className="text-xs text-neutral-500 font-brand truncate">{p.nameEn}</p>
                            <div className="flex items-center gap-2 mt-1.5 text-xs flex-wrap">
                              <span className="font-bold text-black font-brand">{p.price} ج.م</span>
                              {p.originalPrice && (
                                <span className="line-through text-neutral-400 font-brand text-[11px]">
                                  {p.originalPrice} ج.م
                                </span>
                              )}
                              <span className="bg-neutral-100 text-neutral-800 text-[10px] px-2 py-0.5">
                                {catObj?.name || p.category}
                              </span>
                              <span
                                className={`text-[10px] px-2 py-0.5 font-bold ${
                                  p.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {p.inStock ? 'متوفر' : 'غير متوفر بالمخزون'}
                              </span>

                              {/* Product Colors Mini Swatches */}
                              {p.colors && p.colors.length > 0 && (
                                <div className="flex items-center gap-1 bg-neutral-50 px-2 py-0.5 border border-neutral-200">
                                  {p.colors.map((c, cIdx) => (
                                    <span
                                      key={cIdx}
                                      className="w-2.5 h-2.5 rounded-full border border-black/20"
                                      style={{ backgroundColor: c.hex }}
                                      title={`${c.name} (${c.hex})`}
                                    />
                                  ))}
                                  <span className="text-[10px] text-neutral-600 font-medium mr-1">
                                    {p.colors.length} ألوان
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleToggleStock(p)}
                            className="p-2 border border-neutral-200 text-xs font-semibold hover:border-black transition-colors"
                            title={p.inStock ? 'إيقاف توفر المنتج' : 'تفعيل توفر المنتج'}
                          >
                            {p.inStock ? <EyeOff className="w-4 h-4 text-neutral-500" /> : <Eye className="w-4 h-4 text-emerald-600" />}
                          </button>

                          <button
                            onClick={() => handleEditProduct(p)}
                            className="p-2 border border-neutral-200 text-neutral-700 hover:border-black hover:text-black transition-colors"
                            title="تعديل"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() =>
                              setDeleteTarget({
                                type: 'product',
                                id: p.id,
                                name: p.name,
                                extraInfo: `${p.price} ج.م • ${catObj?.name || p.category}`,
                              })
                            }
                            className="p-2 border border-neutral-200 text-neutral-400 hover:text-red-600 hover:border-red-500 transition-colors cursor-pointer"
                            title="حذف المنتج نهائياً"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ================= 3. CATEGORIES TAB ================= */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              
              {/* Header bar */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-neutral-900">أقسام وتصنيفات المتجر</h3>
                  <p className="text-xs text-neutral-500">
                    أقسام وتصنيفات المنتجات — يمكنك إنشاء أقسام جديدة أو تعديل أسمائها وترتيبها بسهولة.
                  </p>
                </div>

                <button
                  onClick={() => {
                    resetCategoryForm();
                    setIsCatFormOpen(true);
                  }}
                  className="bg-black text-white px-5 py-2.5 text-xs font-bold hover:bg-neutral-800 transition-colors flex items-center gap-2 uppercase tracking-wider font-brand cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>إنشاء قسم جديد</span>
                </button>
              </div>

              {/* Simplified Category Form */}
              {isCatFormOpen && (
                <div className="bg-white border-2 border-black p-5 sm:p-6 space-y-4 shadow-xl animate-fadeIn max-w-xl">
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                    <h3 className="font-bold text-base text-black">
                      {editingCatId ? 'تعديل القسم' : 'إنشاء قسم جديد'}
                    </h3>
                    <button onClick={resetCategoryForm} className="text-neutral-400 hover:text-black cursor-pointer">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
                    {/* Category Name - Required */}
                    <div className="space-y-1">
                      <label className="block font-bold text-neutral-800">
                        اسم القسم <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: تيشيرتات، هوديز، بناطيل، كابات..."
                        value={catName}
                        onChange={(e) => setCatName(e.target.value)}
                        className="w-full border border-neutral-300 p-2.5 text-xs sm:text-sm focus:border-black focus:outline-none"
                      />
                    </div>

                    {/* Category Details/Description - Optional */}
                    <div className="space-y-1">
                      <label className="block font-bold text-neutral-700">
                        تفاصيل أو وصف القسم <span className="text-neutral-400 font-normal">(اختياري)</span>
                      </label>
                      <textarea
                        rows={2}
                        placeholder="اكتب وصفاً أو تفاصيل مختصرة عن محتوى هذا القسم (اختياري)..."
                        value={catDescription}
                        onChange={(e) => setCatDescription(e.target.value)}
                        className="w-full border border-neutral-300 p-2.5 text-xs focus:border-black focus:outline-none"
                      />
                    </div>

                    {/* Category Image - Optional */}
                    <div className="space-y-2 p-3 bg-neutral-50 border border-neutral-200">
                      <label className="block font-bold text-neutral-700">
                        صورة القسم / الغلاف <span className="text-neutral-400 font-normal">(اختياري)</span>
                      </label>
                      
                      <div className="flex flex-col sm:flex-row gap-2">
                        <label className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-neutral-300 hover:border-black text-neutral-700 text-xs font-bold transition-all cursor-pointer">
                          <Upload className="w-4 h-4 text-neutral-500" />
                          <span>{isProcessingCatImage ? 'جاري المعالجة...' : 'رفع صورة من جهازك'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isProcessingCatImage}
                            onChange={handleCategoryFileUpload}
                            className="hidden"
                          />
                        </label>
                        <input
                          type="url"
                          placeholder="أو ضع رابط صورة القسم..."
                          value={catImage}
                          onChange={(e) => setCatImage(e.target.value)}
                          className="flex-1 border border-neutral-300 bg-white p-2 text-xs focus:border-black focus:outline-none font-brand"
                        />
                      </div>

                      {catImage && (
                        <div className="relative w-20 h-20 border border-neutral-300 bg-white overflow-hidden mt-2">
                          <img src={catImage} alt="Category Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setCatImage('')}
                            className="absolute top-1 right-1 bg-red-600 text-white p-0.5 shadow hover:bg-red-700 cursor-pointer"
                            title="إزالة الصورة"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="pt-1">
                      <label className="flex items-center gap-2 font-bold text-neutral-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={catIsActive}
                          onChange={(e) => setCatIsActive(e.target.checked)}
                          className="accent-black"
                        />
                        <span>تفعيل ظهور القسم في شريط التصفح وقوائم الموقع</span>
                      </label>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200">
                      <button
                        type="button"
                        onClick={resetCategoryForm}
                        className="px-5 py-2 border border-neutral-300 font-bold text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="bg-black text-white px-7 py-2 font-bold hover:bg-neutral-800 uppercase tracking-wider font-brand cursor-pointer"
                      >
                        {editingCatId ? 'حفظ التعديلات' : 'إنشاء القسم'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Categories Table / List */}
              <div className="space-y-2.5">
                {categories.map((cat, index) => {
                  const assignedProductsCount = products.filter((p) => p.category === cat.slug).length;
                  return (
                    <div
                      key={cat.id}
                      className="bg-white p-3.5 sm:p-4 border border-neutral-200 flex items-center justify-between gap-4 flex-wrap hover:border-black transition-colors"
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        {/* Up/Down Reorder */}
                        <div className="flex flex-col gap-0.5">
                          <button
                            disabled={index === 0}
                            onClick={() => handleMoveCategory(index, 'up')}
                            className="p-1 text-neutral-400 hover:text-black disabled:opacity-20 cursor-pointer"
                            title="تحريك لأعلى"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            disabled={index === categories.length - 1}
                            onClick={() => handleMoveCategory(index, 'down')}
                            className="p-1 text-neutral-400 hover:text-black disabled:opacity-20 cursor-pointer"
                            title="تحريك لأسفل"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-sm text-neutral-900">{cat.name}</h4>
                            <span
                              className={`text-[10px] px-2 py-0.5 font-bold ${
                                cat.isActive !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'
                              }`}
                            >
                              {cat.isActive !== false ? 'مفعل بالموقع' : 'معطل'}
                            </span>
                          </div>
                          {cat.description && (
                            <p className="text-xs text-neutral-500 mt-0.5 max-w-md line-clamp-1">
                              {cat.description}
                            </p>
                          )}
                          <p className="text-[11px] text-neutral-400 mt-0.5 font-arabic">
                            {assignedProductsCount} منتج مضاف لهذا القسم
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditCategory(cat)}
                          className="p-2 border border-neutral-200 text-neutral-700 hover:border-black hover:text-black transition-colors cursor-pointer"
                          title="تعديل القسم"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteTarget({
                              type: 'category',
                              id: cat.id,
                              name: cat.name,
                              extraInfo: `القسم يحتوي على ${assignedProductsCount} منتج. سيتم حذف القسم من شريط التصفح وقوائم الموقع.`,
                            })
                          }
                          className="p-2 border border-neutral-200 text-neutral-400 hover:text-red-600 hover:border-red-500 transition-colors cursor-pointer"
                          title="حذف القسم"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= 4. ORDERS TAB ================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              
              {/* Filter and search */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="بحث برقم الطلب أو اسم العميل أو الهاتف..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-3 pr-9 py-2 border border-neutral-300 bg-white text-xs focus:outline-none focus:border-black"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs text-neutral-500 whitespace-nowrap">الحالة:</span>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="border border-neutral-300 bg-white p-2 text-xs focus:border-black focus:outline-none cursor-pointer"
                  >
                    <option value="all">كافة الحالات ({orders.length})</option>
                    <option value="تم الاستلام">تم الاستلام</option>
                    <option value="قيد التجهيز">قيد التجهيز</option>
                    <option value="في الطريق">في الطريق للشحن</option>
                    <option value="تم التسليم">تم التسليم</option>
                    <option value="ملغي">ملغي</option>
                  </select>
                </div>
              </div>

              {/* Orders List */}
              {filteredOrdersList.length === 0 ? (
                <div className="text-center py-16 px-4 bg-white border border-neutral-200 space-y-3">
                  <Package className="w-12 h-12 text-neutral-300 mx-auto stroke-[1.25]" />
                  <h4 className="font-bold text-neutral-800">لا توجد طلبات تطابق هذا البحث</h4>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrdersList.map((o) => (
                    <div
                      key={o.id || o.orderNumber}
                      className="bg-white p-5 border border-neutral-200 space-y-4 hover:border-black transition-colors"
                    >
                      <div className="flex items-center justify-between border-b border-neutral-100 pb-3 flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                          <span className="font-brand font-black text-sm text-black">{o.orderNumber}</span>
                          <span className="text-xs text-neutral-500">{o.date}</span>
                          <span className="text-xs text-neutral-700 bg-neutral-100 px-2 py-0.5 font-semibold">
                            {o.paymentMethod === 'cod' ? 'الدفع عند الاستلام' : o.paymentMethod === 'instapay' ? 'InstaPay' : 'فودافون كاش'}
                          </span>
                        </div>

                        {/* Status selector */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-500">حالة الطلب:</span>
                          <select
                            value={o.status}
                            onChange={(e) => updateOrderStatus(o.id!, e.target.value as any)}
                            className="border border-neutral-300 font-bold text-xs p-1.5 focus:border-black bg-neutral-50"
                          >
                            <option value="تم الاستلام">تم الاستلام</option>
                            <option value="قيد التجهيز">قيد التجهيز</option>
                            <option value="في الطريق">في الطريق</option>
                            <option value="تم التسليم">تم التسليم</option>
                            <option value="ملغي">ملغي</option>
                          </select>
                        </div>
                      </div>

                      {/* Customer Details & WhatsApp Button */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-neutral-700">
                        <div className="space-y-1">
                          <p>
                            <span className="font-bold text-neutral-900">العميل:</span> {o.customerName}
                          </p>
                          <p>
                            <span className="font-bold text-neutral-900">الهاتف:</span> {o.phone} {o.altPhone && `(بديل: ${o.altPhone})`}
                          </p>
                          <p>
                            <span className="font-bold text-neutral-900">العنوان:</span> {o.governorate} - {o.cityArea} ({o.detailedAddress})
                          </p>
                          {o.notes && (
                            <p className="text-neutral-500">
                              <span className="font-bold text-neutral-900">ملاحظات:</span> {o.notes}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1 md:text-left flex flex-col justify-between">
                          <div>
                            <p>
                              <span className="text-neutral-500">المجموع الفرعي:</span> {o.subtotal} ج.م
                            </p>
                            {o.discount > 0 && (
                              <p className="text-emerald-600">
                                <span>الخصم ({o.couponCode || 'كوبون'}):</span> -{o.discount} ج.م
                              </p>
                            )}
                            <p>
                              <span className="text-neutral-500">الشحن:</span> {o.shipping} ج.م
                            </p>
                            <p className="font-bold text-sm text-black pt-1">
                              <span>الإجمالي:</span> {o.total} ج.م
                            </p>
                          </div>

                          <div className="pt-2 flex items-center gap-2 md:justify-end">
                            <a
                              href={`https://wa.me/${(() => {
                                const digits = o.phone.replace(/[^0-9]/g, '');
                                return digits.startsWith('01') ? `20${digits.substring(1)}` : digits;
                              })()}?text=${encodeURIComponent(
                                `مرحباً ${o.customerName}، نتواصل معك بخصوص طلبك من متجر ZYRO برقم: ${o.orderNumber}`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xs font-bold text-xs transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>واتساب العميل</span>
                            </a>
                            <button
                              onClick={() =>
                                setDeleteTarget({
                                  type: 'order',
                                  id: o.id || o.orderNumber,
                                  name: `طلب رقم ${o.orderNumber}`,
                                  extraInfo: `العميل: ${o.customerName} (${o.phone}) • الإجمالي: ${o.total} ج.م`,
                                })
                              }
                              className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                              title="حذف الطلب نهائياً"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="bg-neutral-50 p-3 border border-neutral-100 text-xs space-y-2">
                        <p className="font-bold text-neutral-800">المنتجات المطلوبة ({o.items?.length || 0}):</p>
                        <div className="divide-y divide-neutral-200">
                          {o.items?.map((item, idx) => (
                            <div key={idx} className="py-1.5 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-black">{item.product?.name}</span>
                                <span className="text-neutral-500 font-brand">({item.selectedSize} / {item.selectedColor})</span>
                              </div>
                              <div className="font-brand font-bold text-neutral-800">
                                {item.quantity} × {item.product?.price} = {item.quantity * item.product?.price} ج.م
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= 5. CUSTOMERS TAB ================= */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-sm text-neutral-900">سجل العملاء والمشترين</h3>
                <p className="text-xs text-neutral-500">قائمة مجمعة بالعملاء الذين قاموا بإجراء طلبات عبر المتجر</p>
              </div>

              {customersList.length === 0 ? (
                <div className="text-center py-16 px-4 bg-white border border-neutral-200 text-xs text-neutral-400">
                  لا توجد بيانات عملاء مسجلة بعد
                </div>
              ) : (
                <div className="bg-white border border-neutral-200 overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-neutral-100 text-neutral-700 font-bold border-b border-neutral-200">
                      <tr>
                        <th className="p-3">اسم العميل</th>
                        <th className="p-3">رقم الهاتف</th>
                        <th className="p-3">المحافظة</th>
                        <th className="p-3">عدد الطلبات</th>
                        <th className="p-3">إجمالي المشتريات</th>
                        <th className="p-3">تواصل</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {customersList.map((c, i) => (
                        <tr key={i} className="hover:bg-neutral-50">
                          <td className="p-3 font-bold text-neutral-900">{c.customerName}</td>
                          <td className="p-3 font-brand">{c.phone}</td>
                          <td className="p-3 text-neutral-600">{c.governorate}</td>
                          <td className="p-3 font-bold font-brand">{c.ordersCount}</td>
                          <td className="p-3 font-bold text-black font-brand">{c.totalSpent.toLocaleString()} ج.م</td>
                          <td className="p-3">
                            <a
                              href={`https://wa.me/${(() => {
                                const digits = c.phone.replace(/[^0-9]/g, '');
                                return digits.startsWith('01') ? `20${digits.substring(1)}` : digits;
                              })()}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-600 hover:text-emerald-700 font-bold inline-flex items-center gap-1"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>واتساب</span>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ================= 6. COUPONS TAB ================= */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-neutral-900">كوبونات وأكواد الخصم</h3>
                  <p className="text-xs text-neutral-500">إنشاء أكواد خصم بنسبة مئوية أو مبلغ ثابت وتفعيلها فوراً</p>
                </div>
                <button
                  onClick={() => {
                    resetCouponForm();
                    setIsCouponFormOpen(true);
                  }}
                  className="bg-black text-white px-5 py-2.5 text-xs font-bold hover:bg-neutral-800 transition-colors flex items-center gap-2 uppercase tracking-wider font-brand"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة كود خصم</span>
                </button>
              </div>

              {/* Coupon Form */}
              {isCouponFormOpen && (
                <div className="bg-white border-2 border-black p-5 sm:p-7 space-y-4 shadow-xl animate-fadeIn text-xs">
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                    <h3 className="font-bold text-sm text-black">إنشاء كود خصم جديد</h3>
                    <button onClick={resetCouponForm} className="text-neutral-400 hover:text-black">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveCoupon} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="block font-bold text-neutral-700">كود الخصم (Coupon Code) *</label>
                        <input
                          type="text"
                          required
                          placeholder="مثال: ZYRO20"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="w-full border border-neutral-300 p-2.5 uppercase font-brand font-bold focus:border-black focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block font-bold text-neutral-700">نوع الخصم *</label>
                        <select
                          value={couponType}
                          onChange={(e) => setCouponType(e.target.value as any)}
                          className="w-full border border-neutral-300 p-2.5 focus:border-black bg-white focus:outline-none"
                        >
                          <option value="percentage">نسبة مئوية (%)</option>
                          <option value="fixed">مبلغ ثابت (ج.م)</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="block font-bold text-neutral-700">قيمة الخصم *</label>
                        <input
                          type="number"
                          required
                          min="1"
                          placeholder={couponType === 'percentage' ? '15 (يعني 15%)' : '50 (يعني 50 جنيه)'}
                          value={couponValue}
                          onChange={(e) => setCouponValue(e.target.value ? Number(e.target.value) : '')}
                          className="w-full border border-neutral-300 p-2.5 font-brand focus:border-black focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block font-bold text-neutral-700">وصف الخصم</label>
                      <input
                        type="text"
                        placeholder="مثال: خصم 15% بمناسبة عروض الصيف"
                        value={couponDesc}
                        onChange={(e) => setCouponDesc(e.target.value)}
                        className="w-full border border-neutral-300 p-2.5 focus:border-black focus:outline-none"
                      />
                    </div>

                    <div className="pt-2">
                      <label className="flex items-center gap-2 font-bold text-neutral-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={couponIsActive}
                          onChange={(e) => setCouponIsActive(e.target.checked)}
                          className="accent-black"
                        />
                        <span>كود الخصم مفعل وجاهز للاستخدام في السلة</span>
                      </label>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200">
                      <button
                        type="button"
                        onClick={resetCouponForm}
                        className="px-5 py-2 border border-neutral-300 font-bold text-neutral-700 hover:bg-neutral-100"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="bg-black text-white px-7 py-2 font-bold hover:bg-neutral-800 uppercase tracking-wider font-brand"
                      >
                        حفظ الكوبون
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Coupons List */}
              <div className="space-y-3">
                {coupons.map((c) => (
                  <div
                    key={c.id || c.code}
                    className="bg-white p-4 border border-neutral-200 flex items-center justify-between gap-4 flex-wrap"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-neutral-100 flex items-center justify-center text-black font-brand font-black">
                        %
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-brand font-black text-sm text-black tracking-wider">{c.code}</span>
                          <span className="bg-neutral-900 text-white text-[10px] px-2 py-0.5 font-brand font-bold">
                            {c.discountType === 'percentage' ? `${c.value}%` : `${c.value} ج.م`}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleToggleCoupon(c)}
                            className={`text-[10px] px-2 py-0.5 font-bold cursor-pointer transition-colors ${
                              c.isActive ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'
                            }`}
                            title="انقر لتفعيل أو تعطيل الكود"
                          >
                            {c.isActive ? 'مفعل ✓' : 'معطل ✕'}
                          </button>
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5">{c.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditCoupon(c)}
                        className="p-2 border border-neutral-200 text-neutral-700 hover:text-black hover:border-black transition-colors"
                        title="تعديل الكوبون"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteTarget({
                            type: 'coupon',
                            id: c.id || `coupon-${c.code.toLowerCase()}`,
                            name: c.code,
                            extraInfo: c.description || (c.discountType === 'percentage' ? `خصم ${c.value}%` : `خصم ${c.value} ج.م`),
                          })
                        }
                        className="p-2 border border-neutral-200 text-neutral-400 hover:text-red-600 hover:border-red-500 transition-colors cursor-pointer"
                        title="حذف الكوبون"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 7. SHIPPING & GOVERNORATES TAB ================= */}
          {activeTab === 'shipping' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-neutral-900">أسعار ومناطق الشحن (المحافظات)</h3>
                  <p className="text-xs text-neutral-500">تعديل تكلفة التوصيل ومدة الشحن المتوقعة لكل محافظة</p>
                </div>
                <button
                  onClick={() => {
                    resetGovForm();
                    setIsGovFormOpen(true);
                  }}
                  className="bg-black text-white px-5 py-2.5 text-xs font-bold hover:bg-neutral-800 transition-colors flex items-center gap-2 uppercase tracking-wider font-brand"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة محافظة جديدة</span>
                </button>
              </div>

              {/* Gov Form */}
              {isGovFormOpen && (
                <div className="bg-white border-2 border-black p-5 shadow-xl animate-fadeIn text-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                    <h4 className="font-bold text-black">إضافة محافظة جديدة</h4>
                    <button onClick={resetGovForm} className="text-neutral-400 hover:text-black">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <form onSubmit={handleSaveGovernorate} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="block font-bold text-neutral-700">اسم المحافظة *</label>
                        <input
                          type="text"
                          required
                          value={govName}
                          onChange={(e) => setGovName(e.target.value)}
                          className="w-full border border-neutral-300 p-2 focus:border-black focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block font-bold text-neutral-700">تكلفة الشحن (ج.م) *</label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={govFee}
                          onChange={(e) => setGovFee(e.target.value ? Number(e.target.value) : '')}
                          className="w-full border border-neutral-300 p-2 font-brand focus:border-black focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block font-bold text-neutral-700">مدة التوصيل المتوقعة</label>
                        <input
                          type="text"
                          value={govDays}
                          onChange={(e) => setGovDays(e.target.value)}
                          className="w-full border border-neutral-300 p-2 focus:border-black focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={resetGovForm}
                        className="px-4 py-2 border border-neutral-300 font-bold"
                      >
                        إلغاء
                      </button>
                      <button type="submit" className="bg-black text-white px-6 py-2 font-bold font-brand">
                        حفظ المحافظة
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Governorates List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                {governorates.map((g) => (
                  <div key={g.id} className="bg-white p-3.5 border border-neutral-200 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-neutral-900">{g.name}</h4>
                        <button
                          type="button"
                          onClick={() => handleToggleGovernorate(g)}
                          className={`text-[9px] px-1.5 py-0.2 font-bold cursor-pointer transition-colors ${
                            g.isActive !== false ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'
                          }`}
                          title="تفعيل أو تعطيل الشحن لهذه المحافظة"
                        >
                          {g.isActive !== false ? 'مفعل ✓' : 'معطل ✕'}
                        </button>
                      </div>
                      <p className="text-[11px] text-neutral-500">{g.deliveryDays}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-black font-brand">{g.shippingFee} ج.م</span>
                      <button
                        onClick={() => handleEditGovernorate(g)}
                        className="p-1 text-neutral-500 hover:text-black transition-colors"
                        title="تعديل السعر والمحافظة"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteTarget({
                            type: 'governorate',
                            id: g.id,
                            name: g.name,
                            extraInfo: `سعر الشحن الحالي: ${g.shippingFee} ج.م (${g.deliveryDays})`,
                          })
                        }
                        className="p-1 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="حذف المحافظة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 8. STORE SETTINGS TAB ================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-sm text-neutral-900">إعدادات المتجر والموقع العامة</h3>
                <p className="text-xs text-neutral-500">
                  تعديل اسم الموقع، نصوص البانر، روابط التواصل الاجتماعي، أرقام الواتساب، والسياسات. تنعكس فوراً على الموقع العام!
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6 bg-white p-5 sm:p-7 border border-neutral-200 text-xs">
                
                {/* Branding & Logo */}
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-black border-b border-neutral-100 pb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span>الهوية والشعار</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block font-bold text-neutral-700">اسم المتجر / الشعار النصي *</label>
                      <input
                        type="text"
                        required
                        value={settingsForm.storeName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value, logoText: e.target.value })}
                        className="w-full border border-neutral-300 p-2.5 font-brand tracking-widest text-sm focus:border-black focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-bold text-neutral-700">الحد الأدنى للشحن المجاني (ج.م)</label>
                      <input
                        type="number"
                        min="0"
                        value={settingsForm.freeShippingThreshold}
                        onChange={(e) => setSettingsForm({ ...settingsForm, freeShippingThreshold: Number(e.target.value) })}
                        className="w-full border border-neutral-300 p-2.5 font-brand focus:border-black focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Announcement Bar */}
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-black border-b border-neutral-100 pb-2">
                    شريط الإعلانات العلوي
                  </h4>
                  <div className="space-y-1">
                    <label className="block font-bold text-neutral-700">نص الإعلان الترويجي</label>
                    <input
                      type="text"
                      value={settingsForm.announcementText}
                      onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                      className="w-full border border-neutral-300 p-2.5 focus:border-black focus:outline-none"
                    />
                  </div>
                </div>

                {/* Hero Section */}
                <div className="space-y-4">
                  <div className="border-b border-neutral-100 pb-2 flex items-center justify-between">
                    <h4 className="font-bold text-sm text-black">
                      قسم الواجهة الرئيسية (Hero Banner)
                    </h4>
                    <span className="text-[11px] text-neutral-400 font-medium">
                      الحقول النصية اختيارية (تُخفى تلقائياً عند تركها فارغة)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="block font-bold text-neutral-700 font-brand">Hero Badge Text</label>
                        <span className="text-[10px] text-neutral-400 font-sans">اختياري (Optional)</span>
                      </div>
                      <input
                        type="text"
                        placeholder="مثال: ZYRO SUMMER 2026 (اتركه فارغاً للإخفاء)"
                        value={settingsForm.heroBadge ?? ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, heroBadge: e.target.value })}
                        className="w-full border border-neutral-300 p-2.5 font-brand focus:border-black focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="block font-bold text-neutral-700 font-brand">Hero Main Headline</label>
                        <span className="text-[10px] text-neutral-400 font-sans">اختياري (Optional)</span>
                      </div>
                      <input
                        type="text"
                        placeholder="مثال: NEW STREETWEAR COLLECTION (اتركه فارغاً للإخفاء)"
                        value={settingsForm.heroTitle ?? ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })}
                        className="w-full border border-neutral-300 p-2.5 font-brand font-bold focus:border-black focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block font-bold text-neutral-700">نص الوصف الترحيبي (Hero Description)</label>
                      <span className="text-[10px] text-neutral-400 font-sans">اختياري (Optional)</span>
                    </div>
                    <textarea
                      rows={2}
                      placeholder="اكتب وصفاً للبانر الرئيسي أو اتركه فارغاً للإخفاء التام دون ترك فراغات"
                      value={settingsForm.heroSubtitle ?? ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })}
                      className="w-full border border-neutral-300 p-2.5 focus:border-black focus:outline-none"
                    />
                  </div>

                  {/* Hero Background Media (Image or Video) Settings */}
                  <div className="space-y-4 pt-3 border-t border-neutral-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <label className="block font-bold text-xs sm:text-sm text-neutral-900">
                            خلفية البانر الرئيسي (صورة أو فيديو - Hero Media)
                          </label>
                          <span className="text-[10px] bg-neutral-900 text-white font-mono px-2 py-0.5 font-bold uppercase">
                            Auto Responsive Cover
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          يمكنك رفع صورة أو فيديو. يتم ضبط وتغطية الشاشة تلقائياً (Object Cover) دون أي تشويه أو تمدد مهما كانت أبعاد الملف أفقية أو عمودية.
                        </p>
                      </div>

                      {/* Media Type Toggle */}
                      <div className="flex items-center bg-neutral-100 p-1 border border-neutral-300 shrink-0 self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => setSettingsForm((prev) => ({ ...prev, heroMediaType: 'image' }))}
                          className={`px-3 py-1 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                            (settingsForm.heroMediaType || 'image') === 'image'
                              ? 'bg-black text-white shadow-xs'
                              : 'text-neutral-600 hover:text-black'
                          }`}
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>صورة (Image)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSettingsForm((prev) => ({ ...prev, heroMediaType: 'video' }))}
                          className={`px-3 py-1 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                            settingsForm.heroMediaType === 'video'
                              ? 'bg-black text-white shadow-xs'
                              : 'text-neutral-600 hover:text-black'
                          }`}
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>فيديو (Video)</span>
                        </button>
                      </div>
                    </div>

                    {/* Upload Inputs and Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                      <div className="sm:col-span-6 space-y-1">
                        <input
                          type="url"
                          placeholder={
                            settingsForm.heroMediaType === 'video'
                              ? 'رابط فيديو مباشر (https://... mp4 / webm)'
                              : 'رابط صورة مباشر (https://...)'
                          }
                          value={
                            settingsForm.heroMediaType === 'video'
                              ? settingsForm.heroVideoUrl || settingsForm.heroImage || ''
                              : settingsForm.heroImage || ''
                          }
                          onChange={(e) => {
                            const val = e.target.value;
                            if (settingsForm.heroMediaType === 'video') {
                              setSettingsForm({ ...settingsForm, heroVideoUrl: val, heroImage: val, heroMediaType: 'video' });
                            } else {
                              setSettingsForm({ ...settingsForm, heroImage: val, heroMediaType: 'image' });
                            }
                          }}
                          className="w-full border border-neutral-300 p-2.5 text-xs font-brand focus:border-black focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-6 flex flex-wrap gap-2">
                        {/* Hidden Image File Input */}
                        <input
                          id="hero-banner-image-input"
                          type="file"
                          accept="image/*"
                          onChange={handleHeroImageFileUpload}
                          className="hidden"
                        />
                        {/* Hidden Video File Input */}
                        <input
                          id="hero-banner-video-input"
                          type="file"
                          accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
                          onChange={handleHeroVideoFileUpload}
                          className="hidden"
                        />

                        {/* Image Upload Button */}
                        <label
                          htmlFor="hero-banner-image-input"
                          className={`flex-1 min-w-[120px] p-2 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors text-center ${
                            settingsForm.heroMediaType === 'video'
                              ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300'
                              : 'bg-black hover:bg-neutral-800 text-white'
                          }`}
                          title="اختر ملف صورة من جهازك"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>رفع صورة</span>
                        </label>

                        {/* Video Upload Button */}
                        <label
                          htmlFor="hero-banner-video-input"
                          className={`flex-1 min-w-[120px] p-2 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors text-center ${
                            settingsForm.heroMediaType === 'video'
                              ? 'bg-black hover:bg-neutral-800 text-white'
                              : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300'
                          }`}
                          title="اختر ملف فيديو (MP4, WebM, MOV) من جهازك"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>رفع فيديو</span>
                        </label>

                        {/* Remove / Clear Media */}
                        {(settingsForm.heroImage || settingsForm.heroVideoUrl) && (
                          <button
                            type="button"
                            onClick={() => {
                              setSettingsForm((prev) => ({
                                ...prev,
                                heroImage: '',
                                heroVideoUrl: '',
                                heroMediaType: 'image',
                              }));
                              onShowToast('info', 'تم مسح خلفية البانر والعودة للخلفية البسيطة');
                            }}
                            className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 px-2.5 py-2 text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                            title="إزالة الوسائط"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden md:inline">مسح</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Media Alignment / Focal Point Selector */}
                    <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-neutral-50 border border-neutral-200 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-800">موضع التركيز والتوسيط (Focal Point):</span>
                        <span className="text-neutral-500 text-[11px]">يحدد نقطة ارتكاز الفيديو/الصورة عند التكبير المتجاوب</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {(['center', 'top', 'bottom'] as const).map((pos) => (
                          <button
                            key={pos}
                            type="button"
                            onClick={() => setSettingsForm((prev) => ({ ...prev, heroMediaPosition: pos }))}
                            className={`px-2.5 py-1 text-[11px] font-bold uppercase transition-colors cursor-pointer ${
                              (settingsForm.heroMediaPosition || 'center') === pos
                                ? 'bg-neutral-900 text-white'
                                : 'bg-white hover:bg-neutral-200 text-neutral-700 border border-neutral-300'
                            }`}
                          >
                            {pos === 'center' ? 'وسط (Center)' : pos === 'top' ? 'أعلى (Top)' : 'أسفل (Bottom)'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Processing Status Feedback */}
                    {heroMediaStatus && (
                      <div className="p-2.5 bg-neutral-900 text-white text-xs font-medium flex items-center gap-2 animate-fadeIn">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{heroMediaStatus}</span>
                      </div>
                    )}

                    {/* Live Responsive Dual Preview (Desktop 16:9 & Mobile) */}
                    {(settingsForm.heroImage || settingsForm.heroVideoUrl) && (() => {
                      const mediaUrl = (
                        settingsForm.heroMediaType === 'video' && settingsForm.heroVideoUrl
                          ? settingsForm.heroVideoUrl
                          : settingsForm.heroImage || settingsForm.heroVideoUrl || ''
                      ).trim();
                      const isVideo = isVideoMedia(mediaUrl, settingsForm.heroMediaType);
                      const positionClass =
                        settingsForm.heroMediaPosition === 'top'
                          ? 'object-top'
                          : settingsForm.heroMediaPosition === 'bottom'
                          ? 'object-bottom'
                          : 'object-center';

                      return (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-neutral-800">معاينة استجابة وتغطية البانر الحية:</span>
                              <span className="text-[10px] bg-neutral-200 text-neutral-800 px-2 py-0.5 font-bold font-mono">
                                {isVideo ? '📹 VIDEO MODE' : '🖼️ IMAGE MODE'}
                              </span>
                            </div>

                            {/* Switch Device View */}
                            <div className="flex items-center border border-neutral-300 bg-white p-0.5">
                              <button
                                type="button"
                                onClick={() => setHeroPreviewDevice('desktop')}
                                className={`px-2 py-1 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                                  heroPreviewDevice === 'desktop' ? 'bg-black text-white' : 'text-neutral-600 hover:text-black'
                                }`}
                              >
                                <Monitor className="w-3 h-3" />
                                <span>كمبيوتر (16:9)</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setHeroPreviewDevice('mobile')}
                                className={`px-2 py-1 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                                  heroPreviewDevice === 'mobile' ? 'bg-black text-white' : 'text-neutral-600 hover:text-black'
                                }`}
                              >
                                <Smartphone className="w-3 h-3" />
                                <span>هاتف (Mobile)</span>
                              </button>
                            </div>
                          </div>

                          {/* Preview Screen */}
                          <div className="flex justify-center bg-neutral-900 p-3 sm:p-4 border border-neutral-300 overflow-hidden">
                            <div
                              className={`relative bg-neutral-950 border border-neutral-700 overflow-hidden shadow-2xl transition-all duration-300 ${
                                heroPreviewDevice === 'desktop'
                                  ? 'w-full aspect-video'
                                  : 'w-[260px] h-[380px] rounded-lg'
                              }`}
                            >
                              {isVideo ? (
                                <video
                                  key={mediaUrl}
                                  src={mediaUrl}
                                  autoPlay
                                  loop
                                  muted
                                  playsInline
                                  className={`w-full h-full object-cover ${positionClass} opacity-85`}
                                />
                              ) : (
                                <img
                                  key={mediaUrl}
                                  src={mediaUrl}
                                  alt="Hero Banner Preview"
                                  className={`w-full h-full object-cover ${positionClass} opacity-85`}
                                />
                              )}

                              {/* Gradient Scrim */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 pointer-events-none" />

                              {/* Live Text Overlay in Preview */}
                              <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4 text-center pointer-events-none">
                                {settingsForm.heroBadge && (
                                  <div className="inline-block mx-auto mb-1 px-2 py-0.5 bg-black/50 border border-white/20 text-[9px] text-white/90 font-mono tracking-widest uppercase">
                                    {settingsForm.heroBadge}
                                  </div>
                                )}
                                <p className="text-xs sm:text-base font-black text-white uppercase tracking-tight drop-shadow-md truncate font-brand">
                                  {settingsForm.heroTitle || 'ZYRO STREETWEAR'}
                                </p>
                                {settingsForm.heroSubtitle && (
                                  <p className="text-[9px] sm:text-[11px] text-neutral-300 line-clamp-1 mt-0.5">
                                    {settingsForm.heroSubtitle}
                                  </p>
                                )}
                                <div className="mt-2 inline-flex items-center justify-center mx-auto">
                                  <span className="bg-white text-black font-bold text-[9px] px-3 py-1 uppercase shadow-sm">
                                    {settingsForm.heroCtaText || 'SHOP COLLECTION NOW'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Social & Contact */}
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-black border-b border-neutral-100 pb-2 flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    <span>بيانات التواصل وروابط السوشيال ميديا</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="block font-bold text-neutral-700 font-brand">WhatsApp Number (بدون +)</label>
                      <input
                        type="text"
                        value={settingsForm.whatsappNumber}
                        onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                        className="w-full border border-neutral-300 p-2.5 font-brand focus:border-black focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-bold text-neutral-700">رقم الهاتف للدعم</label>
                      <input
                        type="text"
                        value={settingsForm.phone}
                        onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                        className="w-full border border-neutral-300 p-2.5 font-brand focus:border-black focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-bold text-neutral-700 font-brand">Support Email</label>
                      <input
                        type="email"
                        value={settingsForm.email}
                        onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                        className="w-full border border-neutral-300 p-2.5 font-brand focus:border-black focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="block font-bold text-neutral-700 font-brand">Instagram Link</label>
                      <input
                        type="url"
                        value={settingsForm.instagramUrl}
                        onChange={(e) => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
                        className="w-full border border-neutral-300 p-2.5 font-brand focus:border-black focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-bold text-neutral-700 font-brand">Facebook Link</label>
                      <input
                        type="url"
                        value={settingsForm.facebookUrl}
                        onChange={(e) => setSettingsForm({ ...settingsForm, facebookUrl: e.target.value })}
                        className="w-full border border-neutral-300 p-2.5 font-brand focus:border-black focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-bold text-neutral-700 font-brand">TikTok Link</label>
                      <input
                        type="url"
                        value={settingsForm.tiktokUrl || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, tiktokUrl: e.target.value })}
                        className="w-full border border-neutral-300 p-2.5 font-brand focus:border-black focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Content & Policies */}
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-black border-b border-neutral-100 pb-2">
                    محتوى الفوتر والسياسات
                  </h4>
                  <div className="space-y-1">
                    <label className="block font-bold text-neutral-700">نبذة عن المتجر (Footer About Text)</label>
                    <textarea
                      rows={2}
                      value={settingsForm.aboutText}
                      onChange={(e) => setSettingsForm({ ...settingsForm, aboutText: e.target.value })}
                      className="w-full border border-neutral-300 p-2.5 focus:border-black focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block font-bold text-neutral-700">سياسة الاستبدال والاسترجاع</label>
                      <textarea
                        rows={2}
                        value={settingsForm.refundPolicy}
                        onChange={(e) => setSettingsForm({ ...settingsForm, refundPolicy: e.target.value })}
                        className="w-full border border-neutral-300 p-2.5 focus:border-black focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-bold text-neutral-700">الشروط وأوقات العمل</label>
                      <textarea
                        rows={2}
                        value={settingsForm.termsText}
                        onChange={(e) => setSettingsForm({ ...settingsForm, termsText: e.target.value })}
                        className="w-full border border-neutral-300 p-2.5 focus:border-black focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Save settings CTA */}
                <div className="pt-4 border-t border-neutral-200 flex justify-end">
                  <button
                    type="submit"
                    className="bg-black text-white px-9 py-3 text-xs font-bold hover:bg-neutral-800 transition-colors uppercase tracking-wider font-brand shadow-md"
                  >
                    حفظ ونشر كافة الإعدادات
                  </button>
                </div>

              </form>
            </div>
          )}

        </div>

        {/* Dashboard Footer Bar */}
        <div className="p-3 bg-neutral-100 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-600 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-brand font-semibold text-neutral-800">ZYRO CLOUD DATABASE: FIRESTORE CONNECTED</span>
          </div>
          <button
            onClick={onClose}
            className="font-bold text-black hover:underline cursor-pointer"
          >
            إغلاق لوحة التحكم
          </button>
        </div>

      </div>

      {/* ================= DEDICATED IN-APP DELETE CONFIRMATION DIALOG ================= */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs font-arabic animate-fadeIn"
          dir="rtl"
        >
          <div className="bg-white border-2 border-red-600 w-full max-w-md p-6 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                <AlertCircle className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-neutral-900">
                  تأكيد الحذف النهائي من قاعدة البيانات
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  هل أنت متأكد من رغبتك في حذف هذا العنصر نهائياً؟ سيتم مسحه فوراً من قاعدة البيانات السحابية والموقع العام.
                </p>
              </div>
            </div>

            <div className="bg-neutral-50 p-3.5 border border-neutral-200 text-xs space-y-1">
              <div className="font-bold text-neutral-900 flex items-center gap-1.5 flex-wrap">
                <span>
                  {deleteTarget.type === 'product' && 'المنتج المراد حذفه:'}
                  {deleteTarget.type === 'category' && 'القسم المراد حذفه:'}
                  {deleteTarget.type === 'coupon' && 'كود الخصم المراد حذفه:'}
                  {deleteTarget.type === 'governorate' && 'المحافظة المراد حذفها:'}
                  {deleteTarget.type === 'order' && 'الطلب المراد حذفه:'}
                </span>
                <span className="text-red-600 font-extrabold">{deleteTarget.name}</span>
              </div>
              {deleteTarget.extraInfo && (
                <p className="text-neutral-500 text-[11px] pt-0.5">{deleteTarget.extraInfo}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-xs font-bold text-neutral-700 border border-neutral-300 hover:bg-neutral-100 cursor-pointer disabled:opacity-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-colors shadow-xs"
              >
                {isDeleting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>جاري الحذف السحابي...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>تأكيد الحذف نهائياً</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
