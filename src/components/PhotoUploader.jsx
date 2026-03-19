import React, { useState, useRef, useCallback } from 'react';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export default function PhotoUploader({ onPhotosSelected, maxFiles = 20 }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  const validateFiles = useCallback((files) => {
    const validFiles = [];
    const newErrors = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        newErrors.push(`"${file.name}" is not an image file.`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        newErrors.push(`"${file.name}" exceeds the 20MB limit.`);
        continue;
      }
      validFiles.push(file);
    }

    return { validFiles, newErrors };
  }, []);

  const addFiles = useCallback((incomingFiles) => {
    const { validFiles, newErrors } = validateFiles(incomingFiles);
    setErrors(newErrors);

    if (validFiles.length === 0) return;

    setSelectedFiles((prev) => {
      const remaining = maxFiles - prev.length;
      if (remaining <= 0) {
        setErrors((e) => [...e, `Maximum of ${maxFiles} photos allowed.`]);
        return prev;
      }
      const toAdd = validFiles.slice(0, remaining);
      if (validFiles.length > remaining) {
        setErrors((e) => [
          ...e,
          `Only ${remaining} more photo${remaining === 1 ? '' : 's'} can be added. ${validFiles.length - remaining} skipped.`,
        ]);
      }

      // Generate previews for the new files
      toAdd.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews((p) => [...p, { name: file.name, url: reader.result }]);
        };
        reader.readAsDataURL(file);
      });

      return [...prev, ...toAdd];
    });
  }, [maxFiles, validateFiles]);

  const removeFile = useCallback((index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setErrors([]);
  }, []);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      addFiles(files);
    }
  }, [addFiles]);

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      addFiles(files);
    }
    // Reset the input so the same file can be re-selected
    e.target.value = '';
  }, [addFiles]);

  const handleUploadClick = () => {
    if (selectedFiles.length > 0 && onPhotosSelected) {
      onPhotosSelected(selectedFiles);
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={openFilePicker}
        className={`
          relative cursor-pointer rounded-xl border-2 border-dashed p-8 md:p-12
          transition-all duration-300 ease-in-out text-center
          ${isDragging
            ? 'border-[#B993A5] bg-[#B993A5]/10 scale-[1.02]'
            : 'border-[#B993A5]/50 bg-[#f5efe8]/50 hover:border-[#B993A5] hover:bg-[#B993A5]/5'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Upload Icon */}
        <div className="flex flex-col items-center gap-3">
          <svg
            className={`w-12 h-12 transition-colors duration-300 ${isDragging ? 'text-[#B993A5]' : 'text-[#B993A5]/60'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
            />
          </svg>
          <div>
            <p className="font-playfair text-lg text-[#39372b]">
              {isDragging ? 'Drop your photos here' : 'Drag & drop photos here'}
            </p>
            <p className="text-sm text-[#39372b]/60 mt-1">
              or <span className="text-[#B993A5] underline underline-offset-2">click to browse</span>
            </p>
          </div>
          <p className="text-xs text-[#39372b]/40 mt-1">
            Images only, up to 20MB each
          </p>
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mt-3 space-y-1">
          {errors.map((error, i) => (
            <p key={i} className="text-sm text-red-600/80 font-medium">
              {error}
            </p>
          ))}
        </div>
      )}

      {/* Photo Count */}
      {selectedFiles.length > 0 && (
        <p className="text-sm text-[#39372b]/60 mt-4 text-center font-playfair">
          {selectedFiles.length} of {maxFiles} photos selected
        </p>
      )}

      {/* Preview Thumbnails */}
      {previews.length > 0 && (
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {previews.map((preview, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={preview.url}
                alt={preview.name}
                className="w-full h-full object-cover rounded-lg shadow-sm"
              />
              {/* Remove Button - always visible on mobile, hover on desktop */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="
                  absolute -top-2 -right-2 w-7 h-7 rounded-full
                  bg-[#39372b] text-white text-sm leading-none
                  flex items-center justify-center
                  opacity-100 md:opacity-0 md:group-hover:opacity-100
                  transition-opacity duration-200
                  hover:bg-[#222217] shadow-md
                "
                aria-label={`Remove ${preview.name}`}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {selectedFiles.length > 0 && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={handleUploadClick}
            className="
              px-8 py-3 rounded-lg
              bg-[#B993A5] text-white font-playfair text-lg
              hover:bg-[#a07d91] active:bg-[#8d6c7f]
              transition-colors duration-200
              shadow-sm hover:shadow-md
              min-w-[200px]
            "
          >
            Upload {selectedFiles.length} photo{selectedFiles.length !== 1 ? 's' : ''}
          </button>
        </div>
      )}
    </div>
  );
}
