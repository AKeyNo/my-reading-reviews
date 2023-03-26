import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Avatar } from '../../../components/Avatar';
import Loading from '../../../components/Loading';
import { useScroll } from '../../../lib/hooks/useScroll';
import { Database } from '../../../lib/types/supabase';

export default function SearchUser() {
  const router = useRouter();
  const supabase = useSupabaseClient();

  const [searchUsername, setSearchUsername] = useState<string | null>();
  const [startIndex, setStartIndex] = useState(-1);
  const [users, setUsers] = useState<
    Database['public']['Tables']['profiles']['Row'][]
  >([]);
  const [totalUsers, setTotalUsers] = useState(-1);

  const [loading, setLoading] = useState(false);

  const loadMoreUsers = async () => {
    if (
      startIndex == 0 ||
      Object.keys(router.query).length === 0 ||
      users.length >= totalUsers ||
      loading
    )
      return;

    setLoading(true);
    setStartIndex(startIndex + 1);

    // search for the users
    const { data, count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .textSearch('username', router.query.username as string)
      .range(startIndex * 10, startIndex * 10 + 10);

    if (error) {
      console.error(error);
      return setLoading(false);
    }

    setUsers([...users!, ...data]);
    setTotalUsers(count || 0);
    setLoading(false);
  };

  useScroll(loadMoreUsers);

  useEffect(() => {
    setUsers([]);
    if (Object.keys(router.query).length === 0) return;

    const fetchUsers = async () => {
      setLoading(true);

      setSearchUsername(router.query.username as string);

      // search for the user
      const { data, count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .textSearch('username', router.query.username as string)
        .range(0, 10);

      if (error) {
        console.error(error);
        return setLoading(false);
      }

      setUsers(data);
      setTotalUsers(count || 0);
      setLoading(false);
      setStartIndex(1);
    };

    fetchUsers();
  }, [router.query, supabase]);

  // searches for users by username and returns the first 10 results
  // and debounces the search
  useEffect(() => {
    setTotalUsers(-1);
    const isParameterEmpty = () => {
      return !searchUsername;
    };

    const isParameterEqual = () => {
      return searchUsername === router.query.username;
    };

    if (isParameterEmpty() && Object.keys(router.query).length === 0)
      return setUsers([]);

    if (isParameterEqual()) return;

    const delayDebounce = setTimeout(() => {
      if (isParameterEmpty()) {
        return router.replace({ pathname: '/search/user' });
      }

      // only include queries that are not empty
      let query = {};
      if (searchUsername) query = { ...query, username: searchUsername };

      router.replace({ pathname: '/search/user', query });
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [searchUsername, router]);

  return (
    <div className='w-full'>
      <Head>
        <title>User Search</title>
      </Head>

      {/* search */}
      <form className='mb-2'>
        <label className='block mb-4 font-bold text-gray-400'>
          Search Username
        </label>
        <input
          className='w-full p-2 bg-gray-700 border-gray-400 rounded-md'
          type='text'
          value={(searchUsername as string) || ''}
          placeholder=''
          onChange={(e) => setSearchUsername(e.target.value)}
          data-cy='search-username-input'
        />
      </form>

      {/* users list */}
      <div className='flex flex-col'>
        {users?.map((user, key: any) => (
          <div key={key} className='flex flex-row items-center p-4 border-2'>
            <Avatar
              username={user.username!}
              url={user.avatar_url}
              userID={user.id}
              size='medium'
              className='mr-2'
            />
            <Link
              className='mr-2 font-semibold'
              href={`/user/${user.username}`}
              data-cy={`search-result-${user.username}-username`}
            >
              {user.username}
            </Link>
            <p>{user.summary}</p>
          </div>
        ))}
        {loading && <Loading />}
      </div>

      {/* no users found */}
      {totalUsers == 0 && !loading && (
        <p className='mt-4 text-center text-gray-400'>
          No users found with the username{' '}
          <span className='font-semibold'>{searchUsername}</span>
        </p>
      )}
    </div>
  );
}
