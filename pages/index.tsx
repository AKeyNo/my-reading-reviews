import {
  createServerSupabaseClient,
  Session,
} from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { AuthButtons } from '../src/components/ui/AuthButtons';
import { LatestActivity } from '../src/components/layout/LatestActivity';

interface Props {
  session: Session | null;
}

export default function Home({ session }: Props) {
  return (
    <div className='flex flex-col w-full'>
      <Head>
        <title>My Reading Reviews - Keep track of your readings easily.</title>
      </Head>

      {!session && (
        <div className='p-12 mb-12 text-center bg-gray-800 border-4 border-gray-700 rounded-md'>
          <h2 className='text-4xl font-bold'>Keep track of your readings.</h2>
          <h3 className='py-8 text-xl font-semibold text-blue-300'>
            Easy, quick, and made for readers.
          </h3>
          {!session && <AuthButtons />}
        </div>
      )}

      <LatestActivity />
    </div>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const supabase = createServerSupabaseClient(context);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return { props: { session } };
};
