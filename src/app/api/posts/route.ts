import { NextResponse } from "next/server";
import { getPosts, getUniqueChannels } from "@/lib/posts";

export async function GET() {
  try {
    const [posts, channels] = await Promise.all([
      getPosts(),
      getUniqueChannels(),
    ]);

    return NextResponse.json({
      posts,
      channels,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "게시물을 불러오는데 실패했습니다.";
    return NextResponse.json(
      { error: errorMessage, posts: [], channels: [] },
      { status: 500 }
    );
  }
}
