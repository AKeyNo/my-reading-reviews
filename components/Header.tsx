import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';

export const Header = () => {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        if (!user) return;

        const { data, error, status } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id);
        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setUsername(data[0].username);
        }
      } catch (error: any) {
        console.error('error', error);
      }
    };

    getProfile();
  }, [user]);

  return (
    <header className='h-14'>
      <span data-cy='hello-message'>Hello {username || ''}!</span>

      <button
        onClick={async () => {
          await supabase.auth.signOut();
        }}
      >
        Sign Out
      </button>
    </header>
  );
};
