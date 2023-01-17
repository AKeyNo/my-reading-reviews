import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import Image from 'next/image';
import { useUser } from '@supabase/auth-helpers-react';
import { Dialog } from '../../components/Dialog';
import { ListEditor } from '../../components/ListEditor';
import { Database } from '../../types/supabase';
import { ReviewList } from '../../components/ReviewList';

export default function BookPage() {
  const user = useUser();
  const router = useRouter();
  const { id } = router.query;
  const [book, setBook] = useState(null as any);
  const [userBookInformation, setUserBookInformation] = useState(
    {} as Database['public']['Tables']['read_list']['Row']
  );
  // helps handle the button that says "Add to List" or "Edit List" depending on if their review is online or not
  const [isInformationIsOnline, setIsInformationIsOnline] = useState(false);
  const [isShowingListEditor, setIsShowingListEditor] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      const response = await axios.get(`/api/book/${id}`);

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
        times_read: 0,
        favorite: false,
      } as Database['public']['Tables']['read_list']['Row']);

      return setIsInformationIsOnline(false);
    };

    fetchBook();
  }, [id, user]);

  if (!book) return <div>loading...</div>;

  return (
    <div>
      <div className='grid grid-cols-4 grid-rows-1 p-12 border-b-4 border-gray-800'>
        <div className='relative col-span-1 mr-4 text-center'>
          {book.imageLinks && (
            <Image
              src={book.imageLinks.thumbnail}
              alt={book.name || 'Missing Book Name'}
              width={200}
              height={300}
              className='w-48 mx-auto rounded-md'
            />
          )}

          {user ? (
            <button
              onClick={() => setIsShowingListEditor(true)}
              className='w-4/5 p-4 mt-4 text-sm duration-100 bg-orange-700 rounded-md hover:bg-orange-800'
            >
              {isInformationIsOnline ? 'Edit Entry' : 'Add to List'}
            </button>
          ) : null}
        </div>
        <Dialog isActive={isShowingListEditor}>
          <ListEditor
            book={book}
            userBookInformation={userBookInformation}
            setUserBookInformation={setUserBookInformation}
            closeListEditor={() => setIsShowingListEditor(false)}
            setIsInformationOnline={() => setIsInformationIsOnline(true)}
          />
        </Dialog>
        <div className='col-span-3'>
          <h1 className='pb-4 text-3xl'>{book.title}</h1>
          <p>{book.description && parse(book.description)}</p>
        </div>
      </div>
      <div className='grid grid-cols-4 grid-rows-1 gap-4 p-12 border-t-0 flow-col'>
        <div className='col-span-1 p-4 bg-gray-800 rounded-md'>
          <h2 className='font-semibold'>Stats</h2>
          <p>Page Count: {book.pageCount}</p>
          <p>Published: {book.publishedDate}</p>
          <p>
            Average Rating: {book.averageRating} ({book.ratingsCount} total
            rating{book.ratingsCount > 1 ? 's' : ''})
          </p>
        </div>
        <ReviewList id={id as string} />
      </div>
    </div>
  );
}
