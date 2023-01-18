import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function UserPage() {
  const router = useRouter();
  const supabase = useSupabaseClient();

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!router.query.id) return;

    const fetchUser = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, summary, read_list(pages_read, score, status)')
        .eq('username', router.query.id);

      if (error) {
        console.error(error);
        return;
      }

      if (data) {
        // console.log(data);
        setUser(data[0]);
      }
    };

    fetchUser();
  }, [supabase, router]);

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

    return totalScore / user.read_list.length;
  };

  return (
    <div className='grid grid-flow-col grid-cols-12 gap-4'>
      <div className='h-full col-span-3'>
        <div className='w-full bg-slate-500'>{user?.username}</div>
        {user && (
          <div className='w-full bg-slate-600'>
            <p>Total Books: {user?.read_list?.length}</p>
            <p>Books Read: {totalBooksFinished()}</p>
            <p>Pages Read: {totalPagesRead()}</p>
            <p>Average Score: {averageScore()}</p>
          </div>
        )}
      </div>
      <div className='h-full col-span-9'>
        <div className='w-full bg-slate-700'>{user?.summary}</div>
        <div className='w-full bg-slate-800'>Latest Activity</div>
      </div>
    </div>
  );
}
