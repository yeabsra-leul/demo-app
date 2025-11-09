"use client"

import { useRef, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Mousewheel, Keyboard } from "swiper/modules"
import ComicSlide from "@/components/comic-slide"
import { mockComics } from "@/lib/mock-data"

export default function Home() {
  const swiperRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <main className="w-full h-screen overflow-hidden">
      <Swiper
        ref={swiperRef}
        direction="vertical"
        slidesPerView={1}
        mousewheel={true}
        keyboard={true}
        modules={[Mousewheel, Keyboard]}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        className="w-full h-full"
      >
        {mockComics.map((comic) => (
          <SwiperSlide key={comic.id}>
            <ComicSlide comic={comic} isActive={mockComics.indexOf(comic) === activeIndex} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 z-20">
        {mockComics.map((_, index) => (
          <button
            key={index}
            onClick={() => swiperRef.current?.swiper?.slideTo(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === activeIndex ? "bg-primary w-3 h-3" : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </main>
  )
}
