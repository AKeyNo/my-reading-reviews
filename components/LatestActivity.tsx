import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { Card } from './Card';
import Loading from './Loading';
import { RecentActivity } from './RecentActivity';

export const LatestActivity = () => {
  const supabase = useSupabaseClient();
  const [latestActivity, setLatestActivity] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLatestActivity = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('read_list')
        .select(
          'user_id, book_id, pages_read, status, cached_information:cached_books(book_id, title, cover, total_pages), user:profiles(username)'
        )
        .order('finish_date', { ascending: false })
        .range(0, 9);

      if (error) {
        console.error(error);
        return;
      }

      if (data) {
        console.log(data);
        setLatestActivity(data);
      }
    };

    fetchLatestActivity();
    setLoading(false);
  }, [supabase]);

  return (
    <Card className='w-full'>
      <h2 className='mb-4 font-semibold'>Latest Activity</h2>
      {loading && <Loading />}
      {!loading &&
        latestActivity &&
        latestActivity.map((activity: any) => (
          <RecentActivity
            key={activity.book_id}
            user={activity.user}
            book={activity}
          />
        ))}
    </Card>
  );
};
