"use client";

import Image from "next/image";
import { useState } from "react";
import { InstagramPost } from "@/types";

interface PostCardProps {
  post: InstagramPost;
}

function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes}분 전`;
    }
    return `${diffHours}시간 전`;
  }
  if (diffDays === 1) return "어제";
  if (diffDays < 7) return `${diffDays}일 전`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;

  return date.toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
  });
}

export default function PostCard({ post }: PostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = post.caption.length > 100;
  const displayCaption = isExpanded || !shouldTruncate
    ? post.caption
    : post.caption.slice(0, 100) + "...";

  return (
    <article className="overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <a
          href={`https://www.instagram.com/${post.username}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 hover:opacity-80"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 via-fuchsia-400 to-pink-400 text-sm font-bold text-white shadow-md">
            {post.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {post.displayName}
            </p>
            <p className="text-xs text-gray-400">
              @{post.username}
            </p>
          </div>
        </a>
        <span className="ml-auto rounded-full bg-purple-50 px-2.5 py-1 text-xs text-purple-500">
          {formatDate(post.timestamp)}
        </span>
      </div>

      {/* Image */}
      <a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50">
          {post.imageUrl ? (
            <Image
              src={post.imageUrl}
              alt={post.caption.slice(0, 50) || "Instagram post"}
              fill
              className="object-cover transition-transform hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-purple-300">
              <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="mt-2 text-sm">이미지 없음</span>
            </div>
          )}
        </div>
      </a>

      {/* Caption */}
      {post.caption && (
        <div className="px-4 py-3">
          <p className="text-sm leading-relaxed text-gray-600">
            {displayCaption}
          </p>
          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-1.5 text-sm font-medium text-violet-500 hover:text-violet-700"
            >
              {isExpanded ? "접기" : "더 보기"}
            </button>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-purple-50 px-4 py-2.5">
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-violet-500 transition-colors"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
          </svg>
          Instagram에서 보기
        </a>
      </div>
    </article>
  );
}
