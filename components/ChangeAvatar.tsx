import { X } from 'phosphor-react';
import { useState } from 'react';
import { ChangeAvatarFields } from '../lib/types/changeAvatar';
import { Dialog } from './Dialog';

export const ChangeAvatar = ({
  uploadAvatar,
  deleteAvatar,
  closeChangeAvatar,
  isChangeAvatarActive,
  avatarRef,
}: ChangeAvatarFields) => {
  const [avatarIsValid, setAvatarIsValid] = useState(false);

  // affirms that what the user uploaded is a valid image that is less than 5MB
  const checkAvatar = () => {
    if (
      !avatarRef.current ||
      !avatarRef.current.files ||
      avatarRef.current.files?.length === 0
    ) {
      setAvatarIsValid(false);
      return window.alert('No file selected!');
    }

    if (!avatarRef?.current?.files[0].type.includes('image/')) {
      setAvatarIsValid(false);
      return window.alert('File is not an image!');
    }

    // 1_000_000 = 1MB
    if (avatarRef.current.files[0].size > 1_000_000) {
      setAvatarIsValid(false);
      avatarRef.current.value = '';
      return window.alert('File must be less than 1MB!');
    }

    setAvatarIsValid(true);
  };

  return (
    <Dialog isActive={isChangeAvatarActive} data-cy='change-avatar-dialog'>
      <div className='relative flex w-full h-full p-12 bg-gray-800 shadow-2xl sm:h-auto sm:w-auto max-h-64'>
        <button
          type='button'
          onClick={() => {
            setAvatarIsValid(false);
            closeChangeAvatar();
          }}
          className='absolute duration-200 right-12 hover:bg-red-800'
        >
          <X size={32} weight='thin' data-cy='change-avatar-close-button' />
        </button>

        <form onSubmit={uploadAvatar}>
          <label className='block font-semibold'>
            Upload Avatar{' '}
            <span className='text-xs font-normal'>
              (must be smaller than 1MB)
            </span>
          </label>

          <input
            id='avatar'
            accept='image/*'
            type='file'
            className='block mb-8'
            onChange={checkAvatar}
            ref={avatarRef}
            data-cy='avatar-upload-input'
          />
          <div className='flex justify-between w-full gap-4'>
            <button
              className={`p-4 px-8 font-semibold duration-150 bg-gray-700 rounded-md pointer-events-none ${
                avatarIsValid &&
                'enabled bg-green-700 hover:bg-green-800 pointer-events-auto'
              }`}
              type='submit'
              data-cy='avatar-upload-button'
            >
              Upload Avatar
            </button>
            <button
              className='p-4 px-8 font-semibold duration-150 bg-red-700 rounded-md hover:bg-red-800'
              type='button'
              onClick={deleteAvatar}
              data-cy='avatar-delete-button'
            >
              Delete Avatar
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  );
};
