import React, { useEffect, useRef, useState } from 'react';

const CATEGORY_COLORS = {
  wedding: '#B993A5',
  travel: '#4A90D9',
  celebration: '#F5A623',
  milestone: '#7ED321',
  everyday: '#9B9B9B',
  anniversary: '#E84393',
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function getYear(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).getFullYear().toString();
  } catch {
    return '';
  }
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Hook to detect when an element enters the viewport
function useInView(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element); // Only animate once
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px', ...options }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
}

// Individual timeline node component with fade-in
function TimelineNode({ memory, index, isLeft, onMemoryClick }) {
  const [ref, isVisible] = useInView();
  const categoryColor = CATEGORY_COLORS[memory.category] || CATEGORY_COLORS.everyday;

  return (
    <div
      ref={ref}
      className={`
        relative flex w-full
        mb-8 md:mb-12
        ${isLeft ? 'md:flex-row-reverse' : 'md:flex-row'}
        flex-row
      `}
    >
      {/* Spacer - opposite side (desktop only) */}
      <div className="hidden md:block md:w-1/2" />

      {/* Timeline Dot */}
      <div
        className="
          absolute
          left-0 md:left-1/2
          top-6
          -translate-x-1/2
          z-10
        "
      >
        <div
          className="
            w-4 h-4 rounded-full border-[3px] border-[#f5efe8]
            shadow-sm
            transition-transform duration-500
          "
          style={{
            backgroundColor: categoryColor,
            transform: isVisible ? 'scale(1)' : 'scale(0)',
          }}
        />
      </div>

      {/* Content Card */}
      <div
        className={`
          w-full md:w-1/2
          pl-8 md:pl-0
          ${isLeft ? 'md:pr-10' : 'md:pl-10'}
        `}
      >
        <div
          onClick={() => onMemoryClick && onMemoryClick(memory)}
          className={`
            bg-[#f5efe8] rounded-xl p-4 md:p-5
            border border-[#B993A5]/10
            cursor-pointer
            transition-all duration-500 ease-out
            hover:shadow-lg hover:shadow-[#B993A5]/10
            hover:-translate-y-0.5
            ${isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-6'
            }
          `}
          style={{
            transitionDelay: isVisible ? '100ms' : '0ms',
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onMemoryClick && onMemoryClick(memory);
            }
          }}
        >
          {/* Category Badge + Date Row */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#39372b]/40 font-ebgaramond">
              {formatDate(memory.date)}
            </span>
            {memory.category && (
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide uppercase text-white"
                style={{ backgroundColor: categoryColor }}
              >
                {capitalize(memory.category)}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-playfair text-base md:text-lg text-[#39372b] leading-snug">
            {memory.title}
          </h3>

          {/* Description Preview */}
          {memory.description && (
            <p className="mt-2 text-sm text-[#39372b]/60 leading-relaxed line-clamp-2">
              {memory.description}
            </p>
          )}

          {/* Photo Count */}
          {memory.photoCount > 0 && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-[#B993A5]">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                />
              </svg>
              <span>{memory.photoCount} photo{memory.photoCount !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Year marker component
function YearMarker({ year }) {
  const [ref, isVisible] = useInView();

  return (
    <div ref={ref} className="relative flex items-center w-full mb-8 md:mb-10">
      {/* Year dot - larger than normal dots */}
      <div
        className="
          absolute
          left-0 md:left-1/2
          -translate-x-1/2
          z-10
        "
      >
        <div
          className={`
            w-8 h-8 rounded-full
            bg-[#B993A5] border-4 border-[#f5efe8]
            flex items-center justify-center
            shadow-md
            transition-all duration-500
          `}
          style={{
            transform: isVisible ? 'scale(1)' : 'scale(0)',
          }}
        >
          <span className="text-[8px] font-bold text-white">{year.slice(-2)}</span>
        </div>
      </div>

      {/* Year label */}
      <div
        className={`
          pl-12 md:pl-0
          md:absolute md:left-1/2 md:translate-x-6
          transition-all duration-500
          ${isVisible ? 'opacity-100' : 'opacity-0'}
        `}
      >
        <span className="font-playfair text-xl md:text-2xl text-[#B993A5] font-semibold">
          {year}
        </span>
      </div>
    </div>
  );
}

export default function Timeline({ memories = [], onMemoryClick }) {
  if (!memories || memories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-[#39372b]/50">
        <svg
          className="w-16 h-16 mb-4 text-[#B993A5]/40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="font-playfair text-lg">No memories yet</p>
        <p className="text-sm mt-1">Start adding memories to see your timeline</p>
      </div>
    );
  }

  // Build timeline items with year markers
  const timelineItems = [];
  let lastYear = null;

  memories.forEach((memory, index) => {
    const year = getYear(memory.date);
    if (year && year !== lastYear) {
      timelineItems.push({ type: 'year', year, key: `year-${year}` });
      lastYear = year;
    }
    timelineItems.push({
      type: 'memory',
      memory,
      index,
      key: memory.id || `memory-${index}`,
    });
  });

  // Track a running index for alternating left/right on desktop
  let memoryCount = 0;

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4 py-8">
      {/* Vertical Timeline Line */}
      <div
        className="
          absolute
          left-0 md:left-1/2
          top-0 bottom-0
          w-0.5
          bg-gradient-to-b from-[#B993A5]/20 via-[#B993A5]/40 to-[#B993A5]/20
          -translate-x-1/2
        "
        style={{ marginLeft: '0px' }}
      />

      {/* Timeline Items */}
      {timelineItems.map((item) => {
        if (item.type === 'year') {
          return <YearMarker key={item.key} year={item.year} />;
        }

        const isLeft = memoryCount % 2 === 0;
        memoryCount++;

        return (
          <TimelineNode
            key={item.key}
            memory={item.memory}
            index={item.index}
            isLeft={isLeft}
            onMemoryClick={onMemoryClick}
          />
        );
      })}

      {/* End cap */}
      <div className="relative flex items-center justify-start md:justify-center">
        <div
          className="
            absolute left-0 md:left-1/2
            -translate-x-1/2
            w-3 h-3 rounded-full
            bg-[#B993A5]/40
          "
        />
      </div>
    </div>
  );
}
