import React from 'react';
import { Link } from 'react-router-dom';
import watermarkBottom from '../assets/watermark-bottom.png';
import watermarkLeft from '../assets/watermark-left.png';
import watermarkRight from '../assets/watermark-right.png';
import sangeetImg from '../assets/sangeet.png';
import haldiImg from '../assets/haldi.png';
import weddingImg from '../assets/wedding.png';

const events = [
  {
    id: 'sangeet',
    name: 'Sangeet',
    icon: sangeetImg,
    date: 'Wednesday, August 6, 2025',
    time: '6:00 PM - 10:00 PM',
    venue: 'Shubham Halls',
    address: '1214 Apollo Way, Sunnyvale, CA 94085',
    mapsUrl: 'https://maps.google.com/?q=1214+Apollo+Way,+Sunnyvale,+CA+94085',
    description:
      'An evening of music, dance, and celebration as families came together for the first time. The night was filled with choreographed performances, heartfelt speeches, and endless laughter.',
  },
  {
    id: 'haldi',
    name: 'Haldi',
    icon: haldiImg,
    date: 'Thursday, August 7, 2025',
    time: '8:00 AM - 10:00 AM, followed by lunch',
    venue: 'Family Residence',
    address: '835 Tolentino Ct, Livermore, CA 94550',
    mapsUrl: 'https://maps.google.com/?q=835+Tolentino+Ct,+Livermore,+CA+94550',
    description:
      'A morning of blessings and tradition as turmeric paste was lovingly applied by family and friends. The intimate ceremony was followed by a joyful lunch together.',
  },
  {
    id: 'wedding',
    name: 'Wedding',
    icon: weddingImg,
    date: 'Friday, August 8, 2025',
    time: '8:00 AM - 1:30 PM',
    venue: "Sunol's Casa Bella Event Center",
    address: '11984 Main Street, Sunol, CA 94586',
    mapsUrl: 'https://maps.google.com/?q=11984+Main+Street,+Sunol,+CA+94586',
    description:
      'The day two became one. Surrounded by loved ones at the beautiful Casa Bella, Tejasvi and Aurobindo exchanged vows and began their forever journey together.',
  },
];

export default function WeddingJourney() {
  return (
    <div className="min-h-screen bg-[#f5efe8] flex flex-col items-center pb-16 w-full relative overflow-x-hidden">
      {/* Left Watermark */}
      <img
        src={watermarkLeft}
        alt="Watermark Left"
        className="hidden md:block absolute left-0 top-1/3 -translate-y-1/2 -translate-x-20 w-80 lg:w-[420px] pointer-events-none select-none z-0"
        style={{ maxHeight: '90vh' }}
      />
      {/* Right Watermark */}
      <img
        src={watermarkRight}
        alt="Watermark Right"
        className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-20 w-80 lg:w-[420px] pointer-events-none select-none z-0"
        style={{ maxHeight: '90vh' }}
      />

      <div className="w-full max-w-3xl mx-auto px-4 pt-8 relative z-10">
        {/* Page Title */}
        <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-[#39372b] text-center mb-3 tracking-wide">
          Our Wedding Journey
        </h1>
        <p className="font-ebgaramond italic text-lg md:text-xl text-[#39372b] text-center mb-12 max-w-xl mx-auto">
          Three days of love, laughter, and new beginnings
        </p>

        {/* Event Cards */}
        <div className="flex flex-col gap-12 md:gap-16">
          {events.map((event, index) => (
            <section
              key={event.id}
              className="flex flex-col items-center bg-white/40 rounded-2xl shadow-sm border border-[#B993A5]/20 py-10 px-6 md:px-12 transition-all duration-300 hover:shadow-md"
            >
              {/* Event Icon */}
              <img
                src={event.icon}
                alt={`${event.name} Icon`}
                className="h-16 md:h-20 mb-4"
              />

              {/* Event Name */}
              <h2 className="font-playfair text-2xl md:text-3xl text-[#39372b] font-semibold mb-2 text-center">
                {event.name}
              </h2>

              {/* Date */}
              <div className="font-ebgaramond text-lg md:text-xl text-[#39372b] tracking-wide mb-1 text-center">
                {event.date}
              </div>

              {/* Time */}
              <div className="font-ebgaramond text-base md:text-lg text-[#39372b] mb-3 text-center">
                {event.time}
              </div>

              {/* Venue & Address */}
              <div className="font-ebgaramond text-lg md:text-xl text-[#39372b] font-semibold mb-1 text-center">
                {event.venue}
              </div>
              <a
                href={event.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-ebgaramond text-base md:text-lg text-[#39372b] underline underline-offset-2 hover:text-[#B993A5] transition-colors mb-4 text-center"
              >
                {event.address}
              </a>

              {/* Description */}
              <p className="font-ebgaramond text-base md:text-lg text-[#39372b]/80 text-center max-w-lg mb-6 leading-relaxed italic">
                {event.description}
              </p>

              {/* View Photos Button */}
              <Link to={`/event/${event.id}`}>
                <button className="px-10 py-2.5 bg-[#39372b] hover:bg-[#222217] text-white text-base md:text-lg font-playfair uppercase tracking-widest rounded shadow transition-all duration-200 border-none">
                  View Photos
                </button>
              </Link>
            </section>
          ))}
        </div>

        {/* Bottom Watermark */}
        <img
          src={watermarkBottom}
          alt="Watermark Bottom"
          className="mx-auto mt-12 w-32 md:w-48 lg:w-56 pointer-events-none select-none"
          style={{ maxHeight: '120px' }}
        />
      </div>

      <footer className="text-center text-sm text-[#39372b] font-playfair mt-8 mb-4 opacity-70">
        Teju & Auro -- Forever
      </footer>
    </div>
  );
}
