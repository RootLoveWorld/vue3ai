// Simple in-memory cache for document content
class DocumentCache {
  private cache: Map<string, { content: string | ArrayBuffer | null; timestamp: number }> = new Map();
  private maxSize: number;
  private ttl: number; // Time to live in milliseconds

  constructor(maxSize: number = 100, ttl: number = 30 * 60 * 1000) { // 30 minutes default TTL
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  // Get cached content for a document
  get(documentId: string): string | ArrayBuffer | null | undefined {
    const entry = this.cache.get(documentId);
    
    // Check if entry exists and is not expired
    if (entry) {
      if (Date.now() - entry.timestamp < this.ttl) {
        return entry.content;
      } else {
        // Remove expired entry
        this.cache.delete(documentId);
      }
    }
    
    return undefined;
  }

  // Set content for a document
  set(documentId: string, content: string | ArrayBuffer | null): void {
    // If cache is at max size, remove the oldest entry
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    
    // Add new entry
    this.cache.set(documentId, {
      content,
      timestamp: Date.now()
    });
  }

  // Remove a document from cache
  remove(documentId: string): void {
    this.cache.delete(documentId);
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
  }

  // Get cache size
  size(): number {
    return this.cache.size;
  }
}

// Export singleton instance
export const documentCache = new DocumentCache();