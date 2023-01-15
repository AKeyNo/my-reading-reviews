import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function SearchBook() {
  const router = useRouter();

  const [searchBookName, setSearchBookName] = useState<string | null>();
  const [searchAuthor, setSearchAuthor] = useState<string | null>();
  const [searchPublisher, setSearchPublisher] = useState<string | null>();

  // const [books, setBooks] = useState([] as any);

  // searches for books with the given the book name, author, and/or publisher
  // does so by debouncing the search
  useEffect(() => {
    const areParametersEmpty = () => {
      return !searchBookName && !searchAuthor && !searchPublisher;
    };

    // checks if the search parameters match up with the queries to prevent unnecessary searches
    const areParametersEqual = () => {
      return (
        searchBookName === router.query.search &&
        searchAuthor === router.query.author &&
        searchPublisher === router.query.publisher
      );
    };

    if (areParametersEmpty() && Object.keys(router.query).length === 0) return;
    if (areParametersEqual()) return;

    const delayDebounce = setTimeout(() => {
      if (areParametersEmpty())
        return router.replace({ pathname: '/search/book' });

      // only include queries that are not empty
      let query = {};
      if (searchBookName) query = { search: searchBookName };
      if (searchAuthor) query = { ...query, author: searchAuthor };
      if (searchPublisher) query = { ...query, publisher: searchPublisher };

      router.replace({
        pathname: '/search/book',
        query,
      });
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [searchBookName, searchAuthor, searchPublisher, router]);

  return (
    <div>
      <form className='flex flex-row items-center w-full mt-4 mb-2 space-x-2'>
        <div className='w-4/12'>
          <label className='block font-bold text-gray-400'>Search</label>
          <input
            className='w-full p-2 mt-4 bg-gray-700 rounded-md'
            type='text'
            placeholder=''
            onChange={(e) => setSearchBookName(e.target.value)}
          />
        </div>
        <div className='w-4/12'>
          <label className='block font-bold text-gray-400'>Author</label>
          <input
            className='w-full p-2 mt-4 bg-gray-700 rounded-md'
            type='text'
            placeholder=''
            onChange={(e) => setSearchAuthor(e.target.value)}
          />
        </div>
        <div className='w-4/12'>
          <label className='block font-bold text-gray-400'>Publisher</label>
          <input
            className='w-full p-2 mt-4 bg-gray-700 rounded-md'
            type='text'
            placeholder=''
            onChange={(e) => setSearchPublisher(e.target.value)}
          />
        </div>
      </form>

      <div className='grid grid-cols-3 grid-rows-3'>
        <div className='p-4 bg-slate-900'></div>
        <div className='p-4 bg-slate-800'></div>
        <div className='p-4 bg-slate-700'></div>
        <div className='p-4 bg-slate-600'></div>
        <div className='p-4 bg-slate-500'></div>
        <div className='p-4 bg-slate-400'></div>
        <div className='p-4 bg-slate-300'></div>
        <div className='p-4 bg-slate-200'></div>
        <div className='p-4 bg-slate-100'></div>
      </div>
    </div>
  );
}
