import { stringToMonthDayYear } from '../lib/utils/date';
import { Database } from '../lib/types/supabase';
import { User } from '@supabase/auth-helpers-react';
import { Avatar } from './Avatar';

interface Props {
  review: Database['public']['Tables']['read_list']['Row'] & {
    profiles: {
      username: string;
      avatar_url: string;
    };
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
  const { username, avatar_url } = review.profiles;

  return (
    <article
      className='col-span-3 p-4 mb-4 bg-gray-800 rounded-md'
      data-cy={`review-${username}-${review.book_id}`}
    >
      <div className='flex items-center justify-center w-full h-max'>
        <div
          data-cy={`review-${username}-${review.book_id}-avatar-url`}
          className='mr-2'
        >
          <Avatar
            username={username}
            userID={user_id}
            url={avatar_url}
            size='medium'
          />
        </div>
        <div>
          <div data-cy={`review-${username}-${review.book_id}-username`}>
            {username}
          </div>
          <div data-cy={`review-${username}-${review.book_id}-score`}>
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
          <p data-cy={`review-${username}-${review.book_id}-post-time`}>
            Posted {review_post_time && stringToMonthDayYear(review_post_time)}
          </p>
        </div>
      </div>
      <div
        className='mt-4'
        data-cy={`review-${username}-${review.book_id}-text`}
      >
        {reviewText}
      </div>
    </article>
  );
};
