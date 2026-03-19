import React, { useState, useEffect } from 'react';

const CATEGORIES = [
  { value: 'wedding', label: 'Wedding' },
  { value: 'travel', label: 'Travel' },
  { value: 'celebration', label: 'Celebration' },
  { value: 'milestone', label: 'Milestone' },
  { value: 'everyday', label: 'Everyday' },
  { value: 'anniversary', label: 'Anniversary' },
];

export default function MemoryForm({ initialData, onSubmit, onCancel }) {
  const isEditing = Boolean(initialData?.id);

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    category: 'everyday',
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Initialize form with existing data when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        date: initialData.date || '',
        category: initialData.category || 'everyday',
        description: initialData.description || '',
      });
    }
  }, [initialData]);

  const validate = (data) => {
    const newErrors = {};
    if (!data.title.trim()) {
      newErrors.title = 'Title is required.';
    } else if (data.title.trim().length > 100) {
      newErrors.title = 'Title must be 100 characters or fewer.';
    }
    if (!data.date) {
      newErrors.date = 'Date is required.';
    }
    if (!data.category) {
      newErrors.category = 'Please select a category.';
    }
    if (data.description.length > 2000) {
      newErrors.description = 'Description must be 2000 characters or fewer.';
    }
    return newErrors;
  };

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    // Clear error for this field as user types
    if (touched[field]) {
      const newErrors = validate(updated);
      setErrors((prev) => ({
        ...prev,
        [field]: newErrors[field] || undefined,
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validate(formData);
    setErrors((prev) => ({
      ...prev,
      [field]: newErrors[field] || undefined,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = { title: true, date: true, category: true, description: true };
    setTouched(allTouched);

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    const submission = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
    };

    if (initialData?.id) {
      submission.id = initialData.id;
    }

    onSubmit(submission);
  };

  const inputBaseClass = `
    w-full px-4 py-3 rounded-lg
    bg-[#f5efe8] text-[#39372b]
    border transition-colors duration-200
    placeholder-[#39372b]/30
    focus:outline-none focus:ring-2 focus:ring-[#B993A5]/40 focus:border-[#B993A5]
    font-ebgaramond text-base
  `;

  const getInputBorderClass = (field) => {
    if (errors[field] && touched[field]) {
      return 'border-red-400';
    }
    return 'border-[#B993A5]/20 hover:border-[#B993A5]/40';
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto space-y-5">
      {/* Title */}
      <div>
        <label
          htmlFor="memory-title"
          className="block text-sm font-playfair text-[#39372b] mb-1.5"
        >
          Title <span className="text-[#B993A5]">*</span>
        </label>
        <input
          id="memory-title"
          type="text"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          onBlur={() => handleBlur('title')}
          placeholder="A special moment..."
          maxLength={100}
          className={`${inputBaseClass} ${getInputBorderClass('title')}`}
        />
        {errors.title && touched.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      {/* Date */}
      <div>
        <label
          htmlFor="memory-date"
          className="block text-sm font-playfair text-[#39372b] mb-1.5"
        >
          Date <span className="text-[#B993A5]">*</span>
        </label>
        <input
          id="memory-date"
          type="date"
          value={formData.date}
          onChange={(e) => handleChange('date', e.target.value)}
          onBlur={() => handleBlur('date')}
          className={`${inputBaseClass} ${getInputBorderClass('date')}`}
        />
        {errors.date && touched.date && (
          <p className="mt-1 text-sm text-red-500">{errors.date}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label
          htmlFor="memory-category"
          className="block text-sm font-playfair text-[#39372b] mb-1.5"
        >
          Category <span className="text-[#B993A5]">*</span>
        </label>
        <select
          id="memory-category"
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          onBlur={() => handleBlur('category')}
          className={`${inputBaseClass} ${getInputBorderClass('category')} appearance-none cursor-pointer`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2339372b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.75rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.25em 1.25em',
            paddingRight: '2.5rem',
          }}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        {errors.category && touched.category && (
          <p className="mt-1 text-sm text-red-500">{errors.category}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="memory-description"
          className="block text-sm font-playfair text-[#39372b] mb-1.5"
        >
          Description
        </label>
        <textarea
          id="memory-description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          onBlur={() => handleBlur('description')}
          placeholder="Share the story behind this memory..."
          rows={4}
          maxLength={2000}
          className={`${inputBaseClass} ${getInputBorderClass('description')} resize-y min-h-[100px]`}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.description && touched.description ? (
            <p className="text-sm text-red-500">{errors.description}</p>
          ) : (
            <span />
          )}
          <span className="text-xs text-[#39372b]/30">
            {formData.description.length}/2000
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="
            flex-1 px-6 py-3 rounded-lg
            bg-[#B993A5] text-white
            font-playfair text-base
            hover:bg-[#a07d91] active:bg-[#8d6c7f]
            transition-colors duration-200
            shadow-sm hover:shadow-md
          "
        >
          {isEditing ? 'Update Memory' : 'Save Memory'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="
              px-6 py-3 rounded-lg
              bg-transparent text-[#39372b]/60
              border border-[#39372b]/15
              font-playfair text-base
              hover:bg-[#39372b]/5 hover:text-[#39372b]
              transition-colors duration-200
            "
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
