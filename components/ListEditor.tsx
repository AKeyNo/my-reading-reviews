import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import Image from 'next/image';
import { Heart, X } from 'phosphor-react';
import { ListEditorFields } from '../lib/types/listEditor';

export const ListEditor = ({
  book,
  userBookInformation,
  setUserBookInformation,
  closeListEditor,
  setIsInformationOnline,
  updateBookStats,
}: ListEditorFields) => {
  const supabase = useSupabaseClient();
  const user = useUser();
  const {
    book_id,
    status,
    score,
    pages_read,
    start_date,
    finish_date,
    times_reread,
    notes,
    favorite,
  } = userBookInformation;

  const submitUserBookInformation = async () => {
    window.event?.preventDefault();
    if (!user) return;

    // cache the book image to save on querying too many times from Google Books
    // this is used in displaying favorites and recently read book titles
    const { error: cacheError } = await supabase.from('cached_books').upsert([
      {
        book_id: book_id,
        title: book.title,
        cover: book.imageLinks?.smallThumbnail,
        total_pages: book.pageCount,
      },
    ]);

    if (cacheError) {
      console.error('error', cacheError);
    }

    const { error: uploadError } = await supabase.from('read_list').upsert([
      {
        user_id: user.id,
        book_id: book_id,
        status: status,
        score: score,
        pages_read: pages_read,
        start_date: start_date,
        finish_date: finish_date,
        times_reread: times_reread,
        notes: notes,
        favorite: favorite,
      },
    ]);
    if (uploadError) {
      console.error('error', uploadError);
    }

    setIsInformationOnline(true);
    updateBookStats();
  };

  const deleteUserBookInformation = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('read_list')
      .delete()
      .eq('user_id', user.id)
      .eq('book_id', userBookInformation.book_id);

    if (error) {
      console.error('error', error);
    }

    setIsInformationOnline(false);
    updateBookStats();
    closeListEditor();
  };

  return (
    <form
      className='relative w-2/4 p-12 bg-gray-800 shadow-2xl'
      onSubmit={() => {
        window.event?.preventDefault();
        submitUserBookInformation();
        closeListEditor();
      }}
    >
      <button
        onClick={closeListEditor}
        className='absolute duration-200 right-12 hover:bg-red-800'
      >
        <X size={32} weight='thin' data-cy='list-editor-close-button' />
      </button>

      <div className='flex items-center w-full'>
        <Image
          src={book.imageLinks?.smallThumbnail || '/missingBookImage.png'}
          alt={book.name || 'Missing Book Name'}
          width={100}
          height={100}
          className='inline w-24 mr-4 rounded-md basis-1/12'
        />

        <p className='font-semibold basis-10/12'>{book.title}</p>
      </div>
      <div className='grid grid-cols-3 gap-2 py-2'>
        <div className='colspan-2'>
          <label className='block'>Status</label>
          <select
            value={(status as string) || 'Reading'}
            onChange={(e) => {
              setUserBookInformation({
                ...userBookInformation,
                status: e.target.value,
              });
              if (e.target.value === 'Completed') {
                setUserBookInformation({
                  ...userBookInformation,
                  status: e.target.value,
                  pages_read: book.pageCount,
                });
              }
            }}
            data-cy='list-editor-status'
          >
            <option value='Reading' selected>
              Reading
            </option>
            <option value='Planning to Read'>Planning to Read</option>
            <option value='Completed'>Completed</option>
            <option value='Paused'>Paused</option>
            <option value='Dropped'>Dropped</option>
          </select>
        </div>

        <div className='colspan-1'>
          <label className='block'>Score</label>
          <input
            type='number'
            min='0'
            max='10'
            value={(score as number) || 0}
            onChange={(e) =>
              setUserBookInformation({
                ...userBookInformation,
                score: parseInt(e.target.value),
              })
            }
            data-cy='list-editor-score'
          />
        </div>

        <div className='colspan-1'>
          <label className='block'>Pages Read</label>
          <input
            type='number'
            min='0'
            max={book.pageCount}
            value={(pages_read as number) || 0}
            onChange={(e) =>
              setUserBookInformation({
                ...userBookInformation,
                pages_read: parseInt(e.target.value),
              })
            }
            data-cy='list-editor-pages-read'
          />
        </div>

        <div className='colspan-1'>
          <label className='block'>Start Date</label>
          <input
            type='date'
            min='0'
            max={book.pageCount}
            value={(start_date as string) || 0}
            onChange={(e) =>
              setUserBookInformation({
                ...userBookInformation,
                start_date: e.target.value,
              })
            }
            data-cy='list-editor-start-date'
          />
        </div>
        <div className='colspan-1'>
          <label className='block'>Finish Date</label>
          <input
            type='date'
            min='0'
            max={book.pageCount}
            value={(finish_date as string) || 0}
            onChange={(e) =>
              setUserBookInformation({
                ...userBookInformation,
                finish_date: e.target.value,
              })
            }
            data-cy='list-editor-finish-date'
          />
        </div>

        <div className='col-span-1'>
          <label className='block'>Times Reread</label>
          <input
            type='number'
            min='0'
            max={book.pageCount}
            value={(times_reread as number) || 0}
            onChange={(e) =>
              setUserBookInformation({
                ...userBookInformation,
                times_reread: parseInt(e.target.value),
              })
            }
            data-cy='list-editor-times-reread'
          />
        </div>

        <div className='col-span-3'>
          <label className='block'>Notes</label>
          <textarea
            className='w-full col-span-full'
            value={(notes as string) || ''}
            onChange={(e) =>
              setUserBookInformation({
                ...userBookInformation,
                notes: e.target.value,
              })
            }
            data-cy='list-editor-notes'
          />
        </div>
      </div>

      <div className='flex items-center'>
        <button
          type='button'
          onClick={() =>
            setUserBookInformation({
              ...userBookInformation,
              favorite: !userBookInformation.favorite,
            })
          }
          className={`duration-150 ${favorite ? 'text-red-700' : 'text-white'}`}
          data-cy='list-editor-favorite-button'
        >
          <Heart size={32} weight='fill' />
        </button>
        <button
          className='p-4 px-8 ml-auto mr-2 text-sm duration-150 bg-orange-700 rounded-md hover:bg-orange-800'
          onClick={deleteUserBookInformation}
          type='button'
          data-cy='list-editor-delete-button'
        >
          Delete
        </button>
        <button
          className='p-4 px-8 text-sm duration-150 bg-orange-700 rounded-md hover:bg-orange-800'
          type='submit'
          data-cy='list-editor-save-button'
        >
          Save
        </button>
      </div>
    </form>
  );
};
