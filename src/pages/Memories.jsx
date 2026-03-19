import { useNavigate } from 'react-router-dom';
import Timeline from '../components/Timeline';
import { useMemories } from '../contexts/MemoryContext';
import watermarkLeft from '../assets/watermark-left.png';
import watermarkRight from '../assets/watermark-right.png';
import watermarkBottom from '../assets/watermark-bottom.png';

export default function Memories() {
  const navigate = useNavigate();
  const { memories } = useMemories();

  const sortedMemories = [...memories].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

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

      <div className="w-full max-w-3xl mx-auto px-4 pt-10 relative z-10">
        {/* Title */}
        <h1 className="font-playfair text-3xl md:text-4xl text-[#39372b] tracking-widest text-center uppercase mb-2">
          Our Memories
        </h1>
        <p className="font-ebgaramond italic text-lg md:text-xl text-[#39372b] text-center mb-10">
          Every moment tells our story
        </p>

        {/* Timeline or empty state */}
        {sortedMemories.length > 0 ? (
          <Timeline memories={sortedMemories} onMemoryClick={(memory) => navigate(`/memories/${memory.id}`)} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-5xl mb-4" role="img" aria-label="heart">
              &#10084;
            </span>
            <p className="font-ebgaramond text-xl text-[#39372b] italic">
              Your story begins here...
            </p>
            <p className="font-ebgaramond text-lg text-[#39372b] mt-2">
              Add your first memory!
            </p>
            <button
              onClick={() => navigate('/memories/new')}
              className="mt-6 px-8 py-3 bg-[#39372b] hover:bg-[#222217] text-white font-playfair uppercase tracking-widest rounded shadow transition-all duration-200"
            >
              Create Memory
            </button>
          </div>
        )}

        {/* Bottom Watermark */}
        <img
          src={watermarkBottom}
          alt="Watermark Bottom"
          className="mx-auto mt-12 w-32 md:w-48 lg:w-56 pointer-events-none select-none"
          style={{ maxHeight: '120px' }}
        />

        <footer className="text-center text-xs text-[#39372b] font-playfair mt-4 mb-2 opacity-70">
          Teju &amp; Auro &mdash; Forever
        </footer>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => navigate('/memories/new')}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#39372b] hover:bg-[#222217] text-white rounded-full shadow-lg flex items-center justify-center text-3xl leading-none transition-all duration-200 z-50"
        aria-label="Add new memory"
      >
        +
      </button>
    </div>
  );
}
