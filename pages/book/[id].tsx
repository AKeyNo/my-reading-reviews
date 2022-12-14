import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Wrapper } from '../../components/Wrapper';
import parse from 'html-react-parser';
import Image from 'next/image';

export default function BookPage() {
  const router = useRouter();
  const { id } = router.query;
  const [book, setBook] = useState(null as any);

  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      const response = await axios.get(`/api/book/${id}`);

      setBook(response.data);
    };

    fetchBook();
  }, [id]);

  if (!book) return <div>loading...</div>;

  return (
    <Wrapper>
      <div className='grid grid-cols-4 p-12 border-b-4 border-gray-800 grid-rows-1'>
        <div className='mr-4 text-center relative col-span-1'>
          <Image
            src={book.imageLinks.thumbnail}
            alt={book.name}
            width={200}
            height={300}
            className='rounded-md mx-auto w-48'
          />
          <div className='text-sm bg-orange-700 mt-4 p-4 rounded-md hover:bg-orange-800'>
            Add to List
          </div>
        </div>
        <div className='col-span-3'>
          <h1 className='text-3xl pb-4'>{book.title}</h1>
          <p>{parse(book.description)}</p>
        </div>
      </div>
      <div className='grid p-12 border-t-0 flow-col grid-rows-1 grid-cols-4 gap-4'>
        <div className='bg-gray-800 p-4 rounded-md col-span-1'>
          <h2 className='font-semibold'>Stats</h2>
          <p>Page Count: {book.pageCount}</p>
          <p>Published: {book.publishedDate}</p>
          <p>
            Average Rating: {book.averageRating} ({book.ratingsCount} total
            rating{book.ratingsCount > 1 ? 's' : ''})
          </p>
        </div>
        <div className='bg-gray-800 p-4 rounded-md col-span-3'>
          There are currently no reviews!
        </div>
      </div>
    </Wrapper>
  );
}
