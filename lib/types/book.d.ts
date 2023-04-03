import { Database } from '../types/supabase';

export interface BookStats {
  averageScore: number;
  totalFavorites: number;
  totalListings: number;
  totalReviews: number;
  totalCurrentlyReading: number;
  totalCurrentlyPlanning: number;
  totalCurrentlyCompleted: number;
  totalCurrentlyPaused: number;
  totalCurrentlyDropped: number;
}

export interface BookState {
  bookID: string | null;
  volumeInfo: any;
  userBookInformation: Database['public']['Tables']['read_list']['Row'] | null;
  bookStats: BookStats | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  openedListEditor: boolean;
  openedReviewEditor: boolean;
  error: string | null | undefined;
  userReview: Review | null;
  otherReviews: Review[] | null;
  latestReviewLoadTime: number | null;
}

// export interface of Database['public']['Tables']['read_list']['Row']
export type UserBookInformation =
  Database['public']['Tables']['read_list']['Row'];
export type Review = Database['public']['Tables']['read_list']['Row'] & {
  profiles: {
    username: string;
    avatar_url: string;
  };
};
