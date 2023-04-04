import { useUser } from '@supabase/auth-helpers-react';
import Image from 'next/image';
import { Heart, X } from 'phosphor-react';
import { useAppDispatch, useAppSelector } from '../../../lib/hooks/reduxHooks';
import {
  closeListEditor,
  deleteUserBookInformation,
  submitUserBookInformation,
} from '../../../lib/slices/bookSlice';
import { useEffect, useState } from 'react';
import { UserBookInformation } from '../../../lib/types/book';

export const ListEditor = () => {
  const dispatch = useAppDispatch();
  const user = useUser();
  const book = useAppSelector((state) => state.book.volumeInfo);
  const currentUserBookInformation = useAppSelector(
    (state) => state.book.userBookInformation
  );

  useEffect(() => {
    if (!currentUserBookInformation) {
      return;
    }

    setUserBookInformation(currentUserBookInformation);
  }, [currentUserBookInformation]);

  const [userBookInformation, setUserBookInformation] =
    useState<UserBookInformation>({
      user_id: user?.id as string,
      book_id: book.id as string,
      status: 'reading',
      score: 0,
      pages_read: 0,
      start_date: null,
      finish_date: null,
      times_reread: 0,
      notes: '',
      favorite: false,
      review: '',
      review_post_time: null,
    });

  const {
    status,
    score,
    pages_read,
    start_date,
    finish_date,
    times_reread,
    notes,
    favorite,
  } = userBookInformation;

  const submitUserBookInformationOnline = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!user) return;

    dispatch(
      submitUserBookInformation({
        title: book.title,
        cover: book.imageLinks?.smallThumbnail,
        totalPages: book.pageCount,
        userBookInformation: userBookInformation,
      })
    );

    dispatch(closeListEditor());
  };

  const deleteUserBookInformationOnline = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (!user) return;

    dispatch(deleteUserBookInformation());
    dispatch(closeListEditor());
  };

  return (
    <form
      className='box-content relative w-full h-full max-w-screen-md p-8 mx-auto overflow-y-auto bg-gray-800 shadow-2xl max-h-[41rem] sm:p-12 sm:h-auto sm:w-3/4'
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        submitUserBookInformationOnline(e);
      }}
    >
      <button
        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
          e.preventDefault();
          dispatch(closeListEditor());
        }}
        className='absolute duration-200 right-4 sm:right-12 hover:bg-red-800'
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
      <div className='grid grid-cols-1 gap-4 py-2 sm:grid-cols-2 md:grid-cols-3'>
        <div className='w-full'>
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
            className='w-full'
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

        <div className='col-span-1'>
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
            className='w-full'
            data-cy='list-editor-score'
          />
        </div>

        <div className='col-span-1'>
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
            className='w-full'
            data-cy='list-editor-pages-read'
          />
        </div>

        <div className='col-span-1'>
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
            className='w-full'
            data-cy='list-editor-start-date'
          />
        </div>
        <div className='col-span-1'>
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
            className='w-full'
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
            className='w-full'
            data-cy='list-editor-times-reread'
          />
        </div>

        <div className='col-span-1 sm:col-span-2 md:col-span-3'>
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
          onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            deleteUserBookInformationOnline(e);
          }}
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
