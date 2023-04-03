import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BookStats } from '../types/bookStats';
import { Database } from '../types/supabase';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { BookState, UserBookInformation, Review } from '../types/book';
import { RootState } from '../../store';

// set up a supabase instance using
const supabase = createBrowserSupabaseClient<Database>();

// volumeInfo is the book information from the Google Books API
// userBookInformation is the book information from the user's read_list table
// bookStats is the book information from the book_stats table

const initialState = {
  bookID: null,
  volumeInfo: {} as any,
  userBookInformation: {} as UserBookInformation,
  bookStats: {} as BookStats,
  status: 'idle',
  openedListEditor: false,
  openedReviewEditor: false,
  error: null,
  userReview: null,
  otherReviews: null,
  latestReviewLoadTime: null,
} as BookState;

const getUserID = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('No user found');

  return user.id;
};

export const fetchBookOnline = createAsyncThunk(
  'book/fetchBook',
  async (bookID: string) => {
    const response = await axios.get(`/api/book/${bookID}`);

    const { bookStats, userBookInformation, volumeInfo } = response.data;

    return { bookStats, userBookInformation, volumeInfo, bookID };
  }
);

export const submitUserBookInformation = createAsyncThunk(
  'book/submitUserBookInformation',
  async (
    {
      title,
      cover,
      totalPages,
      userBookInformation,
    }: {
      title: string;
      cover: string;
      totalPages: number;
      userBookInformation: UserBookInformation;
    },
    { getState }
  ) => {
    const userID = await getUserID();
    const { book } = getState() as RootState;

    if (!book.bookID) {
      throw new Error('No book ID found');
    }

    const {
      status,
      score,
      pages_read,
      start_date,
      finish_date,
      times_reread,
      notes,
      favorite,
    } = userBookInformation;

    // // cache the book image to save on querying too many times from Google Books
    // // this is used in displaying favorites and recently read book titles
    const { error: cacheError } = await supabase.from('cached_books').upsert([
      {
        book_id: book.bookID,
        title,
        cover,
        total_pages: totalPages,
      },
    ]);

    if (cacheError) {
      throw cacheError;
    }

    const { error: uploadError } = await supabase.from('read_list').upsert([
      {
        user_id: userID,
        book_id: book.bookID,
        status: status,
        score: score,
        pages_read: pages_read,
        start_date: start_date,
        finish_date: finish_date,
        times_reread: times_reread,
        notes: notes,
        favorite: favorite,
      },
    ]);

    if (uploadError) {
      throw uploadError;
    }

    const { data: bookStatsResponse, error: bookStatsError } =
      await supabase.rpc('get_book_stats', {
        book_id_to_check: book.bookID as string,
      });

    if (bookStatsError) {
      throw bookStatsError;
    }

    if (!bookStatsResponse) {
      throw new Error('No book stats found');
    }

    return {
      userBookInformation,
      bookStats: bookStatsResponse[0] as unknown as BookStats,
    };
  }
);

export const deleteUserBookInformation = createAsyncThunk(
  'book/deleteUserBookInformation',
  async (_, { getState }) => {
    const userID = await getUserID();
    const { book } = getState() as RootState;

    const { error } = await supabase
      .from('read_list')
      .delete()
      .eq('user_id', userID)
      .eq('book_id', book.bookID);

    if (error) {
      throw error;
    }
  }
);

export const fetchReviews = createAsyncThunk(
  'book/fetchReviews',
  async (_, { getState }) => {
    const userID = await getUserID();
    const { book } = getState() as RootState;

    // separate the user's review from the other reviews to keep it simple
    const { data: userReview } = await supabase
      .from('read_list')
      .select('*, profiles (username, avatar_url)')
      .eq('user_id', userID)
      .eq('book_id', book.bookID);

    const { data: otherReviews, error } = await supabase
      .from('read_list')
      .select('*, profiles (username, avatar_url)')
      .lte('review_post_time', new Date().toISOString())
      .eq('book_id', book.bookID)
      .neq('user_id', userID)
      .order('review_post_time', { ascending: false })
      .limit(10);

    if (error) {
      throw error;
    }

    return {
      userReview: userReview?.[0] as Review,
      otherReviews: otherReviews as Review[],
    };
  }
);

export const submitReview = createAsyncThunk(
  'book/submitReview',
  async (reviewText: string, { getState }) => {
    const userID = await getUserID();
    const { book } = getState() as RootState;
    const latestReviewLoadTime = new Date().toISOString();

    const { error } = await supabase.from('read_list').upsert([
      {
        user_id: userID,
        book_id: book.bookID!,
        review: reviewText,
        review_post_time: latestReviewLoadTime,
      },
    ]);

    const { data: review } = await supabase
      .from('read_list')
      .select('*, profiles (username, avatar_url)')
      .eq('user_id', userID)
      .eq('book_id', book.bookID);

    if (error) {
      console.error('error', error);
    }

    return {
      userReview: review?.[0] as unknown as Review,
      latestReviewLoadTime,
    };
  }
);

export const deleteReview = createAsyncThunk(
  'book/deleteReview',
  async (_, { getState }) => {
    const userID = await getUserID();
    const { book } = getState() as RootState;

    const { error } = await supabase
      .from('read_list')
      .update({ review: null, review_post_time: null })
      .eq('user_id', userID)
      .eq('book_id', book.bookID);

    if (error) {
      throw error;
    }
  }
);

export const bookReducer = createSlice({
  name: 'book',
  initialState,
  reducers: {
    clearBook: () => {
      return initialState;
    },
    openListEditor: (state) => {
      state.openedListEditor = true;
    },
    closeListEditor: (state) => {
      state.openedListEditor = false;
    },
    toggleReviewEditor: (state) => {
      state.openedReviewEditor = !state.openedReviewEditor;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookOnline.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBookOnline.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.volumeInfo = action.payload.volumeInfo;
        state.userBookInformation = action.payload.userBookInformation;
        state.bookStats = action.payload.bookStats;
        state.bookID = action.payload.bookID;
      })
      .addCase(fetchBookOnline.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });

    builder.addCase(submitUserBookInformation.fulfilled, (state, action) => {
      state.userBookInformation = action.payload.userBookInformation;
      state.bookStats = action.payload.bookStats;
    });

    builder.addCase(deleteUserBookInformation.fulfilled, (state) => {
      state.userBookInformation = null;
    });

    builder.addCase(fetchReviews.fulfilled, (state, action) => {
      state.userReview = action.payload.userReview;
      state.otherReviews = action.payload.otherReviews;
    });

    builder.addCase(submitReview.fulfilled, (state, action) => {
      state.userReview = action.payload.userReview;
      state.latestReviewLoadTime = parseInt(
        action.payload.latestReviewLoadTime
      );
    });

    builder.addCase(deleteReview.fulfilled, (state) => {
      state.userReview = null;
    });
  },
});

export const {
  clearBook,
  openListEditor,
  closeListEditor,
  toggleReviewEditor,
} = bookReducer.actions;

export default bookReducer.reducer;
