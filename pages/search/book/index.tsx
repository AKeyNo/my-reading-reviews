import axios from 'axios';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Card } from '../../../src/components/ui/Card';
import Loading from '../../../src/components/ui/Loading';
import { useScroll } from '../../../lib/hooks/useScroll';

export default function SearchBook() {
  const router = useRouter();

  const [searchTitle, setSearchTitle] = useState<string | null>();
  const [searchAuthor, setSearchAuthor] = useState<string | null>();
  const [searchPublisher, setSearchPublisher] = useState<string | null>();
  const [startIndex, setStartIndex] = useState(-1);
  const [books, setBooks] = useState([] as any);

  const [loading, setLoading] = useState(false);

  const loadMoreBooks = async () => {
    if (Object.keys(router.query).length === 0) return;
    if (startIndex == 0) return;

    setLoading(true);
    setStartIndex(startIndex + 1);

    const response = await axios.get('/api/search/book', {
      params: { ...router.query, startIndex },
    });

    if (response.data.totalItems === 0) {
      return setLoading(false);
    }

    setBooks([...books, ...response.data.items]);
    setLoading(false);
  };

  useScroll(loadMoreBooks);

  useEffect(() => {
    setBooks([]);
    if (Object.keys(router.query).length === 0) return;

    const fetchBooks = async () => {
      setLoading(true);

      setSearchTitle(router.query.title as string);
      setSearchAuthor(router.query.author as string);
      setSearchPublisher(router.query.publisher as string);

      const response = await axios.get('/api/search/book', {
        params: { ...router.query, startIndex: 0 },
      });

      if (response.data.totalItems === 0) {
        return setLoading(false);
      }

      setBooks(response.data.items);
      setLoading(false);
      setStartIndex(1);
    };
    fetchBooks();
  }, [router.query]);

  // searches for books with the given the book name, author, and/or publisher
  // does so by debouncing the search
  useEffect(() => {
    const areParametersEmpty = () => {
      return !searchTitle && !searchAuthor && !searchPublisher;
    };

    // checks if the search parameters match up with the queries to prevent unnecessary searches
    const areParametersEqual = () => {
      return (
        searchTitle === router.query.title &&
        searchAuthor === router.query.author &&
        searchPublisher === router.query.publisher
      );
    };

    if (areParametersEmpty() && Object.keys(router.query).length === 0)
      return setBooks([]);

    if (areParametersEqual()) return;

    const delayDebounce = setTimeout(() => {
      if (areParametersEmpty())
        return router.replace({ pathname: '/search/book' });

      // only include queries that are not empty
      let query = {};
      if (searchTitle) query = { title: searchTitle };
      if (searchAuthor) query = { ...query, author: searchAuthor };
      if (searchPublisher) query = { ...query, publisher: searchPublisher };

      router.replace({
        pathname: '/search/book',
        query,
      });
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [searchTitle, searchAuthor, searchPublisher, router]);

  return (
    <div className='w-full'>
      <Head>
        <title>Book Search</title>
      </Head>

      <form className='flex flex-col items-center w-full mb-2 space-x-2 sm:flex-row'>
        <div className='w-full sm:w-4/12'>
          <label className='block font-bold text-gray-400'>Search</label>
          <input
            className='w-full p-2 mt-4 bg-gray-700 rounded-md'
            type='text'
            value={searchTitle as string}
            placeholder=''
            onChange={(e) => setSearchTitle(e.target.value)}
            data-cy='search-input-book-title'
          />
        </div>
        <div className='w-full sm:w-4/12'>
          <label className='block font-bold text-gray-400'>Author</label>
          <input
            className='w-full p-2 mt-4 bg-gray-700 rounded-md'
            type='text'
            value={searchAuthor as string}
            placeholder=''
            onChange={(e) => setSearchAuthor(e.target.value)}
            data-cy='search-input-book-author'
          />
        </div>
        <div className='w-full sm:w-4/12'>
          <label className='block font-bold text-gray-400'>Publisher</label>
          <input
            className='w-full p-2 mt-4 bg-gray-700 rounded-md'
            type='text'
            value={searchPublisher as string}
            placeholder=''
            onChange={(e) => setSearchPublisher(e.target.value)}
            data-cy='search-input-book-publisher'
          />
        </div>
      </form>
      <Image
        src='https://books.google.com/googlebooks/images/poweredby.png'
        alt='Powered by Google Books'
        width={62}
        height={30}
      />

      <div
        className='grid grid-cols-2 gap-x-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
        data-cy='search-book-results'
      >
        {books?.map((book: any, key: any) => (
          <div key={key} className='flex flex-col p-4 h-[23rem]'>
            <Link href={`/book/${book.id}`} passHref>
              <Card className='relative block h-64 w-36'>
                <Image
                  alt={book.volumeInfo.title || 'Missing Book Name'}
                  src={
                    book.volumeInfo.imageLinks?.thumbnail ||
                    '/missingBookImage.png'
                  }
                  fill
                  className='object-cover border-2 border-white'
                />
              </Card>
            </Link>
            <a
              href={`/book/${book.id}`}
              className='block truncate hover:whitespace-normal'
            >
              {book.volumeInfo.title}
            </a>
          </div>
        ))}
      </div>

      {loading && <Loading />}
    </div>
  );
}
