import { encodeBase64Url, encodeHex } from "jsr:@std/encoding"
import { crypto } from "jsr:@std/crypto/crypto"

export async function generateShortCode(longURL: string) {

    try {
        new URL(longURL);
    } catch (error) {
        console.log(error);
        throw new Error("Invalid URL provided");
    }

    // Generate a unique identifier for the URL
    const urlData = new TextEncoder().encode(longURL + Date.now());
    const hash = await crypto.subtle.digest("SHA-256", urlData);

    // Take the first 8 of the hash for the short URL
    const shortCode = encodeBase64Url(hash.slice(0, 8));

    return shortCode;
}