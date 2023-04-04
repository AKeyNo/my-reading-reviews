import { stringToMonthDayYear } from '../../../lib/utils/date';
import { Avatar } from '../user/Avatar';
import { Review as ReviewType } from '../../../lib/types/book';
import { useAppDispatch } from '../../../lib/hooks/reduxHooks';
import { deleteReview } from '../../../lib/slices/bookSlice';
import { useUser } from '@supabase/auth-helpers-react';

export const Review = ({
  review,
}: {
  review: ReviewType;
}): // authorID: string
JSX.Element => {
  const user = useUser();
  const dispatch = useAppDispatch();
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

  const dispatchDeleteReview = () => {
    dispatch(deleteReview());
  };

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
            data-cy={`review-avatar-${username}`}
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
          {user?.id === user_id && (
            <>
              <button
                onClick={dispatchDeleteReview}
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
