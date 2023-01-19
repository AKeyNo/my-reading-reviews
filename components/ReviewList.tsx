import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useEffect, useRef, useState } from 'react';
import { Database } from '../lib/types/supabase';
import { Review } from './Review';

interface Props {
  id: string;
}

export const ReviewList = ({ id }: Props): JSX.Element => {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [reviews, setReviews] = useState(
    [] as (Omit<Database['public']['Tables']['read_list']['Row'], 'user_id'> & {
      user_id: { username: string; avatar_url: string };
    })[]
  );

  const reviewRef = useRef<HTMLTextAreaElement>(null);

  // store the time the reviews were loaded
  const [initialReviewLoadTime, setInitialReviewLoadTime] = useState(
    new Date().toISOString()
  );
  // determines whether or not the "create a review" menu is shown
  const [showReviewCreation, setShowReviewCreation] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!supabase) return;

      const { data, error } = await supabase
        .from('read_list')
        .select('*, user_id (username, avatar_url)')
        .lte('review_post_time', initialReviewLoadTime)
        .eq('book_id', id);

      if (!data || error) return;

      setReviews(data);
    };

    fetchReviews();
  }, [initialReviewLoadTime, supabase, id]);

  const submitReview = async () => {
    window.event?.preventDefault();

    if (!reviewRef.current?.value || !user) return;

    const { error } = await supabase.from('read_list').upsert([
      {
        user_id: user.id,
        book_id: id,
        review: reviewRef.current?.value,
        review_post_time: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('error', error);
    }

    setInitialReviewLoadTime(new Date().toISOString());
    setShowReviewCreation(false);

    reviewRef.current.value = '';
  };

  return (
    <div className='w-full col-span-3'>
      <div className='flex items-center mb-4'>
        <div className='font-semibold'>Reviews</div>
        <button
          onClick={() => setShowReviewCreation(!showReviewCreation)}
          className='p-2 ml-auto text-sm duration-100 bg-orange-700 rounded-md hover:bg-orange-800'
        >
          {showReviewCreation ? 'Close Review Form' : 'Create a review'}
        </button>
      </div>
      {showReviewCreation ? (
        <form
          onSubmit={submitReview}
          className='col-span-3 p-4 mb-4 bg-gray-800 rounded-md'
        >
          <label className='mb-2 font-semibold'>Create a review</label>
          <textarea ref={reviewRef} className='w-full p-2 my-2 rounded-md' />
          <button
            type='submit'
            className='p-2 text-sm duration-100 bg-orange-700 rounded-md hover:bg-orange-800'
          >
            Submit
          </button>
        </form>
      ) : null}

      <div>
        {reviews.map((review, key) => {
          return <Review review={review} key={key} />;
        })}
      </div>
    </div>
  );
};
