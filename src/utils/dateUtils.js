/**
 * Date formatting and calculation utilities for the memorial/remembrance app.
 * All functions are pure and have zero external dependencies.
 */

const WEDDING_DATE = '2025-08-08';

/**
 * Calculate the number of whole days between a given date and today.
 * @param {string} dateString — ISO date string (e.g. '2025-08-08')
 * @returns {number} non-negative integer (days since the date, or 0 if in the future)
 */
export const daysSince = (dateString) => {
  const then = new Date(dateString + 'T00:00:00');
  const now = new Date();
  // Zero out the time portion of "now" to get a clean day count
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = today - then;
  return diffMs > 0 ? Math.floor(diffMs / (1000 * 60 * 60 * 24)) : 0;
};

/**
 * Format a date string into a human-readable form like "August 8, 2025".
 * @param {string} dateString — ISO date string
 * @returns {string}
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format a date as a relative time string like "7 months ago" or "2 years ago".
 * @param {string} dateString — ISO date string
 * @returns {string}
 */
export const formatRelativeDate = (dateString) => {
  const then = new Date(dateString + 'T00:00:00');
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = today - then;

  if (diffMs < 0) {
    return 'in the future';
  }

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  }

  const years = Math.floor(diffDays / 365);
  const remainingDays = diffDays - years * 365;
  const remainingMonths = Math.floor(remainingDays / 30);

  if (remainingMonths === 0) {
    return years === 1 ? '1 year ago' : `${years} years ago`;
  }
  return years === 1
    ? `1 year, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''} ago`
    : `${years} years, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''} ago`;
};

/**
 * Calculate the precise elapsed time since the wedding date (Aug 8, 2025).
 * Uses calendar-aware month/year arithmetic rather than fixed-day approximations.
 *
 * @returns {{ years: number, months: number, days: number }}
 */
export const getTimeSinceWedding = () => {
  const wedding = new Date(WEDDING_DATE + 'T00:00:00');
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (today < wedding) {
    return { years: 0, months: 0, days: 0 };
  }

  let years = today.getFullYear() - wedding.getFullYear();
  let months = today.getMonth() - wedding.getMonth();
  let days = today.getDate() - wedding.getDate();

  if (days < 0) {
    months -= 1;
    // Days in the previous month relative to today
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
};

/**
 * Format the time since the wedding as a readable string.
 * Examples: "7 months, 10 days" or "1 year, 2 months, 5 days"
 *
 * @returns {string}
 */
export const formatTimeSinceWedding = () => {
  const { years, months, days } = getTimeSinceWedding();

  const parts = [];

  if (years > 0) {
    parts.push(`${years} year${years > 1 ? 's' : ''}`);
  }
  if (months > 0) {
    parts.push(`${months} month${months > 1 ? 's' : ''}`);
  }
  if (days > 0 || parts.length === 0) {
    parts.push(`${days} day${days !== 1 ? 's' : ''}`);
  }

  return parts.join(', ');
};
