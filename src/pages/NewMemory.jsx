import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MemoryForm from '../components/MemoryForm';
import PhotoUploader from '../components/PhotoUploader';
import { useMemories } from '../contexts/MemoryContext';
import { useIndexedDB } from '../hooks/useIndexedDB';
import { compressImage, createThumbnail, generateId } from '../utils/imageUtils';
import watermarkLeft from '../assets/watermark-left.png';
import watermarkRight from '../assets/watermark-right.png';
import watermarkBottom from '../assets/watermark-bottom.png';

export default function NewMemory() {
  const navigate = useNavigate();
  const { addMemory } = useMemories();
  const { savePhoto } = useIndexedDB();

  // Holds the validated form data returned by MemoryForm's onSubmit callback.
  // null until the user submits the form inside MemoryForm.
  const [submittedFormData, setSubmittedFormData] = useState(null);

  // Photos that the user has selected via PhotoUploader's "Upload" button.
  const [pendingPhotos, setPendingPhotos] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ref so we can tell whether we already have form data when the
  // main "Save Memory" button is clicked.
  const formDataRef = useRef(null);

  // ---- MemoryForm callbacks ----

  const handleFormSubmit = (formData) => {
    // MemoryForm calls this after its own validation passes.
    setSubmittedFormData(formData);
    formDataRef.current = formData;
  };

  const handleCancel = () => {
    navigate('/memories');
  };

  // ---- PhotoUploader callback ----

  const handlePhotosSelected = (fileArray) => {
    // PhotoUploader calls this when the user clicks its internal "Upload" button.
    setPendingPhotos(fileArray);
  };

  // ---- Main Save ----

  const handleSaveMemory = async () => {
    // Use the latest form data (from ref) — it may have been set in the same
    // render cycle as this click if the user clicks the MemoryForm submit first.
    const data = formDataRef.current || submittedFormData;

    if (!data || !data.title || !data.date) {
      return;
    }

    setIsSubmitting(true);

    try {
      const memoryId = generateId();
      const photoIds = [];

      for (const file of pendingPhotos) {
        const photoId = generateId();
        const compressedBlob = await compressImage(file);
        const thumbnailBlob = await createThumbnail(file);

        await savePhoto({
          id: photoId,
          memoryId,
          blob: compressedBlob,
          thumbnail: thumbnailBlob,
          createdAt: new Date().toISOString(),
        });

        photoIds.push(photoId);
      }

      addMemory({
        id: memoryId,
        title: data.title,
        date: data.date,
        category: data.category,
        description: data.description,
        photoIds,
        createdAt: new Date().toISOString(),
      });

      navigate('/memories');
    } catch (error) {
      console.error('Failed to save memory:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <h1 className="font-playfair text-3xl md:text-4xl text-[#39372b] tracking-widest text-center uppercase mb-8">
          New Memory
        </h1>

        <div className="flex flex-col gap-8">
          {/* Section 1: Memory Details — MemoryForm manages its own state */}
          <section className="bg-white/70 border border-[#e2e0d7] rounded-xl p-6 shadow">
            <h2 className="font-playfair text-xl text-[#39372b] mb-4">Memory Details</h2>
            <MemoryForm
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
            />
          </section>

          {/* Section 2: Photo Upload — PhotoUploader manages its own state */}
          <section className="bg-white/70 border border-[#e2e0d7] rounded-xl p-6 shadow">
            <h2 className="font-playfair text-xl text-[#39372b] mb-4">Photos</h2>
            <PhotoUploader onPhotosSelected={handlePhotosSelected} maxFiles={20} />
            {pendingPhotos.length > 0 && (
              <p className="mt-3 text-sm text-[#39372b]/60 font-playfair text-center">
                {pendingPhotos.length} photo{pendingPhotos.length !== 1 ? 's' : ''} ready to save
              </p>
            )}
          </section>

          {/* Actions — main Save Memory button processes form data + photos */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-2">
            <button
              type="button"
              onClick={handleSaveMemory}
              disabled={isSubmitting || !submittedFormData}
              className="w-full sm:w-auto px-12 py-3 bg-[#39372b] hover:bg-[#222217] text-white font-playfair uppercase tracking-widest rounded shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save Memory'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/memories')}
              className="w-full sm:w-auto px-12 py-3 border border-[#39372b] text-[#39372b] hover:bg-[#39372b] hover:text-white font-playfair uppercase tracking-widest rounded shadow transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>

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
