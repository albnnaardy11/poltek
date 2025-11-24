"use client";

import { useEffect, useRef, useState } from "react";
import Carousel from "./Carousel";

type Props = {
  videoUrl?: string;
  images?: string[];
};

export default function HeroMedia({ videoUrl, images }: Props) {
  const [showCarousel, setShowCarousel] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastTimeRef = useRef(0);
  const timeoutRef = useRef<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const placeholderVideo =
    videoUrl ||
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

  const carouselImages =
    images && images.length > 0
      ? images
      : [
          "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1503264116251-35a269479413?w=1600&q=80&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80&auto=format&fit=crop",
        ];

  function transitionToCarousel(animate = true) {
    if (animate) {
      setIsTransitioning(true);
      try {
        videoRef.current?.pause();
      } catch {}

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      window.setTimeout(() => {
        setShowCarousel(true);
        setIsTransitioning(false);
      }, 500);
    } else {
      setShowCarousel(true);
    }
  }

  useEffect(() => {
    timeoutRef.current = window.setTimeout(
      () => transitionToCarousel(true),
      60_000
    );

    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const onEnded = () => transitionToCarousel(true);
    const onTimeUpdate = () => (lastTimeRef.current = el.currentTime);
    const onSeeking = () => {
      try {
        el.currentTime = lastTimeRef.current;
      } catch {}
    };

    el.addEventListener("ended", onEnded);
    el.addEventListener("timeupdate", onTimeUpdate);
    el.addEventListener("seeking", onSeeking);

    return () => {
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("timeupdate", onTimeUpdate);
      el.removeEventListener("seeking", onSeeking);
    };
  }, []);

  return (
    <section className="w-full px-4 md:px-8 lg:px-20 py-10">
      <div
        className={`relative mx-auto max-w-7xl h-[540px] ${
          isTransitioning ? "opacity-60" : "opacity-100"
        } transition-opacity duration-500`}
      >
        <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-xl">

          {/* VIDEO */}
          {!showCarousel && (
            <div
              className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
                isTransitioning ? "opacity-0" : "opacity-100"
              }`}
            >
              <video
                ref={videoRef}
                src={placeholderVideo}
                autoPlay
                muted
                playsInline
                controls={false}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* CAROUSEL */}
          {showCarousel && (
            <div
              className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
                isTransitioning ? "opacity-0" : "opacity-100"
              }`}
            >
              <Carousel images={carouselImages} interval={4500} fullHeight />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
