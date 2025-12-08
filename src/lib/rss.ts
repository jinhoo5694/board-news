import { InstagramPost } from "@/types";

interface RssItem {
  title?: string;
  link?: string;
  description?: string;
  pubDate?: string;
  "dc:creator"?: string;
  "media:content"?: {
    $: {
      url: string;
    };
  };
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function extractImageFromDescription(description: string): string | null {
  const imgMatch = description.match(/<img[^>]+src="([^"]+)"/);
  return imgMatch ? decodeHtmlEntities(imgMatch[1]) : null;
}

function extractTextFromDescription(description: string): string {
  return description
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseRssXml(xml: string): RssItem[] {
  const items: RssItem[] = [];
  const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/g);

  if (!itemMatches) return items;

  for (const itemXml of itemMatches) {
    const item: RssItem = {};

    const titleMatch = itemXml.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/);
    if (titleMatch) item.title = titleMatch[1];
    else {
      const titleSimple = itemXml.match(/<title>([\s\S]*?)<\/title>/);
      if (titleSimple) item.title = titleSimple[1];
    }

    const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/);
    if (linkMatch) item.link = linkMatch[1].trim();

    const descMatch = itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/);
    if (descMatch) item.description = descMatch[1];
    else {
      const descSimple = itemXml.match(/<description>([\s\S]*?)<\/description>/);
      if (descSimple) item.description = descSimple[1];
    }

    const pubDateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
    if (pubDateMatch) item.pubDate = pubDateMatch[1].trim();

    const creatorMatch = itemXml.match(/<dc:creator><!\[CDATA\[([\s\S]*?)\]\]><\/dc:creator>/);
    if (creatorMatch) item["dc:creator"] = creatorMatch[1];
    else {
      const creatorSimple = itemXml.match(/<dc:creator>([\s\S]*?)<\/dc:creator>/);
      if (creatorSimple) item["dc:creator"] = creatorSimple[1];
    }

    const mediaMatch = itemXml.match(/<media:content[^>]+url="([^"]+)"/);
    if (mediaMatch) {
      item["media:content"] = { $: { url: mediaMatch[1] } };
    }

    items.push(item);
  }

  return items;
}

function extractChannelTitle(xml: string): string {
  const titleMatch = xml.match(/<channel>[\s\S]*?<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/);
  if (titleMatch) return titleMatch[1];

  const titleSimple = xml.match(/<channel>[\s\S]*?<title>([\s\S]*?)<\/title>/);
  if (titleSimple) return titleSimple[1];

  return "Unknown";
}

function extractUsernameFromTitle(title: string): string {
  const match = title.match(/@(\w+)/);
  return match ? match[1] : title.split(" ")[0];
}

export async function fetchRssFeed(feedUrl: string): Promise<InstagramPost[]> {
  const response = await fetch(feedUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch RSS feed: ${response.status}`);
  }

  const xml = await response.text();
  const items = parseRssXml(xml);
  const channelTitle = extractChannelTitle(xml);
  const username = extractUsernameFromTitle(channelTitle);

  return items.map((item, index) => {
    const rawImageUrl =
      item["media:content"]?.$.url ||
      (item.description ? extractImageFromDescription(item.description) : null) ||
      "";
    const imageUrl = decodeHtmlEntities(rawImageUrl);

    const caption = item.description
      ? extractTextFromDescription(item.description)
      : item.title || "";

    const postId = item.link
      ? item.link.split("/p/")[1]?.replace("/", "") || `${username}-${index}`
      : `${username}-${index}`;

    return {
      id: postId,
      username,
      displayName: channelTitle.split("(")[0].trim(),
      caption,
      imageUrl,
      timestamp: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
      url: item.link || `https://www.instagram.com/${username}/`,
    };
  });
}

export async function fetchAllRssFeeds(feedUrls: string[]): Promise<InstagramPost[]> {
  const results = await Promise.allSettled(
    feedUrls.map((url) => fetchRssFeed(url))
  );

  const posts: InstagramPost[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      posts.push(...result.value);
    }
  }

  return posts;
}
