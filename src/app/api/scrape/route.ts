import { NextResponse } from "next/server";
import { getRssFeeds } from "@/lib/channels";
import { fetchAllRssFeeds } from "@/lib/rss";
import { addPosts } from "@/lib/posts";
import { ScrapeResult } from "@/types";

export async function POST(): Promise<NextResponse<ScrapeResult>> {
  try {
    const feeds = await getRssFeeds();

    if (feeds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          postsAdded: 0,
          errors: ["RSS 피드 URL이 설정되지 않았습니다."],
        },
        { status: 500 }
      );
    }

    const feedUrls = feeds.map((f) => f.url);
    const posts = await fetchAllRssFeeds(feedUrls);
    const postsAdded = await addPosts(posts);

    return NextResponse.json({
      success: true,
      postsAdded,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
    return NextResponse.json(
      {
        success: false,
        postsAdded: 0,
        errors: [errorMessage],
      },
      { status: 500 }
    );
  }
}
