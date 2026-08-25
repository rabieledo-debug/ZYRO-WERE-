import React, { useState } from 'react';
import { X, Package } from 'lucide-react';
import { OrderData } from '../types';
import { getEnglishOrderStatus } from '../lib/translations';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedOrders: OrderData[];
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  savedOrders,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [matchedOrder, setMatchedOrder] = useState<OrderData | null>(
    savedOrders.length > 0 ? savedOrders[0] : null
  );
  const [searched, setSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    const cleanedDigits = q.replace(/[^0-9]/g, '');

    const found = savedOrders.find((o) => {
      const matchOrderNum = o.orderNumber.toLowerCase() === q;
      const orderPhoneDigits = (o.phone || '').replace(/[^0-9]/g, '');
      const orderAltDigits = (o.altPhone || '').replace(/[^0-9]/g, '');

      const matchPhoneExact = o.phone.toLowerCase().includes(q);
      const matchPhoneDigits = cleanedDigits.length >= 4 && (orderPhoneDigits.includes(cleanedDigits) || orderAltDigits.includes(cleanedDigits));

      return matchOrderNum || matchPhoneExact || matchPhoneDigits;
    });

    if (found) {
      setMatchedOrder(found);
    } else {
      setMatchedOrder(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn font-brand" dir="ltr">
      <div className="relative bg-white w-full max-w-2xl shadow-2xl overflow-hidden my-auto border border-neutral-200 text-left">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <h2 className="font-bold text-base sm:text-lg text-neutral-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-black" />
            <span>Track Your Order & Shipment</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-500 hover:text-black hover:bg-neutral-200 rounded-full transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6">
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Order Number (e.g. SVX-123456) or Phone Number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border border-neutral-300 px-3 py-2.5 text-xs focus:outline-none focus:border-black uppercase font-brand"
            />
            <button
              type="submit"
              className="bg-black hover:bg-neutral-800 text-white text-xs font-bold px-5 py-2.5 uppercase tracking-wider transition-colors cursor-pointer"
            >
              Track
            </button>
          </form>

          {/* Results */}
          {matchedOrder ? (
            <div className="space-y-6">
              
              {/* Order Meta */}
              <div className="bg-neutral-50 border border-neutral-200 p-4 space-y-2 text-xs">
                <div className="flex justify-between items-center border-b border-neutral-200 pb-2">
                  <span className="font-bold text-sm text-neutral-900">
                    Order Reference: <strong>{matchedOrder.orderNumber}</strong>
                  </span>
                  <span className="bg-black text-white px-2.5 py-0.5 font-bold text-[11px] uppercase tracking-wider">
                    {getEnglishOrderStatus(matchedOrder.status)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-neutral-600">
                  <div>Date: <strong className="text-black">{matchedOrder.date}</strong></div>
                  <div>Region: <strong className="text-black">{matchedOrder.governorate}</strong></div>
                  <div>Recipient: <strong className="text-black">{matchedOrder.customerName}</strong></div>
                  <div>Total: <strong className="text-black">{matchedOrder.total} EGP</strong></div>
                </div>
              </div>

              {/* Progress Steps Timeline */}
              <div className="relative border-l-2 border-neutral-200 ml-4 space-y-6 pl-6">
                
                <div className="relative">
                  <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white"></span>
                  <h4 className="font-bold text-xs text-neutral-900">1. Order Placed & Confirmed</h4>
                  <p className="text-[11px] text-neutral-500">Your order has been received and scheduled for warehouse preparation.</p>
                </div>

                <div className="relative">
                  <span className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 border-white ${
                    ['جاري التجهيز', 'قيد التجهيز', 'تم الشحن', 'في الطريق', 'تم التسليم', 'Processing', 'Out for Delivery', 'Delivered'].includes(matchedOrder.status)
                      ? 'bg-emerald-600'
                      : 'bg-neutral-300'
                  }`}></span>
                  <h4 className="font-bold text-xs text-neutral-900">2. Quality Checked & Packed</h4>
                  <p className="text-[11px] text-neutral-500">Items inspected for fabric quality, tagged, and carefully packed.</p>
                </div>

                <div className="relative">
                  <span className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 border-white ${
                    ['تم الشحن', 'في الطريق', 'تم التسليم', 'Out for Delivery', 'Delivered'].includes(matchedOrder.status)
                      ? 'bg-emerald-600'
                      : 'bg-neutral-300'
                  }`}></span>
                  <h4 className="font-bold text-xs text-neutral-900">3. Out for Delivery with Courier</h4>
                  <p className="text-[11px] text-neutral-500">On the way to your shipping address. The courier will contact you prior to arrival.</p>
                </div>

                <div className="relative">
                  <span className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 border-white ${
                    ['تم التسليم', 'Delivered'].includes(matchedOrder.status) ? 'bg-emerald-600' : 'bg-neutral-300'
                  }`}></span>
                  <h4 className="font-bold text-xs text-neutral-900">4. Delivered Successfully</h4>
                  <p className="text-[11px] text-neutral-500">Inspect, receive, and enjoy your new ZYRO pieces!</p>
                </div>

              </div>

            </div>
          ) : searched ? (
            <div className="text-center py-8 text-neutral-500 text-xs">
              No matching order found with the provided details. Please check the order reference number or mobile phone.
            </div>
          ) : (
            <div className="text-center py-6 text-neutral-400 text-xs">
              Enter your order reference number to track its exact live dispatch status.
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-white text-center">
          <button
            onClick={onClose}
            className="bg-black text-white px-8 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
