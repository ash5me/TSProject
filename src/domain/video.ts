export type VideoCategory = 'Tutorial' | 'Vlog' | 'Review';

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  description: string;
  views: number;
  uploadDate: Date;
  category: VideoCategory;
}
