import Image from 'next/image';
import Link from 'next/link';
import { stringToMonthDayYear } from '../lib/utils/date';

interface Props {
  user: any;
  book: any;
}

export const RecentActivity = ({ user, book }: Props) => {
  if (!book.cached_information) return null;

  const getAction = (status: string) => {
    switch (status) {
      case 'reading':
        return 'is reading';
      case 'plan to read':
        return 'plans to read';
      case 'completed':
        return 'has completed';
      case 'paused':
        return 'has paused';
      case 'dropped':
        return 'has dropped';
      default:
        return 'is looking at';
    }
  };

  const { title, cover, total_pages: totalPages } = book.cached_information;

  return (
    <div className='flex items-center'>
      <Link href={`/book/${book.book_id}`} passHref>
        <Image
          src={cover || '/missingBookImage.png'}
          alt={title || 'Missing Book Name'}
          width={100}
          height={100}
          className='inline w-12 mr-4 rounded-md'
        />
      </Link>
      <p className=''>
        <Link
          href={`/user/${user.username}`}
          className='font-semibold text-gray-200 duration-200 hover:text-white'
        >
          {user.username}{' '}
        </Link>
        {getAction(book.status.toLowerCase())}{' '}
        <Link
          href={`/book/${book.book_id}`}
          className='text-blue-500 duration-200 hover:text-blue-400'
          data-cy={`recent-activity-user-${user.username}-book-${book.book_id}`}
        >
          {title}!{' '}
        </Link>
        <span className='text-gray-400'>
          {book.pages_read}/{totalPages}
        </span>
      </p>
      <span className='ml-auto'>{stringToMonthDayYear(book.finish_date)}</span>
    </div>
  );
};
