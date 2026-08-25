export interface CountryCode {
  name: string;
  nameAr?: string;
  code: string; // ISO 2-letter
  dialCode: string; // e.g. "+20"
  flag: string; // Emoji flag
  placeholder: string;
  minLength?: number;
  maxLength?: number;
}

export const DEFAULT_COUNTRY: CountryCode = {
  name: 'Egypt',
  nameAr: 'مصر',
  code: 'EG',
  dialCode: '+20',
  flag: '🇪🇬',
  placeholder: '10XXXXXXXX',
  minLength: 10,
  maxLength: 11,
};

export const COUNTRY_CODES: CountryCode[] = [
  DEFAULT_COUNTRY,
  // Middle East & North Africa (MENA)
  { name: 'Saudi Arabia', nameAr: 'المملكة العربية السعودية', code: 'SA', dialCode: '+966', flag: '🇸🇦', placeholder: '5XXXXXXXX', minLength: 9, maxLength: 9 },
  { name: 'United Arab Emirates', nameAr: 'الإمارات العربية المتحدة', code: 'AE', dialCode: '+971', flag: '🇦🇪', placeholder: '5XXXXXXXX', minLength: 9, maxLength: 9 },
  { name: 'Kuwait', nameAr: 'الكويت', code: 'KW', dialCode: '+965', flag: '🇰🇼', placeholder: 'XXXXXXXX', minLength: 8, maxLength: 8 },
  { name: 'Qatar', nameAr: 'قطر', code: 'QA', dialCode: '+974', flag: '🇶🇦', placeholder: 'XXXXXXXX', minLength: 8, maxLength: 8 },
  { name: 'Bahrain', nameAr: 'البحرين', code: 'BH', dialCode: '+973', flag: '🇧🇭', placeholder: 'XXXXXXXX', minLength: 8, maxLength: 8 },
  { name: 'Oman', nameAr: 'عُمان', code: 'OM', dialCode: '+968', flag: '🇴🇲', placeholder: 'XXXXXXXX', minLength: 8, maxLength: 8 },
  { name: 'Jordan', nameAr: 'الأردن', code: 'JO', dialCode: '+962', flag: '🇯🇴', placeholder: '7XXXXXXXX', minLength: 9, maxLength: 9 },
  { name: 'Lebanon', nameAr: 'لبنان', code: 'LB', dialCode: '+961', flag: '🇱🇧', placeholder: 'XXXXXXXX', minLength: 7, maxLength: 8 },
  { name: 'Iraq', nameAr: 'العراق', code: 'IQ', dialCode: '+964', flag: '🇮🇶', placeholder: '7XXXXXXXXX', minLength: 10, maxLength: 10 },
  { name: 'Palestine', nameAr: 'فلسطين', code: 'PS', dialCode: '+970', flag: '🇵🇸', placeholder: '5XXXXXXXX', minLength: 9, maxLength: 9 },
  { name: 'Libya', nameAr: 'ليبيا', code: 'LY', dialCode: '+218', flag: '🇱🇾', placeholder: '9XXXXXXXX', minLength: 9, maxLength: 9 },
  { name: 'Tunisia', nameAr: 'تونس', code: 'TN', dialCode: '+216', flag: '🇹🇳', placeholder: 'XXXXXXXX', minLength: 8, maxLength: 8 },
  { name: 'Algeria', nameAr: 'الجزائر', code: 'DZ', dialCode: '+213', flag: '🇩🇿', placeholder: 'XXXXXXXXX', minLength: 9, maxLength: 9 },
  { name: 'Morocco', nameAr: 'المغرب', code: 'MA', dialCode: '+212', flag: '🇲🇦', placeholder: '6XXXXXXXX', minLength: 9, maxLength: 9 },
  { name: 'Sudan', nameAr: 'السودان', code: 'SD', dialCode: '+249', flag: '🇸🇩', placeholder: '9XXXXXXXX', minLength: 9, maxLength: 9 },
  { name: 'Yemen', nameAr: 'اليمن', code: 'YE', dialCode: '+967', flag: '🇾🇪', placeholder: '7XXXXXXXX', minLength: 9, maxLength: 9 },
  { name: 'Syria', nameAr: 'سوريا', code: 'SY', dialCode: '+963', flag: '🇸🇾', placeholder: '9XXXXXXXX', minLength: 9, maxLength: 9 },

  // North & South America
  { name: 'United States', nameAr: 'الولايات المتحدة', code: 'US', dialCode: '+1', flag: '🇺🇸', placeholder: '2025550123', minLength: 10, maxLength: 10 },
  { name: 'Canada', nameAr: 'كندا', code: 'CA', dialCode: '+1', flag: '🇨🇦', placeholder: '4165550123', minLength: 10, maxLength: 10 },
  { name: 'Mexico', nameAr: 'المكسيك', code: 'MX', dialCode: '+52', flag: '🇲🇽', placeholder: 'XXXXXXXXXX', minLength: 10, maxLength: 10 },
  { name: 'Brazil', nameAr: 'البرازيل', code: 'BR', dialCode: '+55', flag: '🇧🇷', placeholder: 'XXXXXXXXXXX', minLength: 10, maxLength: 11 },
  { name: 'Argentina', nameAr: 'الأرجنتين', code: 'AR', dialCode: '+54', flag: '🇦🇷', placeholder: 'XXXXXXXXXX', minLength: 10, maxLength: 10 },
  { name: 'Colombia', nameAr: 'كولومبيا', code: 'CO', dialCode: '+57', flag: '🇨🇴', placeholder: 'XXXXXXXXXX', minLength: 10, maxLength: 10 },
  { name: 'Chile', nameAr: 'تشيلي', code: 'CL', dialCode: '+56', flag: '🇨🇱', placeholder: 'XXXXXXXXX', minLength: 9, maxLength: 9 },

  // Europe
  { name: 'United Kingdom', nameAr: 'المملكة المتحدة', code: 'GB', dialCode: '+44', flag: '🇬🇧', placeholder: '7XXXXXXXXX', minLength: 10, maxLength: 10 },
  { name: 'Germany', nameAr: 'ألمانيا', code: 'DE', dialCode: '+49', flag: '🇩🇪', placeholder: 'XXXXXXXXXX', minLength: 10, maxLength: 11 },
  { name: 'France', nameAr: 'فرنسا', code: 'FR', dialCode: '+33', flag: '🇫🇷', placeholder: '6XXXXXXXX', minLength: 9, maxLength: 9 },
  { name: 'Italy', nameAr: 'إيطاليا', code: 'IT', dialCode: '+39', flag: '🇮🇹', placeholder: '3XXXXXXXXX', minLength: 10, maxLength: 10 },
  { name: 'Spain', nameAr: 'إسبانيا', code: 'ES', dialCode: '+34', flag: '🇪🇸', placeholder: '6XXXXXXXX', minLength: 9, maxLength: 9 },
  { name: 'Netherlands', nameAr: 'هولندا', code: 'NL', dialCode: '+31', flag: '🇳🇱', placeholder: '6XXXXXXXX', minLength: 9, maxLength: 9 },
  { name: 'Turkey', nameAr: 'تركيا', code: 'TR', dialCode: '+90', flag: '🇹🇷', placeholder: '5XXXXXXXXX', minLength: 10, maxLength: 10 },
  { name: 'Switzerland', nameAr: 'سويسرا', code: 'CH', dialCode: '+41', flag: '🇨🇭', placeholder: '7XXXXXXXX', minLength: 9, maxLength: 9 },
  { name: 'Sweden', nameAr: 'السويد', code: 'SE', dialCode: '+46', flag: '🇸🇪', placeholder: '7XXXXXXXX', minLength: 9, maxLength: 9 },
  { name: 'Norway', nameAr: 'النرويج', code: 'NO', dialCode: '+47', flag: '🇳🇴', placeholder: 'XXXXXXXX', minLength: 8, maxLength: 8 },
  { name: 'Denmark', nameAr: 'الدنمارك', code: 'DK', dialCode: '+45', flag: '🇩🇰', placeholder: 'XXXXXXXX', minLength: 8, maxLength: 8 },
  { name: 'Belgium', nameAr: 'بلجيكا', code: 'BE', dialCode: '+32', flag: '🇧🇪', placeholder: 'XXXXXXXXX', minLength: 9, maxLength: 9 },
  { name: 'Austria', nameAr: 'النمسا', code: 'AT', dialCode: '+43', flag: '🇦🇹', placeholder: 'XXXXXXXXXX', minLength: 10, maxLength: 11 },
  { name: 'Greece', nameAr: 'اليونان', code: 'GR', dialCode: '+30', flag: '🇬🇷', placeholder: '6XXXXXXXXX', minLength: 10, maxLength: 10 },
  { name: 'Portugal', nameAr: 'البرتغال', code: 'PT', dialCode: '+351', flag: '🇵🇹', placeholder: '9XXXXXXXX', minLength: 9, maxLength: 9 },
  { name: 'Poland', nameAr: 'بولندا', code: 'PL', dialCode: '+48', flag: '🇵🇱', placeholder: 'XXXXXXXXX', minLength: 9, maxLength: 9 },
  { name: 'Romania', nameAr: 'رومانيا', code: 'RO', dialCode: '+40', flag: '🇷🇴', placeholder: '7XXXXXXXX', minLength: 9, maxLength: 9 },
  { name: 'Russia', nameAr: 'روسيا', code: 'RU', dialCode: '+7', flag: '🇷🇺', placeholder: '9XXXXXXXXX', minLength: 10, maxLength: 10 },
  { name: 'Ukraine', nameAr: 'أوكرانيا', code: 'UA', dialCode: '+380', flag: '🇺🇦', placeholder: 'XXXXXXXXX', minLength: 9, maxLength: 9 },
  { name: 'Ireland', nameAr: 'أيرلندا', code: 'IE', dialCode: '+353', flag: '🇮🇪', placeholder: '8XXXXXXXX', minLength: 9, maxLength: 9 },

  // Asia & Pacific
  { name: 'China', nameAr: 'الصين', code: 'CN', dialCode: '+86', flag: '🇨🇳', placeholder: '1XXXXXXXXXX', minLength: 11, maxLength: 11 },
  { name: 'India', nameAr: 'الهند', code: 'IN', dialCode: '+91', flag: '🇮🇳', placeholder: '9XXXXXXXXX', minLength: 10, maxLength: 10 },
  { name: 'Japan', nameAr: 'اليابان', code: 'JP', dialCode: '+81', flag: '🇯🇵', placeholder: '90XXXXXXXX', minLength: 10, maxLength: 10 },
  { name: 'South Korea', nameAr: 'كوريا الجنوبية', code: 'KR', dialCode: '+82', flag: '🇰🇷', placeholder: '10XXXXXXXX', minLength: 9, maxLength: 10 },
  { name: 'Australia', nameAr: 'أستراليا', code: 'AU', dialCode: '+61', flag: '🇦🇺', placeholder: '4XXXXXXXX', minLength: 9, maxLength: 9 },
  { name: 'New Zealand', nameAr: 'نيوزيلندا', code: 'NZ', dialCode: '+64', flag: '🇳🇿', placeholder: '2XXXXXXXX', minLength: 8, maxLength: 10 },
  { name: 'Malaysia', nameAr: 'ماليزيا', code: 'MY', dialCode: '+60', flag: '🇲🇾', placeholder: '1XXXXXXXX', minLength: 9, maxLength: 10 },
  { name: 'Singapore', nameAr: 'سنغافورة', code: 'SG', dialCode: '+65', flag: '🇸🇬', placeholder: 'XXXXXXXX', minLength: 8, maxLength: 8 },
  { name: 'Indonesia', nameAr: 'إندونيسيا', code: 'ID', dialCode: '+62', flag: '🇮🇩', placeholder: '8XXXXXXXXXX', minLength: 10, maxLength: 12 },
  { name: 'Pakistan', nameAr: 'باكستان', code: 'PK', dialCode: '+92', flag: '🇵🇰', placeholder: '3XXXXXXXXX', minLength: 10, maxLength: 10 },
  { name: 'Bangladesh', nameAr: 'بنغلاديش', code: 'BD', dialCode: '+880', flag: '🇧🇩', placeholder: '1XXXXXXXXX', minLength: 10, maxLength: 10 },
  { name: 'Philippines', nameAr: 'الفلبين', code: 'PH', dialCode: '+63', flag: '🇵🇭', placeholder: '9XXXXXXXXX', minLength: 10, maxLength: 10 },
  { name: 'Thailand', nameAr: 'تايلاند', code: 'TH', dialCode: '+66', flag: '🇹🇭', placeholder: '8XXXXXXXX', minLength: 9, maxLength: 9 },
  { name: 'Vietnam', nameAr: 'فيتنام', code: 'VN', dialCode: '+84', flag: '🇻🇳', placeholder: '9XXXXXXXX', minLength: 9, maxLength: 9 },
  { name: 'Hong Kong', nameAr: 'هونغ كونغ', code: 'HK', dialCode: '+852', flag: '🇭🇰', placeholder: 'XXXXXXXX', minLength: 8, maxLength: 8 },
  { name: 'Taiwan', nameAr: 'تايوان', code: 'TW', dialCode: '+886', flag: '🇹🇼', placeholder: '9XXXXXXXX', minLength: 9, maxLength: 9 },

  // Africa
  { name: 'Nigeria', nameAr: 'نيجيريا', code: 'NG', dialCode: '+234', flag: '🇳🇬', placeholder: '80XXXXXXXX', minLength: 10, maxLength: 10 },
  { name: 'South Africa', nameAr: 'جنوب أفريقيا', code: 'ZA', dialCode: '+27', flag: '🇿🇦', placeholder: 'XXXXXXXXX', minLength: 9, maxLength: 9 },
  { name: 'Kenya', nameAr: 'كينيا', code: 'KE', dialCode: '+254', flag: '🇰🇪', placeholder: '7XXXXXXXX', minLength: 9, maxLength: 9 },
  { name: 'Ghana', nameAr: 'غانا', code: 'GH', dialCode: '+233', flag: '🇬🇭', placeholder: 'XXXXXXXXX', minLength: 9, maxLength: 9 },
  { name: 'Ethiopia', nameAr: 'إثيوبيا', code: 'ET', dialCode: '+251', flag: '🇪🇹', placeholder: '9XXXXXXXX', minLength: 9, maxLength: 9 },
  { name: 'Uganda', nameAr: 'أوغندا', code: 'UG', dialCode: '+256', flag: '🇺🇬', placeholder: '7XXXXXXXX', minLength: 9, maxLength: 9 },
  { name: 'Tanzania', nameAr: 'تنزانيا', code: 'TZ', dialCode: '+255', flag: '🇹🇿', placeholder: '7XXXXXXXX', minLength: 9, maxLength: 9 },
  { name: 'Cyprus', nameAr: 'قبرص', code: 'CY', dialCode: '+357', flag: '🇨🇾', placeholder: '9XXXXXXX', minLength: 8, maxLength: 8 },
];

/**
 * Formats and validates phone number based on selected country
 */
export function formatFullPhoneNumber(country: CountryCode, localNumber: string): string {
  const cleaned = localNumber.replace(/[^0-9]/g, '');
  if (!cleaned) return '';
  
  // If Egypt and starts with leading 0 (e.g. 010...), remove the leading 0 for standard storage
  let normalizedLocal = cleaned;
  if (country.code === 'EG' && normalizedLocal.startsWith('0')) {
    normalizedLocal = normalizedLocal.substring(1);
  }
  
  return `${country.dialCode} ${normalizedLocal}`;
}

/**
 * Validates phone number for a given country code
 */
export function validatePhoneNumber(country: CountryCode, localNumber: string): { isValid: boolean; message?: string } {
  const cleaned = localNumber.replace(/[^0-9]/g, '');
  if (!cleaned) {
    return { isValid: false, message: 'Please enter your phone number' };
  }

  // Egypt validation
  if (country.code === 'EG') {
    // Should be either 10 digits (without leading 0, e.g. 1012345678, 11..., 12..., 15...)
    // or 11 digits (with leading 0, e.g. 01012345678)
    const normalized = cleaned.startsWith('0') ? cleaned.substring(1) : cleaned;
    const isValidEg = /^(10|11|12|15)\d{8}$/.test(normalized);
    if (!isValidEg) {
      return {
        isValid: false,
        message: 'Please enter a valid Egyptian mobile number (e.g. 010XXXXXXXX or 10XXXXXXXX)',
      };
    }
    return { isValid: true };
  }

  // Saudi Arabia validation
  if (country.code === 'SA') {
    const normalized = cleaned.startsWith('0') ? cleaned.substring(1) : cleaned;
    if (normalized.length !== 9 || !normalized.startsWith('5')) {
      return { isValid: false, message: 'Please enter a valid Saudi number (e.g. 5XXXXXXXX)' };
    }
    return { isValid: true };
  }

  // UAE validation
  if (country.code === 'AE') {
    const normalized = cleaned.startsWith('0') ? cleaned.substring(1) : cleaned;
    if (normalized.length !== 9 || !normalized.startsWith('5')) {
      return { isValid: false, message: 'Please enter a valid UAE number (e.g. 5XXXXXXXX)' };
    }
    return { isValid: true };
  }

  // General length check based on min/max length
  const min = country.minLength || 7;
  const max = country.maxLength || 15;
  if (cleaned.length < min || cleaned.length > max) {
    return {
      isValid: false,
      message: `Please enter a valid phone number for ${country.name} (${min}-${max} digits)`,
    };
  }

  return { isValid: true };
}
