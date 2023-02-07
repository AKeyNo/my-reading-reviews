import { X } from 'phosphor-react';
import { ChangeAvatarFields } from '../lib/types/changeAvatar';
import { Dialog } from './Dialog';

export const ChangeAvatar = ({
  uploadAvatar,
  deleteAvatar,
  closeChangeAvatar,
  isChangeAvatarActive,
}: ChangeAvatarFields) => {
  return (
    <Dialog isActive={isChangeAvatarActive}>
      <div className='relative w-1/4 p-12 bg-gray-800 shadow-2xl'>
        <button
          type='button'
          onClick={closeChangeAvatar}
          className='absolute duration-200 right-12 hover:bg-red-800'
        >
          <X size={32} weight='thin' data-cy='list-editor-close-button' />
        </button>
        <label className='block font-semibold'>Upload Avatar</label>

        <input
          id='avatar'
          accept='image/*'
          type='file'
          className='block mb-8'
          onChange={(e) => uploadAvatar(e)}
        />

        <button
          className='text-red-500 duration-150 hover:text-red-600'
          onClick={() => deleteAvatar()}
        >
          Delete avatar
        </button>
      </div>
    </Dialog>
  );
};
