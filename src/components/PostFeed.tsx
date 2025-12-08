import { InstagramPost } from "@/types";
import PostCard from "./PostCard";

interface PostFeedProps {
  posts: InstagramPost[];
}

export default function PostFeed({ posts }: PostFeedProps) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-purple-200 bg-white/50 py-20 text-center">
        <div className="mb-4 text-6xl">🎲</div>
        <h2 className="mb-2 text-lg font-semibold text-gray-700">
          게시물이 없습니다
        </h2>
        <p className="max-w-sm text-sm text-gray-500">
          아직 수집된 게시물이 없어요!<br />
          상단의 <span className="text-violet-500 font-medium">새로고침</span> 버튼을 눌러 최신 게시물을 가져와주세요 ✨
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
