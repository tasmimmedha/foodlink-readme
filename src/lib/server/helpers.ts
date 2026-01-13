/**
 * Utility functions for server-side operations
 */

/**
 * Simple client-side password hashing
 * Uses a combination of encoding and hashing for basic security
 */
export function hashPassword(password: string): string {
  // Simple hash function for client-side use
  let hash = 0;
  const str = password + "foodflow_salt_2024";
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36) + btoa(str).slice(0, 16);
}

/**
 * Verify password against hash
 */
export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

/**
 * Generate a simple token (encoded user data)
 */
export function generateToken(userId: string, email: string): string {
  const payload = {
    userId,
    email,
    iat: Date.now(),
  };
  return btoa(JSON.stringify(payload));
}

/**
 * Decode token
 */
export function decodeToken(token: string): { userId: string; email: string; iat: number } | null {
  try {
    return JSON.parse(atob(token));
  } catch {
    return null;
  }
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get current timestamp in ISO format
 */
export function getTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Add artificial delay to simulate network latency
 */
export function delay(ms: number = 150): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate expiry date based on typical expiry days
 */
export function calculateExpiryDate(typicalExpiryDays: number, startDate?: string): string {
  const start = startDate ? new Date(startDate) : new Date();
  const expiry = new Date(start);
  expiry.setDate(expiry.getDate() + typicalExpiryDays);
  return expiry.toISOString().split("T")[0];
}

/**
 * Check if date is expiring soon (within 3 days)
 */
export function isExpiringSoon(expiryDate: string): boolean {
  const expiry = new Date(expiryDate);
  const today = new Date();
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 3;
}

/**
 * Check if date is expired
 */
export function isExpired(expiryDate: string): boolean {
  const expiry = new Date(expiryDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);
  return expiry < today;
}

/**
 * Convert file to base64
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] || result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Get file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

