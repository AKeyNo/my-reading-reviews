import { useEffect, useState } from 'react';
import supabase from '../client';
import { Database } from '../types/supabase';
import { Review } from './Review';

interface Props {
  id: string;
}

export const ReviewList = ({ id }: Props): JSX.Element => {
  const [reviews, setReviews] = useState(
    [] as (Omit<Database['public']['Tables']['read_list']['Row'], 'user_id'> & {
      user_id: { username: string; avatar_url: string };
    })[]
  );
  // store the time the reviews were loaded
  const [initialReviewLoadTime, setInitialReviewLoadTime] = useState(
    new Date().toISOString()
  );
  // determines whether or not the "create a review" menu is shown
  const [showReviewCreation, setShowReviewCreation] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error, status } = await supabase
        .from('read_list')
        .select('*, user_id (username, avatar_url)')
        .lte('review_post_time', initialReviewLoadTime);

      if (!data || error) return;

      // @ts-ignore
      setReviews(data);
    };

    fetchReviews();
  }, [initialReviewLoadTime]);

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
        <form className='col-span-3 p-4 mb-4 bg-gray-800 rounded-md'>
          <label className='mb-2 font-semibold'>Create a review</label>
          <textarea className='w-full p-2 my-2 rounded-md' />
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
