import { promises as fs } from "fs";
import path from "path";
import { InstagramPost } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const POSTS_FILE = path.join(DATA_DIR, "posts.json");

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function cleanPost(post: InstagramPost): InstagramPost {
  return {
    ...post,
    imageUrl: decodeHtmlEntities(post.imageUrl),
  };
}

async function ensureDataDir(): Promise<void> {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

export async function getPosts(): Promise<InstagramPost[]> {
  try {
    await ensureDataDir();
    const content = await fs.readFile(POSTS_FILE, "utf-8");
    const posts: InstagramPost[] = JSON.parse(content);
    return posts
      .map(cleanPost)
      .sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
  } catch {
    return [];
  }
}

export async function savePosts(posts: InstagramPost[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2), "utf-8");
}

export async function addPosts(newPosts: InstagramPost[]): Promise<number> {
  const existingPosts = await getPosts();
  const existingIds = new Set(existingPosts.map((p) => p.id));

  const uniqueNewPosts = newPosts.filter((p) => !existingIds.has(p.id));

  if (uniqueNewPosts.length > 0) {
    const allPosts = [...existingPosts, ...uniqueNewPosts];
    allPosts.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    await savePosts(allPosts);
  }

  return uniqueNewPosts.length;
}

export async function getPostsByChannel(
  username: string
): Promise<InstagramPost[]> {
  const posts = await getPosts();
  return posts.filter(
    (p) => p.username.toLowerCase() === username.toLowerCase()
  );
}

export async function getUniqueChannels(): Promise<string[]> {
  const posts = await getPosts();
  const channels = new Set(posts.map((p) => p.username));
  return Array.from(channels).sort();
}
