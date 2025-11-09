"use client";

import { useRef, useState, useCallback } from "react";
import { Swiper, SwiperSlide, SwiperClass } from "swiper/react";
import { Mousewheel, Keyboard } from "swiper/modules";
import ComicSlide from "@/components/comic-slide";
import { mockComics } from "@/lib/mock-data";
import AnimatedInfoButton from "@/components/AnimatedInfoButton";
import { AnimatePresence, motion } from "framer-motion";

interface SwiperRef {
  swiper: SwiperClass;
}

export default function Home() {
  const swiperRef = useRef<SwiperRef | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInfoButtonVisible, setIsInfoButtonVisible] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  /* --------------------------------------------------------------
     Hide the button while a transition is happening – keeps the UI
     clean when the user flicks quickly.
  -------------------------------------------------------------- */
  const handleSlideChangeTransitionStart = useCallback(() => {
    setIsInfoButtonVisible(false);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
  }, []);

  const handleSlideChangeTransitionEnd = useCallback(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(
      () => setIsInfoButtonVisible(true),
      300
    );
  }, []);

  /* --------------------------------------------------------------
     The **real** logic – called on every frame while swiping.
     `swiper.progress` → 0 … 1 (overall progress)
     `slide.progress` → -1 (fully out) … 0 (fully in) … 1 (fully out)
  -------------------------------------------------------------- */
  const handleProgress = useCallback((swiper: SwiperClass) => {
    // Overall progress of the entire swiper (0 = first slide, 1 = last slide)
    const progress = swiper.progress; // 0 to 1

    // Calculate how far we are *between* the current and next slide
    // When progress = 0   → current slide fully visible
    // When progress = 0.5 → halfway to the next slide
    // When progress = 1   → next slide fully visible

    const shouldShow = progress >= 0.5; // Show when 50%+ toward the next slide

    setIsInfoButtonVisible(shouldShow);
  }, []);

  return (
    <main className="w-full h-screen overflow-hidden">
      <Swiper
        ref={swiperRef}
        direction="vertical"
        slidesPerView={1}
        mousewheel={true}
        keyboard={true}
        modules={[Mousewheel, Keyboard]}
        onSlideChange={(s) => setActiveIndex(s.activeIndex)}
        onSlideChangeTransitionStart={handleSlideChangeTransitionStart}
        onSlideChangeTransitionEnd={handleSlideChangeTransitionEnd}
        onProgress={handleProgress}
        className="w-full h-full"
      >
        {mockComics.map((comic) => (
          <SwiperSlide key={comic.id}>
            <ComicSlide
              comic={comic}
              isActive={mockComics.indexOf(comic) === activeIndex}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <AnimatePresence>
        {isInfoButtonVisible && (
          <motion.div
            key="animated-info-button"
            className="fixed bottom-16 right-6 z-20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <AnimatedInfoButton />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
