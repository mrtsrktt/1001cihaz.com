import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

export interface HeroSlide {
  id: string;
  tag: string;
  title: string;
  description: string;
  buttonText: string;
  url: string;
  shortNote?: string;
  bgWebp: string;
  bgPng: string;
  primaryImage: string;
  secondaryImage?: string;
  imageAlt: string;
  navLabel: string;
  navGradient: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'deltasmart',
    tag: 'BACA GAZI ANALİZİ',
    title: 'Yanmayı ölçün.\nVerimliliği değerlendirin.',
    description: 'DELTAsmart ile O₂, CO, sıcaklık ve basınç ölçümlerini tek cihazda inceleyin.',
    buttonText: 'DELTAsmart’ı incele',
    url: '/urun/690109-mru-deltasmart-set-ll',
    bgWebp: '/images/hero/hero-deltasmart.webp',
    bgPng: '/images/hero/hero-deltasmart.png',
    primaryImage: '/images/products/690109-deltasmart-set.png',
    imageAlt: 'MRU DELTAsmart SET LL Baca Gazı Analiz Cihazı',
    navLabel: 'DELTAsmart',
    navGradient: 'linear-gradient(135deg, #F2F5F5 0%, #E7EEEE 100%)',
  },
  {
    id: 'optima',
    tag: 'PROFESYONEL ANALİZ SETİ',
    title: 'Kapsamlı analiz.\nSahada net sonuçlar.',
    description: 'Geniş ekranı ve CO sensör koruma sistemiyle OPTIMA COA’yı keşfedin.',
    buttonText: 'OPTIMA COA’yı incele',
    url: '/urun/420145-mru-optima-coa-set',
    bgWebp: '/images/hero/hero-optima.webp',
    bgPng: '/images/hero/hero-optima.png',
    primaryImage: '/images/products/420145-optima-coa-cutout.png',
    imageAlt: 'MRU OPTIMA COA Profesyonel Baca Gazı Analiz Cihazı',
    navLabel: 'OPTIMA COA',
    navGradient: 'linear-gradient(135deg, #F6F1F2 0%, #EDE5E7 100%)',
  },
  {
    id: '400gd',
    tag: 'MODÜLER GAZ KAÇAK TESPİTİ',
    title: 'Cihazınızı seçin.\nÖlçümünüzü genişletin.',
    description: '400GD ve pompalı 500GD’yi ihtiyacınıza uygun değiştirilebilir sensörlerle tamamlayın.',
    buttonText: 'Cihazları keşfet',
    url: '/kategori/gaz-kacak-dedektorleri',
    shortNote: 'Sensörler ayrıca seçilir.',
    bgWebp: '/images/hero/hero-400gd.webp',
    bgPng: '/images/hero/hero-400gd.png',
    primaryImage: '/images/products/681000-400gd.png',
    secondaryImage: '/images/products/682000-500gd.png',
    imageAlt: 'MRU 400GD ve 500GD Gaz Kaçak Dedektörleri',
    navLabel: '400GD ve 500GD',
    navGradient: 'linear-gradient(135deg, #F0F4F3 0%, #E3EBE8 100%)',
  },
  {
    id: 'dm9600',
    tag: 'HASSAS BASINÇ ÖLÇÜMÜ',
    title: 'Doğru aralık.\nHassas basınç ölçümü.',
    description: 'Basınç, fark basıncı ve sıcaklık ölçümü için DM9600 modellerini karşılaştırın.',
    buttonText: 'DM9600 modellerini incele',
    url: '/kategori/dijital-manometreler',
    bgWebp: '/images/hero/hero-dm9600.webp',
    bgPng: '/images/hero/hero-dm9600.png',
    primaryImage: '/images/products/dm9600-series.png',
    imageAlt: 'MRU DM9600 Dijital Manometre Serisi',
    navLabel: 'DM9600',
    navGradient: 'linear-gradient(135deg, #F0F3F6 0%, #E4EAF0 100%)',
  },
];

interface HeroShowcaseProps {
  onQuickViewByCode?: (code: string) => void;
  onFilterCategory?: (category: string) => void;
  onNavigate?: (url: string) => void;
}

const SLIDE_DURATION_MS = 5000;
const TICK_INTERVAL_MS = 50;

export const HeroShowcase: React.FC<HeroShowcaseProps> = ({
  onNavigate,
}) => {
  const { navigate: contextNavigate } = useNavigation();
  const navigate = onNavigate || contextNavigate;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isUserPaused, setIsUserPaused] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [isIntersecting, setIsIntersecting] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);

  const heroRef = useRef<HTMLDivElement>(null);
  const progressTimerRef = useRef<number | null>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, []);

  // Track page visibility
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabVisible(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Track viewport intersection (pause when hero is off-screen)
  useEffect(() => {
    const el = heroRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting && entry.intersectionRatio > 0.2);
      },
      { threshold: [0, 0.2, 0.5] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Preload upcoming images in background
  useEffect(() => {
    HERO_SLIDES.forEach((slide) => {
      const img = new Image();
      img.src = slide.bgWebp;
      const prodImg = new Image();
      prodImg.src = slide.primaryImage;
    });
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    setProgressPercent(0);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    setProgressPercent(0);
  }, []);

  const handleTabClick = (index: number) => {
    if (index === currentIndex) return;
    setCurrentIndex(index);
    setProgressPercent(0);
  };

  const toggleUserPlayPause = () => {
    setIsUserPaused((prev) => !prev);
  };

  // Determine if auto-advance is currently active
  const isAutoPlaying =
    !isUserPaused &&
    !isHovered &&
    !isFocused &&
    isTabVisible &&
    isIntersecting &&
    !isReducedMotion;

  // 5000ms Auto-advance progress timer
  useEffect(() => {
    if (!isAutoPlaying) {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
      return;
    }

    const step = (TICK_INTERVAL_MS / SLIDE_DURATION_MS) * 100;

    progressTimerRef.current = window.setInterval(() => {
      setProgressPercent((prev) => {
        if (prev + step >= 100) {
          handleNext();
          return 0;
        }
        return prev + step;
      });
    }, TICK_INTERVAL_MS);

    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
    };
  }, [isAutoPlaying, handleNext]);

  // Handle CTA navigation
  const handleCtaClick = (e: React.MouseEvent, url: string) => {
    if (!e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && e.button === 0) {
      e.preventDefault();
      navigate(url);
    }
  };

  return (
    <section
      ref={heroRef}
      className="pt-6"
      aria-label="Öne Çıkan MRU Ölçüm Çözümleri"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => {
        // Only set focus false if focus actually left the hero container
        if (!heroRef.current?.contains(e.relatedTarget as Node)) {
          setIsFocused(false);
        }
      }}
    >
      <div className="max-w-[1440px] mx-auto px-8 min-[1440px]:px-[80px]">
        {/* 1280px Content Width Standard */}
        <div className="w-full max-w-[1280px] mx-auto">
          
          {/* Main Slide Stage: 480px height, 12px rounded corners, overflow hidden */}
          <div
            className="relative w-full h-[480px] rounded-[12px] overflow-hidden bg-[#122129] shadow-md border border-[#1F333F]/80 group"
            role="region"
            aria-roledescription="carousel"
            aria-label="MRU Çözüm Vitrini"
          >
            {/* Horizontal Track Container: 550ms ease cubic-bezier(0.22,1,0.36,1) */}
            <div
              data-hero-track="true"
              data-current-index={currentIndex}
              className="flex w-full h-full transition-transform motion-reduce:transition-none"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
                transitionDuration: isReducedMotion ? '0ms' : '550ms',
                transitionTimingFunction: isReducedMotion ? 'linear' : 'cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              {HERO_SLIDES.map((slide, index) => {
                const isActive = index === currentIndex;

                return (
                  <div
                    key={slide.id}
                    id={`hero-slide-${index}`}
                    role="tabpanel"
                    aria-roledescription="slide"
                    aria-label={`Slayt ${index + 1} / ${HERO_SLIDES.length}: ${slide.navLabel}`}
                    aria-hidden={!isActive}
                    className="w-full h-full flex-shrink-0 relative overflow-hidden flex items-center justify-between"
                  >
                    {/* Background Layer: WebP with PNG fallback */}
                    <picture className="absolute inset-0 w-full h-full pointer-events-none z-0">
                      <source srcSet={slide.bgWebp} type="image/webp" />
                      <img
                        src={slide.bgPng}
                        alt=""
                        className="w-full h-full object-cover object-center"
                        loading={index === 0 ? 'eager' : 'lazy'}
                        fetchPriority={index === 0 ? 'high' : 'auto'}
                      />
                    </picture>

                    {/* Gradient Overlay for Text Legibility on Left Negative Space */}
                    <div
                      className="absolute inset-y-0 left-0 w-[58%] pointer-events-none z-1 bg-gradient-to-r from-[#122129] via-[#122129]/80 to-transparent"
                      aria-hidden="true"
                    />

                    {/* Left Column: ~530px Quiet Text Area, 56px Padding on 1440px */}
                    <div className="relative z-10 w-full max-w-[530px] p-8 min-[1440px]:p-14 flex flex-col justify-center h-full">
                      <span className="text-[12px] font-[700] text-white/70 tracking-[1.6px] uppercase block">
                        {slide.tag}
                      </span>

                      <h1 className="text-[44px] leading-[50px] min-[1440px]:text-[48px] min-[1440px]:leading-[54px] font-[700] text-white tracking-tight mt-3 whitespace-pre-line">
                        {slide.title}
                      </h1>

                      <p className="text-[16px] leading-[26px] text-white/85 mt-4 max-w-[460px] line-clamp-3">
                        {slide.description}
                      </p>

                      {/* CTA Action Area */}
                      <div className="mt-8 flex flex-col items-start">
                        <a
                          href={slide.url}
                          onClick={(e) => handleCtaClick(e, slide.url)}
                          tabIndex={isActive ? 0 : -1}
                          className="group/cta bg-[#C82B35] hover:bg-[#B3232C] text-white rounded-[6px] h-[48px] px-6 text-[15px] font-[600] inline-flex items-center gap-2.5 transition-all duration-[180ms] ease-out hover:-translate-y-[2px] hover:shadow-[0_4px_16px_rgba(200,43,53,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transform-none motion-reduce:transition-none"
                        >
                          <span>{slide.buttonText}</span>
                          <ArrowRight className="w-4 h-4 transition-transform duration-[180ms] ease-out group-hover/cta:translate-x-[3px] motion-reduce:transform-none" />
                        </a>

                        {slide.shortNote && (
                          <span className="text-[12px] text-white/70 font-medium mt-2.5 block">
                            {slide.shortNote}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right Column: Real MRU Product Visual, Visible Height 340-380px */}
                    <div className="relative z-10 w-[45%] h-full flex items-center justify-center p-6 pr-10 min-[1440px]:pr-14">
                      {slide.secondaryImage ? (
                        /* 400GD & 500GD: 400GD main focus, 500GD smaller secondary device */
                        <div className="relative h-full w-full flex items-center justify-center">
                          <img
                            src={slide.secondaryImage}
                            alt="MRU 500GD"
                            className="max-h-[280px] max-w-[48%] object-contain drop-shadow-xl translate-x-4 opacity-95 transition-transform duration-[450ms] ease-out hover:scale-[1.02] motion-reduce:transform-none"
                            loading="lazy"
                          />
                          <img
                            src={slide.primaryImage}
                            alt="MRU 400GD"
                            className="max-h-[360px] max-w-[58%] object-contain drop-shadow-2xl z-10 transition-transform duration-[450ms] ease-out hover:scale-[1.02] motion-reduce:transform-none cursor-pointer"
                            onClick={(e) => handleCtaClick(e, slide.url)}
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        /* Single Device (DELTAsmart, OPTIMA COA, DM9600) */
                        <div className="relative h-full w-full flex items-center justify-center">
                          <img
                            src={slide.primaryImage}
                            alt={slide.imageAlt}
                            className="max-h-[340px] min-[1440px]:max-h-[380px] max-w-full object-contain drop-shadow-2xl transition-transform duration-[450ms] ease-out hover:scale-[1.02] motion-reduce:transform-none cursor-pointer"
                            onClick={(e) => handleCtaClick(e, slide.url)}
                            loading={index === 0 ? 'eager' : 'lazy'}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Previous Arrow Button */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Önceki slayt"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#122129]/60 hover:bg-[#122129] text-white/80 hover:text-white border border-white/10 hover:border-white/30 flex items-center justify-center transition-colors duration-[180ms] backdrop-blur-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Next Arrow Button */}
            <button
              type="button"
              onClick={handleNext}
              aria-label="Sonraki slayt"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#122129]/60 hover:bg-[#122129] text-white/80 hover:text-white border border-white/10 hover:border-white/30 flex items-center justify-center transition-colors duration-[180ms] backdrop-blur-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Play/Pause Control Button (Visible, Accessible) */}
            <button
              type="button"
              data-pause-toggle="true"
              onClick={toggleUserPlayPause}
              aria-label={isUserPaused ? 'Otomatik geçişi oynat' : 'Otomatik geçişi duraklat'}
              className="absolute bottom-4 right-4 z-20 px-3 py-1.5 rounded-[6px] bg-[#122129]/75 hover:bg-[#122129] text-white/80 hover:text-white border border-white/15 hover:border-white/30 text-[12px] font-[600] flex items-center gap-1.5 transition-colors duration-[180ms] backdrop-blur-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {isUserPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 text-white fill-white" />
                  <span>Oynat</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 text-white" />
                  <span>Duraklat</span>
                </>
              )}
            </button>
          </div>

          {/* Scoped CSS for card hover lift, shadow elevation, and image zoom */}
          <style>{`
            .hero-slide-nav-card {
              transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1),
                          box-shadow 240ms cubic-bezier(0.22, 1, 0.36, 1),
                          border-color 240ms cubic-bezier(0.22, 1, 0.36, 1);
            }
            .hero-slide-nav-card:hover {
              transform: translateY(-3px);
            }
            .hero-slide-nav-card:not([data-active="true"]):hover {
              box-shadow: 0 10px 24px rgba(18, 33, 41, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.90) !important;
              border-color: rgba(18, 33, 41, 0.18) !important;
            }
            .hero-slide-nav-card[data-active="true"]:hover {
              box-shadow: 0 10px 24px rgba(18, 33, 41, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.22) !important;
              border-color: rgba(255, 255, 255, 0.26) !important;
            }
            .hero-slide-nav-card .hero-slide-nav-img {
              transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
            }
            .hero-slide-nav-card:hover .hero-slide-nav-img {
              transform: scale(1.05) translateY(-2px);
            }
            @media (prefers-reduced-motion: reduce) {
              .hero-slide-nav-card,
              .hero-slide-nav-card:hover,
              .hero-slide-nav-card .hero-slide-nav-img,
              .hero-slide-nav-card:hover .hero-slide-nav-img {
                transform: none !important;
                transition: none !important;
              }
            }
          `}</style>

          {/* Underneath Hero: Four Equal Premium Product Navigation Cards */}
          <div
            className="grid grid-cols-4 gap-[12px] mt-4"
            role="tablist"
            aria-label="Vitrin Ürün Gezinme Düğmeleri"
          >
            {HERO_SLIDES.map((slide, index) => {
              const isActive = index === currentIndex;

              return (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  id={`hero-tab-${index}`}
                  aria-selected={isActive}
                  aria-current={isActive ? 'true' : undefined}
                  aria-controls={`hero-slide-${index}`}
                  tabIndex={0}
                  onClick={() => handleTabClick(index)}
                  data-active={isActive ? 'true' : 'false'}
                  data-slide-id={slide.id}
                  className={`hero-slide-nav-card group relative text-left h-[96px] p-[16px] rounded-[10px] flex items-center justify-between overflow-hidden cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                    isActive
                      ? 'focus-visible:ring-white focus-visible:ring-offset-[#122129]'
                      : 'focus-visible:ring-[#16242B] focus-visible:ring-offset-white'
                  }`}
                  style={{
                    background: isActive
                      ? 'linear-gradient(135deg, #16242B 0%, #223943 100%)'
                      : slide.navGradient,
                    border: isActive
                      ? '1px solid rgba(255, 255, 255, 0.14)'
                      : '1px solid rgba(18, 33, 41, 0.10)',
                    boxShadow: isActive
                      ? '0 3px 10px rgba(18, 33, 41, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                      : '0 3px 10px rgba(18, 33, 41, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.80)',
                  }}
                >
                  {/* Left Column: Model name (15px/700), vertically centered without sequence number */}
                  <div className="flex-1 min-w-0 pr-2 flex items-center">
                    <span
                      className={`text-[15px] font-[700] leading-normal tracking-tight truncate transition-colors duration-200 ${
                        isActive ? 'text-white' : 'text-[#16242B]'
                      }`}
                    >
                      {slide.navLabel}
                    </span>
                  </div>

                  {/* Right Column: Layered Product Visual Area (85px, 100px for dual) */}
                  <div
                    className={`relative h-full flex-shrink-0 flex items-center justify-center ${
                      slide.id === '400gd' ? 'w-[100px]' : 'w-[85px]'
                    }`}
                  >
                    {/* Soft radial light behind product visual */}
                    <div
                      className="absolute inset-0 m-auto w-[64px] h-[64px] rounded-full pointer-events-none transition-opacity duration-300"
                      style={{
                        background: isActive
                          ? 'radial-gradient(circle, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 70%)'
                          : 'radial-gradient(circle, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0) 70%)',
                      }}
                      aria-hidden="true"
                    />

                    {/* Low opacity elliptic shadow below product */}
                    <div
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 pointer-events-none transition-opacity duration-300"
                      style={{
                        width: slide.id === '400gd' ? '76px' : '52px',
                        height: '6px',
                        borderRadius: '50%',
                        background: isActive
                          ? 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.40) 0%, rgba(0, 0, 0, 0) 72%)'
                          : 'radial-gradient(ellipse at center, rgba(18, 33, 41, 0.16) 0%, rgba(18, 33, 41, 0) 72%)',
                      }}
                      aria-hidden="true"
                    />

                    {/* Product Visual Group: scale(1.05) & translateY(-2px) on hover */}
                    {slide.secondaryImage ? (
                      /* 400GD and 500GD dual visual */
                      <div className="hero-slide-nav-img relative z-10 w-full h-[70px] flex items-center justify-center gap-1">
                        <img
                          src={slide.secondaryImage}
                          alt=""
                          className="max-h-[62px] max-w-[46%] object-contain pointer-events-none drop-shadow-xs"
                          loading="lazy"
                        />
                        <img
                          src={slide.primaryImage}
                          alt=""
                          className="max-h-[70px] max-w-[50%] object-contain pointer-events-none drop-shadow-xs -ml-1"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      /* Single product visual (DELTAsmart, OPTIMA COA, DM9600) */
                      <div className="hero-slide-nav-img relative z-10 w-full h-[70px] flex items-center justify-center">
                        <img
                          src={slide.primaryImage}
                          alt=""
                          className="max-h-[70px] max-w-full object-contain pointer-events-none drop-shadow-xs"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>

                  {/* Active 5-Second Red Progress Line at Card Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-black/5 overflow-hidden rounded-b-[10px]">
                    {isActive && (
                      <div
                        data-slide-progress={index}
                        className="h-full bg-[#C82B35]"
                        style={{
                          width: `${progressPercent}%`,
                          transition: isReducedMotion ? 'none' : 'width 50ms linear',
                        }}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};
