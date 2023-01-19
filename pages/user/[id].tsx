import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { RecentActivity } from '../../components/RecentActivity';

export default function UserPage() {
  const router = useRouter();
  const supabase = useSupabaseClient();

  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any>(null);

  useEffect(() => {
    if (!router.query.id) return;

    const fetchUser = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, summary, id, read_list(pages_read, score, status)')
        .eq('username', router.query.id);

      if (error) {
        console.error(error);
        return;
      }

      if (data) {
        setUser(data[0]);
      }
    };

    fetchUser();
  }, [supabase, router]);

  useEffect(() => {
    if (!user) return;

    const fetchFavorites = async () => {
      if (favorites) return;

      const { data, error } = await supabase
        .from('read_list')
        .select('book_id, cached_books(title, cover)')
        .eq('user_id', user.id)
        .eq('favorite', true);

      if (error) {
        console.error(error);
        return;
      }

      setFavorites(data);
    };

    const fetchRecentActivity = async () => {
      if (recentActivity) return;

      const { data, error } = await supabase
        .from('read_list')
        .select(
          'book_id, pages_read, status, finish_date, cached_information:cached_books(title, cover, total_pages)'
        )
        .eq('user_id', user.id)
        .order('finish_date', { ascending: false })
        .limit(5);

      if (error) {
        console.error(error);
        return;
      }

      setRecentActivity(data);
    };

    fetchFavorites();
    fetchRecentActivity();
  }, [supabase, user, favorites, recentActivity]);

  //TODO: Experiment with using RPC instead of doing all of these equations below.
  const totalBooksFinished = () => {
    return user.read_list.filter((book: any) => book.status === 'Completed')
      .length;
  };

  const totalPagesRead = () => {
    return user.read_list.reduce(
      (accumulator: number, currentValue: any) =>
        accumulator + currentValue.pages_read,
      0
    );
  };

  const averageScore = () => {
    const totalScore = user.read_list.reduce(
      (accumulator: number, currentValue: any) =>
        accumulator + currentValue.score,
      0
    );

    return (totalScore / user.read_list.length).toPrecision(3);
  };

  return (
    <div className='grid grid-flow-col grid-cols-12 gap-4'>
      <div className='flex flex-col h-full col-span-3 gap-4'>
        <Card flex={'flex'}>
          <div className='grid w-32 h-32 mr-4 rounded-full place-items-center bg-slate-500'>
            {user?.avatar_url ? (
              <Image src={user.avatar_url} alt={user.username} />
            ) : (
              <p>{user?.username[0]}</p>
            )}
          </div>
          <p className='self-center'>{user?.username}</p>
        </Card>

        {user && (
          <Card>
            <h2 className='font-semibold'>Stats</h2>
            <p>Total Books: {user?.read_list?.length}</p>
            <p>Books Read: {totalBooksFinished()}</p>
            <p>Pages Read: {totalPagesRead()}</p>
            <p>Average Score: {averageScore()}</p>
          </Card>
        )}
      </div>
      <div className='flex flex-col h-full col-span-9 gap-4'>
        <Card>{user?.summary}</Card>
        <Card flex={'flex flex-col'}>
          <h2 className='mb-4 font-semibold'>Recent Activity</h2>
          {recentActivity?.map((book: any, key: string) => (
            <RecentActivity user={user} book={book} key={key} />
          ))}
        </Card>
        <Card flex={'flex flex-col'}>
          <h2 className='mb-4 font-semibold'>Favorites</h2>
          {favorites?.map((book: any, key: string) => (
            <Link href={`/book/${book.book_id}`} key={key} passHref>
              <Image
                src={book.cached_books.cover || '/missingBookImage.png'}
                alt={book.name || 'Missing Book Name'}
                width={100}
                height={100}
                className='inline w-24 mr-4 rounded-md basis-1/12'
              />
            </Link>
          ))}
        </Card>
      </div>
    </div>
  );
}
