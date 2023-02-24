import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Database } from '../lib/types/supabase';
import { ChangeAvatar } from './ChangeAvatar';
import Loading from './Loading';

type Profiles = Database['public']['Tables']['profiles']['Row'];

interface Props {
  username: string;
  userID: string;
  url: string | null;
  customizable?: boolean;
  size: 'small' | 'medium' | 'large';
  'data-cy'?: string;
  className?: string;
}

export const Avatar = ({
  username,
  url,
  customizable,
  userID,
  size,
  'data-cy': dataCy,
  className,
}: Props) => {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const user = useUser();
  const [isChangeAvatarActive, setIsChangeAvatarActive] = useState(false);
  const [avatarURL, setAvatarURL] = useState<Profiles['avatar_url']>(null);
  const [downloadedAvatar, setDownloadedAvatar] = useState(false);
  const [filePath, setFilePath] = useState<string | null>(url);
  const [loading, setLoading] = useState(true);
  const avatarRef = useRef<HTMLInputElement>(null);

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

  const uploadAvatar = async () => {
    window.event?.preventDefault();
    if (!user) return;

    setLoading(true);
    setAvatarURL(null);
    setDownloadedAvatar(false);

    try {
      if (!avatarRef?.current?.files || avatarRef.current.files.length == 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = avatarRef.current.files[0];
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
    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFilePath(url);
  }, [url]);

  useEffect(() => {
    setDownloadedAvatar(false);
  }, [filePath]);

  useEffect(() => {
    if (!filePath || downloadedAvatar) return setLoading(false);

    downloadAvatar();
  }, [downloadAvatar, filePath, downloadedAvatar]);

  return (
    <div
      className={`relative grid text-blue-100 rounded-full bg-slate-500 items-center ${
        !isChangeAvatarActive && 'cursor-pointer'
      } ${
        (size == 'small' && 'w-10 h-10') ||
        (size == 'medium' && 'w-20 h-20') ||
        (size == 'large' && 'w-32 h-32')
      } ${className}`}
      data-cy={dataCy}
    >
      {!loading && (
        <Image
          src={avatarURL || '/blankAvatar.png'}
          alt={`${username}'s avatar`}
          fill
          className={`rounded-full object-cover`}
          onClick={openProfile}
          data-cy={`${dataCy}-image`}
        />
      )}

      {loading && <Loading data-cy={`loading-avatar-${username}`} />}

      {customizable && !loading && (
        <div
          onClick={changeAvatar}
          className='z-10 grid items-center w-full h-full text-center duration-200 border-2 rounded-full text-white/0 hover:bg-black/70 hover:text-white/100'
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
          avatarRef={avatarRef}
        />
      )}
    </div>
  );
};
