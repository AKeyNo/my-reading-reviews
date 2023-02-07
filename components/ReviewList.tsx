import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useEffect, useRef, useState } from 'react';
import { Database } from '../lib/types/supabase';
import { Review } from './Review';

interface Props {
  id: string;
  userBookInformation: Database['public']['Tables']['read_list']['Row'];
  isInformationIsOnline: boolean;
}

export const ReviewList = ({
  id,
  userBookInformation,
  isInformationIsOnline,
}: Props): JSX.Element => {
  const supabase = useSupabaseClient();
  const user = useUser();
  // to keep it simple, we will separate the user's review from the other reviews
  const [userReview, setUserReview] = useState(
    {} as Database['public']['Tables']['read_list']['Row'] & {
      profiles: {
        username: string;
        avatar_url: string;
      };
    }
  );

  const [reviews, setReviews] = useState(
    [] as (Database['public']['Tables']['read_list']['Row'] & {
      profiles: {
        username: string;
        avatar_url: string;
      };
    })[]
  );

  const [fetchedReviews, setFetchedReviews] = useState(false);

  const reviewRef = useRef<HTMLTextAreaElement>(null);

  // store the time the reviews were loaded
  const [initialReviewLoadTime, setInitialReviewLoadTime] = useState(
    new Date().toISOString()
  );
  // determines whether or not the "create a review" menu is shown
  const [showReviewCreation, setShowReviewCreation] = useState(false);

  useEffect(() => {
    setUserReview((userReview) => {
      return {
        ...userReview,
        score: userBookInformation.score,
        review: userBookInformation.review,
        review_post_time: userBookInformation.review_post_time,
      };
    });
  }, [userBookInformation]);

  useEffect(() => {
    if (fetchedReviews) return;

    const fetchReviews = async () => {
      if (!supabase) return;

      // get user review first
      if (user) {
        const { data: userReview } = await supabase
          .from('read_list')
          .select('*, profiles (username, avatar_url)')
          .eq('user_id', user?.id)
          .eq('book_id', id);

        if (!userReview) return;

        setUserReview(userReview[0]);
      }

      const { data: otherReviews, error } = await supabase
        .from('read_list')
        .select('*, profiles (username, avatar_url)')
        .lte('review_post_time', initialReviewLoadTime)
        .eq('book_id', id)
        .neq('user_id', user?.id)
        .order('review_post_time', { ascending: false })
        .limit(10);

      setFetchedReviews(true);
      if (!otherReviews || error) return;

      setReviews(otherReviews);
    };

    fetchReviews();
  }, [initialReviewLoadTime, supabase, id, user, reviews, fetchedReviews]);

  const submitReview = async () => {
    window.event?.preventDefault();

    if (!reviewRef.current?.value || !user || !userBookInformation) return;

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

    setUserReview({
      ...userBookInformation,
      book_id: id,
      review: reviewRef.current?.value,
      review_post_time: new Date().toISOString(),
      profiles: {
        username: user?.user_metadata?.username,
        avatar_url: user?.user_metadata?.avatar_url,
      },
    });
    setShowReviewCreation(false);
  };

  // with row level security on Supabase, we can only delete reviews that belong to the user
  const deleteOwnReview = async () => {
    const { error } = await supabase
      .from('read_list')
      .update({ review: null, review_post_time: null })
      .eq('user_id', user?.id)
      .eq('book_id', id);

    if (error) {
      console.error(error);
      return;

      // if the review was successfully deleted, update the review list
    } else {
      setInitialReviewLoadTime(new Date().toISOString());
      setUserReview({} as any);
    }
  };

  const getReviewButtonText = () => {
    if (showReviewCreation) return 'Close Review Form';
    else if (userReview?.review) return 'Edit Your Review';
    else return 'Create a Review';
  };

  return (
    <div className='w-full col-span-3'>
      <div className='flex items-center mb-4'>
        <div className='font-semibold'>Reviews</div>
        {user && isInformationIsOnline && (
          <button
            onClick={() => setShowReviewCreation(!showReviewCreation)}
            className='p-2 ml-auto text-sm duration-100 bg-orange-700 rounded-md hover:bg-orange-800'
            data-cy='create-review-button'
          >
            {getReviewButtonText()}
          </button>
        )}
      </div>
      {showReviewCreation && (
        <form
          onSubmit={submitReview}
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
          !showReviewCreation && (
            <Review
              review={userReview}
              user={user}
              deleteOwnReview={() => deleteOwnReview()}
            />
          )}
        {reviews.map((review, key) => {
          return <Review review={review} key={key} />;
        })}
      </div>
    </div>
  );
};
