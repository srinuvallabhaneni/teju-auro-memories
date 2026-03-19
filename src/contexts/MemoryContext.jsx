import { createContext, useContext, useCallback, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// ---------------------------------------------------------------------------
// Default seed data -- pre-populated wedding events
// ---------------------------------------------------------------------------
const SEED_MEMORIES = [
  {
    id: 'sangeet',
    title: 'Sangeet Night',
    date: '2025-08-06',
    description: 'An evening of music, dance, and celebration',
    category: 'wedding',
    photoIds: [],
  },
  {
    id: 'haldi',
    title: 'Haldi Ceremony',
    date: '2025-08-07',
    description: 'The sacred turmeric ceremony filled with love',
    category: 'wedding',
    photoIds: [],
  },
  {
    id: 'wedding',
    title: 'Wedding Ceremony',
    date: '2025-08-08',
    description: 'The beautiful ceremony at Casa Bella, Sunol',
    category: 'wedding',
    photoIds: [],
  },
];

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
const MemoryContext = createContext(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function MemoryProvider({ children }) {
  const [memories, setMemories] = useLocalStorage(
    'tejuauro-memories',
    SEED_MEMORIES,
  );

  /**
   * Add a new memory. Caller must supply at least { id, title }.
   * Sensible defaults are merged in for missing fields.
   */
  const addMemory = useCallback(
    (memory) => {
      setMemories((prev) => [
        ...prev,
        {
          category: 'personal',
          photoIds: [],
          date: new Date().toISOString().split('T')[0],
          description: '',
          ...memory,
        },
      ]);
    },
    [setMemories],
  );

  /**
   * Update an existing memory by id. Accepts a partial object that will be
   * shallow-merged into the existing entry.
   */
  const updateMemory = useCallback(
    (id, updates) => {
      setMemories((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...updates } : m)),
      );
    },
    [setMemories],
  );

  /**
   * Remove a memory by id.
   */
  const deleteMemory = useCallback(
    (id) => {
      setMemories((prev) => prev.filter((m) => m.id !== id));
    },
    [setMemories],
  );

  /**
   * Retrieve a single memory by id (returns undefined if not found).
   */
  const getMemory = useCallback(
    (id) => memories.find((m) => m.id === id),
    [memories],
  );

  // Stabilise the context value to avoid unnecessary re-renders.
  const value = useMemo(
    () => ({
      memories,
      addMemory,
      updateMemory,
      deleteMemory,
      getMemory,
    }),
    [memories, addMemory, updateMemory, deleteMemory, getMemory],
  );

  return (
    <MemoryContext.Provider value={value}>{children}</MemoryContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Consumer hook
// ---------------------------------------------------------------------------

/**
 * Access the global memory state.
 *
 * Must be used inside a <MemoryProvider>.
 *
 * @returns {{
 *   memories: Array,
 *   addMemory: (memory: object) => void,
 *   updateMemory: (id: string, updates: object) => void,
 *   deleteMemory: (id: string) => void,
 *   getMemory: (id: string) => object|undefined,
 * }}
 */
export function useMemories() {
  const ctx = useContext(MemoryContext);
  if (ctx === null) {
    throw new Error('useMemories must be used within a <MemoryProvider>');
  }
  return ctx;
}
