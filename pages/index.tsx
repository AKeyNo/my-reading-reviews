import Head from 'next/head';
import { Wrapper } from '../components/Wrapper';

export default function Home() {
  return (
    <Wrapper>
      <Head>
        <title>My Book Reviews - Keep track of your readings easily.</title>
      </Head>
      <div className='p-12 m-12 text-center bg-gray-800 border-4 border-gray-700 rounded-md'>
        <h2 className='text-4xl font-bold'>Keep track of your readings.</h2>
        <h3 className='py-8 text-xl font-semibold text-blue-300'>
          Easy, quick, and made for readers.
        </h3>
        <div className='-mb-20'>
          <button className='px-12 py-4 mx-32 duration-200 bg-orange-700 rounded-full hover:-translate-y-1 hover:scale-110 hover:bg-orange-800 hover:drop-shadow-lg'>
            Sign Up
          </button>
          <button className='px-12 py-4 mx-32 duration-200 bg-orange-700 rounded-full hover:-translate-y-1 hover:scale-110 hover:bg-orange-800 hover:drop-shadow-lg'>
            Sign In
          </button>
        </div>
      </div>
    </Wrapper>
  );
}
