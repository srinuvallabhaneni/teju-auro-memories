import React from 'react';

const CATEGORY_COLORS = {
  wedding: { bg: '#B993A5', text: '#fff' },
  travel: { bg: '#4A90D9', text: '#fff' },
  celebration: { bg: '#F5A623', text: '#fff' },
  milestone: { bg: '#7ED321', text: '#fff' },
  everyday: { bg: '#9B9B9B', text: '#fff' },
  anniversary: { bg: '#E84393', text: '#fff' },
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

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function MemoryCard({ memory, onClick }) {
  if (!memory) return null;

  const { title, date, description, category, photoCount } = memory;
  const categoryStyle = CATEGORY_COLORS[category] || CATEGORY_COLORS.everyday;

  return (
    <div
      onClick={() => onClick && onClick(memory)}
      className="
        relative bg-[#f5efe8] rounded-xl p-5 md:p-6
        cursor-pointer
        transition-all duration-300 ease-in-out
        hover:shadow-lg hover:shadow-[#B993A5]/10
        hover:-translate-y-1 hover:scale-[1.02]
        border border-[#B993A5]/10
        group
      "
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick && onClick(memory);
        }
      }}
    >
      {/* Category Badge */}
      {category && (
        <span
          className="
            absolute top-3 right-3
            px-2.5 py-0.5 rounded-full
            text-xs font-medium tracking-wide uppercase
          "
          style={{
            backgroundColor: categoryStyle.bg,
            color: categoryStyle.text,
          }}
        >
          {capitalize(category)}
        </span>
      )}

      {/* Title */}
      <h3 className="font-playfair text-lg md:text-xl text-[#39372b] pr-20 leading-snug">
        {title}
      </h3>

      {/* Date */}
      {date && (
        <p className="text-sm text-[#39372b]/50 mt-1.5 font-ebgaramond">
          {formatDate(date)}
        </p>
      )}

      {/* Description Preview */}
      {description && (
        <p
          className="
            mt-3 text-sm text-[#39372b]/70
            leading-relaxed
            line-clamp-2
          "
        >
          {description}
        </p>
      )}

      {/* Photo Count */}
      {photoCount > 0 && (
        <div className="mt-3 flex items-center gap-1.5 text-sm text-[#B993A5]">
          <svg
            className="w-4 h-4"
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
          <span>{photoCount} photo{photoCount !== 1 ? 's' : ''}</span>
        </div>
      )}

      {/* Subtle bottom accent line on hover */}
      <div
        className="
          absolute bottom-0 left-4 right-4 h-0.5 rounded-full
          bg-[#B993A5]/0 group-hover:bg-[#B993A5]/30
          transition-colors duration-300
        "
      />
    </div>
  );
}
