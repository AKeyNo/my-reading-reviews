import Image from 'next/image';
import { stringToMonthDayYear } from '../lib/utils/date';
import { Database } from '../lib/types/supabase';
import { User } from '@supabase/auth-helpers-react';

interface Props {
  review: Omit<Database['public']['Tables']['read_list']['Row'], 'user_id'> & {
    user_id: { username: string; avatar_url: string };
  };
  deleteOwnReview?: () => void;
  user?: User | null;
}

export const Review = ({
  review,
  deleteOwnReview,
  user,
}: Props): // authorID: string
JSX.Element => {
  // if the review text is empty, return
  if (
    !review ||
    !review.user_id ||
    Object.keys(review).length === 0 ||
    !review.review
  )
    return <></>;

  const { score, user_id, review: reviewText, review_post_time } = review;
  const { username, avatar_url } = user_id;

  return (
    <article
      className='col-span-3 p-4 mb-4 bg-gray-800 rounded-md'
      data-cy={`review-${review.user_id.username}-${review.book_id}`}
    >
      <div className='flex items-center justify-center w-full h-max'>
        <div
          className='grid w-16 h-16 mr-4 rounded-full place-items-center bg-slate-500'
          data-cy={`review-${review.user_id.username}-${review.book_id}-avatar-url`}
        >
          {avatar_url ? (
            <Image src={avatar_url} alt={username} />
          ) : (
            <p>{username[0]}</p>
          )}
        </div>
        <div>
          <div
            data-cy={`review-${review.user_id.username}-${review.book_id}-username`}
          >
            {username}
          </div>
          <div
            data-cy={`review-${review.user_id.username}-${review.book_id}-score`}
          >
            {score}/10
          </div>
        </div>
        <div className='flex ml-auto space-x-2 text-gray-400'>
          {user?.user_metadata?.username === username && (
            <>
              <button
                onClick={() => deleteOwnReview && deleteOwnReview()}
                type='button'
                className='duration-150 hover:text-red-500'
                data-cy='review-delete-review-button'
              >
                Delete Your Review
              </button>
              <p>|</p>
            </>
          )}
          <p
            data-cy={`review-${review.user_id.username}-${review.book_id}-post-time`}
          >
            Posted {review_post_time && stringToMonthDayYear(review_post_time)}
          </p>
        </div>
      </div>
      <div
        className='mt-4'
        data-cy={`review-${review.user_id.username}-${review.book_id}-text`}
      >
        {reviewText}
      </div>
    </article>
  );
};
