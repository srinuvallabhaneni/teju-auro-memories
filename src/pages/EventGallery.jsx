import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMemories } from '../contexts/MemoryContext';
import { useIndexedDB } from '../hooks/useIndexedDB';
import PhotoGallery from '../components/PhotoGallery';
import PhotoUploader from '../components/PhotoUploader';
import { compressImage, createThumbnail, generateId } from '../utils/imageUtils';
import sangeetImg from '../assets/sangeet.png';
import haldiImg from '../assets/haldi.png';
import weddingImg from '../assets/wedding.png';
import watermarkLeft from '../assets/watermark-left.png';
import watermarkRight from '../assets/watermark-right.png';
import watermarkBottom from '../assets/watermark-bottom.png';

const eventData = {
  sangeet: {
    name: 'Sangeet Night',
    date: 'Wednesday, August 6, 2025',
    time: '6:00 PM - 10:00 PM',
    venue: 'Shubham Halls',
    address: '1214 Apollo Way, Sunnyvale, CA 94085',
    icon: sangeetImg,
    description: 'An evening of music, dance, and celebration with family and friends',
  },
  haldi: {
    name: 'Haldi Ceremony',
    date: 'Thursday, August 7, 2025',
    time: '8:00 AM - 10:00 AM',
    venue: 'Family Home',
    address: '835 Tolentino Ct, Livermore, CA 94550',
    icon: haldiImg,
    description: 'The sacred turmeric ceremony filled with love and blessings',
  },
  wedding: {
    name: 'Wedding Ceremony',
    date: 'Friday, August 8, 2025',
    time: '8:00 AM - 1:30 PM',
    venue: "Sunol's Casa Bella Event Center",
    address: '11984 Main Street, Sunol, CA 94586',
    icon: weddingImg,
    description: 'The beautiful ceremony where two souls became one',
  },
};

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

/**
 * Convert a raw IndexedDB photo record into the shape PhotoGallery expects:
 *   { id, thumbnailUrl, fullUrl, ...rest }
 *
 * Handles both naming conventions:
 *   - fullImage / thumbnail  (saved by EventGallery)
 *   - blob / thumbnail       (saved by other parts of the app)
 */
function convertPhotoForGallery(photo) {
  const fullSource = photo.fullImage || photo.blob;
  const thumbSource = photo.thumbnail;

  return {
    ...photo,
    fullUrl: toObjectUrl(fullSource),
    thumbnailUrl: toObjectUrl(thumbSource) || toObjectUrl(fullSource),
  };
}

export default function EventGallery() {
  const { eventId } = useParams();
  const { addPhotoToEvent } = useMemories();
  const { getPhotos, savePhoto } = useIndexedDB();
  const [photos, setPhotos] = useState([]);
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Track created object URLs so we can revoke them on unmount / reload
  const objectUrlsRef = useRef([]);

  const event = eventData[eventId];

  /**
   * Revoke all previously-created object URLs to free memory.
   */
  const revokeObjectUrls = useCallback(() => {
    objectUrlsRef.current.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch {
        // ignore – already revoked or not an object URL
      }
    });
    objectUrlsRef.current = [];
  }, []);

  /**
   * Convert an array of raw IndexedDB photo records, track the created
   * object URLs, and return gallery-ready photo objects.
   */
  const convertAndTrack = useCallback(
    (rawPhotos) => {
      const converted = rawPhotos.map(convertPhotoForGallery);

      // Collect new object URLs for cleanup
      converted.forEach((p) => {
        if (p.fullUrl && p.fullUrl.startsWith('blob:')) objectUrlsRef.current.push(p.fullUrl);
        if (p.thumbnailUrl && p.thumbnailUrl.startsWith('blob:')) objectUrlsRef.current.push(p.thumbnailUrl);
      });

      return converted;
    },
    [],
  );

  // Load photos from IndexedDB for this event
  const loadPhotos = useCallback(async () => {
    if (!eventId) return;
    try {
      setLoading(true);
      const eventPhotos = await getPhotos(eventId);
      // Revoke old URLs before replacing state
      revokeObjectUrls();
      setPhotos(eventPhotos && eventPhotos.length > 0 ? convertAndTrack(eventPhotos) : []);
    } catch (err) {
      console.error('Failed to load photos:', err);
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  }, [eventId, getPhotos, revokeObjectUrls, convertAndTrack]);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  // Clean up object URLs when the component unmounts
  useEffect(() => {
    return () => {
      revokeObjectUrls();
    };
  }, [revokeObjectUrls]);

  // Handle photo upload: compress, create thumbnail, save to IndexedDB
  const handlePhotoUpload = async (files) => {
    if (!files || files.length === 0) return;

    const newPhotos = [];

    for (const file of files) {
      try {
        const compressed = await compressImage(file);
        const thumbnail = await createThumbnail(file);
        const id = generateId();

        const photoRecord = {
          id,
          memoryId: eventId,
          fileName: file.name,
          type: file.type,
          fullImage: compressed,
          thumbnail,
          uploadedAt: new Date().toISOString(),
        };

        await savePhoto(photoRecord);
        newPhotos.push(photoRecord);

        // Also update context if available
        if (addPhotoToEvent) {
          addPhotoToEvent(eventId, photoRecord);
        }
      } catch (err) {
        console.error(`Failed to process photo ${file.name}:`, err);
      }
    }

    if (newPhotos.length > 0) {
      const convertedNew = convertAndTrack(newPhotos);
      setPhotos((prev) => [...prev, ...convertedNew]);
    }
  };

  // Invalid event ID
  if (!event) {
    return (
      <div className="min-h-screen bg-[#f5efe8] flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="font-playfair text-3xl text-[#39372b] mb-4">Event Not Found</h1>
          <p className="font-ebgaramond text-[#39372b]/70 text-lg mb-8">
            Sorry, we couldn't find the event you're looking for.
          </p>
          <Link
            to="/wedding-journey"
            className="inline-block px-6 py-3 bg-[#B993A5] text-white font-playfair rounded-lg hover:bg-[#a07d91] transition-colors"
          >
            Back to Our Wedding
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5efe8] flex flex-col items-center pb-16 w-full relative overflow-x-hidden">
      {/* Watermarks */}
      <img
        src={watermarkLeft}
        alt="Watermark Left"
        className="hidden md:block absolute left-0 top-1/3 -translate-y-1/2 -translate-x-20 w-80 lg:w-[420px] pointer-events-none select-none z-0"
        style={{ maxHeight: '90vh' }}
      />
      <img
        src={watermarkRight}
        alt="Watermark Right"
        className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-20 w-80 lg:w-[420px] pointer-events-none select-none z-0"
        style={{ maxHeight: '90vh' }}
      />

      {/* Back Navigation */}
      <div className="max-w-5xl mx-auto px-4 pt-6">
        <Link
          to="/wedding-journey"
          className="inline-flex items-center gap-2 text-[#39372b]/70 hover:text-[#B993A5] font-ebgaramond transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Our Wedding
        </Link>
      </div>

      {/* Event Header */}
      <div className="max-w-5xl mx-auto px-4 pt-8 pb-6">
        <div className="flex flex-col items-center text-center">
          <img
            src={event.icon}
            alt={event.name}
            className="w-28 h-28 md:w-36 md:h-36 object-contain mb-6"
          />
          <h1 className="font-playfair text-3xl md:text-5xl text-[#39372b] mb-3">
            {event.name}
          </h1>
          <p className="font-dancing text-xl md:text-2xl text-[#B993A5] mb-4">
            {event.description}
          </p>

          {/* Event Details */}
          <div className="flex flex-col gap-2 text-[#39372b]/80 font-ebgaramond text-base md:text-lg">
            <div className="flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#B993A5]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span>{event.date}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#B993A5]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>{event.time}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#B993A5]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>{event.venue} &mdash; {event.address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-3xl mx-auto px-4">
        <hr className="border-[#B993A5]/30" />
      </div>

      {/* Photo Gallery Section */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="font-playfair text-2xl md:text-3xl text-[#39372b] text-center mb-6">
          Event Photos
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-[#B993A5]/30 border-t-[#B993A5] rounded-full animate-spin"></div>
          </div>
        ) : photos.length > 0 ? (
          <PhotoGallery photos={photos} />
        ) : (
          <div className="text-center py-12">
            <p className="font-ebgaramond text-[#39372b]/60 text-lg mb-2">
              No photos yet for this event.
            </p>
            <p className="font-ebgaramond text-[#39372b]/40 text-base">
              Be the first to share a memory!
            </p>
          </div>
        )}
      </div>

      {/* Add Photos Section */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <div className="bg-white/50 rounded-2xl border border-[#B993A5]/20 overflow-hidden">
          <button
            onClick={() => setUploaderOpen(!uploaderOpen)}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/30 transition-colors"
          >
            <span className="font-playfair text-lg md:text-xl text-[#39372b] flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#B993A5]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              Add Photos
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 text-[#39372b]/60 transition-transform duration-300 ${uploaderOpen ? 'rotate-180' : ''}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {uploaderOpen && (
            <div className="px-6 pb-6">
              <PhotoUploader onPhotosSelected={handlePhotoUpload} eventName={event.name} />
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-5xl mx-auto px-4">
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
