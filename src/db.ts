import { encodeBase64Url } from "jsr:@std/encoding"
import { crypto } from "jsr:@std/crypto/crypto"

// Custom Types

export type ShortLink = {
    shortCode: string;
    longUrl: string;
    createdAt: number;
    userId: string;
    clickCount: number;
    lastClickEvent?: string;
}

export type GitHubUser = {
    login: string; // username
    avatar_url: string;
    html_url: string;
};


// Read & Write Data with Deno KV

export async function generateShortCode(longUrl: string) {
    try {
      new URL(longUrl);
    } catch (error) {
      console.log(error);
      throw new Error("Invalid URL provided");
    }
  
    // Generate a unique identifier for the URL
    const urlData = new TextEncoder().encode(longUrl + Date.now());
    const hash = await crypto.subtle.digest("SHA-256", urlData);
  
    // Take the first 8 of the hash for the short URL
    const shortCode = encodeBase64Url(hash.slice(0, 8));
  
    return shortCode;
  }

const kv = await Deno.openKv();

export async function storeShortLink(
    longUrl: string,
    shortCode: string,
    userId: string,
  ) {
    const shortLinkKey = ["shortlinks", shortCode];
    const data: ShortLink = {
      shortCode,
      longUrl,
      userId,
      createdAt: Date.now(),
      clickCount: 0,
    };

    const res = await kv.set(shortLinkKey, data);

    if (!res.ok) {
        // handle errors
        console.log("Not getting the right stuff")
    }

    return res;
}


export async function getShortLink(shortCode: string) {
    const link = await kv.get<ShortLink>(["shortlinks", shortCode]);
    return link.value;
  }

////////////////////////////////
///// User Model //////
////////////////////////////////

export async function storeUser(sessionId: string, userData: GitHubUser) {
    const key = ["sessions", sessionId];
    const res = await kv.set(key, userData);
    return res;
  }

export async function getUser(sessionId: string) {
const key = ["sessions", sessionId];
const res = await kv.get<GitHubUser>(key);
return res.value;
}


//////////////////////////////////////

// Temporary example to try it out
// deno run -A --unstable-kv src/db.ts

// const longUrl = 'https://www.github.com';
// const shortCode = await generateShortCode(longUrl)
// const userId = 'test';

// console.log(shortCode)


// await storeShortLink(longUrl, shortCode, userId);

// const linkData = await getShortLink(shortCode)
// console.log(linkData)