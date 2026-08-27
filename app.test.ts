import { formatViews, timeAgo, filterAndSortVideos, Video } from './utils';

describe('formatViews Utility', () => {
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

describe('timeAgo Utility', () => {
  const mockNow = new Date('2024-01-01T00:00:00Z');

  test('returns "Today" for dates on the same day', () => {
    const sameDay = new Date('2024-01-01T00:00:00Z');
    expect(timeAgo(sameDay, mockNow)).toBe('Today');
  });

  test('returns days ago correctly', () => {
    const fiveDaysAgo = new Date('2023-12-27T00:00:00Z');
    expect(timeAgo(fiveDaysAgo, mockNow)).toBe('5 days ago');
  });

  test('returns months ago correctly', () => {
    const twoMonthsAgo = new Date('2023-11-01T00:00:00Z');
    expect(timeAgo(twoMonthsAgo, mockNow)).toBe('2 months ago');
  });

  test('returns years ago correctly', () => {
    const twoYearsAgo = new Date('2022-01-01T00:00:00Z');
    expect(timeAgo(twoYearsAgo, mockNow)).toBe('2 years ago');
  });

  test('returns "Today" for future dates', () => {
    const tomorrow = new Date('2024-01-02T00:00:00Z');
    expect(timeAgo(tomorrow, mockNow)).toBe('Today');
  });
});

describe('filterAndSortVideos', () => {
  const mockVideos: Video[] = [
    { id: '1', title: 'TypeScript Tutorial', thumbnail: '', views: 100, uploadDate: new Date('2023-01-01'), category: 'Tutorial' },
    { id: '2', title: 'React Vlog', thumbnail: '', views: 500, uploadDate: new Date('2023-06-01'), category: 'Vlog' },
    { id: '3', title: 'Laptop Review', thumbnail: '', views: 300, uploadDate: new Date('2023-03-01'), category: 'Review' },
  ];

  test('filters videos by search term (case-insensitive)', () => {
    const result = filterAndSortVideos(mockVideos, 'typescript', 'All', 'newest');
    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe('1');
  });

  test('filters videos by category', () => {
    const result = filterAndSortVideos(mockVideos, '', 'Vlog', 'newest');
    expect(result).toHaveLength(1);
    expect(result[0]!.category).toBe('Vlog');
  });

  test('returns all videos when category is All and search is empty', () => {
    const result = filterAndSortVideos(mockVideos, '', 'All', 'newest');

    expect(result).toHaveLength(3);
  });

  test('returns an empty list when no videos match', () => {
    const result = filterAndSortVideos(mockVideos, 'nonexistent', 'All', 'newest');

    expect(result).toEqual([]);
  });

  test('sorts videos by most popular (views-high)', () => {
    const result = filterAndSortVideos(mockVideos, '', 'All', 'views-high');
    expect(result[0]!.views).toBe(500);
    expect(result[1]!.views).toBe(300);
    expect(result[2]!.views).toBe(100);
  });

  test('sorts videos by newest first', () => {
    const result = filterAndSortVideos(mockVideos, '', 'All', 'newest');
    expect(result[0]!.id).toBe('2'); // June 2023
    expect(result[2]!.id).toBe('1'); // Jan 2023
  });

  test('sorts videos by oldest first', () => {
    const result = filterAndSortVideos(mockVideos, '', 'All', 'oldest');
    expect(result[0]!.id).toBe('1'); // Jan 2023
    expect(result[2]!.id).toBe('2'); // June 2023
  });

  test('preserves the input order for the default sort', () => {
    const result = filterAndSortVideos(mockVideos, '', 'All', 'unknown');

    expect(result.map(video => video.id)).toEqual(['1', '2', '3']);
    expect(mockVideos.map(video => video.id)).toEqual(['1', '2', '3']);
  });

  test('keeps equal-valued videos in their original order', () => {
    const tiedVideos: Video[] = [
      { ...mockVideos[0]!, views: 100 },
      { ...mockVideos[1]!, views: 100 },
    ];

    const result = filterAndSortVideos(tiedVideos, '', 'All', 'views-high');

    expect(result.map(video => video.id)).toEqual(['1', '2']);
  });
});