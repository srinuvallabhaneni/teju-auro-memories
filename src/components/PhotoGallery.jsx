import React, { useState, useCallback, useEffect, useRef } from 'react';

export default function PhotoGallery({
  photos = [],
  onPhotoClick,
  onDeletePhoto,
  emptyMessage = 'No photos yet',
}) {
  const [viewerIndex, setViewerIndex] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const touchStartX = useRef(null);
  const viewerOpen = viewerIndex !== null;

  // Lock body scroll when viewer is open
  useEffect(() => {
    if (viewerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [viewerOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!viewerOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') closeViewer();
      if (e.key === 'ArrowLeft') navigatePrev();
      if (e.key === 'ArrowRight') navigateNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  const openViewer = useCallback(
    (index) => {
      setViewerIndex(index);
      setDeleteConfirm(false);
      if (onPhotoClick && photos[index]) {
        onPhotoClick(photos[index]);
      }
    },
    [onPhotoClick, photos]
  );

  const closeViewer = useCallback(() => {
    setViewerIndex(null);
    setDeleteConfirm(false);
  }, []);

  const navigatePrev = useCallback(() => {
    setViewerIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
    setDeleteConfirm(false);
  }, [photos.length]);

  const navigateNext = useCallback(() => {
    setViewerIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
    setDeleteConfirm(false);
  }, [photos.length]);

  const handleDelete = useCallback(() => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    if (onDeletePhoto && photos[viewerIndex]) {
      onDeletePhoto(photos[viewerIndex]);
      // Move to next photo or close
      if (photos.length <= 1) {
        closeViewer();
      } else if (viewerIndex >= photos.length - 1) {
        setViewerIndex(photos.length - 2);
      }
      setDeleteConfirm(false);
    }
  }, [deleteConfirm, onDeletePhoto, photos, viewerIndex, closeViewer]);

  // Touch swipe handlers
  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e) => {
      if (touchStartX.current === null) return;
      const diff = touchStartX.current - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) navigateNext();
        else navigatePrev();
      }
      touchStartX.current = null;
    },
    [navigateNext, navigatePrev]
  );

  // Empty state
  if (!photos || photos.length === 0) {
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
            d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
          />
        </svg>
        <p className="font-playfair text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      {/* Masonry Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {photos.map((photo, index) => (
          <div
            key={photo.id || index}
            className="
              relative overflow-hidden rounded-xl cursor-pointer
              bg-[#f5efe8] shadow-sm
              transition-all duration-300 ease-in-out
              hover:shadow-lg hover:scale-[1.03]
              group aspect-square
            "
            onClick={() => openViewer(index)}
          >
            <img
              src={photo.thumbnailUrl || photo.fullUrl}
              alt={photo.alt || `Photo ${index + 1}`}
              loading="lazy"
              className="
                w-full h-full object-cover
                transition-transform duration-500 ease-in-out
                group-hover:scale-110
              "
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#39372b]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ))}
      </div>

      {/* Full-Size Viewer Modal */}
      {viewerOpen && photos[viewerIndex] && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Dark Overlay */}
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            onClick={closeViewer}
          />

          {/* Close Button */}
          <button
            onClick={closeViewer}
            className="
              absolute top-4 right-4 z-10
              w-10 h-10 rounded-full
              bg-white/10 hover:bg-white/20
              text-white text-2xl
              flex items-center justify-center
              transition-colors duration-200
            "
            aria-label="Close viewer"
          >
            &times;
          </button>

          {/* Navigation - Previous */}
          {photos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigatePrev();
              }}
              className="
                absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10
                w-10 h-10 md:w-12 md:h-12 rounded-full
                bg-white/10 hover:bg-white/20
                text-white text-xl md:text-2xl
                flex items-center justify-center
                transition-colors duration-200
              "
              aria-label="Previous photo"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}

          {/* Navigation - Next */}
          {photos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateNext();
              }}
              className="
                absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10
                w-10 h-10 md:w-12 md:h-12 rounded-full
                bg-white/10 hover:bg-white/20
                text-white text-xl md:text-2xl
                flex items-center justify-center
                transition-colors duration-200
              "
              aria-label="Next photo"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}

          {/* Main Image */}
          <div className="relative z-[1] max-w-[90vw] max-h-[80vh] flex items-center justify-center">
            <img
              src={photos[viewerIndex].fullUrl || photos[viewerIndex].thumbnailUrl}
              alt={photos[viewerIndex].alt || `Photo ${viewerIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl select-none"
              draggable={false}
            />
          </div>

          {/* Bottom Bar: Counter + Delete */}
          <div className="absolute bottom-6 left-0 right-0 z-10 flex items-center justify-center gap-6">
            {/* Photo Counter */}
            <span className="text-white/70 text-sm font-playfair">
              {viewerIndex + 1} / {photos.length}
            </span>

            {/* Delete Button */}
            {onDeletePhoto && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium
                  transition-colors duration-200
                  ${deleteConfirm
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-white/10 hover:bg-red-600/60 text-white/70 hover:text-white'
                  }
                `}
              >
                {deleteConfirm ? 'Confirm Delete' : 'Delete'}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
