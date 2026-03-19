import { useState, useEffect, useRef, useCallback } from 'react';

const DB_NAME = 'tejuauro-memories';
const DB_VERSION = 1;
const STORE_NAME = 'photos';

/**
 * Open (or create) the IndexedDB database.
 * Returns a Promise that resolves with the IDBDatabase instance.
 */
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('memoryId', 'memoryId', { unique: false });
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

/**
 * Helper to run a single IndexedDB transaction and return the result.
 *
 * @param {IDBDatabase} db
 * @param {'readonly'|'readwrite'} mode
 * @param {(store: IDBObjectStore) => IDBRequest|IDBRequest[]} callback
 *   Return the IDBRequest whose result you want.
 * @returns {Promise<*>}
 */
function transact(db, mode, callback) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const store = tx.objectStore(STORE_NAME);
    const request = callback(store);

    tx.oncomplete = () => resolve(request.result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

/**
 * Custom hook for IndexedDB photo storage using the native API.
 *
 * DB: "tejuauro-memories"
 * Object store: "photos" (keyPath: "id", index on "memoryId")
 *
 * @returns {{
 *   savePhoto: (photo: {id: string, memoryId: string, blob: Blob, thumbnail: string, createdAt: string}) => Promise<void>,
 *   getPhotos: (memoryId: string) => Promise<Array>,
 *   getPhoto: (id: string) => Promise<object|undefined>,
 *   deletePhoto: (id: string) => Promise<void>,
 *   getAllPhotos: () => Promise<Array>,
 *   getPhotoCount: () => Promise<number>,
 *   isReady: boolean,
 * }}
 */
export function useIndexedDB() {
  const dbRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  // Open the database once on mount.
  useEffect(() => {
    let cancelled = false;

    openDatabase()
      .then((db) => {
        if (!cancelled) {
          dbRef.current = db;
          setIsReady(true);
        } else {
          db.close();
        }
      })
      .catch((error) => {
        console.error('useIndexedDB: failed to open database', error);
      });

    return () => {
      cancelled = true;
      if (dbRef.current) {
        dbRef.current.close();
        dbRef.current = null;
        setIsReady(false);
      }
    };
  }, []);

  /**
   * Guard that throws if the DB is not open yet.
   */
  const getDb = useCallback(() => {
    if (!dbRef.current) {
      throw new Error('IndexedDB is not ready yet');
    }
    return dbRef.current;
  }, []);

  /**
   * Store a photo object.
   * Expected shape: { id, memoryId, blob, thumbnail, createdAt }
   */
  const savePhoto = useCallback(
    (photo) => {
      const db = getDb();
      return transact(db, 'readwrite', (store) => store.put(photo));
    },
    [getDb],
  );

  /**
   * Get all photos for a given memoryId (uses the "memoryId" index).
   */
  const getPhotos = useCallback(
    (memoryId) => {
      const db = getDb();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const index = store.index('memoryId');
        const request = index.getAll(memoryId);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    },
    [getDb],
  );

  /**
   * Get a single photo by its id.
   */
  const getPhoto = useCallback(
    (id) => {
      const db = getDb();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.get(id);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    },
    [getDb],
  );

  /**
   * Delete a photo by its id.
   */
  const deletePhoto = useCallback(
    (id) => {
      const db = getDb();
      return transact(db, 'readwrite', (store) => store.delete(id));
    },
    [getDb],
  );

  /**
   * Get every photo in the store.
   */
  const getAllPhotos = useCallback(() => {
    const db = getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }, [getDb]);

  /**
   * Get the total number of photos stored.
   */
  const getPhotoCount = useCallback(() => {
    const db = getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.count();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }, [getDb]);

  return {
    savePhoto,
    getPhotos,
    getPhoto,
    deletePhoto,
    getAllPhotos,
    getPhotoCount,
    isReady,
  };
}
