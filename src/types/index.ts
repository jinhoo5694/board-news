export interface InstagramPost {
  id: string;
  username: string;
  displayName: string;
  caption: string;
  imageUrl: string;
  timestamp: string;
  url: string;
}

export interface ScrapeResult {
  success: boolean;
  postsAdded: number;
  errors?: string[];
}
