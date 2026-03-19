import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slideshow from '../components/Slideshow';
import DecorWindow from '../components/DecorWindow';

import watermarkLeft from '../assets/watermark-left.png';
import watermarkRight from '../assets/watermark-right.png';
import watermarkBottom from '../assets/watermark-bottom.png';

export default function Home({ onSlideshowHeight }) {
  const weddingDate = new Date('2025-08-08T00:00:00');
  const [daysSince, setDaysSince] = useState(calculateDaysSince());

  function calculateDaysSince() {
    const now = new Date();
    const difference = +now - +weddingDate;

    if (difference <= 0) {
      return null;
    }

    const totalDays = Math.floor(difference / (1000 * 60 * 60 * 24));
    const years = Math.floor(totalDays / 365);
    const remainingAfterYears = totalDays - years * 365;
    const months = Math.floor(remainingAfterYears / 30);
    const days = remainingAfterYears - months * 30;

    return { totalDays, years, months, days };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setDaysSince(calculateDaysSince());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  function renderTimeSince() {
    if (!daysSince) {
      return (
        <div className="font-ebgaramond italic text-xl md:text-2xl text-[#39372b] mt-4">
          Our forever begins soon...
        </div>
      );
    }

    if (daysSince.totalDays <= 365) {
      return (
        <div className="flex flex-col items-center gap-1">
          <div className="font-ebgaramond font-bold text-4xl md:text-5xl text-[#39372b]">
            {daysSince.totalDays}
          </div>
          <div className="font-ebgaramond italic text-lg md:text-xl text-[#B993A5] tracking-wide">
            days of forever
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-row justify-center items-center gap-6 md:gap-10">
        {daysSince.years > 0 && (
          <div className="flex flex-col items-center">
            <div className="font-ebgaramond font-bold text-3xl md:text-4xl text-[#39372b]">{daysSince.years}</div>
            <div className="font-ebgaramond text-sm md:text-base text-[#39372b] tracking-wider uppercase mt-1">{daysSince.years === 1 ? 'year' : 'years'}</div>
          </div>
        )}
        {daysSince.months > 0 && (
          <div className="flex flex-col items-center">
            <div className="font-ebgaramond font-bold text-3xl md:text-4xl text-[#39372b]">{daysSince.months}</div>
            <div className="font-ebgaramond text-sm md:text-base text-[#39372b] tracking-wider uppercase mt-1">{daysSince.months === 1 ? 'month' : 'months'}</div>
          </div>
        )}
        <div className="flex flex-col items-center">
          <div className="font-ebgaramond font-bold text-3xl md:text-4xl text-[#39372b]">{daysSince.days}</div>
          <div className="font-ebgaramond text-sm md:text-base text-[#39372b] tracking-wider uppercase mt-1">{daysSince.days === 1 ? 'day' : 'days'}</div>
        </div>
        <div className="flex flex-col items-center mt-1">
          <div className="font-ebgaramond italic text-base md:text-lg text-[#B993A5]">of forever</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-screen min-h-screen bg-[#f5efe8] flex flex-col pb-32">
        {/* Slideshow at the top */}
        <Slideshow onHeightChange={onSlideshowHeight} />

        {/* Watermark floral images left/right */}
        <div className="relative flex flex-col items-center justify-center mt-[-4rem] px-4 z-10">
          {/* Left Watermark */}
          <img
            src={watermarkLeft}
            alt="Watermark Left"
            className="hidden md:block absolute left-0 top-1/3 -translate-y-1/2 -translate-x-20 w-80 lg:w-[420px] pointer-events-none select-none z-0"
            style={{maxHeight: '90vh'}}
          />
          {/* Right Watermark */}
          <img
            src={watermarkRight}
            alt="Watermark Right"
            className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-20 w-80 lg:w-[420px] pointer-events-none select-none z-0"
            style={{maxHeight: '90vh'}}
          />
          <div className="relative z-10 w-full flex flex-col items-center mt-2 md:mt-4 mb-4 md:mb-6">
            <DecorWindow extraClasses="max-w-6xl min-h-[65vh] flex flex-col justify-center py-10 md:py-32 px-4 md:px-20">
              <div className="flex flex-col items-center w-full px-2 md:px-8 py-2 md:py-6 gap-2 md:gap-4">

                <h2 className="font-dancing font-bold text-4xl md:text-5xl text-[#39372b] mb-1 md:mb-2 text-center">Tejasvi</h2>
                <div className="font-ebgaramond text-3xl md:text-4xl text-[#B993A5] mb-1">&amp;</div>
                <h2 className="font-dancing font-bold text-4xl md:text-5xl text-[#39372b] mb-3 md:mb-4 text-center">Aurobindo</h2>

                <div className="font-ebgaramond italic text-base md:text-lg text-[#39372b]/70 mb-4 md:mb-6 text-center tracking-wider">
                  Married August 8, 2025
                </div>

                {/* Days since wedding counter */}
                <div className="flex flex-row justify-center items-center gap-4 my-6 text-[#39372b]">
                  {renderTimeSince()}
                </div>

                {/* Our Memories Button */}
                <div className="mt-6 text-center">
                  <Link to="/memories">
                    <button className="w-full sm:w-auto px-16 sm:px-20 py-3 bg-[#39372b] hover:bg-[#222217] text-white text-xl sm:text-2xl font-playfair uppercase tracking-widest rounded shadow transition-all duration-200 border-none">
                      Our Memories
                    </button>
                  </Link>

                  {/* Mobile-only links */}
                  <div className="sm:hidden mt-6 flex justify-center gap-6">
                    <Link to="/wedding-journey" className="text-[#39372b] font-playfair text-lg underline underline-offset-4 hover:text-[#b993a5] transition-colors">
                      Wedding Journey
                    </Link>
                    <Link to="/gallery" className="text-[#39372b] font-playfair text-lg underline underline-offset-4 hover:text-[#b993a5] transition-colors">
                      Photo Gallery
                    </Link>
                  </div>
                </div>
              </div>
            </DecorWindow>
          </div>
          {/* Bottom Watermark floral image */}
          <img
            src={watermarkBottom}
            alt="Watermark Bottom"
            className="mx-auto -mt-10 w-40 md:w-64 lg:w-80 pointer-events-none select-none"
            style={{maxHeight: '160px'}}
          />
        <footer className="text-center text-xs text-[#39372b] font-playfair mt-12 mb-4 opacity-70">
          Teju &amp; Auro &mdash; Forever
        </footer>
      </div>
      </div>
    </>
  );
}
