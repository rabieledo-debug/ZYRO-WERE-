import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Pipette, Check, Trash2, Plus, Edit2, Sparkles, RefreshCw, Palette } from 'lucide-react';
import { ProductColor } from '../types';

// ================= COLOR UTILS =================

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number; // 0 - 360
  s: number; // 0 - 100
  l: number; // 0 - 100
}

export interface HSV {
  h: number; // 0 - 360
  s: number; // 0 - 100
  v: number; // 0 - 100
}

export function hexToRgb(hex: string): RGB {
  let cleaned = hex.replace('#', '').trim();
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map((c) => c + c).join('');
  }
  const num = parseInt(cleaned, 16);
  if (isNaN(num) || (cleaned.length !== 6 && cleaned.length !== 8)) {
    return { r: 17, g: 17, b: 17 };
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
  const toHex = (val: number) => clamp(val).toString(16).padStart(2, '0').toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function rgbToHsv(r: number, g: number, b: number): HSV {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  let s = max === 0 ? 0 : (delta / max) * 100;
  let v = max * 100;

  if (delta !== 0) {
    if (max === rNorm) {
      h = ((gNorm - bNorm) / delta) % 6;
    } else if (max === gNorm) {
      h = (bNorm - rNorm) / delta + 2;
    } else {
      h = (rNorm - gNorm) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  return {
    h: Math.round(h),
    s: Math.round(s),
    v: Math.round(v),
  };
}

export function hsvToRgb(h: number, s: number, v: number): RGB {
  const sNorm = s / 100;
  const vNorm = v / 100;
  const c = vNorm * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = vNorm - c;

  let rPrime = 0;
  let gPrime = 0;
  let bPrime = 0;

  if (h >= 0 && h < 60) {
    rPrime = c; gPrime = x; bPrime = 0;
  } else if (h >= 60 && h < 120) {
    rPrime = x; gPrime = c; bPrime = 0;
  } else if (h >= 120 && h < 180) {
    rPrime = 0; gPrime = c; bPrime = x;
  } else if (h >= 180 && h < 240) {
    rPrime = 0; gPrime = x; bPrime = c;
  } else if (h >= 240 && h < 300) {
    rPrime = x; gPrime = 0; bPrime = c;
  } else {
    rPrime = c; gPrime = 0; bPrime = x;
  }

  return {
    r: Math.round((rPrime + m) * 255),
    g: Math.round((gPrime + m) * 255),
    b: Math.round((bPrime + m) * 255),
  };
}

export function getLuminance(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

// Smart Name Detector based on HSL & RGB values
export function detectColorName(hex: string): { ar: string; en: string } {
  const rgb = hexToRgb(hex);
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
  const { h, s, v } = hsv;

  // Achromatic checks (Black, White, Greys)
  if (v <= 15) return { ar: 'أسود فحمي', en: 'Carbon Black' };
  if (s <= 10) {
    if (v >= 92) return { ar: 'أبيض ناصع', en: 'Pure White' };
    if (v >= 80) return { ar: 'أوف وايت', en: 'Off White' };
    if (v >= 60) return { ar: 'رمادي فاتح', en: 'Light Grey' };
    if (v >= 35) return { ar: 'رمادي حجري', en: 'Slate Grey' };
    return { ar: 'رمادي داكن / فحم', en: 'Charcoal' };
  }

  // Hue based color categorization
  if (h >= 345 || h < 15) {
    if (v < 40) return { ar: 'نبيتي داكن / مارون', en: 'Maroon / Deep Burgundy' };
    if (s < 40) return { ar: 'وردي ترابي', en: 'Dusty Rose' };
    return { ar: 'أحمر قرمزي', en: 'Crimson Red' };
  }
  if (h >= 15 && h < 45) {
    if (v < 50 && s > 30) return { ar: 'بني شوكولاتة', en: 'Mocha Brown' };
    if (v >= 70 && s < 50) return { ar: 'بيج رملي', en: 'Sand Beige' };
    if (s > 60) return { ar: 'برتقالي ناري', en: 'Flame Orange' };
    return { ar: 'بني جملي', en: 'Camel Brown' };
  }
  if (h >= 45 && h < 70) {
    if (s < 30) return { ar: 'عاجي / بيج فاتح', en: 'Ivory Cream' };
    if (v > 80 && s > 70) return { ar: 'أصفر ليموني / نيون', en: 'Neon Volt' };
    return { ar: 'خردلي دافئ', en: 'Mustard Gold' };
  }
  if (h >= 70 && h < 165) {
    if (s < 35) return { ar: 'أخضر ميرمية / سيج', en: 'Sage Green' };
    if (v < 35) return { ar: 'زيتي عسكري / كاكي', en: 'Army Olive' };
    if (v < 55) return { ar: 'أخضر زمردي / غابي', en: 'Forest Green' };
    return { ar: 'أخضر نضر', en: 'Emerald Green' };
  }
  if (h >= 165 && h < 200) {
    if (s < 40) return { ar: 'سماوي باستيل', en: 'Mist Cyan' };
    return { ar: 'تركواز بحري', en: 'Teal Cyan' };
  }
  if (h >= 200 && h < 260) {
    if (v < 30) return { ar: 'كحلي ليلي / ميدنايت', en: 'Midnight Navy' };
    if (v < 60 && s > 50) return { ar: 'أزرق ملكي / رويال', en: 'Royal Blue' };
    if (s < 40) return { ar: 'أزرق فولاذي', en: 'Steel Blue' };
    return { ar: 'أزرق سماوي', en: 'Sky Blue' };
  }
  if (h >= 260 && h < 315) {
    if (v < 35) return { ar: 'بنفسجي داكن', en: 'Deep Indigo' };
    if (s < 40) return { ar: 'خزامى / لافندر', en: 'Lavender Mist' };
    return { ar: 'بنفسجي ملكي', en: 'Royal Purple' };
  }
  if (h >= 315 && h < 345) {
    if (v < 40) return { ar: 'توتي داكن / بيري', en: 'Plum Berry' };
    return { ar: 'فوشيا / ماجنتا', en: 'Magenta' };
  }

  return { ar: 'لون مخصص', en: 'Custom Color' };
}

// Curated Sportswear & Streetwear Presets
export const SPORTSWEAR_PRESETS: { name: string; hex: string; category: string }[] = [
  { name: 'أسود كربوني (Onyx Black)', hex: '#111111', category: 'Essentials' },
  { name: 'أبيض ناصع (Pure White)', hex: '#FFFFFF', category: 'Essentials' },
  { name: 'أوف وايت (Off-White)', hex: '#F4F2EB', category: 'Essentials' },
  { name: 'رمادي رياضي (Heather Grey)', hex: '#9E9E9E', category: 'Neutrals' },
  { name: 'فحمي داكن (Charcoal)', hex: '#2B2B2B', category: 'Neutrals' },
  { name: 'بيج رملي (Desert Sand)', hex: '#D2B48C', category: 'Earthy' },
  { name: 'زيتي عسكري (Military Olive)', hex: '#4B5320', category: 'Earthy' },
  { name: 'بني موكا (Mocha Brown)', hex: '#4E3629', category: 'Earthy' },
  { name: 'سيج باستيل (Pastel Sage)', hex: '#8A9A86', category: 'Earthy' },
  { name: 'كحلي داكن (Midnight Navy)', hex: '#0B1D3A', category: 'Bold' },
  { name: 'أزرق ملكي (Cobalt Blue)', hex: '#1D4ED8', category: 'Bold' },
  { name: 'أحمر قرمزي (Crimson Red)', hex: '#B91C1C', category: 'Bold' },
  { name: 'نبيتي ملكي (Burgundy)', hex: '#581825', category: 'Bold' },
  { name: 'أخضر غابي (Forest Pine)', hex: '#1C3D28', category: 'Bold' },
  { name: 'نيون فولت (Volt Green)', hex: '#CCFF00', category: 'Vibrant' },
  { name: 'برتقالي ناري (Burnt Rust)', hex: '#C2410C', category: 'Vibrant' },
];

interface ColorPickerManagerProps {
  colors: ProductColor[];
  onChange: (colors: ProductColor[]) => void;
}

export const ColorPickerManager: React.FC<ColorPickerManagerProps> = ({ colors, onChange }) => {
  // Current active picker state
  const [currentHex, setCurrentHex] = useState('#111111');
  const [currentHsv, setCurrentHsv] = useState<HSV>({ h: 0, s: 0, v: 7 });
  const [rgbInput, setRgbInput] = useState<RGB>({ r: 17, g: 17, b: 17 });
  const [hexInput, setHexInput] = useState('#111111');
  const [colorName, setColorName] = useState('أسود كربوني');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isPickerExpanded, setIsPickerExpanded] = useState(false);

  // Saturation-Value Canvas Dragging
  const svBoxRef = useRef<HTMLDivElement>(null);
  const [isDraggingSv, setIsDraggingSv] = useState(false);

  // Update HSV and RGB when Hex changes internally
  const applyHex = useCallback((hex: string, updateName = true) => {
    let cleanHex = hex.trim();
    if (!cleanHex.startsWith('#')) cleanHex = `#${cleanHex}`;
    cleanHex = cleanHex.toUpperCase();

    const rgb = hexToRgb(cleanHex);
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);

    setCurrentHex(cleanHex);
    setHexInput(cleanHex);
    setRgbInput(rgb);
    setCurrentHsv(hsv);

    if (updateName) {
      const detected = detectColorName(cleanHex);
      setColorName(detected.ar);
    }
  }, []);

  // Handle HSV change (from 2D area or Hue slider)
  const applyHsv = useCallback((h: number, s: number, v: number, updateName = true) => {
    const newHsv = { h, s, v };
    const rgb = hsvToRgb(h, s, v);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

    setCurrentHsv(newHsv);
    setCurrentHex(hex);
    setHexInput(hex);
    setRgbInput(rgb);

    if (updateName) {
      const detected = detectColorName(hex);
      setColorName(detected.ar);
    }
  }, []);

  // 2D Saturation / Value Box coordinates
  const handleSvPointerMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!svBoxRef.current) return;
      const rect = svBoxRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, clientY - rect.top));

      const s = Math.round((x / rect.width) * 100);
      const v = Math.round((1 - y / rect.height) * 100);

      applyHsv(currentHsv.h, s, v, true);
    },
    [currentHsv.h, applyHsv]
  );

  useEffect(() => {
    const handleMouseUp = () => setIsDraggingSv(false);
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingSv) {
        handleSvPointerMove(e);
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDraggingSv) {
        handleSvPointerMove(e);
      }
    };

    if (isDraggingSv) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDraggingSv, handleSvPointerMove]);

  // EyeDropper API handler
  const handleEyeDropper = async () => {
    if (typeof window !== 'undefined' && 'EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        if (result?.sRGBHex) {
          applyHex(result.sRGBHex, true);
        }
      } catch (err) {
        console.log('EyeDropper closed or not supported:', err);
      }
    } else {
      // Fallback: Trigger native color input
      const input = document.getElementById('native-color-picker-fallback') as HTMLInputElement;
      input?.click();
    }
  };

  // Add or Update color in the list
  const handleSaveColorToList = () => {
    if (!colorName.trim()) {
      const auto = detectColorName(currentHex);
      setColorName(auto.ar);
    }

    const finalName = colorName.trim() || detectColorName(currentHex).ar;
    const finalColor: ProductColor = {
      name: finalName,
      hex: currentHex,
    };

    if (editingIndex !== null) {
      const updated = [...colors];
      updated[editingIndex] = finalColor;
      onChange(updated);
      setEditingIndex(null);
    } else {
      // Avoid duplicate exact hex if already exists
      const exists = colors.some((c) => c.hex.toLowerCase() === currentHex.toLowerCase());
      if (exists) {
        const updated = colors.map((c) =>
          c.hex.toLowerCase() === currentHex.toLowerCase() ? finalColor : c
        );
        onChange(updated);
      } else {
        onChange([...colors, finalColor]);
      }
    }

    // Reset picker state for next addition
    setIsPickerExpanded(false);
  };

  // Start Editing an existing color
  const handleStartEdit = (index: number) => {
    const c = colors[index];
    setEditingIndex(index);
    setColorName(c.name);
    applyHex(c.hex, false);
    setIsPickerExpanded(true);
  };

  // Delete color
  const handleDeleteColor = (index: number) => {
    const updated = colors.filter((_, i) => i !== index);
    onChange(updated);
    if (editingIndex === index) {
      setEditingIndex(null);
      setIsPickerExpanded(false);
    }
  };

  const isLight = getLuminance(rgbInput.r, rgbInput.g, rgbInput.b) > 150;

  return (
    <div className="space-y-4 font-arabic" dir="rtl">
      
      {/* Current Product Colors Bar / Swatches List */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-black" />
            <span className="text-xs font-bold text-neutral-800">
              ألوان المنتج المحددة ({colors.length})
            </span>
          </div>

          {!isPickerExpanded && (
            <button
              type="button"
              onClick={() => {
                setEditingIndex(null);
                setIsPickerExpanded(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة / تخصيص لون</span>
            </button>
          )}
        </div>

        {/* Selected Colors Cards */}
        {colors.length === 0 ? (
          <div className="p-4 border border-dashed border-neutral-300 bg-neutral-50 text-center space-y-2">
            <p className="text-xs text-neutral-500">لم يتم إضافة ألوان للمنتج بعد.</p>
            <button
              type="button"
              onClick={() => setIsPickerExpanded(true)}
              className="text-xs font-bold text-black underline underline-offset-4 cursor-pointer"
            >
              افتح أداة اختيار الألوان الاحترافية (Color Picker)
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {colors.map((col, idx) => {
              const colRgb = hexToRgb(col.hex);
              const colIsLight = getLuminance(colRgb.r, colRgb.g, colRgb.b) > 160;

              return (
                <div
                  key={`${col.hex}-${idx}`}
                  className="flex items-center justify-between p-2.5 bg-white border border-neutral-200 hover:border-neutral-400 transition-all shadow-xs group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Swatch Circle */}
                    <div
                      className={`w-7 h-7 rounded-full shadow-inner shrink-0 border ${
                        colIsLight ? 'border-neutral-300' : 'border-black/20'
                      }`}
                      style={{ backgroundColor: col.hex }}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-neutral-900 truncate" title={col.name}>
                        {col.name}
                      </div>
                      <div className="text-[11px] font-mono text-neutral-500 font-brand">
                        {col.hex.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(idx)}
                      className="p-1.5 text-neutral-500 hover:text-black hover:bg-neutral-100 rounded-sm transition-colors cursor-pointer"
                      title="تعديل اللون"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteColor(idx)}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-sm transition-colors cursor-pointer"
                      title="حذف اللون"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= EXPANDABLE PROFESSIONAL COLOR PICKER ================= */}
      {isPickerExpanded && (
        <div className="bg-neutral-50 border-2 border-neutral-900 p-4 sm:p-5 space-y-5 animate-fadeIn">
          
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
            <div className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded-full border border-black/20"
                style={{ backgroundColor: currentHex }}
              />
              <h4 className="text-xs sm:text-sm font-bold text-black">
                {editingIndex !== null ? 'تعديل درجة وتفاصيل اللون' : 'أداة اختيار وتخصيص الألوان الحرة'}
              </h4>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsPickerExpanded(false);
                setEditingIndex(null);
              }}
              className="text-xs text-neutral-500 hover:text-black font-bold cursor-pointer"
            >
              إلغاء
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Visual 2D Canvas & Sliders (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* 2D Saturation / Value Box */}
              <div className="relative">
                <div
                  ref={svBoxRef}
                  onMouseDown={(e) => {
                    setIsDraggingSv(true);
                    handleSvPointerMove(e.nativeEvent);
                  }}
                  onTouchStart={(e) => {
                    setIsDraggingSv(true);
                    handleSvPointerMove(e.nativeEvent);
                  }}
                  className="w-full h-44 sm:h-52 cursor-crosshair relative select-none rounded-xs overflow-hidden border border-neutral-300 shadow-inner"
                  style={{
                    backgroundColor: `hsl(${currentHsv.h}, 100%, 50%)`,
                    backgroundImage: `
                      linear-gradient(to right, #FFFFFF 0%, transparent 100%),
                      linear-gradient(to top, #000000 0%, transparent 100%)
                    `,
                  }}
                >
                  {/* Draggable Indicator Point */}
                  <div
                    className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md pointer-events-none -translate-x-1/2 -translate-y-1/2 ring-1 ring-black/40"
                    style={{
                      left: `${currentHsv.s}%`,
                      top: `${100 - currentHsv.v}%`,
                      backgroundColor: currentHex,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-neutral-400 mt-1 font-medium">
                  <span>اسحب لاختيار درجة السطوع والتشبع بدقة</span>
                  <span>Lightness & Saturation Spectrum</span>
                </div>
              </div>

              {/* Hue Rainbow Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-neutral-700">
                  <span>درجة اللون (Hue 0° - 360°)</span>
                  <span className="font-mono text-neutral-500">{currentHsv.h}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={currentHsv.h}
                  onChange={(e) => applyHsv(Number(e.target.value), currentHsv.s, currentHsv.v, true)}
                  className="w-full h-4 rounded-xs appearance-none cursor-pointer border border-neutral-300"
                  style={{
                    background:
                      'linear-gradient(to right, #FF0000 0%, #FFFF00 17%, #00FF00 33%, #00FFFF 50%, #0000FF 67%, #FF00FF 83%, #FF0000 100%)',
                  }}
                />
              </div>

              {/* Brightness/Value Fine Tuner */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-neutral-700">
                  <span>نسبة السطوع والعمق (Brightness)</span>
                  <span className="font-mono text-neutral-500">{currentHsv.v}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={currentHsv.v}
                  onChange={(e) => applyHsv(currentHsv.h, currentHsv.s, Number(e.target.value), true)}
                  className="w-full h-3 rounded-xs appearance-none cursor-pointer bg-neutral-200 border border-neutral-300 accent-black"
                />
              </div>

            </div>

            {/* Values Inputs & Presets (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Live Preview Card & Eyedropper */}
              <div className="bg-white p-3.5 border border-neutral-200 space-y-3 shadow-xs">
                
                <div className="flex items-center gap-3">
                  {/* Large Swatch */}
                  <div
                    className={`w-16 h-16 rounded-xs shrink-0 shadow-md border flex items-center justify-center ${
                      isLight ? 'border-neutral-300 text-black' : 'border-black/20 text-white'
                    }`}
                    style={{ backgroundColor: currentHex }}
                  >
                    <span className="text-[10px] font-mono font-bold">{currentHex}</span>
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-neutral-500">اسم اللون المقترح</span>
                      <button
                        type="button"
                        onClick={() => {
                          const detected = detectColorName(currentHex);
                          setColorName(detected.ar);
                        }}
                        className="text-[10px] text-neutral-500 hover:text-black flex items-center gap-1 underline"
                        title="إعادة التسمية التلقائية"
                      >
                        <RefreshCw className="w-2.5 h-2.5" />
                        <span>تسمية ذكية</span>
                      </button>
                    </div>

                    <input
                      type="text"
                      value={colorName}
                      onChange={(e) => setColorName(e.target.value)}
                      placeholder="اسم اللون بالعربية أو الإنجليزية"
                      className="w-full border border-neutral-300 px-2.5 py-1.5 text-xs font-bold text-black focus:border-black focus:outline-none"
                    />
                  </div>
                </div>

                {/* Eyedropper and Native Picker fallback */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleEyeDropper}
                    className="flex-1 py-1.5 px-2 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-800 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Pipette className="w-3.5 h-3.5" />
                    <span>التقاط لون (EyeDropper)</span>
                  </button>

                  <input
                    id="native-color-picker-fallback"
                    type="color"
                    value={currentHex}
                    onChange={(e) => applyHex(e.target.value, true)}
                    className="w-8 h-8 p-0 border border-neutral-300 cursor-pointer bg-white"
                    title="المنتقي الكلاسيكي"
                  />
                </div>
              </div>

              {/* Exact Values: HEX & RGB */}
              <div className="bg-white p-3.5 border border-neutral-200 space-y-3 shadow-xs">
                
                {/* HEX Input */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-neutral-600">كود اللون (HEX)</label>
                  <div className="flex items-center border border-neutral-300 focus-within:border-black bg-white">
                    <span className="px-2.5 text-xs font-mono font-bold text-neutral-400 border-l border-neutral-200">#</span>
                    <input
                      type="text"
                      maxLength={7}
                      value={hexInput.replace('#', '')}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6);
                        setHexInput(`#${val}`);
                        if (val.length === 6 || val.length === 3) {
                          applyHex(`#${val}`, true);
                        }
                      }}
                      className="w-full px-2.5 py-1.5 text-xs font-mono font-bold text-black uppercase focus:outline-none"
                      placeholder="111111"
                    />
                  </div>
                </div>

                {/* RGB Inputs */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-neutral-600">قيم الألوان (RGB)</label>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <span className="block text-[10px] font-mono font-bold text-neutral-500 mb-0.5">R (أحمر)</span>
                      <input
                        type="number"
                        min="0"
                        max="255"
                        value={rgbInput.r}
                        onChange={(e) => {
                          const r = Math.max(0, Math.min(255, Number(e.target.value) || 0));
                          const newHex = rgbToHex(r, rgbInput.g, rgbInput.b);
                          applyHex(newHex, true);
                        }}
                        className="w-full border border-neutral-300 py-1 text-center font-mono text-xs font-bold focus:border-black focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] font-mono font-bold text-neutral-500 mb-0.5">G (أخضر)</span>
                      <input
                        type="number"
                        min="0"
                        max="255"
                        value={rgbInput.g}
                        onChange={(e) => {
                          const g = Math.max(0, Math.min(255, Number(e.target.value) || 0));
                          const newHex = rgbToHex(rgbInput.r, g, rgbInput.b);
                          applyHex(newHex, true);
                        }}
                        className="w-full border border-neutral-300 py-1 text-center font-mono text-xs font-bold focus:border-black focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] font-mono font-bold text-neutral-500 mb-0.5">B (أزرق)</span>
                      <input
                        type="number"
                        min="0"
                        max="255"
                        value={rgbInput.b}
                        onChange={(e) => {
                          const b = Math.max(0, Math.min(255, Number(e.target.value) || 0));
                          const newHex = rgbToHex(rgbInput.r, rgbInput.g, b);
                          applyHex(newHex, true);
                        }}
                        className="w-full border border-neutral-300 py-1 text-center font-mono text-xs font-bold focus:border-black focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveColorToList}
                  className="flex-1 bg-black hover:bg-neutral-800 text-white py-2.5 px-4 text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingIndex !== null ? 'حفظ تعديل اللون' : 'إضافة اللون للمنتج'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsPickerExpanded(false);
                    setEditingIndex(null);
                  }}
                  className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800 py-2.5 px-3 text-xs font-bold transition-colors cursor-pointer"
                >
                  إغلاق
                </button>
              </div>

            </div>

          </div>

          {/* Curated Sportswear Palette Shortcuts */}
          <div className="pt-3 border-t border-neutral-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-neutral-600 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>ألوان رياضية وستريتوير كلاسيكية ملهمة (1-Click Presets):</span>
              </span>
              <span className="text-[10px] text-neutral-400">انقر لتحديد اللون وتعديل درجته</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {SPORTSWEAR_PRESETS.map((preset) => {
                const isCurrent = currentHex.toUpperCase() === preset.hex.toUpperCase();
                return (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => {
                      applyHex(preset.hex, false);
                      setColorName(preset.name.split(' (')[0]);
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 border text-[11px] font-medium transition-all cursor-pointer ${
                      isCurrent
                        ? 'border-black bg-white shadow-xs font-bold ring-1 ring-black'
                        : 'border-neutral-200 bg-white hover:border-neutral-400'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                      style={{ backgroundColor: preset.hex }}
                    />
                    <span className="truncate max-w-[120px]">{preset.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
