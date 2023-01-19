import { useSession } from '@supabase/auth-helpers-react';
import Head from 'next/head';
import { AuthButtons } from '../components/AuthButtons';

export default function Home() {
  const session = useSession();

  return (
    <>
      <Head>
        <title>My Book Reviews - Keep track of your readings easily.</title>
      </Head>
      <div className='p-12 m-12 text-center bg-gray-800 border-4 border-gray-700 rounded-md'>
        <h2 className='text-4xl font-bold'>Keep track of your readings.</h2>
        <h3 className='py-8 text-xl font-semibold text-blue-300'>
          Easy, quick, and made for readers.
        </h3>
        {!session && <AuthButtons />}
      </div>
    </>
  );
}
