"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type React from "react";
import "../hero.css";

export interface HeroSlide {
  id: number;
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  href?: string;
}

interface HeroSectionProps {
  slides: HeroSlide[];
  intervalMs?: number;
}

const DEFAULT_INTERVAL = 5000;

export default function HeroSection({ slides, intervalMs = DEFAULT_INTERVAL }: HeroSectionProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);
  const slideCount = slides.length;
  const slideWidth = slideCount > 0 ? 100 / slideCount : 0;

  const stopAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startAutoPlay = useCallback(() => {
    if (!slideCount) return;
    stopAutoPlay();
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slideCount);
    }, Math.min(Math.max(intervalMs, 4000), 6000));
  }, [intervalMs, slideCount, stopAutoPlay]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + slideCount) % slideCount);
    startAutoPlay();
  }, [slideCount, startAutoPlay]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % slideCount);
    startAutoPlay();
  }, [slideCount, startAutoPlay]);

  useEffect(() => {
    startAutoPlay();
    return () => {
      stopAutoPlay();
    };
  }, [startAutoPlay, stopAutoPlay]);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
    stopAutoPlay();
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) {
      startAutoPlay();
      return;
    }

    const deltaX = event.changedTouches[0]?.clientX - touchStartX.current;

    if (typeof deltaX === "number" && Math.abs(deltaX) > 45) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }

    touchStartX.current = null;
    startAutoPlay();
  };

  const handleIndicatorClick = (index: number) => {
    setActiveIndex(index);
    startAutoPlay();
  };

  return (
    <section className="hero" aria-label="شريط الشرائح الرئيسي">
      <div className="hero__shell">
        <div
          className="hero__viewport"
          onMouseEnter={stopAutoPlay}
          onMouseLeave={startAutoPlay}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="hero__track"
            style={{
              width: `${slideCount * 100}%`,
              transform: `translateX(-${activeIndex * slideWidth}%)`,
            }}
            aria-live="polite"
          >
            {slides.map((slide, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={slide.id}
                  className={`hero__item item ${isActive ? "is-active" : ""}`}
                  style={{ width: `${slideWidth}%` }}
                  aria-hidden={!isActive}
                >
                  <div className="hero__image-layer">
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      priority={index === 0}
                      sizes="100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="hero__veil" aria-hidden />
                  {slide.href ? (
                    <a className="hero__link" href={slide.href} aria-label={slide.alt} />
                  ) : null}
                  <div className="hero__meta">شريحة {index + 1}</div>
                  <div className="hero__content">
                    <div className="hero__panel">
                      <p className="hero__kicker">معاً لصناعة أثر مستدام</p>
                      <h1 className="hero__title">{slide.title}</h1>
                      {slide.subtitle ? <p className="hero__subtitle">{slide.subtitle}</p> : null}
                      <div className="hero__actions">
                        <a href="#contact" className="btn-primary px-7 py-3 text-base">
                          تبرع الآن
                          <ArrowRight className="h-4 w-4" />
                        </a>
                        {slide.href ? (
                          <a href={slide.href} className="btn-outline px-7 py-3 text-base">
                            تفاصيل الشريحة
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="hero__controls" aria-hidden="true">
            <button type="button" className="hero__arrow hero__arrow--prev" onClick={handlePrev}>
              <ChevronRight className="h-5 w-5" />
            </button>
            <button type="button" className="hero__arrow hero__arrow--next" onClick={handleNext}>
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>

          <div className="hero__indicators" role="tablist" aria-label="شرائح الصور">
            {slides.map((_, index) => (
              <button
                key={slides[index].id}
                type="button"
                className={`hero__indicator ${activeIndex === index ? "is-active" : ""}`}
                onClick={() => handleIndicatorClick(index)}
                aria-label={`الشريحة ${index + 1}`}
                aria-pressed={activeIndex === index}
              />
            ))}
          </div>

          <div className="hero__cta-bar" aria-hidden />
        </div>
      </div>
    </section>
  );
}
