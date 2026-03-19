import { useState, useEffect, useCallback } from 'react';
import { useMemories } from '../contexts/MemoryContext';
import { useIndexedDB } from '../hooks/useIndexedDB';
import PhotoGallery from '../components/PhotoGallery';
import watermarkLeft from '../assets/watermark-left.png';
import watermarkRight from '../assets/watermark-right.png';
import watermarkBottom from '../assets/watermark-bottom.png';

const CATEGORIES = ['All', 'Wedding', 'Travel', 'Celebrations', 'Milestones', 'Everyday'];

/**
 * Convert a photo's image data to an object URL if it is a Blob,
 * or return it directly if it is already a string URL.
 */
function toObjectUrl(data) {
  if (!data) return null;
  if (typeof data === 'string') return data;
  if (data instanceof Blob) return URL.createObjectURL(data);
  return null;
}

export default function Gallery() {
  const { memories } = useMemories();
  const { getPhotos } = useIndexedDB();

  const [activeFilter, setActiveFilter] = useState('All');
  const [photoGroups, setPhotoGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const filteredMemories =
    activeFilter === 'All'
      ? memories
      : memories.filter((m) => m.category === activeFilter);

  const loadAllPhotos = useCallback(async () => {
    setIsLoading(true);
    try {
      const groups = [];

      for (const memory of filteredMemories) {
        const memoryPhotos = await getPhotos(memory.id);
        if (memoryPhotos.length > 0) {
          const photosWithUrls = memoryPhotos.map((photo) => {
            // Handle both naming conventions:
            //   - fullImage (saved by EventGallery)
            //   - blob (saved by other parts of the app)
            const fullSource = photo.fullImage || photo.blob;
            const thumbSource = photo.thumbnail;

            const fullUrl = toObjectUrl(fullSource);
            const thumbnailUrl = toObjectUrl(thumbSource) || fullUrl;

            return {
              ...photo,
              fullUrl,
              thumbnailUrl,
            };
          });
          groups.push({
            memory,
            photos: photosWithUrls,
          });
        }
      }

      setPhotoGroups(groups);
    } catch (error) {
      console.error('Failed to load photos:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filteredMemories, getPhotos]);

  useEffect(() => {
    loadAllPhotos();
    return () => {
      // Revoke all object URLs when filter changes or component unmounts
      photoGroups.forEach((group) => {
        group.photos.forEach((p) => {
          if (p.fullUrl && p.fullUrl.startsWith('blob:')) URL.revokeObjectURL(p.fullUrl);
          if (p.thumbnailUrl && p.thumbnailUrl.startsWith('blob:')) URL.revokeObjectURL(p.thumbnailUrl);
        });
      });
    };
  }, [activeFilter, memories]);

  const totalPhotos = photoGroups.reduce((sum, g) => sum + g.photos.length, 0);
  const totalMemories = photoGroups.length;

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

      <div className="w-full max-w-4xl mx-auto px-4 pt-10 relative z-10">
        {/* Title */}
        <h1 className="font-playfair text-3xl md:text-4xl text-[#39372b] tracking-widest text-center uppercase mb-2">
          Our Gallery
        </h1>
        <p className="font-ebgaramond italic text-lg md:text-xl text-[#39372b] text-center mb-6">
          All our precious moments in one place
        </p>

        {/* Photo count */}
        {!isLoading && totalPhotos > 0 && (
          <p className="font-ebgaramond text-base text-[#39372b] text-center mb-6">
            {totalPhotos} photo{totalPhotos !== 1 ? 's' : ''} across{' '}
            {totalMemories} memor{totalMemories !== 1 ? 'ies' : 'y'}
          </p>
        )}

        {/* Filter bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-5 py-2 rounded-full font-playfair text-sm uppercase tracking-wider transition-all duration-200 ${
                activeFilter === category
                  ? 'bg-[#39372b] text-white shadow'
                  : 'bg-white/70 border border-[#e2e0d7] text-[#39372b] hover:bg-[#B993A5]/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery content */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <svg className="animate-spin h-8 w-8 text-[#39372b]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : photoGroups.length > 0 ? (
          <div className="flex flex-col gap-10">
            {photoGroups.map((group) => (
              <section key={group.memory.id}>
                <h2 className="font-playfair text-xl text-[#39372b] mb-1">
                  {group.memory.title}
                </h2>
                <p className="font-ebgaramond text-sm text-[#39372b]/60 mb-4">
                  {new Date(group.memory.date + 'T00:00:00').toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  {' '}&middot;{' '}
                  {group.memory.category}
                </p>
                <PhotoGallery photos={group.photos} />
              </section>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="font-ebgaramond text-xl text-[#39372b] italic">
              No photos yet.
            </p>
            <p className="font-ebgaramond text-lg text-[#39372b] mt-2">
              Create a memory and add some photos to get started!
            </p>
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
    </div>
  );
}
