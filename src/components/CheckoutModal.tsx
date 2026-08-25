import React, { useState } from 'react';
import { X, CheckCircle2, Truck, ShieldCheck, CreditCard, Banknote, Smartphone, MessageCircle } from 'lucide-react';
import { CartItem, Coupon, Governorate, OrderData, StoreSettings } from '../types';
import { GOVERNORATES, FREE_SHIPPING_THRESHOLD } from '../data/products';
import { saveOrder } from '../lib/db';
import { getEnglishGovernorateName, getEnglishDeliveryDays } from '../lib/translations';
import { PhoneInputWithCountry } from './PhoneInputWithCountry';
import { CountryCode, DEFAULT_COUNTRY, formatFullPhoneNumber, validatePhoneNumber } from '../data/countryCodes';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  appliedCoupon: Coupon | null;
  onOrderCompleted: (order: OrderData) => void;
  governorates?: Governorate[];
  settings?: StoreSettings;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  appliedCoupon,
  onOrderCompleted,
  governorates = GOVERNORATES,
  settings,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(DEFAULT_COUNTRY);
  const [phone, setPhone] = useState('');
  const [selectedAltCountry, setSelectedAltCountry] = useState<CountryCode>(DEFAULT_COUNTRY);
  const [altPhone, setAltPhone] = useState('');
  const [selectedGovId, setSelectedGovId] = useState(governorates[0]?.id || 'cairo');
  const [cityArea, setCityArea] = useState('');
  const [detailedAddress, setDetailedAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'instapay' | 'vodafone_cash'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmedOrder, setConfirmedOrder] = useState<OrderData | null>(null);

  if (!isOpen) return null;

  const activeGovs = governorates.filter((g) => g.isActive !== false);
  const selectedGov = activeGovs.find((g) => g.id === selectedGovId) || activeGovs[0] || GOVERNORATES[0];
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Discount
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else {
      discount = Math.min(subtotal, appliedCoupon.value);
    }
  }

  // Shipping
  const threshold = settings?.freeShippingThreshold !== undefined ? settings.freeShippingThreshold : FREE_SHIPPING_THRESHOLD;
  const shippingFee = subtotal >= threshold ? 0 : (selectedGov?.shippingFee || 45);
  const grandTotal = Math.max(0, subtotal - discount + shippingFee);

  const englishGovName = getEnglishGovernorateName(selectedGov.name, selectedGov.id);

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!customerName.trim()) {
      errs.customerName = 'Please enter your full name';
    }

    // Country-aware phone validation
    const phoneValidation = validatePhoneNumber(selectedCountry, phone);
    if (!phoneValidation.isValid) {
      errs.phone = phoneValidation.message || 'Please enter a valid phone number';
    }

    if (altPhone.trim()) {
      const altValidation = validatePhoneNumber(selectedAltCountry, altPhone);
      if (!altValidation.isValid) {
        errs.altPhone = altValidation.message || 'Please enter a valid alternative phone number';
      }
    }

    if (!cityArea.trim()) {
      errs.cityArea = 'Please enter your city, district or area';
    }
    if (!detailedAddress.trim()) {
      errs.detailedAddress = 'Please enter your detailed street address (street, building, apartment)';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const formattedPrimaryPhone = formatFullPhoneNumber(selectedCountry, phone);
    const formattedAltPhone = altPhone.trim() ? formatFullPhoneNumber(selectedAltCountry, altPhone) : '';

    const orderNum = `SVX-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: OrderData = {
      orderNumber: orderNum,
      customerName: customerName.trim(),
      phone: formattedPrimaryPhone,
      altPhone: formattedAltPhone,
      governorate: englishGovName,
      cityArea: cityArea.trim(),
      detailedAddress: detailedAddress.trim(),
      notes: notes.trim(),
      paymentMethod,
      items: [...cart],
      subtotal,
      discount,
      shipping: shippingFee,
      total: grandTotal,
      couponCode: appliedCoupon?.code,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'تم الاستلام',
      createdAt: new Date().toISOString(),
    };

    try {
      // Save directly into persistent Firestore database
      await saveOrder(newOrder);
      setConfirmedOrder(newOrder);
      onOrderCompleted(newOrder);
    } catch (err) {
      console.error('Error saving order to Firestore:', err);
      // Fallback local display
      setConfirmedOrder(newOrder);
      onOrderCompleted(newOrder);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendWhatsAppConfirmation = () => {
    if (!confirmedOrder) return;
    const itemsList = confirmedOrder.items
      .map((i) => `• ${i.product.nameEn || i.product.name} (${i.selectedColor} - Size ${i.selectedSize}) × ${i.quantity}`)
      .join('\n');

    const brandName = settings?.storeName || 'ZYRO';
    const storeWhatsApp = settings?.whatsappNumber?.replace(/[^0-9]/g, '') || '201000000000';

    const msg = encodeURIComponent(
      `Hello ${brandName}, I have placed a new order via the website:\n` +
      `Order Reference: ${confirmedOrder.orderNumber}\n` +
      `Customer Name: ${confirmedOrder.customerName}\n` +
      `Phone: ${confirmedOrder.phone}\n` +
      `Address: ${confirmedOrder.governorate} - ${confirmedOrder.cityArea} - ${confirmedOrder.detailedAddress}\n` +
      `Payment Method: ${confirmedOrder.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : confirmedOrder.paymentMethod === 'instapay' ? 'InstaPay Transfer' : 'E-Wallet Transfer'}\n` +
      `Items:\n${itemsList}\n` +
      `Total: ${confirmedOrder.total} EGP`
    );
    window.open(`https://wa.me/${storeWhatsApp}?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn font-brand" dir="ltr">
      <div className="relative bg-white w-full max-w-3xl shadow-2xl overflow-hidden my-auto border border-neutral-200 text-left">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <h2 className="font-bold text-base sm:text-lg text-neutral-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-black" />
            {confirmedOrder ? 'Order Confirmation' : 'Shipping & Checkout'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-500 hover:text-black hover:bg-neutral-200 rounded-full transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Order Confirmed Screen */}
        {confirmedOrder ? (
          <div className="p-6 sm:p-10 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-1">
                {settings?.storeName || 'ZYRO OFFICIAL STORE'}
              </span>
              <h3 className="text-2xl font-black text-neutral-900">
                Thank You! Your Order is Confirmed
              </h3>
              <p className="text-sm text-neutral-600 mt-2">
                Your order reference number is: <strong className="text-black font-brand text-base">{confirmedOrder.orderNumber}</strong>
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Our customer care team will contact you at <strong className="text-black font-mono">{confirmedOrder.phone}</strong> to coordinate delivery.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="bg-neutral-50 border border-neutral-200 p-4 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between border-b border-neutral-200 pb-2 font-bold text-sm">
                <span>Order Receipt Summary</span>
                <span className="text-neutral-500 font-normal">{confirmedOrder.date}</span>
              </div>
              <div className="flex justify-between">
                <span>Recipient:</span>
                <span className="font-bold">{confirmedOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span>Phone:</span>
                <span className="font-bold font-mono text-neutral-900">{confirmedOrder.phone}</span>
              </div>
              {confirmedOrder.altPhone && (
                <div className="flex justify-between">
                  <span>Alt Phone:</span>
                  <span className="font-medium font-mono text-neutral-700">{confirmedOrder.altPhone}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Address:</span>
                <span className="font-medium text-neutral-700">{confirmedOrder.governorate} - {confirmedOrder.cityArea}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="font-bold text-neutral-800">
                  {confirmedOrder.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : confirmedOrder.paymentMethod === 'instapay' ? 'InstaPay' : 'E-Wallet Transfer'}
                </span>
              </div>
              <div className="flex justify-between border-t border-neutral-200 pt-2 text-sm font-black">
                <span>Total Amount Due:</span>
                <span className="font-brand text-base text-black">{confirmedOrder.total} EGP</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <button
                onClick={handleSendWhatsAppConfirmation}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 text-xs flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send Order via WhatsApp</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-black hover:bg-neutral-800 text-white font-bold py-3 px-4 text-xs transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>

          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmitOrder} className="p-4 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            
            {/* Customer Contact */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-black border-b border-neutral-200 pb-2 uppercase tracking-wide">
                1. Personal & Contact Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Full Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe / Ahmed Ali"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className={`w-full border px-3 py-2.5 text-xs focus:outline-none focus:border-black ${
                      errors.customerName ? 'border-rose-500 bg-rose-50' : 'border-neutral-300'
                    }`}
                  />
                  {errors.customerName && (
                    <span className="text-[11px] text-rose-600 block mt-1">{errors.customerName}</span>
                  )}
                </div>

                {/* Country Code & Phone Number Field */}
                <div>
                  <PhoneInputWithCountry
                    label="Mobile Phone Number"
                    required
                    selectedCountry={selectedCountry}
                    onCountryChange={setSelectedCountry}
                    value={phone}
                    onChange={setPhone}
                    error={errors.phone}
                  />
                </div>

                {/* Alternative Phone with Country Code */}
                <div>
                  <PhoneInputWithCountry
                    label="Alternative Phone / WhatsApp (Optional)"
                    selectedCountry={selectedAltCountry}
                    onCountryChange={setSelectedAltCountry}
                    value={altPhone}
                    onChange={setAltPhone}
                    error={errors.altPhone}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Governorate / Region <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={selectedGovId}
                    onChange={(e) => setSelectedGovId(e.target.value)}
                    className="w-full border border-neutral-300 px-3 py-2.5 text-xs focus:outline-none focus:border-black bg-white cursor-pointer"
                  >
                    {activeGovs.map((gov) => {
                      const nameEn = getEnglishGovernorateName(gov.name, gov.id);
                      const daysEn = getEnglishDeliveryDays(gov.deliveryDays);
                      return (
                        <option key={gov.id} value={gov.id}>
                          {nameEn} ({gov.shippingFee} EGP - {daysEn})
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>

            {/* Address Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-black border-b border-neutral-200 pb-2 uppercase tracking-wide">
                2. Detailed Delivery Address
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    City / District / Area <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. New Cairo / Nasr City / Dokki / Maadi"
                    value={cityArea}
                    onChange={(e) => setCityArea(e.target.value)}
                    className={`w-full border px-3 py-2.5 text-xs focus:outline-none focus:border-black ${
                      errors.cityArea ? 'border-rose-500 bg-rose-50' : 'border-neutral-300'
                    }`}
                  />
                  {errors.cityArea && (
                    <span className="text-[11px] text-rose-600 block mt-1">{errors.cityArea}</span>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Detailed Street Address (Street Name, Building No., Floor, Apt, Landmark) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 90 North St., Building 14, 3rd Floor, Apt 12, Near..."
                    value={detailedAddress}
                    onChange={(e) => setDetailedAddress(e.target.value)}
                    className={`w-full border px-3 py-2.5 text-xs focus:outline-none focus:border-black ${
                      errors.detailedAddress ? 'border-rose-500 bg-rose-50' : 'border-neutral-300'
                    }`}
                  />
                  {errors.detailedAddress && (
                    <span className="text-[11px] text-rose-600 block mt-1">{errors.detailedAddress}</span>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Delivery Instructions / Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Please call 30 minutes before arrival"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full border border-neutral-300 px-3 py-2.5 text-xs focus:outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-black border-b border-neutral-200 pb-2 uppercase tracking-wide">
                3. Payment Method
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 border cursor-pointer flex flex-col justify-between gap-2 transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-black bg-neutral-50 shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Banknote className="w-5 h-5 text-neutral-800" />
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-black"
                    />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-black">Cash on Delivery (COD)</span>
                    <span className="text-[11px] text-neutral-500">Pay cash after inspecting your items</span>
                  </div>
                </label>

                <label
                  onClick={() => setPaymentMethod('instapay')}
                  className={`p-3 border cursor-pointer flex flex-col justify-between gap-2 transition-all ${
                    paymentMethod === 'instapay'
                      ? 'border-black bg-neutral-50 shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Smartphone className="w-5 h-5 text-neutral-800" />
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'instapay'}
                      onChange={() => setPaymentMethod('instapay')}
                      className="accent-black"
                    />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-black">InstaPay Transfer</span>
                    <span className="text-[11px] text-neutral-500">Instant transfer via InstaPay app</span>
                  </div>
                </label>

                <label
                  onClick={() => setPaymentMethod('vodafone_cash')}
                  className={`p-3 border cursor-pointer flex flex-col justify-between gap-2 transition-all ${
                    paymentMethod === 'vodafone_cash'
                      ? 'border-black bg-neutral-50 shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <CreditCard className="w-5 h-5 text-neutral-800" />
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'vodafone_cash'}
                      onChange={() => setPaymentMethod('vodafone_cash')}
                      className="accent-black"
                    />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-black">E-Wallet Transfer</span>
                    <span className="text-[11px] text-neutral-500">Vodafone, Orange, or Etisalat Cash</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Order Summary & Total */}
            <div className="bg-neutral-50 border border-neutral-200 p-4 space-y-2 text-xs">
              <div className="font-bold text-sm text-neutral-900 border-b border-neutral-200 pb-2">
                Order Summary ({cart.reduce((a, b) => a + b.quantity, 0)} items)
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal:</span>
                <span className="font-bold text-black">{subtotal} EGP</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Discount Code ({appliedCoupon.code}):</span>
                  <span>-{discount} EGP</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Shipping ({englishGovName}):</span>
                <span className="font-bold text-black">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-bold">Free Shipping 🚚</span>
                  ) : (
                    `${shippingFee} EGP`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-black pt-2 border-t border-neutral-200">
                <span>Total Amount Due:</span>
                <span className="text-xl text-black">{grandTotal} EGP</span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="space-y-2">
              <button
                type="submit"
                id="submit-order-btn"
                disabled={isSubmitting}
                className="w-full bg-black hover:bg-neutral-800 text-white py-4 font-bold text-xs sm:text-sm tracking-widest uppercase transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Confirming & Placing Order...</span>
                ) : (
                  <>
                    <span>Confirm Order Now • {grandTotal} EGP</span>
                    <ShieldCheck className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>All shipments include full inspection before payment and 14-day returns</span>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
