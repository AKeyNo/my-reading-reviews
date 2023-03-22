import { useRouter } from 'next/router';

export const AuthButtons = () => {
  const router = useRouter();

  return (
    <div className='flex -mb-20 space-x-4'>
      <button
        onClick={() => {
          router.push('/signup');
        }}
        className='flex-auto w-12 px-2 py-4 duration-200 bg-orange-700 rounded-full hover:-translate-y-1 hover:scale-110 hover:bg-orange-800 hover:drop-shadow-lg'
        data-cy='sign-up-button'
      >
        Sign Up
      </button>
      <button
        onClick={() => {
          router.push('/signin');
        }}
        className='flex-auto w-12 px-2 py-4 duration-200 bg-orange-700 rounded-full hover:-translate-y-1 hover:scale-110 hover:bg-orange-800 hover:drop-shadow-lg'
        data-cy='sign-in-button'
      >
        Sign In
      </button>
    </div>
  );
};
