"use client";

interface ChannelFilterProps {
  channels: string[];
  selectedChannel: string | null;
  onSelectChannel: (channel: string | null) => void;
}

export default function ChannelFilter({
  channels,
  selectedChannel,
  onSelectChannel,
}: ChannelFilterProps) {
  if (channels.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelectChannel(null)}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
          selectedChannel === null
            ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-md"
            : "bg-white text-gray-600 border border-purple-100 hover:border-purple-200 hover:bg-purple-50"
        }`}
      >
        ✨ 전체
      </button>
      {channels.map((channel) => (
        <button
          key={channel}
          onClick={() => onSelectChannel(channel)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
            selectedChannel === channel
              ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-md"
              : "bg-white text-gray-600 border border-purple-100 hover:border-purple-200 hover:bg-purple-50"
          }`}
        >
          @{channel}
        </button>
      ))}
    </div>
  );
}
