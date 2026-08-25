import React, { useState } from 'react';
import { X, User, Package, Phone, ShieldCheck, ChevronRight } from 'lucide-react';
import { OrderData, StoreSettings } from '../types';
import { getEnglishOrderStatus } from '../lib/translations';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedOrders: OrderData[];
  onOpenTracking: () => void;
  onOpenContact: () => void;
  settings?: StoreSettings;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  savedOrders,
  onOpenTracking,
  onOpenContact,
  settings,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');

  if (!isOpen) return null;

  const brandName = settings?.storeName || 'ZYRO';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn font-brand" dir="ltr">
      <div className="bg-white w-full max-w-lg shadow-2xl relative max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800">
              <User className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-black">My Account</h3>
              <p className="text-xs text-neutral-500 uppercase tracking-widest">{brandName} MEMBERSHIP</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-neutral-100 text-sm font-bold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 cursor-pointer ${
              activeTab === 'profile' ? 'border-black text-black' : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            Profile Info
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'orders' ? 'border-black text-black' : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            <span>Order History</span>
            {savedOrders.length > 0 && (
              <span className="bg-neutral-100 text-neutral-800 text-xs px-2 py-0.5 rounded-full">
                {savedOrders.length}
              </span>
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {activeTab === 'profile' ? (
            <div className="space-y-5">
              {/* Profile Card */}
              <div className="bg-neutral-50 p-4 border border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-black text-white text-lg font-light flex items-center justify-center">
                    {brandName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900">{brandName} Preferred Shopper</h4>
                    <p className="text-xs text-neutral-500">Guest Checkout / Active Shopper</p>
                  </div>
                </div>
                <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 uppercase tracking-wider">
                  Active
                </span>
              </div>

              {/* Quick Actions List */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenTracking();
                  }}
                  className="w-full flex items-center justify-between p-3.5 bg-white border border-neutral-200 hover:border-black transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-neutral-600 stroke-[1.5]" />
                    <span className="font-semibold text-neutral-800">Track Shipments & Orders</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onOpenContact();
                  }}
                  className="w-full flex items-center justify-between p-3.5 bg-white border border-neutral-200 hover:border-black transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-neutral-600 stroke-[1.5]" />
                    <span className="font-semibold text-neutral-800">Customer Care & Support</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                </button>
              </div>

              {/* Guarantees */}
              <div className="pt-2 border-t border-neutral-100 flex items-center gap-3 text-xs text-neutral-500">
                <ShieldCheck className="w-5 h-5 text-neutral-700 stroke-[1.5] shrink-0" />
                <span>All purchases include open inspection on delivery and a 14-day exchange & return guarantee.</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {savedOrders.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <Package className="w-10 h-10 text-neutral-300 mx-auto stroke-[1.25]" />
                  <p className="font-bold text-neutral-700">No orders placed yet</p>
                  <p className="text-xs text-neutral-500">When you complete an order, its details and status will appear here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedOrders.map((order, idx) => (
                    <div key={order.orderNumber || idx} className="p-4 border border-neutral-200 bg-neutral-50 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-black">{order.orderNumber}</span>
                        <span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 text-[11px] uppercase tracking-wider">
                          {getEnglishOrderStatus(order.status)}
                        </span>
                      </div>
                      <div className="text-xs text-neutral-600 flex justify-between">
                        <span>{order.customerName} • {order.governorate}</span>
                        <span className="font-bold text-black">{order.total} EGP</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-100 text-center">
          <button
            onClick={onClose}
            className="w-full bg-black text-white py-3 text-xs font-bold hover:bg-neutral-800 transition-colors uppercase tracking-wider cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
