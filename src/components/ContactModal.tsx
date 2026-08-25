import React, { useState } from 'react';
import { X, MessageCircle, Mail, ShieldCheck, Send, Check } from 'lucide-react';
import { StoreSettings } from '../types';
import { PhoneInputWithCountry } from './PhoneInputWithCountry';
import { CountryCode, DEFAULT_COUNTRY, formatFullPhoneNumber } from '../data/countryCodes';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings?: StoreSettings;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, settings }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(DEFAULT_COUNTRY);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const brandName = settings?.storeName || 'ZYRO';
  const whatsappNumber = settings?.whatsappNumber?.replace(/[^0-9]/g, '') || '201000000000';
  const supportEmail = settings?.email || 'support@zyrostore.com';
  const returnPolicy =
    settings?.refundPolicy && !/[\u0600-\u06FF]/.test(settings.refundPolicy)
      ? settings.refundPolicy
      : 'Full inspection before payment is allowed across all governorates in Egypt. You have 14 days from delivery to request a hassle-free return or size exchange in original unworn condition with tags attached.';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSent(true);
    setTimeout(() => {
      setName('');
      setPhone('');
      setMessage('');
      setSent(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn font-brand" dir="ltr">
      <div className="relative bg-white w-full max-w-2xl shadow-2xl overflow-hidden my-auto border border-neutral-200 text-left">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <h2 className="font-bold text-base sm:text-lg text-neutral-900 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-emerald-600" />
            <span>Contact {brandName} Customer Care</span>
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
          
          {/* Quick WhatsApp & Support Channels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello ${brandName}, I have an inquiry regarding your products.`)}`}
              target="_blank"
              rel="noreferrer"
              className="p-4 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-bold text-xs text-emerald-950">Direct WhatsApp Chat</span>
                <span className="text-[11px] text-emerald-700">Instant assistance & support</span>
              </div>
            </a>

            <div className="p-4 bg-neutral-50 border border-neutral-200 flex items-center gap-3">
              <div className="w-10 h-10 bg-neutral-900 text-white rounded-full flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-bold text-xs text-neutral-900">Email Support</span>
                <span className="text-[11px] text-neutral-600 font-medium">{supportEmail}</span>
              </div>
            </div>
          </div>

          {/* Guarantees Box */}
          <div className="bg-neutral-50 p-4 border border-neutral-200 space-y-2 text-xs text-neutral-700">
            <h4 className="font-bold text-black flex items-center gap-1.5 uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 text-black" />
              <span>Exchange, Return & Quality Policy:</span>
            </h4>
            <p className="leading-relaxed text-neutral-600">
              {returnPolicy}
            </p>
          </div>

          {/* Send direct message */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <h4 className="font-bold text-xs text-black border-b border-neutral-200 pb-1 uppercase tracking-wide">
              Send us a direct message:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ahmed Ali"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border border-neutral-300 px-3 py-2.5 text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <PhoneInputWithCountry
                  label="Phone Number"
                  required
                  selectedCountry={selectedCountry}
                  onCountryChange={setSelectedCountry}
                  value={phone}
                  onChange={setPhone}
                />
              </div>
            </div>

            <textarea
              rows={3}
              placeholder="Type your inquiry, size question, or request..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full border border-neutral-300 px-3 py-2 text-xs focus:outline-none focus:border-black resize-none"
            />

            <button
              type="submit"
              disabled={sent}
              className={`w-full py-3 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                sent
                  ? 'bg-emerald-600 text-white'
                  : 'bg-black hover:bg-neutral-800 text-white shadow-xs'
              }`}
            >
              {sent ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Message Sent Successfully! Thank you.</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};
