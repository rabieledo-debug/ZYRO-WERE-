import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { StoreSettings } from '../types';
import { isVideoMedia } from '../lib/db';

interface HeroBannerProps {
  onShopNow: () => void;
  onExploreSale: () => void;
  settings?: StoreSettings;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onShopNow, onExploreSale, settings }) => {
  const [isMuted, setIsMuted] = useState(true);

  // If settings prop is provided, we check if user provided content or left it empty.
  const hasSettings = settings !== undefined;

  const badge = hasSettings
    ? (settings.heroBadge || '').trim()
    : 'ZYRO SUMMER COLLECTION 2026';

  const title = hasSettings
    ? (settings.heroTitle || '').trim()
    : 'NEW STREETWEAR COLLECTION';

  const subtitle = hasSettings
    ? (settings.heroSubtitle || '').trim()
    : 'Discover the latest urban streetwear essentials crafted from 100% premium Egyptian heavyweight cotton with clean minimalist aesthetics.';

  const ctaText =
    settings?.heroCtaText && !/[\u0600-\u06FF]/.test(settings.heroCtaText)
      ? settings.heroCtaText
      : 'SHOP COLLECTION NOW';

  // Support either heroVideoUrl (if type is video) or heroImage (which can hold image or video URL/base64)
  const mediaSrc = (
    settings?.heroMediaType === 'video' && settings?.heroVideoUrl
      ? settings.heroVideoUrl
      : settings?.heroImage || settings?.heroVideoUrl || ''
  ).trim();

  const isVideo = isVideoMedia(mediaSrc, settings?.heroMediaType);

  const objectPositionClass =
    settings?.heroMediaPosition === 'top'
      ? 'object-top'
      : settings?.heroMediaPosition === 'bottom'
      ? 'object-bottom'
      : 'object-center';

  const hasAnyText = Boolean(badge || title || subtitle);

  return (
    <section
      className="relative w-full min-h-[85vh] sm:min-h-[88vh] md:min-h-[92vh] lg:min-h-[calc(100vh-64px)] flex flex-col justify-end bg-neutral-950 text-white overflow-hidden font-brand select-none"
      dir="ltr"
    >
      {/* Background Graphic, Image or Video */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
        {mediaSrc ? (
          isVideo ? (
            <video
              key={mediaSrc}
              src={mediaSrc}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              disablePictureInPicture
              disableRemotePlayback
              preload="auto"
              className={`w-full h-full object-cover ${objectPositionClass} scale-100 pointer-events-none`}
            />
          ) : (
            <img
              key={mediaSrc}
              src={mediaSrc}
              alt="ZYRO Streetwear Visual"
              className={`w-full h-full object-cover ${objectPositionClass} scale-100 transform transition-transform duration-1000 ease-out pointer-events-none`}
              loading="eager"
              decoding="async"
            />
          )
        ) : (
          <div className="w-full h-full bg-radial from-neutral-900 via-neutral-950 to-black flex items-center justify-center pointer-events-none">
            {/* Minimalist Watermark Texture */}
            <div className="text-[18vw] font-black tracking-tighter text-white/[0.03] select-none uppercase pointer-events-none">
              ZYRO
            </div>
          </div>
        )}

        {/* Calibrated Dark Gradient & Ambient Scrim: Ensures maximum video/image vibrancy + crisp text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/25 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/60 pointer-events-none" />

        {/* Sound toggle button for video */}
        {isVideo && mediaSrc && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMuted((prev) => !prev);
            }}
            className="absolute bottom-4 right-4 z-20 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white border border-white/20 p-2.5 rounded-full cursor-pointer transition-transform hover:scale-105 active:scale-95 shadow-lg"
            title={isMuted ? 'Unmute Video' : 'Mute Video'}
            aria-label={isMuted ? 'Unmute Video' : 'Mute Video'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-white/80" /> : <Volume2 className="w-4 h-4 text-white" />}
          </button>
        )}
      </div>

      {/* Hero Content Overlay (Positioned toward the lower part of the Hero image) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 sm:pb-12 md:pb-14 flex flex-col items-center text-center">
        
        {/* Top Tag / Badge - Optional */}
        {badge ? (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-none bg-black/40 backdrop-blur-md border border-white/25 text-[11px] sm:text-xs tracking-[0.25em] uppercase font-semibold mb-4 sm:mb-5 shadow-sm text-white/95 animate-fadeIn">
            <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
            <span>{badge}</span>
          </div>
        ) : null}

        {/* Main Heading - Optional */}
        {title ? (
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight uppercase max-w-5xl leading-[1.08] text-white drop-shadow-md animate-fadeIn">
            {title}
          </h1>
        ) : null}

        {/* Description - Optional */}
        {subtitle ? (
          <p
            className={`${
              title ? 'mt-3 sm:mt-5' : ''
            } text-xs sm:text-base md:text-lg text-neutral-200/95 max-w-2xl font-normal leading-relaxed drop-shadow-sm px-2 animate-fadeIn`}
          >
            {subtitle}
          </p>
        ) : null}

        {/* CTA Buttons */}
        <div className={`${hasAnyText ? 'mt-6 sm:mt-8' : 'mt-2'} flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto max-w-md sm:max-w-none`}>
          <button
            onClick={onShopNow}
            className="bg-white text-black hover:bg-neutral-200 font-black px-8 sm:px-10 py-3.5 sm:py-4 text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 cursor-pointer active:translate-y-0"
          >
            <span>{ctaText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onExploreSale}
            className="bg-black/40 hover:bg-white/15 text-white border border-white/40 hover:border-white font-bold px-8 sm:px-10 py-3.5 sm:py-4 text-xs sm:text-sm tracking-wider uppercase backdrop-blur-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:translate-y-0"
          >
            <span>EXPLORE SPECIAL DROPS 🔥</span>
          </button>
        </div>

        {/* Feature Guarantees Strip: Positioned directly over the visual section at the bottom */}
        <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full max-w-4xl text-neutral-300 text-[11px] sm:text-xs">
          <div className="flex items-center justify-center gap-2">
            <Truck className="w-4 h-4 text-white shrink-0" />
            <span className="font-medium">Fast Nationwide Delivery</span>
          </div>

          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-white shrink-0" />
            <span className="font-medium">100% Egyptian Cotton</span>
          </div>

          <div className="flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4 text-white shrink-0" />
            <span className="font-medium">Inspect Before Delivery</span>
          </div>

          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-white shrink-0" />
            <span className="font-medium">14-Day Easy Returns</span>
          </div>
        </div>

      </div>
    </section>
  );
};
