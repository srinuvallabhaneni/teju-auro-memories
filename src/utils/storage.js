/**
 * localStorage-backed storage utilities for memory metadata.
 *
 * Each memory object has the shape:
 * {
 *   id: string,          — auto-generated UUID
 *   title: string,
 *   date: string,        — ISO date string (e.g. '2025-08-08')
 *   description: string,
 *   category: string,    — one of MEMORY_CATEGORIES
 *   photoIds: string[],  — references to stored photos
 *   createdAt: string,   — ISO timestamp
 * }
 */

const STORAGE_KEY = 'wedding_memories';

export const MEMORY_CATEGORIES = [
  'wedding',
  'travel',
  'celebration',
  'milestone',
  'everyday',
  'anniversary',
];

/**
 * Generate a UUID-like string (v4-ish, crypto-based when available).
 * @returns {string}
 */
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Retrieve all memories from localStorage.
 * @returns {object[]}
 */
export const getMemories = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read memories from localStorage:', err);
    return [];
  }
};

/**
 * Overwrite the entire memories array in localStorage.
 * @param {object[]} memories
 */
export const saveMemories = (memories) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
  } catch (err) {
    console.error('Failed to save memories to localStorage:', err);
  }
};

/**
 * Get a single memory by id.
 * @param {string} id
 * @returns {object|undefined}
 */
export const getMemory = (id) => {
  const memories = getMemories();
  return memories.find((m) => m.id === id);
};

/**
 * Add a new memory. Auto-generates id and createdAt.
 * @param {object} memory — partial memory object (title, date, description, category, photoIds)
 * @returns {object} the saved memory with id and createdAt populated
 */
export const addMemory = (memory) => {
  const memories = getMemories();
  const newMemory = {
    ...memory,
    id: generateId(),
    photoIds: memory.photoIds || [],
    createdAt: new Date().toISOString(),
  };
  memories.push(newMemory);
  saveMemories(memories);
  return newMemory;
};

/**
 * Partially update an existing memory.
 * @param {string} id
 * @param {object} updates — fields to merge into the existing memory
 * @returns {object|null} the updated memory, or null if not found
 */
export const updateMemory = (id, updates) => {
  const memories = getMemories();
  const index = memories.findIndex((m) => m.id === id);
  if (index === -1) {
    console.warn(`Memory with id "${id}" not found.`);
    return null;
  }
  memories[index] = { ...memories[index], ...updates, id }; // id is immutable
  saveMemories(memories);
  return memories[index];
};

/**
 * Delete a memory by id.
 * @param {string} id
 * @returns {boolean} true if deleted, false if not found
 */
export const deleteMemory = (id) => {
  const memories = getMemories();
  const filtered = memories.filter((m) => m.id !== id);
  if (filtered.length === memories.length) {
    console.warn(`Memory with id "${id}" not found.`);
    return false;
  }
  saveMemories(filtered);
  return true;
};
