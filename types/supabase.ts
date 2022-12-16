export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
        }
      }
      read_list: {
        Row: {
          book_id: string
          user_id: string
          pages_read: number | null
          score: number | null
          status: string | null
          review: string | null
          review_post_time: string | null
          favorite: boolean
        }
        Insert: {
          book_id: string
          user_id: string
          pages_read?: number | null
          score?: number | null
          status?: string | null
          review?: string | null
          review_post_time?: string | null
          favorite?: boolean
        }
        Update: {
          book_id?: string
          user_id?: string
          pages_read?: number | null
          score?: number | null
          status?: string | null
          review?: string | null
          review_post_time?: string | null
          favorite?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
