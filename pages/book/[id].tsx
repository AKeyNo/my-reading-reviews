import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import Image from 'next/image';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { Dialog } from '../../components/Dialog';
import { ListEditor } from '../../components/ListEditor';
import { Database } from '../../lib/types/supabase';
import { ReviewList } from '../../components/ReviewList';
import Loading from '../../components/Loading';
import { Card } from '../../components/Card';
import { BookStats } from '../../lib/types/bookStats';
import Link from 'next/link';

export default function BookPage() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const router = useRouter();
  const { id } = router.query;
  const [book, setBook] = useState(null as any);
  const [userBookInformation, setUserBookInformation] = useState(
    {} as Database['public']['Tables']['read_list']['Row']
  );
  const [bookStats, setBookStats] = useState<BookStats>();

  // helps handle the button that says "Add to List" or "Edit List" depending on if their review is online or not
  const [isInformationIsOnline, setIsInformationIsOnline] = useState(false);
  const [isShowingListEditor, setIsShowingListEditor] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      const response = await axios.get(`/api/book/${id}`);
      const { data: bookStatsResponse } = await supabase.rpc('get_book_stats', {
        book_id_to_check: id as string,
      });

      if (bookStatsResponse && bookStatsResponse[0])
        setBookStats(bookStatsResponse[0] as BookStats);

      setBook(response.data);

      if (!user) {
        return;
      }

      if (response.data.userBookInformation) {
        setUserBookInformation(response.data.userBookInformation);
        return setIsInformationIsOnline(true);
      }

      setUserBookInformation({
        user_id: user.id,
        book_id: id as string,
        status: 'Reading',
        score: 0,
        pages_read: 0,
        start_date: null,
        finish_date: null,
        times_reread: 0,
        favorite: false,
      } as Database['public']['Tables']['read_list']['Row']);

      return setIsInformationIsOnline(false);
    };

    fetchBook();
  }, [id, user, supabase]);

  if (!book) return <Loading hScreen={true} />;

  // we use amount to determine if we are adding or subtracting from the stats
  const updateBookStats = async () => {
    if (!bookStats || !userBookInformation) {
      return;
    }

    const { data: bookStatsResponse } = await supabase.rpc('get_book_stats', {
      book_id_to_check: id as string,
    });

    if (bookStatsResponse && bookStatsResponse[0])
      setBookStats(bookStatsResponse[0] as BookStats);
  };

  return (
    <div>
      <div className='grid grid-cols-4 grid-rows-1 p-12 pt-0 border-b-4 border-gray-800'>
        <div className='relative col-span-1 mr-4 text-center'>
          <Image
            src={book.imageLinks?.thumbnail || '/missingBookImage.png'}
            alt={book.name || 'Missing Book Name'}
            width={200}
            height={300}
            className='w-48 mx-auto rounded-md'
          />

          {user && (
            <button
              onClick={() => setIsShowingListEditor(true)}
              className='w-4/5 p-4 mt-4 text-sm duration-100 bg-orange-700 rounded-md hover:bg-orange-800'
              data-cy='add-to-list-button'
            >
              {isInformationIsOnline ? 'Edit Entry' : 'Add to List'}
            </button>
          )}
        </div>
        <Dialog isActive={isShowingListEditor}>
          <ListEditor
            book={book}
            userBookInformation={userBookInformation}
            setUserBookInformation={setUserBookInformation}
            closeListEditor={() => setIsShowingListEditor(false)}
            setIsInformationOnline={setIsInformationIsOnline}
            updateBookStats={updateBookStats}
          />
        </Dialog>
        <div className='col-span-3'>
          <div className='flex items-center pb-4 space-x-2'>
            <h1 className='text-3xl text-center'>{book.title}</h1>

            {book?.previewLink && (
              <Link
                href={book.previewLink}
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
            {book?.description ? (
              <p>{book.description && parse(book.description)}</p>
            ) : (
              <p>
                <i className='italic'>There is no description provided.</i>
              </p>
            )}
          </Card>
        </div>
      </div>
      <div className='grid grid-cols-4 grid-rows-1 gap-4 p-12 border-t-0 flow-col'>
        <div>
          <Card colSpan='col-span-1'>
            <div data-cy='book-information'>
              <h2 className='font-bold'>Information</h2>
              {book.authors && (
                <p className='text-gray-200' data-cy='book-information-authors'>
                  <strong className='font-semibold'>
                    Author{book.authors.length > 1 && 's'}:
                  </strong>{' '}
                  {book.authors.join(', ')}
                </p>
              )}
              {book.pageCount && (
                <p
                  className='text-gray-200'
                  data-cy='book-information-page-count'
                >
                  <strong className='font-semibold'>Page Count:</strong>{' '}
                  {book.pageCount}
                </p>
              )}
              {book.publishedDate && (
                <p
                  className='text-gray-200'
                  data-cy='book-information-published-date'
                >
                  <strong className='font-semibold'>Published:</strong>{' '}
                  {book.publishedDate}
                </p>
              )}
              {book.publisher && (
                <p
                  className='text-gray-200'
                  data-cy='book-information-publisher'
                >
                  <strong className='font-semibold'>Publisher:</strong>{' '}
                  {book.publisher}
                </p>
              )}
              {book.categories && (
                <p
                  className='text-gray-200'
                  data-cy='book-information-categories'
                >
                  <strong className='font-semibold'>Categories:</strong>
                  <br />
                  {book.categories.join(`, `)}
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
        <ReviewList
          id={id as string}
          userBookInformation={userBookInformation}
          isInformationIsOnline={isInformationIsOnline}
        />
      </div>
    </div>
  );
}
