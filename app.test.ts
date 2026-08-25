import { formatViews, timeAgo, filterAndSortVideos, Video } from './utils';

describe('formatViews Utility', () => {
  test('formats numbers below 1000 as plain strings', () => {
    expect(formatViews(500)).toBe('500');
  });

  test('formats thousands with K suffix', () => {
    expect(formatViews(45000)).toBe('45.0K');
    expect(formatViews(154000)).toBe('154.0K');
  });

  test('formats millions with M suffix', () => {
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
});