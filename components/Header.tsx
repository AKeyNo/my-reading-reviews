import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CaretDown, SignOut, User } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { Avatar } from './Avatar';

export const Header = () => {
  const supabase = useSupabaseClient();
  const user = useUser();
  const router = useRouter();
  const username = user?.user_metadata.username;
  const [isShowingUserMenu, setIsShowingUserMenu] = useState(false);

  useEffect(() => {
    const getAvatar = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('avatar_url, username')
        .eq('id', user.id)
        .single();

      if (!data) return;
    };

    getAvatar();
  }, [supabase, user]);

  return (
    <header className='z-50 flex items-center mb-4 h-14 bg-stone-900 px-72'>
      <div className='mr-4 text-xl font-semibold'>
        <Link href='/' data-cy='header-logo'>
          My Reading Reviews
        </Link>
      </div>

      <div className='flex space-x-8 font-semibold text-gray-300'>
        <section className='duration-150 hover:text-white'>
          <Link href='/' data-cy='header-home'>
            Home
          </Link>
        </section>
        {user && (
          <section className='duration-150 hover:text-white'>
            <Link href={`/user/${username}`} data-cy='header-profile'>
              Profile
            </Link>
          </section>
        )}
        <section className='duration-150 hover:text-white'>
          <Link href='/search/book' data-cy='header-search'>
            Search
          </Link>
        </section>
      </div>
      {user ? (
        <div
          className='relative flex items-center h-full ml-auto space-x-2 text-blue-500 duration-200 cursor-pointer hover:text-blue-400 group'
          onMouseOver={() => setIsShowingUserMenu(true)}
          onMouseLeave={() => setIsShowingUserMenu(false)}
          data-cy='header-user-menu'
        >
          <Avatar
            username={username}
            userID={user.id}
            url={user.user_metadata.avatar_url}
            size='small'
          />
          <p data-cy='header-user-menu-username'>{`${username}`}</p>
          <CaretDown size={16} weight='bold' />

          {/* drop down menu */}
          <div
            className={`absolute right-0 top-full flex flex-col p-2 py-2 duration-150 bg-gray-800 border border-gray-900 rounded-md shadow-md items-start group-hover:opacity-100 ${
              !isShowingUserMenu && 'opacity-0 pointer-events-none top-4'
            }`}
          >
            <button
              onClick={() => router.push(`/user/${username}`)}
              className='flex items-center w-32 py-1 space-x-2 text-gray-400 duration-200 text-start hover:text-white'
            >
              <User size={16} weight='bold' />
              <p>Profile</p>
            </button>
            <button
              onClick={() => {
                setIsShowingUserMenu(false);
                supabase.auth.signOut();
              }}
              className='flex items-center w-32 py-1 space-x-2 text-gray-400 duration-200 text-start hover:text-white'
              data-cy='header-sign-out-button'
            >
              <SignOut size={16} weight='bold' />
              <p>Logout</p>
            </button>
          </div>
        </div>
      ) : (
        <div className='flex ml-auto space-x-2 text-blue-500'>
          <Link
            href='/signin'
            className='duration-200 hover:text-blue-300'
            data-cy='header-sign-in-link'
          >
            Sign In
          </Link>
          <Link
            href='/signup'
            className='duration-200 hover:text-blue-300'
            data-cy='header-sign-up-link'
          >
            Sign Up
          </Link>
        </div>
      )}
    </header>
  );
};
