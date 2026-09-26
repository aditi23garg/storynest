export interface StoryChapter {
  number: string;
  title: string;
  content: string[];
  artifact?: {
    image: string;
    caption: string;
    title: string;
    description: string;
  };
  quote?: {
    text: string;
    author: string;
  };
}

export interface Story {
  id: string;
  title: string;
  subtitle: string;
  hero: string;
  heroAge?: number;
  companion?: string;
  category: string;
  theme: string;
  ageGroup: string;
  ageDisplay: string;
  readTimeMinutes: number;
  wordCount: number;
  coverImage: string;
  readingImage?: string;
  vignetteImage?: string;
  badge?: string;
  epigraph?: {
    quote: string;
    author: string;
  };
  synopsis: string;
  chapters: StoryChapter[];
  audioVoicedBy: string;
  audioDuration: string;
  likesCount: number;
  pageCount: number;
  isCustom?: boolean;
}

export interface ReactionCounts {
  loved: number;
  bedtime: number;
  wonder: number;
  companions: number;
}
