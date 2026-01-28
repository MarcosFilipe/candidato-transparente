import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'tse-bens-cache';
const DB_VERSION = 1;
const STORE_NAME = 'csv-cache';

// Cache expiry: 24 hours
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000;

interface CacheRecord {
  key: string;
  data: string;
  timestamp: number;
}

let dbPromise: Promise<IDBPDatabase> | null = null;

/**
 * Initialize IndexedDB
 */
function getDb(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'key' });
        }
      },
    });
  }
  return dbPromise;
}

/**
 * Generate cache key
 */
export function getCacheKey(ano: number, uf: string, tipo: 'consulta' | 'bens'): string {
  return `${ano}-${uf}-${tipo}`;
}

/**
 * Get cached data
 */
export async function getCached(key: string): Promise<string | null> {
  try {
    const db = await getDb();
    const record = await db.get(STORE_NAME, key) as CacheRecord | undefined;
    
    if (!record) return null;
    
    // Check expiry
    if (Date.now() - record.timestamp > CACHE_EXPIRY_MS) {
      await db.delete(STORE_NAME, key);
      return null;
    }
    
    return record.data;
  } catch (error) {
    console.warn('Cache read error:', error);
    return null;
  }
}

/**
 * Set cache data
 */
export async function setCache(key: string, data: string): Promise<void> {
  try {
    const db = await getDb();
    const record: CacheRecord = {
      key,
      data,
      timestamp: Date.now(),
    };
    await db.put(STORE_NAME, record);
  } catch (error) {
    console.warn('Cache write error:', error);
  }
}

/**
 * Clear all cache
 */
export async function clearCache(): Promise<void> {
  try {
    const db = await getDb();
    await db.clear(STORE_NAME);
  } catch (error) {
    console.warn('Cache clear error:', error);
  }
}

/**
 * In-memory cache for current session
 */
const memoryCache = new Map<string, string>();

export function getMemoryCached(key: string): string | null {
  return memoryCache.get(key) ?? null;
}

export function setMemoryCache(key: string, data: string): void {
  memoryCache.set(key, data);
}

export function clearMemoryCache(): void {
  memoryCache.clear();
}
