import { useRouter } from 'next/router';
import { useEffect } from 'react';
import parse from 'html-react-parser';
import Image from 'next/image';
import { useUser } from '@supabase/auth-helpers-react';
import { Dialog } from '../../components/Dialog';
import { ListEditor } from '../../components/ListEditor';
import { ReviewList } from '../../components/ReviewList';
import { Card } from '../../components/Card';
import Link from 'next/link';
import Head from 'next/head';
import {
  clearBook,
  fetchBookOnline,
  openListEditor,
} from '../../lib/slices/bookSlice';
import { useAppDispatch, useAppSelector } from '../../lib/hooks/reduxHooks';

export default function BookPage() {
  const user = useUser();
  const router = useRouter();
  const { id } = router.query;

  const dispatch = useAppDispatch();
  const book = useAppSelector((state) => state.book);

  const { volumeInfo, bookStats } = book;

  useEffect(() => {
    if (!id || book.status == 'succeeded') {
      return;
    }

    const fetchBook = async () => {
      await dispatch(fetchBookOnline(id as string));
    };

    fetchBook();
  }, [id, book, dispatch]);

  useEffect(() => {
    return () => {
      // clear the book state
      dispatch(clearBook());
    };
  }, [dispatch]);

  return (
    <div className='w-full'>
      <Head>
        <title>
          {volumeInfo?.title ? `${volumeInfo?.title}` : 'Loading...'}
        </title>
      </Head>

      <div className='grid grid-cols-1 grid-rows-1 p-12 pt-0 border-b-4 border-gray-800 sm:grid-cols-4'>
        <div className='relative col-span-1 mr-0 text-center sm:mr-4'>
          <Image
            src={volumeInfo?.imageLinks?.thumbnail || '/missingBookImage.png'}
            alt={volumeInfo?.title || 'Missing Book Name'}
            width={200}
            height={300}
            className='w-48 mx-auto rounded-md'
          />

          {user && (
            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                e.preventDefault();
                dispatch(openListEditor());
              }}
              className='w-4/5 p-4 mt-4 text-sm duration-100 bg-orange-700 rounded-md hover:bg-orange-800'
              data-cy='add-to-list-button'
            >
              {book.userBookInformation && book.status == 'succeeded'
                ? 'Edit Entry'
                : 'Add to List'}
            </button>
          )}
        </div>
        <Dialog isActive={book.openedListEditor}>
          <ListEditor />
        </Dialog>
        <div className='col-span-3'>
          <div className='flex flex-col items-center pb-4 space-x-2 space-y-2 sm:space-y-0 sm:flex-row'>
            <h1 className='text-3xl text-center'>{volumeInfo?.title}</h1>

            {volumeInfo?.previewLink && (
              <Link
                href={volumeInfo?.previewLink}
                rel='noopener noreferrer'
                target='_blank'
                passHref
                data-cy='google-preview-button'
              >
                <Image
                  src='https://www.google.com/intl/en/googlebooks/images/gbs_preview_button1.png'
                  alt='Google Preview'
                  width={88}
                  height={31}
                  className='self-center'
                />
              </Link>
            )}
          </div>

          <Card>
            {volumeInfo?.description ? (
              <p>{volumeInfo?.description && parse(volumeInfo?.description)}</p>
            ) : (
              <p>
                <i className='italic'>There is no description provided.</i>
              </p>
            )}
          </Card>
        </div>
      </div>
      <div className='grid grid-cols-1 grid-rows-1 gap-4 p-12 border-t-0 sm:grid-cols-4 flow-col'>
        <div>
          <Card colSpan='col-span-1'>
            <div data-cy='book-information'>
              <h2 className='font-bold'>Information</h2>
              {volumeInfo?.authors && (
                <p className='text-gray-200' data-cy='book-information-authors'>
                  <strong className='font-semibold'>
                    Author{volumeInfo?.authors.length > 1 && 's'}:
                  </strong>{' '}
                  {volumeInfo?.authors.join(', ')}
                </p>
              )}
              {volumeInfo?.pageCount && (
                <p
                  className='text-gray-200'
                  data-cy='book-information-page-count'
                >
                  <strong className='font-semibold'>Page Count:</strong>{' '}
                  {volumeInfo?.pageCount}
                </p>
              )}
              {volumeInfo?.publishedDate && (
                <p
                  className='text-gray-200'
                  data-cy='book-information-published-date'
                >
                  <strong className='font-semibold'>Published:</strong>{' '}
                  {volumeInfo?.publishedDate}
                </p>
              )}
              {volumeInfo?.publisher && (
                <p
                  className='text-gray-200'
                  data-cy='book-information-publisher'
                >
                  <strong className='font-semibold'>Publisher:</strong>{' '}
                  {volumeInfo?.publisher}
                </p>
              )}
              {volumeInfo?.categories && (
                <p
                  className='text-gray-200'
                  data-cy='book-information-categories'
                >
                  <strong className='font-semibold'>Categories:</strong>
                  <br />
                  {volumeInfo?.categories.join(`, `)}
                </p>
              )}
            </div>
            <br />
            {bookStats && (
              <div data-cy='community-stats'>
                <h2 className='font-bold'>Community Stats</h2>
                <p
                  className='text-gray-200'
                  data-cy='community-stats-average-score'
                >
                  <strong className='font-semibold'>Average Score:</strong>{' '}
                  {bookStats.averageScore?.toFixed(2) || 'N/A'}
                </p>
                <p
                  className='text-gray-200'
                  data-cy='community-stats-total-favorites'
                >
                  <strong className='font-semibold'>Total Favorites:</strong>{' '}
                  {bookStats.totalFavorites}
                </p>
                <br />
                <p
                  className='text-gray-200'
                  data-cy='community-stats-total-listings'
                >
                  <strong className='font-semibold'>Total Listings:</strong>{' '}
                  {bookStats.totalListings}
                </p>
                <p
                  className='text-gray-200'
                  data-cy='community-stats-total-reviews'
                >
                  <strong className='font-semibold'>Total Reviews:</strong>{' '}
                  {bookStats.totalReviews}
                </p>
                <p
                  className='text-gray-200'
                  data-cy='community-stats-currently-reading'
                >
                  <strong className='font-semibold'>Currently Reading:</strong>{' '}
                  {bookStats.totalCurrentlyReading}
                </p>
                <p
                  className='text-gray-200'
                  data-cy='community-stats-currently-planning'
                >
                  <strong className='font-semibold'>Planning to Read:</strong>{' '}
                  {bookStats.totalCurrentlyPlanning}
                </p>
                <p
                  className='text-gray-200'
                  data-cy='community-stats-currently-completed'
                >
                  <strong className='font-semibold'>Completed:</strong>{' '}
                  {bookStats.totalCurrentlyCompleted}
                </p>
                <p
                  className='text-gray-200'
                  data-cy='community-stats-currently-paused'
                >
                  <strong className='font-semibold'>Paused:</strong>{' '}
                  {bookStats.totalCurrentlyPaused}
                </p>
                <p
                  className='text-gray-200'
                  data-cy='community-stats-currently-dropped'
                >
                  <strong className='font-semibold'>Dropped:</strong>{' '}
                  {bookStats.totalCurrentlyDropped}
                </p>
              </div>
            )}
          </Card>
        </div>
        <ReviewList />
      </div>
    </div>
  );
}
