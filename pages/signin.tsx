import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Card } from '../components/Card';
import { AuthErrors, AuthFields } from '../lib/types/auth';

export default function SignIn() {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [userFields, setUserFields] = useState<AuthFields>({} as AuthFields);
  const [errors, setErrors] = useState<AuthErrors>({} as AuthErrors);

  const signInSubmit = async () => {
    window.event?.preventDefault();

    if (!userFields.email || userFields.email?.length == 0) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        emailError: 'Email is empty!',
      }));
    }

    if (!userFields.password || userFields.password?.length == 0) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        emailError: 'Password is empty!',
      }));
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: userFields.email!,
        password: userFields.password!,
      });

      if (error) throw error;

      router.push('/');
    } catch (error: any) {
      console.error('error', error);
      if (error.message.includes('Email')) {
        setErrors((previousErrors) => ({
          ...previousErrors,
          emailError: error.message,
        }));
      }

      if (error.message.includes('Password')) {
        setErrors((previousErrors) => ({
          ...previousErrors,
          passwordError: error.message,
        }));
      }
    }
  };

  return (
    <Card className='w-full max-w-xl mx-auto'>
      <Head>
        <title>Sign In</title>
      </Head>

      <h1 className='text-2xl font-bold text-center'>Sign In</h1>
      <form
        className='flex flex-col items-center justify-center w-11/12 mt-4'
        onSubmit={signInSubmit}
      >
        <div className='flex-auto w-2/3 max-w-md mb-1 min-w-fit'>
          <label className='block text-sm font-semibold text-white'>
            Email
          </label>
          <input
            className={`w-full px-3 py-2 leading-tight border rounded shadow appearance-none focus:outline-none focus:shadow-outline duration-200 ${
              errors.emailError && 'border-red-500'
            }`}
            type='email'
            placeholder='Email'
            onChange={(e) => {
              setUserFields({
                ...userFields,
                email: e.target.value,
              } as AuthFields);
              setErrors((previousErrors) => ({
                ...previousErrors,
                emailError: '',
              }));
            }}
            data-cy='email-input'
          />
          <p className='text-red-500'>{errors.emailError}&nbsp;</p>
        </div>

        <div className='flex-auto w-2/3 max-w-md mb-1 min-w-fit'>
          <label className='block mb-2 text-sm font-semibold text-white'>
            Password
          </label>
          <input
            className={`w-full px-3 py-2 leading-tight border rounded shadow appearance-none focus:outline-none focus:shadow-outline duration-200 ${
              errors.passwordError ? 'border-red-500' : ''
            }`}
            type='password'
            placeholder='Password'
            onChange={(e) => {
              setUserFields({
                ...userFields,
                password: e.target.value,
              } as AuthFields);
            }}
            data-cy='password-input'
          />
          <p className='text-red-500'>{errors.passwordError}&nbsp;</p>
        </div>
        <button
          className='p-4 px-12 mt-4 duration-200 bg-orange-700 rounded-md hover:bg-orange-800'
          type='submit'
          data-cy='sign-in-submit-button'
        >
          Sign In
        </button>

        <p className='mt-24 text-white'>
          Don&apos;t have an account?{' '}
          <Link href='/signup' className='font-semibold text-blue-300'>
            Sign Up
          </Link>
        </p>
      </form>
    </Card>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const supabase = createServerSupabaseClient(context);
  // if there is already a user logged in, redirect to home page
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };

  return {
    props: {},
  };
};
