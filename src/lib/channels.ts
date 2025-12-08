import { promises as fs } from "fs";
import path from "path";

const CHANNELS_FILE = path.join(process.cwd(), "boardgame_channels.txt");

export interface RssFeedSource {
  url: string;
}

export async function getRssFeeds(): Promise<RssFeedSource[]> {
  const content = await fs.readFile(CHANNELS_FILE, "utf-8");
  const lines = content.split("\n").filter((line) => line.trim());

  return lines
    .filter((line) => line.includes("rss.app/feeds/"))
    .map((url) => ({ url: url.trim() }));
}
