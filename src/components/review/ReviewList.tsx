import { useUser } from '@supabase/auth-helpers-react';
import { useEffect, useRef } from 'react';
import { Review } from './Review';
import { useAppDispatch, useAppSelector } from '../../../lib/hooks/reduxHooks';
import {
  fetchReviews,
  submitReview,
  toggleReviewEditor,
} from '../../../lib/slices/bookSlice';

export const ReviewList = (): JSX.Element => {
  const user = useUser();
  const dispatch = useAppDispatch();

  const {
    bookID,
    status,
    userReview,
    otherReviews,
    openedReviewEditor,
    userBookInformation,
  } = useAppSelector((state) => state.book);

  const reviewRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!bookID) return;

    dispatch(fetchReviews());
  }, [dispatch, bookID]);

  const dispatchSubmitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!reviewRef.current?.value) return;

    dispatch(submitReview(reviewRef.current.value));
    dispatch(toggleReviewEditor());
  };

  const dispatchToggleReviewEditor = () => {
    dispatch(toggleReviewEditor());
  };

  const getReviewButtonText = () => {
    if (openedReviewEditor) return 'Close Review Form';
    else if (userReview?.review) return 'Edit Your Review';
    else return 'Create a Review';
  };

  return (
    <div className='w-full col-span-3'>
      <div className='flex items-center mb-4'>
        <div className='font-semibold'>Reviews</div>
        {user && status == 'succeeded' && userBookInformation != null && (
          <button
            onClick={dispatchToggleReviewEditor}
            className='p-2 ml-auto text-sm duration-100 bg-orange-700 rounded-md hover:bg-orange-800'
            data-cy='create-review-button'
          >
            {getReviewButtonText()}
          </button>
        )}
      </div>
      {openedReviewEditor && (
        <form
          onSubmit={dispatchSubmitReview}
          className='col-span-3 p-4 mb-4 bg-gray-800 rounded-md'
        >
          <label className='mb-2 font-semibold'>Create a review</label>
          <textarea
            ref={reviewRef}
            defaultValue={userReview?.review as string}
            className='w-full p-2 my-2 rounded-md'
            data-cy='review-text-area'
          />
          <button
            type='submit'
            className='p-2 text-sm duration-100 bg-orange-700 rounded-md hover:bg-orange-800'
            data-cy='review-submit-button'
          >
            Submit
          </button>
        </form>
      )}

      <div data-cy='review-list'>
        {userReview &&
          Object.keys(userReview).length != 0 &&
          !openedReviewEditor && <Review review={userReview} />}
        {otherReviews?.map((review, key) => {
          return <Review review={review} key={key} />;
        })}
      </div>
    </div>
  );
};
