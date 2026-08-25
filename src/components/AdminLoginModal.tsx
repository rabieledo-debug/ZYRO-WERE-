import React, { useState } from 'react';
import { X, Lock, User, Key, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Verify credentials
    // Username: "Zyro"
    // Password: "Zyro777000"
    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    setTimeout(() => {
      if (
        (trimmedUser.toLowerCase() === 'zyro' || trimmedUser === 'Zyro') &&
        trimmedPass === 'Zyro777000'
      ) {
        setIsLoading(false);
        setUsername('');
        setPassword('');
        setError('');
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setError('اسم المستخدم أو كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.');
      }
    }, 400);
  };

  const handleClose = () => {
    setUsername('');
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-arabic animate-fadeIn"
      dir="rtl"
    >
      <div className="bg-white w-full max-w-md shadow-2xl border border-neutral-200 relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-100 bg-neutral-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/10 flex items-center justify-center text-white">
              <Lock className="w-4 h-4 stroke-[1.75]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">تسجيل الدخول - الإعدادات</h3>
              <p className="text-[11px] text-neutral-400 font-brand">ZYRO MANAGEMENT ACCESS</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block font-bold text-neutral-800">
              اسم المستخدم (Username)
            </label>
            <div className="relative">
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="أدخل اسم المستخدم"
                className="w-full pl-3 pr-10 py-2.5 border border-neutral-300 bg-neutral-50/50 text-xs focus:bg-white focus:border-black focus:outline-none font-brand"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block font-bold text-neutral-800">
              كلمة المرور (Password)
            </label>
            <div className="relative">
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
                <Key className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                className="w-full pl-10 pr-10 py-2.5 border border-neutral-300 bg-neutral-50/50 text-xs focus:bg-white focus:border-black focus:outline-none font-brand"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer"
                title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black hover:bg-neutral-800 text-white py-3 text-xs font-bold transition-colors uppercase tracking-wider font-brand cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
            >
              {isLoading ? (
                <span>جاري التحقق...</span>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>دخول لوحة التحكم</span>
                </>
              )}
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-[11px] text-neutral-400">
              لوحة التحكم محمية ومخصصة لإدارة المتجر فقط
            </p>
          </div>

        </form>

      </div>
    </div>
  );
};
