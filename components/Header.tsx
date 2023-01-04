import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

export const Header = () => {
  const supabase = useSupabaseClient();
  const user = useUser();

  return (
    <header className='h-14'>
      <span data-cy='hello-message'>
        Hello {`${user?.user_metadata.username}!` || ''}
      </span>

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
