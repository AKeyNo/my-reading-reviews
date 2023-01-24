export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      cached_books: {
        Row: {
          book_id: string;
          cover: string | null;
          title: string | null;
          total_pages: number | null;
        };
        Insert: {
          book_id: string;
          cover?: string | null;
          title?: string | null;
          total_pages?: number | null;
        };
        Update: {
          book_id?: string;
          cover?: string | null;
          title?: string | null;
          total_pages?: number | null;
        };
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          full_name: string | null;
          id: string;
          summary: string | null;
          updated_at: string | null;
          username: string | null;
          website: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          full_name?: string | null;
          id: string;
          summary?: string | null;
          updated_at?: string | null;
          username?: string | null;
          website?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          full_name?: string | null;
          id?: string;
          summary?: string | null;
          updated_at?: string | null;
          username?: string | null;
          website?: string | null;
        };
      };
      read_list: {
        Row: {
          book_id: string;
          favorite: boolean;
          finish_date: string | null;
          notes: string | null;
          pages_read: number | null;
          review: string | null;
          review_post_time: string | null;
          score: number | null;
          start_date: string | null;
          status: string | null;
          times_reread: number | null;
          user_id: string;
        };
        Insert: {
          book_id: string;
          favorite?: boolean;
          finish_date?: string | null;
          notes?: string | null;
          pages_read?: number | null;
          review?: string | null;
          review_post_time?: string | null;
          score?: number | null;
          start_date?: string | null;
          status?: string | null;
          times_reread?: number | null;
          user_id: string;
        };
        Update: {
          book_id?: string;
          favorite?: boolean;
          finish_date?: string | null;
          notes?: string | null;
          pages_read?: number | null;
          review?: string | null;
          review_post_time?: string | null;
          score?: number | null;
          start_date?: string | null;
          status?: string | null;
          times_reread?: number | null;
          user_id?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
