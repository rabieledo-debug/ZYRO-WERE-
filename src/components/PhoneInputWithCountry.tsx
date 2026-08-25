import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search, Check, Globe } from 'lucide-react';
import { CountryCode, COUNTRY_CODES, DEFAULT_COUNTRY } from '../data/countryCodes';

interface PhoneInputWithCountryProps {
  label?: string;
  required?: boolean;
  selectedCountry: CountryCode;
  onCountryChange: (country: CountryCode) => void;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  id?: string;
  placeholder?: string;
  autoFocus?: boolean;
}

export const PhoneInputWithCountry: React.FC<PhoneInputWithCountryProps> = ({
  label,
  required = false,
  selectedCountry = DEFAULT_COUNTRY,
  onCountryChange,
  value,
  onChange,
  error,
  id,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Auto-focus search input when opened
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      setSearchQuery('');
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Filter country codes by name, Arabic name, or dialCode
  const filteredCountries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase().replace('+', '');
    if (!query) return COUNTRY_CODES;

    return COUNTRY_CODES.filter((c) => {
      const matchName = c.name.toLowerCase().includes(query);
      const matchNameAr = c.nameAr ? c.nameAr.includes(query) : false;
      const matchDial = c.dialCode.replace('+', '').includes(query);
      const matchIso = c.code.toLowerCase().includes(query);
      return matchName || matchNameAr || matchDial || matchIso;
    });
  }, [searchQuery]);

  const handleSelectCountry = (c: CountryCode) => {
    onCountryChange(c);
    setIsOpen(false);
    setSearchQuery('');
  };

  const dynamicPlaceholder = placeholder || selectedCountry.placeholder || 'Phone number';

  return (
    <div className="w-full font-brand text-left" dir="ltr">
      {label && (
        <label htmlFor={id} className="block text-xs font-bold text-neutral-700 mb-1">
          {label} {required && <span className="text-rose-600">*</span>}
        </label>
      )}

      <div className="relative" ref={dropdownRef}>
        <div
          className={`flex items-stretch border transition-colors bg-white ${
            error ? 'border-rose-500 bg-rose-50/40 ring-1 ring-rose-500/20' : 'border-neutral-300 focus-within:border-black focus-within:ring-1 focus-within:ring-black'
          }`}
        >
          {/* Country Calling Code Trigger */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-neutral-50 hover:bg-neutral-100 border-r border-neutral-300 text-xs font-bold text-neutral-900 transition-colors shrink-0 cursor-pointer select-none"
            title={`Selected: ${selectedCountry.name} (${selectedCountry.dialCode})`}
          >
            <span className="text-base leading-none">{selectedCountry.flag}</span>
            <span className="font-brand tracking-tight text-black">{selectedCountry.dialCode}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-200 ${isOpen ? 'rotate-180 text-black' : ''}`} />
          </button>

          {/* Local Phone Number Input */}
          <input
            id={id}
            type="tel"
            inputMode="numeric"
            value={value}
            onChange={(e) => {
              // Allow numbers, spaces, and dashes
              const val = e.target.value;
              onChange(val);
            }}
            placeholder={dynamicPlaceholder}
            className="w-full px-3 py-2.5 text-xs text-neutral-900 bg-transparent focus:outline-none placeholder:text-neutral-400 font-brand font-medium"
          />
        </div>

        {/* Searchable Country Code Dropdown Popover */}
        {isOpen && (
          <div className="absolute left-0 top-full mt-1.5 w-full sm:w-80 bg-white border border-neutral-300 shadow-xl z-50 animate-fadeIn max-h-72 flex flex-col overflow-hidden text-left">
            
            {/* Search Box Header */}
            <div className="p-2 border-b border-neutral-200 bg-neutral-50 shrink-0">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search country or code (e.g. Egypt, +966, UAE)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-neutral-300 bg-white focus:outline-none focus:border-black placeholder:text-neutral-400"
                />
              </div>
            </div>

            {/* Country List Options */}
            <div className="overflow-y-auto divide-y divide-neutral-100 flex-1 overscroll-contain">
              {filteredCountries.length === 0 ? (
                <div className="p-4 text-center text-xs text-neutral-500">
                  <Globe className="w-5 h-5 text-neutral-300 mx-auto mb-1.5" />
                  <span>No countries matching "{searchQuery}"</span>
                </div>
              ) : (
                filteredCountries.map((c) => {
                  const isSelected = c.code === selectedCountry.code && c.dialCode === selectedCountry.dialCode;
                  return (
                    <button
                      key={`${c.code}-${c.dialCode}`}
                      type="button"
                      onClick={() => handleSelectCountry(c)}
                      className={`w-full px-3 py-2.5 text-xs flex items-center justify-between transition-colors cursor-pointer text-left ${
                        isSelected
                          ? 'bg-neutral-100 font-bold text-black'
                          : 'hover:bg-neutral-50 text-neutral-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-base leading-none shrink-0">{c.flag}</span>
                        <div className="truncate">
                          <span className="font-semibold text-neutral-900 block truncate">{c.name}</span>
                          {c.nameAr && (
                            <span className="text-[10px] text-neutral-400 block font-arabic truncate">{c.nameAr}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className="text-xs font-mono font-bold text-neutral-600 bg-neutral-100 px-1.5 py-0.5 rounded-xs">
                          {c.dialCode}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-black shrink-0" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Quick helper tip */}
            <div className="p-1.5 bg-neutral-50 border-t border-neutral-200 text-[10px] text-neutral-500 text-center font-medium">
              Default: 🇪🇬 Egypt (+20) • Select international code if ordering from abroad
            </div>
          </div>
        )}
      </div>

      {error && (
        <span className="text-[11px] text-rose-600 block mt-1 font-medium">{error}</span>
      )}
    </div>
  );
};
