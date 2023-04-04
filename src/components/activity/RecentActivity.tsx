import Image from 'next/image';
import Link from 'next/link';
import { stringToMonthDayYear } from '../../../lib/utils/date';

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
    <div className='flex items-center mb-2'>
      <Link
        href={`/book/${book.book_id}`}
        passHref
        className='relative block mr-2 h-36 sm:h-24 basis-3/12 sm:basis-1/12'
      >
        <Image
          src={cover || '/missingBookImage.png'}
          alt={title || 'Missing Book Name'}
          fill
          className='object-cover rounded-md'
        />
      </Link>
      <p className='basis-9/12 sm:basis-11/12'>
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
