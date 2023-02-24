import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Pencil, X } from 'phosphor-react';
import { useEffect, useRef, useState } from 'react';
import { Avatar } from '../../components/Avatar';
import { Card } from '../../components/Card';
import { RecentActivity } from '../../components/RecentActivity';

export default function UserPage() {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const user = useUser();

  const [profileUser, setProfileUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any>(null);
  const [showSummaryCreation, setShowSummaryCreation] = useState(false);

  const newSummary = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!router.query.id) return;

    const fetchUser = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(
          'username, summary, id, avatar_url, read_list(pages_read, score, status)'
        )
        .eq('username', router.query.id);

      if (error) {
        console.error(error);
        return;
      }

      if (data) {
        setProfileUser(data[0]);
      }
    };

    fetchUser();
  }, [supabase, router]);

  useEffect(() => {
    if (!profileUser) return;

    const fetchFavorites = async () => {
      if (favorites) return;

      const { data, error } = await supabase
        .from('read_list')
        .select('book_id, cached_books(title, cover)')
        .eq('user_id', profileUser.id)
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
        .eq('user_id', profileUser.id)
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
  }, [supabase, profileUser, favorites, recentActivity]);

  // reset the new summary textarea when the user closes the summary creation menu
  useEffect(() => {
    if (!newSummary.current) return;

    newSummary.current.value = profileUser.summary;
  }, [showSummaryCreation, profileUser]);

  //TODO: Experiment with using RPC instead of doing all of these equations below.
  const totalBooksFinished = () => {
    return profileUser.read_list.filter(
      (book: any) => book.status === 'Completed'
    ).length;
  };

  const totalPagesRead = () => {
    return profileUser.read_list.reduce(
      (accumulator: number, currentValue: any) =>
        accumulator + currentValue.pages_read,
      0
    );
  };

  const averageScore = () => {
    const totalScore = profileUser.read_list.reduce(
      (accumulator: number, currentValue: any) =>
        accumulator + currentValue.score,
      0
    );

    return (totalScore / profileUser.read_list.length).toFixed(2);
  };

  const submitNewSummary = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newSummary.current) return;

    const { error } = await supabase
      .from('profiles')
      .update({ summary: newSummary.current.value })
      .eq('id', profileUser.id);

    if (error) {
      console.error(error);
      return;
    }

    setProfileUser({ ...profileUser, summary: newSummary.current.value });
    setShowSummaryCreation(false);

    newSummary.current.value = '';
  };

  return (
    <div className='grid grid-flow-col grid-cols-12 gap-4'>
      <div className='flex flex-col h-full col-span-3 gap-4'>
        <Card flex={'flex justify-evenly'}>
          <Avatar
            username={profileUser?.username}
            userID={profileUser?.id}
            url={profileUser?.avatar_url}
            customizable={true}
            size='large'
            data-cy='profile-avatar'
          />
          <p className='self-center' data-cy='profile-username'>
            {profileUser?.username}
          </p>
        </Card>

        {profileUser && (
          <Card data-cy='profile-stats'>
            <h2 className='font-semibold'>Stats</h2>
            <p>Total Books: {profileUser?.read_list?.length}</p>
            <p>Books Read: {totalBooksFinished()}</p>
            <p>Pages Read: {totalPagesRead()}</p>
            <p>Average Score: {averageScore()}</p>
          </Card>
        )}
      </div>
      <div className='flex flex-col h-full col-span-9 gap-4'>
        <Card className='relative' data-cy='profile-summary'>
          <div className='flex mb-4'>
            <h2 className='font-semibold '>Summary</h2>
            {user?.id == profileUser?.id && !showSummaryCreation && (
              <button
                onClick={() => setShowSummaryCreation(true)}
                className='ml-auto'
              >
                <Pencil
                  size={32}
                  weight='fill'
                  className='duration-150 hover:fill-orange-500'
                  data-cy='summary-editor-open-button'
                />
              </button>
            )}
            {user?.id == profileUser?.id && showSummaryCreation && (
              <button
                onClick={() => setShowSummaryCreation(false)}
                className='ml-auto'
              >
                <X
                  size={32}
                  weight='fill'
                  className='duration-150 fill-gray-400 hover:fill-red-500'
                  data-cy='summary-editor-close-button'
                />
              </button>
            )}
          </div>
          {/* if the user is the same as the page, allow them to edit the summary */}
          {showSummaryCreation && (
            <form
              onSubmit={(e) => {
                submitNewSummary(e);
              }}
            >
              <textarea
                ref={newSummary}
                className='w-full mb-2'
                data-cy='profile-summary-text-area'
              />

              <button
                className='p-4 px-8 text-sm duration-150 bg-orange-700 rounded-md hover:bg-orange-800'
                type='submit'
                data-cy='profile-summary-save-button'
              >
                Save
              </button>
            </form>
          )}
          <p data-cy='profile-summary-text'>
            {!showSummaryCreation && profileUser?.summary}
          </p>
        </Card>
        <Card flex={'flex flex-col'} data-cy='profile-recent-activity'>
          <h2 className='mb-4 font-semibold'>Recent Activity</h2>
          {recentActivity?.map((book: any, key: string) => (
            <RecentActivity user={profileUser} book={book} key={key} />
          ))}
        </Card>
        <Card flex={'flex flex-col'} data-cy='profile-favorites'>
          <h2 className='mb-4 font-semibold'>Favorites</h2>
          <div className='flex space-x-2'>
            {favorites?.map((book: any, key: string) => (
              <Link
                href={`/book/${book.book_id}`}
                key={key}
                passHref
                className={`relative flex items-center h-44 basis-1/11`}
              >
                <Image
                  src={book.cached_books.cover || '/missingBookImage.png'}
                  alt={book.name || 'Missing Book Name'}
                  fill
                  className='inline object-cover w-full mr-4 rounded-md'
                  data-cy={`profile-favorite-book-${book.book_id}`}
                />
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
