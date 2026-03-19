import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMemories } from '../contexts/MemoryContext';
import { useIndexedDB } from '../hooks/useIndexedDB';
import PhotoGallery from '../components/PhotoGallery';
import PhotoUploader from '../components/PhotoUploader';
import MemoryForm from '../components/MemoryForm';
import { compressImage, createThumbnail, generateId } from '../utils/imageUtils';
import watermarkLeft from '../assets/watermark-left.png';
import watermarkRight from '../assets/watermark-right.png';
import watermarkBottom from '../assets/watermark-bottom.png';

export default function MemoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { memories, updateMemory, deleteMemory } = useMemories();
  const { getPhotosByMemoryId, savePhoto } = useIndexedDB();

  const memory = memories.find((m) => m.id === id);

  const [photos, setPhotos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddPhotos, setShowAddPhotos] = useState(false);
  const [pendingPhotos, setPendingPhotos] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const loadPhotos = useCallback(async () => {
    if (!memory) return;
    try {
      const memoryPhotos = await getPhotosByMemoryId(memory.id);
      const photosWithUrls = memoryPhotos.map((photo) => ({
        ...photo,
        url: URL.createObjectURL(photo.blob),
        thumbnailUrl: photo.thumbnail
          ? URL.createObjectURL(photo.thumbnail)
          : URL.createObjectURL(photo.blob),
      }));
      setPhotos(photosWithUrls);
    } catch (error) {
      console.error('Failed to load photos:', error);
    }
  }, [memory, getPhotosByMemoryId]);

  useEffect(() => {
    loadPhotos();
    return () => {
      photos.forEach((p) => {
        if (p.url) URL.revokeObjectURL(p.url);
        if (p.thumbnailUrl) URL.revokeObjectURL(p.thumbnailUrl);
      });
    };
  }, [loadPhotos]);

  const formatDate = (dateString) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // ---- MemoryForm callbacks for edit mode ----

  const handleEditSubmit = (formData) => {
    // MemoryForm calls this with validated data after user clicks its submit button.
    updateMemory(memory.id, {
      title: formData.title,
      date: formData.date,
      category: formData.category,
      description: formData.description,
    });
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  // ---- PhotoUploader callback ----

  const handlePhotosSelected = (fileArray) => {
    // PhotoUploader calls this when user clicks its internal "Upload" button.
    setPendingPhotos(fileArray);
  };

  // ---- Add photos to existing memory ----

  const handleAddPhotos = async () => {
    if (pendingPhotos.length === 0) return;

    setIsUploading(true);
    try {
      const updatedPhotoIds = [...(memory.photoIds || [])];

      for (const file of pendingPhotos) {
        const photoId = generateId();
        const compressedBlob = await compressImage(file);
        const thumbnailBlob = await createThumbnail(file);

        await savePhoto({
          id: photoId,
          memoryId: memory.id,
          blob: compressedBlob,
          thumbnail: thumbnailBlob,
          createdAt: new Date().toISOString(),
        });

        updatedPhotoIds.push(photoId);
      }

      updateMemory(memory.id, { photoIds: updatedPhotoIds });
      setPendingPhotos([]);
      setShowAddPhotos(false);
      await loadPhotos();
    } catch (error) {
      console.error('Failed to add photos:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = () => {
    deleteMemory(memory.id);
    navigate('/memories');
  };

  // Memory not found
  if (!memory) {
    return (
      <div className="min-h-screen bg-[#f5efe8] flex flex-col items-center justify-center pb-16 w-full relative overflow-x-hidden">
        <div className="text-center">
          <h2 className="font-playfair text-2xl text-[#39372b] mb-4">Memory not found</h2>
          <p className="font-ebgaramond text-lg text-[#39372b] mb-6 italic">
            This memory may have been removed or the link is incorrect.
          </p>
          <button
            onClick={() => navigate('/memories')}
            className="px-8 py-3 bg-[#39372b] hover:bg-[#222217] text-white font-playfair uppercase tracking-widest rounded shadow transition-all duration-200"
          >
            Back to Memories
          </button>
        </div>
      </div>
    );
  }

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
        {/* Back button */}
        <button
          onClick={() => navigate('/memories')}
          className="flex items-center gap-2 text-[#39372b] hover:text-[#222217] font-playfair mb-6 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Memories
        </button>

        {/* Memory content */}
        {isEditing ? (
          <div className="bg-white/70 border border-[#e2e0d7] rounded-xl p-6 shadow mb-8">
            <h2 className="font-playfair text-xl text-[#39372b] mb-4">Edit Memory</h2>
            <MemoryForm
              initialData={{
                id: memory.id,
                title: memory.title,
                date: memory.date,
                category: memory.category,
                description: memory.description,
              }}
              onSubmit={handleEditSubmit}
              onCancel={handleEditCancel}
            />
          </div>
        ) : (
          <div className="mb-8">
            {/* Title */}
            <h1 className="font-playfair text-3xl md:text-4xl text-[#39372b] mb-3">
              {memory.title}
            </h1>

            {/* Date */}
            <p className="font-ebgaramond text-lg text-[#39372b] mb-3">
              {formatDate(memory.date)}
            </p>

            {/* Category badge */}
            <span className="inline-block bg-[#B993A5]/20 text-[#39372b] font-playfair text-sm px-4 py-1 rounded-full border border-[#B993A5]/40 mb-6">
              {memory.category}
            </span>

            {/* Description */}
            {memory.description && (
              <p className="font-ebgaramond text-lg text-[#39372b] leading-relaxed mb-6">
                {memory.description}
              </p>
            )}

            {/* Action buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-[#39372b] hover:bg-[#222217] text-white font-playfair uppercase tracking-widest rounded shadow transition-all duration-200 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-6 py-2 border border-red-400 text-red-600 hover:bg-red-50 font-playfair uppercase tracking-widest rounded shadow transition-all duration-200 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Photo Gallery */}
        {photos.length > 0 && (
          <section className="mb-8">
            <h2 className="font-playfair text-xl text-[#39372b] mb-4">Photos</h2>
            <PhotoGallery photos={photos} />
          </section>
        )}

        {/* Add More Photos (collapsible) */}
        <section className="mb-8">
          <button
            onClick={() => setShowAddPhotos(!showAddPhotos)}
            className="flex items-center gap-2 text-[#39372b] hover:text-[#222217] font-playfair transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transition-transform duration-200 ${showAddPhotos ? 'rotate-90' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            Add More Photos
          </button>

          {showAddPhotos && (
            <div className="mt-4 bg-white/70 border border-[#e2e0d7] rounded-xl p-6 shadow">
              <PhotoUploader onPhotosSelected={handlePhotosSelected} maxFiles={20} />
              {pendingPhotos.length > 0 && (
                <div className="mt-4 flex flex-col items-center gap-3">
                  <p className="text-sm text-[#39372b]/60 font-playfair">
                    {pendingPhotos.length} photo{pendingPhotos.length !== 1 ? 's' : ''} ready to upload
                  </p>
                  <button
                    onClick={handleAddPhotos}
                    disabled={isUploading}
                    className="px-8 py-2 bg-[#39372b] hover:bg-[#222217] text-white font-playfair uppercase tracking-widest rounded shadow transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Uploading...
                      </span>
                    ) : (
                      `Save ${pendingPhotos.length} Photo${pendingPhotos.length !== 1 ? 's' : ''}`
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-[#f5efe8] border border-[#e2e0d7] rounded-xl p-8 shadow-xl max-w-md w-full">
            <h3 className="font-playfair text-xl text-[#39372b] mb-3">Delete Memory</h3>
            <p className="font-ebgaramond text-lg text-[#39372b] mb-6">
              Are you sure you want to delete &ldquo;{memory.title}&rdquo;? This action cannot be undone.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-2 border border-[#39372b] text-[#39372b] hover:bg-[#39372b] hover:text-white font-playfair uppercase tracking-widest rounded shadow transition-all duration-200 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-playfair uppercase tracking-widest rounded shadow transition-all duration-200 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
