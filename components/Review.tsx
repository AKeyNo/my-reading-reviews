import Image from 'next/image';
import { stringToMonthDayYear } from '../lib/utils/date';
import { Database } from '../lib/types/supabase';

interface Props {
  review: Omit<Database['public']['Tables']['read_list']['Row'], 'user_id'> & {
    user_id: { username: string; avatar_url: string };
  };
}

export const Review = ({
  review,
}: Props): // authorID: string
JSX.Element => {
  if (!review) return <></>;

  const { score, user_id, review: reviewText, review_post_time } = review;

  const { username, avatar_url } = user_id;

  return (
    <article className='col-span-3 p-4 mb-4 bg-gray-800 rounded-md'>
      <div className='flex items-center justify-center w-full h-max'>
        <div className='grid w-16 h-16 mr-4 rounded-full place-items-center bg-slate-500'>
          {avatar_url ? (
            <Image src={avatar_url} alt={username} />
          ) : (
            <p>{username[0]}</p>
          )}
        </div>
        <div>
          <div>{username}</div>
          <div>{score}/10</div>
        </div>
        <div className='ml-auto text-gray-400'>
          Posted{' '}
          {review_post_time ? stringToMonthDayYear(review_post_time) : null}
        </div>
      </div>
      <div className='mt-4'>{reviewText}</div>
    </article>
  );
};
