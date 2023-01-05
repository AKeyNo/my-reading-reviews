import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

export const Header = () => {
  const supabase = useSupabaseClient();
  const user = useUser();

  return (
    <header className='h-14'>
      <span data-cy='hello-message'>
        Hello
        {user
          ? ` ${user.user_metadata.username}!`
          : '! You are currently not signed in.'}
      </span>

      {user && (
        <button
          onClick={async () => {
            await supabase.auth.signOut();
          }}
          data-cy='sign-out-button'
        >
          Sign Out
        </button>
      )}
    </header>
  );
};
