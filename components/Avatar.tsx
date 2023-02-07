import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Spinner } from 'phosphor-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Database } from '../lib/types/supabase';
import { ChangeAvatar } from './ChangeAvatar';

type Profiles = Database['public']['Tables']['profiles']['Row'];

interface Props {
  username: string;
  userID: string;
  url: string;
  customizable?: boolean;
  size: 'small' | 'medium' | 'large';
}

export const Avatar = ({
  username,
  url,
  customizable,
  userID,
  size,
}: Props) => {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const user = useUser();
  const [isChangeAvatarActive, setIsChangeAvatarActive] = useState(false);
  const [avatarURL, setAvatarURL] = useState<Profiles['avatar_url']>(null);
  const [downloadedAvatar, setDownloadedAvatar] = useState(false);
  const [filePath, setFilePath] = useState<string | null>(url);
  const [loading, setLoading] = useState(false);

  const changeAvatar = () => {
    window.event?.preventDefault();
    setIsChangeAvatarActive(true);
  };

  const downloadAvatar = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.storage
        .from('avatars')
        .download(`${filePath}?bust=${Date.now()}`);

      if (error) {
        throw error;
      }

      setAvatarURL(URL.createObjectURL(data));
      setDownloadedAvatar(true);
      setIsChangeAvatarActive(false);

      setLoading(false);
    } catch (error) {
      alert('Error downloading avatar!');
      console.error(error);
    }
  }, [supabase.storage, filePath]);

  const openProfile = () => {
    window.event?.preventDefault();
    router.push(`/user/${username}`);
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    window.event?.preventDefault();
    if (!user) return;

    setLoading(true);
    setAvatarURL(null);
    setDownloadedAvatar(false);

    try {
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExtension = file.name.split('.').pop();
      const fileName = `${userID}.${fileExtension}`;
      const filePath = `${userID}/${fileName}`;

      const { error: uploadAvatarError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadAvatarError) {
        throw uploadAvatarError;
      }

      // update profile with avatar url
      const { error: updateProfileError } = await supabase
        .from('profiles')
        .update({ avatar_url: filePath })
        .eq('id', user.id);

      if (updateProfileError) {
        throw updateProfileError;
      }

      // update user with avatar url
      const { error: updateUserError } = await supabase.auth.updateUser({
        data: { avatar_url: filePath },
      });

      if (updateUserError) {
        throw updateUserError;
      }

      // update local
      const { error } = await supabase.auth.getUser();

      if (error) {
        throw error;
      }

      setFilePath(filePath);
    } catch (error) {
      alert('Error uploading avatar!');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAvatar = async () => {
    window.event?.preventDefault();
    if (!user) return;

    try {
      // delete avatar from storage
      let { error: deleteAvatarError } = await supabase.storage
        .from('avatars')
        .remove([`${user.id}/${filePath}`]);

      if (deleteAvatarError) {
        throw deleteAvatarError;
      }

      // update profile with avatar url
      let { error: updateProfileError } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', user.id);

      if (updateProfileError) {
        throw updateProfileError;
      }

      // update user with avatar url
      const { error: updateUserError } = await supabase.auth.updateUser({
        data: { avatar_url: null },
      });

      if (updateUserError) {
        throw updateUserError;
      }

      // update local
      const { error } = await supabase.auth.getUser();

      if (error) {
        throw error;
      }

      setAvatarURL(null);
      setDownloadedAvatar(true);
      setIsChangeAvatarActive(false);
    } catch (error) {
      alert('Error deleting avatar!');
      console.error(error);
    }
  };

  useEffect(() => {
    setFilePath(url);
  }, [url]);

  useEffect(() => {
    setDownloadedAvatar(false);
  }, [filePath]);

  useEffect(() => {
    if (!filePath || downloadedAvatar) return;

    downloadAvatar();
  }, [downloadAvatar, filePath, downloadedAvatar]);

  return (
    <div
      className={`relative grid text-blue-100 rounded-full place-items-center bg-slate-500 ${
        !isChangeAvatarActive && 'cursor-pointer'
      } ${
        (size == 'small' && 'w-10 h-10') ||
        (size == 'medium' && 'w-20 h-20') ||
        (size == 'large' && 'w-32 h-32')
      }`}
    >
      {!loading && (
        <Image
          src={avatarURL || '/blankAvatar.png'}
          alt={`${username}'s avatar`}
          fill
          className={`rounded-full object-cover ${customizable && ''}`}
          onClick={openProfile}
        />
      )}

      {customizable && (
        <div
          onClick={changeAvatar}
          className='z-10 grid items-center w-full h-full text-center duration-200 rounded-full text-white/0 hover:bg-black/70 hover:text-white/100'
        >
          Edit Avatar
        </div>
      )}
      {customizable && (
        <ChangeAvatar
          uploadAvatar={uploadAvatar}
          deleteAvatar={deleteAvatar}
          isChangeAvatarActive={isChangeAvatarActive}
          closeChangeAvatar={() => {
            setIsChangeAvatarActive(false);
          }}
        />
      )}
    </div>
  );
};
