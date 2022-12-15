import Link from 'next/link';
import { Wrapper } from '../components/Wrapper';

export default function SignUp() {
  return (
    <Wrapper>
      <div className='flex flex-col items-center w-1/2 p-12 mx-auto mt-12 bg-gray-800 rounded-2xl'>
        <h1 className='text-2xl font-bold'>Sign Up</h1>
        <form className='flex flex-col items-center justify-center w-11/12 mt-4'>
          <div className='flex-auto w-2/3 max-w-md min-w-fit'>
            <label className='block mb-2 text-sm font-semibold text-white'>
              Username
            </label>
            <input
              className='w-full px-3 py-2 mb-4 leading-tight border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
              type='text'
              placeholder='Username'
            />
          </div>
          <div className='flex-auto w-2/3 max-w-md min-w-fit'>
            <label className='block mb-2 text-sm font-semibold text-white'>
              Email
            </label>
            <input
              className='w-full px-3 py-2 mb-4 leading-tight border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
              type='email'
              placeholder='Email'
            />
          </div>
          <div className='flex-auto w-2/3 max-w-md min-w-fit'>
            <label className='block mb-2 text-sm font-semibold text-white'>
              Password
            </label>
            <input
              className='w-full px-3 py-2 mb-4 leading-tight border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
              type='password'
              placeholder='Password'
            />
          </div>
          <div className='flex-auto w-2/3 max-w-md min-w-fit'>
            <label className='block mb-2 text-sm font-semibold text-white'>
              Confirm Password
            </label>
            <input
              className='w-full px-3 py-2 mb-4 leading-tight border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
              type='password'
              placeholder='Confirm Password'
            />
          </div>

          <button
            className='p-4 px-12 mt-4 duration-200 bg-orange-700 rounded-md hover:bg-orange-800'
            type='submit'
          >
            Sign Up
          </button>

          <p className='mt-24 text-white'>
            Already have an account?{' '}
            <Link href='/signin' className='font-semibold text-blue-300'>
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </Wrapper>
  );
}
