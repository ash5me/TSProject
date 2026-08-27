import { Video } from '../domain/video.js';

export const videos: Video[] = [
  {
    id: '1',
    title: 'Beach day vlog',
    thumbnail: 'https://picsum.photos/seed/ts/640/360',
    videoUrl: 'assets/videos/waves.mp4',
    description: 'Spending a relaxing day down at the sunny beach! Relax and enjoy the sound of the ocean waves.',
    views: 154000,
    uploadDate: new Date('2023-10-01'),
    category: 'Tutorial'
  },
  {
    id: '2',
    title: 'Millionaire yatch vlog',
    thumbnail: 'https://picsum.photos/seed/vlog1/640/360',
    videoUrl: 'assets/videos/person.mp4',
    description: 'A full tour of a luxury yacht while exploring open waters. Behind the scenes of high life travel.',
    views: 89000,
    uploadDate: new Date('2023-10-15'),
    category: 'Vlog'
  },
  {
    id: '3',
    title: 'Skyscraper everyday fit',
    thumbnail: 'https://picsum.photos/seed/mac/640/360',
    videoUrl: 'assets/videos/motorcycle.mp4',
    description: 'Reviewing urban streetwear and outfits suited for working in high-rise skyscraper offices.',
    views: 320000,
    uploadDate: new Date('2023-11-05'),
    category: 'Review'
  },
  {
    id: '4',
    title: 'Life of an farmer',
    thumbnail: 'https://picsum.photos/seed/bulma/640/360',
    videoUrl: 'assets/videos/honeybee.mp4',
    description: 'An early morning look into daily operations on a self-sustaining organic farm.',
    views: 45000,
    uploadDate: new Date('2023-09-20'),
    category: 'Tutorial'
  },
  {
    id: '5',
    title: 'Solo traveller guide',
    thumbnail: 'https://picsum.photos/seed/desk/640/360',
    videoUrl: 'assets/videos/squirrel.mp4',
    description: 'Essential safety and budget tips when traveling abroad completely on your own.',
    views: 112000,
    uploadDate: new Date('2023-12-01'),
    category: 'Vlog'
  },
  {
    id: '6',
    title: 'Dark forest alone in the dark?',
    thumbnail: 'https://picsum.photos/seed/key/640/360',
    videoUrl: 'assets/videos/lamp.mp4',
    description: 'Nighttime gear test and review deep inside the quiet woods.',
    views: 67000,
    uploadDate: new Date('2023-12-10'),
    category: 'Review'
  }
];
