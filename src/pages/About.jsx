import logo from '../assets/logo.png';
import watermarkLeft from '../assets/watermark-left.png';
import watermarkRight from '../assets/watermark-right.png';
import watermarkBottom from '../assets/watermark-bottom.png';

export default function About() {
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

      <div className="w-full max-w-2xl mx-auto px-4 pt-10 relative z-10">
        {/* Title */}
        <h1 className="font-playfair text-3xl md:text-4xl text-[#39372b] tracking-widest text-center uppercase mb-10">
          Our Story
        </h1>

        {/* Section 1: The Couple */}
        <section className="flex flex-col items-center mb-14">
          <img
            src={logo}
            alt="Teju & Auro"
            className="w-32 md:w-40 mb-6 pointer-events-none select-none"
          />
          <h2 className="font-dancing text-4xl md:text-5xl text-[#39372b] text-center mb-1">
            Tejasvi
          </h2>
          <p className="font-ebgaramond text-2xl md:text-3xl text-[#39372b] mb-1">&amp;</p>
          <h2 className="font-dancing text-4xl md:text-5xl text-[#39372b] text-center mb-4">
            Aurobindo
          </h2>
          <div className="w-16 h-px bg-[#B993A5] mx-auto" />
        </section>

        {/* Section 2: How It All Began */}
        <section className="mb-14">
          <h2 className="font-playfair text-2xl md:text-3xl text-[#39372b] text-center mb-6">
            How It All Began
          </h2>
          <div className="bg-white/70 border border-[#e2e0d7] rounded-xl p-6 md:p-8 shadow">
            <p className="font-ebgaramond text-lg md:text-xl text-[#39372b] leading-relaxed text-center italic">
              Every love story is beautiful, but ours is our favorite. Share your story here...
            </p>
          </div>
        </section>

        {/* Section 3: The Wedding */}
        <section className="mb-14">
          <h2 className="font-playfair text-2xl md:text-3xl text-[#39372b] text-center mb-6">
            The Wedding
          </h2>
          <div className="bg-white/70 border border-[#e2e0d7] rounded-xl p-6 md:p-8 shadow">
            <p className="font-ebgaramond text-lg md:text-xl text-[#39372b] leading-relaxed text-center">
              On August 8, 2025, surrounded by family and friends, at the beautiful Casa Bella
              Event Center in Sunol, California, we began our forever.
            </p>
          </div>
        </section>

        {/* Section 4: What's Ahead */}
        <section className="mb-14">
          <h2 className="font-playfair text-2xl md:text-3xl text-[#39372b] text-center mb-6">
            What&rsquo;s Ahead
          </h2>
          <div className="bg-white/70 border border-[#e2e0d7] rounded-xl p-6 md:p-8 shadow">
            <p className="font-ebgaramond text-lg md:text-xl text-[#39372b] leading-relaxed text-center">
              This is just the beginning. Every day is a new chapter in our story, and we
              can&rsquo;t wait to write it together.
            </p>
          </div>
        </section>

        {/* Bottom Watermark */}
        <img
          src={watermarkBottom}
          alt="Watermark Bottom"
          className="mx-auto mt-6 w-32 md:w-48 lg:w-56 pointer-events-none select-none"
          style={{ maxHeight: '120px' }}
        />

        <footer className="text-center text-xs text-[#39372b] font-playfair mt-4 mb-2 opacity-70">
          Teju &amp; Auro &mdash; Forever
        </footer>
      </div>
    </div>
  );
}
