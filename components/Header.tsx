import { Session } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import supabase from '../client';

export const Header = ({ session }: { session: Session }) => {
  const user = useUser();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    getProfile();
  }, [session]);

  const getProfile = async () => {
    try {
      if (!user) throw new Error('No user found');

      const { data, error, status } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id);
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        console.log('typeof', typeof data[0]);
        setUsername(data[0].username);
      }
    } catch (error: any) {
      console.log('error', error);
    }
  };

  return <header className='h-14'>Hello {username}</header>;
};
