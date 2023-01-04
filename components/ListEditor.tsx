import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import Image from 'next/image';
import { X } from 'phosphor-react';
import { ListEditorFields } from '../types/listEditor';

export const ListEditor = ({
  book,
  userBookInformation,
  setUserBookInformation,
  closeListEditor,
  setIsInformationOnline,
}: ListEditorFields) => {
  const supabase = useSupabaseClient();
  const user = useUser();
  const {
    status,
    score,
    pages_read,
    start_date,
    finish_date,
    times_read,
    notes,
  } = userBookInformation;

  const submitUserBookInformation = async () => {
    window.event?.preventDefault();

    if (!user) return;

    const { error } = await supabase.from('read_list').upsert([
      {
        user_id: user.id,
        book_id: userBookInformation.book_id,
        status: userBookInformation.status,
        score: userBookInformation.score,
        pages_read: userBookInformation.pages_read,
        start_date: userBookInformation.start_date,
        finish_date: userBookInformation.finish_date,
        times_read: userBookInformation.times_read,
        notes: userBookInformation.notes,
        favorite: userBookInformation.favorite,
      },
    ]);
    if (error) {
      console.error('error', error);
    }

    setIsInformationOnline();
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
        <X size={32} weight='thin' />
      </button>

      <div className='flex items-center w-full'>
        <Image
          src={book.imageLinks.smallThumbnail}
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
            value={status as string}
            onChange={(e) =>
              setUserBookInformation({
                ...userBookInformation,
                status: e.target.value,
              })
            }
          >
            <option value='Reading'>Reading</option>
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
            value={score as number}
            onChange={(e) =>
              setUserBookInformation({
                ...userBookInformation,
                score: parseInt(e.target.value),
              })
            }
          />
        </div>

        <div className='colspan-1'>
          <label className='block'>Pages Read</label>
          <input
            type='number'
            min='0'
            max={book.pageCount}
            value={pages_read as number}
            onChange={(e) =>
              setUserBookInformation({
                ...userBookInformation,
                pages_read: parseInt(e.target.value),
              })
            }
          />
        </div>

        <div className='colspan-1'>
          <label className='block'>Start Date</label>
          <input
            type='datetime-local'
            min='0'
            max={book.pageCount}
            value={start_date as string}
            onChange={(e) =>
              setUserBookInformation({
                ...userBookInformation,
                start_date: e.target.value,
              })
            }
          />
        </div>
        <div className='colspan-1'>
          <label className='block'>Finish Date</label>
          <input
            type='datetime-local'
            min='0'
            max={book.pageCount}
            value={finish_date as string}
            onChange={(e) =>
              setUserBookInformation({
                ...userBookInformation,
                finish_date: e.target.value,
              })
            }
          />
        </div>

        <div className='col-span-1'>
          <label className='block'>Times Read</label>
          <input
            type='number'
            min='0'
            max={book.pageCount}
            value={times_read as number}
            onChange={(e) =>
              setUserBookInformation({
                ...userBookInformation,
                times_read: parseInt(e.target.value),
              })
            }
          />
        </div>

        <div className='col-span-3'>
          <label className='block'>Notes</label>
          <textarea
            className='w-full col-span-full'
            value={notes as string}
            onChange={(e) =>
              setUserBookInformation({
                ...userBookInformation,
                notes: e.target.value,
              })
            }
          />
        </div>
      </div>

      <div className='flex justify-end space-x-2'>
        {/* <button
          className='p-4 px-8 text-sm duration-150 bg-orange-700 rounded-md hover:bg-orange-800'
          onClick={closeListEditor}
        >
          Delete
        </button> */}
        <button
          className='p-4 px-8 text-sm duration-150 bg-orange-700 rounded-md hover:bg-orange-800'
          type='submit'
        >
          Save
        </button>
      </div>
    </form>
  );
};
