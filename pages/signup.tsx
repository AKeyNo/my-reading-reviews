import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Wrapper } from '../components/Wrapper';
import { AuthErrors, AuthFields } from '../types/auth';
import supabase from '../client';
import { useRouter } from 'next/router';

export default function SignUp() {
  const router = useRouter();
  const [userFields, setUserFields] = useState<AuthFields>({} as AuthFields);

  const [errors, setErrors] = useState<AuthErrors>({} as AuthErrors);

  const signUpSubmit = async () => {
    window.event?.preventDefault();

    if (!userFields.username || userFields.username?.length == 0) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        usernameError: 'Username is empty!',
      }));
    }

    if (!userFields.email || userFields.email?.length == 0) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        emailError: 'Email is empty!',
      }));
    }

    if (
      errors.usernameError ||
      errors.emailError ||
      errors.passwordError ||
      errors.confirmPasswordError
    ) {
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: userFields.email!,
        password: userFields.password!,
        options: {
          data: {
            username: userFields.username,
          },
        },
      });

      if (error) throw error;

      router.push('/');
    } catch (error: any) {
      if (error.message.includes('Username')) {
        setErrors((previousErrors) => ({
          ...previousErrors,
          usernameError: error.message,
        }));
      }
    }
  };

  useEffect(() => {
    const checkPasswordLength = () => {
      if (!userFields.password || userFields.password?.length >= 12) {
        setErrors((previousErrors) => ({
          ...previousErrors,
          passwordError: null,
        }));

        return;
      }

      if (userFields.password?.length != 12) {
        setErrors((previousErrors) => ({
          ...previousErrors,
          passwordError: 'The password must be at least 12 characters long.',
        }));

        return;
      }
    };

    const checkMatchingPasswords = () => {
      if (
        !userFields.confirmPassword ||
        userFields.confirmPassword?.length == 0
      ) {
        setErrors((previousErrors) => ({
          ...previousErrors,
          confirmPasswordError: null,
        }));

        return;
      }

      if (userFields.password != userFields.confirmPassword) {
        setErrors((previousErrors) => ({
          ...previousErrors,
          confirmPasswordError: 'These passwords do not match!',
        }));
      } else {
        setErrors((previousErrors) => ({
          ...previousErrors,
          confirmPasswordError: null,
        }));
      }
    };

    checkPasswordLength();
    checkMatchingPasswords();
  }, [userFields]);

  return (
    <Wrapper>
      <div className='flex flex-col items-center w-1/2 p-12 mx-auto mt-12 bg-gray-800 rounded-2xl'>
        <h1 className='text-2xl font-bold'>Sign Up</h1>
        <form
          className='flex flex-col items-center justify-center w-11/12 mt-4'
          onSubmit={signUpSubmit}
        >
          <div className='flex-auto w-2/3 max-w-md mb-1 min-w-fit'>
            <label className='block text-sm font-semibold text-white'>
              Username
            </label>
            <input
              className={`w-full px-3 py-2 leading-tight border rounded shadow appearance-none focus:outline-none focus:shadow-outline duration-200 ${
                errors.usernameError ? 'border-red-500' : ''
              }`}
              type='text'
              placeholder='Username'
              onChange={(e) => {
                setUserFields({
                  ...userFields,
                  username: e.target.value,
                } as AuthFields);
                setErrors((previousErrors) => ({
                  ...previousErrors,
                  usernameError: '',
                }));
              }}
            />
            <p className='text-red-500'>{errors.usernameError}&nbsp;</p>
          </div>

          <div className='flex-auto w-2/3 max-w-md mb-1 min-w-fit'>
            <label className='block text-sm font-semibold text-white'>
              Email
            </label>
            <input
              className={`w-full px-3 py-2 leading-tight border rounded shadow appearance-none focus:outline-none focus:shadow-outline duration-200 ${
                errors.emailError ? 'border-red-500' : ''
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
            />
            <p className='text-red-500'>{errors.passwordError}&nbsp;</p>
          </div>

          <div className='flex-auto w-2/3 max-w-md mb-1 min-w-fit'>
            <label className='block mb-2 text-sm font-semibold text-white'>
              Confirm Password
            </label>
            <input
              className={`w-full px-3 py-2 leading-tight border rounded shadow appearance-none focus:outline-none focus:shadow-outline duration-200 ${
                errors.confirmPasswordError ? 'border-red-500' : ''
              }`}
              type='password'
              placeholder='Confirm Password'
              onChange={(e) => {
                setUserFields({
                  ...userFields,
                  confirmPassword: e.target.value,
                } as AuthFields);
              }}
            />
            <p className='text-red-500'>{errors.confirmPasswordError}&nbsp;</p>
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
