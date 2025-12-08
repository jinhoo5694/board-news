"use client";

import { useState, useEffect, useCallback } from "react";
import { InstagramPost } from "@/types";
import PostFeed from "@/components/PostFeed";
import ChannelFilter from "@/components/ChannelFilter";

export default function Home() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [channels, setChannels] = useState<string[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isScraping, setIsScraping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/posts");
      if (!res.ok) throw new Error("게시물을 불러오는데 실패했습니다.");
      const data = await res.json();
      setPosts(data.posts);
      setChannels(data.channels);
      if (data.posts.length > 0) {
        setLastUpdated(new Date());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleScrape = async () => {
    setIsScraping(true);
    setError(null);
    try {
      const res = await fetch("/api/scrape", { method: "POST" });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.errors?.join(", ") || "새로고침에 실패했습니다.");
      }
      await fetchPosts();
      if (data.postsAdded > 0) {
        alert(`${data.postsAdded}개의 새 게시물이 추가되었습니다.`);
      } else {
        alert("새로운 게시물이 없습니다.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "새로고침 오류가 발생했습니다.");
    } finally {
      setIsScraping(false);
    }
  };

  const filteredPosts = selectedChannel
    ? posts.filter((p) => p.username.toLowerCase() === selectedChannel.toLowerCase())
    : posts;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-purple-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xl shadow-md">
                🎲
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                  보드게임 뉴스
                </h1>
                <p className="text-xs text-gray-500">
                  한국 보드게임 커뮤니티 소식
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {lastUpdated && (
                <span className="hidden text-xs text-gray-400 sm:block">
                  {lastUpdated.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })} 업데이트
                </span>
              )}
              <button
                onClick={handleScrape}
                disabled={isScraping}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              >
                {isScraping ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    수집 중...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    새로고침
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl bg-red-50 border border-red-100 p-4 text-red-600">
            <span className="text-xl">😢</span>
            {error}
          </div>
        )}

        {/* Filter */}
        {channels.length > 0 && (
          <div className="mb-6">
            <ChannelFilter
              channels={channels}
              selectedChannel={selectedChannel}
              onSelectChannel={setSelectedChannel}
            />
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-purple-100"></div>
              <div className="absolute top-0 h-16 w-16 rounded-full border-4 border-transparent border-t-violet-500 animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-500">불러오는 중...</p>
          </div>
        ) : (
          <PostFeed posts={filteredPosts} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-100 bg-white/50 py-8 mt-8">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="text-sm text-gray-500">
            🎲 한국 보드게임 커뮤니티의 인스타그램 소식을 모아봅니다
          </p>
          <p className="mt-2 text-xs text-gray-400">
            {channels.length}개 채널 · {posts.length}개 게시물
          </p>
        </div>
      </footer>
    </div>
  );
}
