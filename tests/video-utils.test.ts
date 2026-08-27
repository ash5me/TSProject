import { filterAndSortVideos, formatViews, timeAgo } from '../src/domain/video-utils.js';
import { Video } from '../src/domain/video.js';

describe('formatViews', () => {
  test('formats numbers below 1000 as plain strings', () => {
    expect(formatViews(0)).toBe('0');
    expect(formatViews(500)).toBe('500');
    expect(formatViews(999)).toBe('999');
  });

  test('formats thousands with K suffix', () => {
    expect(formatViews(1000)).toBe('1.0K');
    expect(formatViews(45000)).toBe('45.0K');
    expect(formatViews(154000)).toBe('154.0K');
    expect(formatViews(999999)).toBe('1000.0K');
  });

  test('formats millions with M suffix', () => {
    expect(formatViews(1000000)).toBe('1.0M');
    expect(formatViews(1200000)).toBe('1.2M');
  });
});

describe('timeAgo', () => {
  const mockNow = new Date('2024-01-01T00:00:00Z');

  test('returns Today for dates on the same day or in the future', () => {
    expect(timeAgo(new Date('2024-01-01T00:00:00Z'), mockNow)).toBe('Today');
    expect(timeAgo(new Date('2024-01-02T00:00:00Z'), mockNow)).toBe('Today');
  });

  test('returns days, months, and years ago correctly', () => {
    expect(timeAgo(new Date('2023-12-27T00:00:00Z'), mockNow)).toBe('5 days ago');
    expect(timeAgo(new Date('2023-11-01T00:00:00Z'), mockNow)).toBe('2 months ago');
    expect(timeAgo(new Date('2022-01-01T00:00:00Z'), mockNow)).toBe('2 years ago');
  });
});

describe('filterAndSortVideos', () => {
  const mockVideos: Video[] = [
    { id: '1', title: 'TypeScript Tutorial', thumbnail: '', videoUrl: '', description: '', views: 100, uploadDate: new Date('2023-01-01'), category: 'Tutorial' },
    { id: '2', title: 'React Vlog', thumbnail: '', videoUrl: '', description: '', views: 500, uploadDate: new Date('2023-06-01'), category: 'Vlog' },
    { id: '3', title: 'Laptop Review', thumbnail: '', videoUrl: '', description: '', views: 300, uploadDate: new Date('2023-03-01'), category: 'Review' },
  ];

  test('filters by search term and category', () => {
    expect(filterAndSortVideos(mockVideos, 'typescript', 'All', 'newest').map(video => video.id)).toEqual(['1']);
    expect(filterAndSortVideos(mockVideos, '', 'Vlog', 'newest').map(video => video.id)).toEqual(['2']);
  });

  test('returns all videos for All and an empty list for no matches', () => {
    expect(filterAndSortVideos(mockVideos, '', 'All', 'newest')).toHaveLength(3);
    expect(filterAndSortVideos(mockVideos, 'nonexistent', 'All', 'newest')).toEqual([]);
  });

  test('sorts by views, newest, and oldest', () => {
    expect(filterAndSortVideos(mockVideos, '', 'All', 'views-high').map(video => video.id)).toEqual(['2', '3', '1']);
    expect(filterAndSortVideos(mockVideos, '', 'All', 'newest').map(video => video.id)).toEqual(['2', '3', '1']);
    expect(filterAndSortVideos(mockVideos, '', 'All', 'oldest').map(video => video.id)).toEqual(['1', '3', '2']);
  });

  test('preserves input order for unknown sorts and ties', () => {
    const tiedVideos = [{ ...mockVideos[0]!, views: 100 }, { ...mockVideos[1]!, views: 100 }];
    expect(filterAndSortVideos(mockVideos, '', 'All', 'unknown').map(video => video.id)).toEqual(['1', '2', '3']);
    expect(filterAndSortVideos(tiedVideos, '', 'All', 'views-high').map(video => video.id)).toEqual(['1', '2']);
    expect(mockVideos.map(video => video.id)).toEqual(['1', '2', '3']);
  });
});
