/**
 * Returns the base URL for the backend API.
 * In development: http://localhost:5000
 * In production: set via NEXT_PUBLIC_API_URL environment variable
 */
export function getApiUrl(): string {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
}

/**
 * Resolves an image URL stored in the database.
 * If the URL starts with /api/ (relative), it is prefixed with the backend URL.
 * Otherwise, it is returned as-is (e.g., external URLs).
 */
export function resolveImageUrl(imageUrl: string | null | undefined): string {
    if (!imageUrl) return "";
    if (imageUrl.startsWith("/api/")) {
        return `${getApiUrl()}${imageUrl}`;
    }
    return imageUrl;
}
