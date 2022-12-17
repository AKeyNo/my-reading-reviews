import { useRouter } from 'next/router';

export const AuthButtons = () => {
  const router = useRouter();

  return (
    <div className='-mb-20'>
      <button
        onClick={() => {
          router.push('/signup');
        }}
        className='px-12 py-4 mx-32 duration-200 bg-orange-700 rounded-full hover:-translate-y-1 hover:scale-110 hover:bg-orange-800 hover:drop-shadow-lg'
      >
        Sign Up
      </button>
      <button
        onClick={() => {
          router.push('/signin');
        }}
        className='px-12 py-4 mx-32 duration-200 bg-orange-700 rounded-full hover:-translate-y-1 hover:scale-110 hover:bg-orange-800 hover:drop-shadow-lg'
      >
        Sign In
      </button>
    </div>
  );
};
