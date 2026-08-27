import { Video } from './video.js';

export function formatViews(views: number): string {
  if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
  if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
  return views.toString();
}

export function timeAgo(date: Date, now: Date = new Date()): string {
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  return 'Today';
}

export function filterAndSortVideos(
  videos: Video[],
  search: string,
  category: string,
  sort: string
): Video[] {
  const filtered = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || video.category === category;
    return matchesSearch && matchesCategory;
  });

  return filtered.sort((a, b) => {
    switch (sort) {
      case 'newest': return b.uploadDate.getTime() - a.uploadDate.getTime();
      case 'oldest': return a.uploadDate.getTime() - b.uploadDate.getTime();
      case 'views-high': return b.views - a.views;
      default: return 0;
    }
  });
}
