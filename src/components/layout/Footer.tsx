import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className='z-50 h-20 mt-auto sm:h-14 bg-stone-900'>
      <div className='flex flex-col items-center h-full max-w-screen-lg p-4 mx-auto sm:flex-row'>
        <div>
          <p className='text-xs'>
            Google Books™ service is a trademark of Google LLC.
          </p>
        </div>

        <div className='flex items-center mt-2 space-x-2 text-sm text-blue-500 sm:mt-0 sm:ml-auto sm:text-md'>
          <section>
            <Link
              href='http://localhost:3000/legal/privacy-policy'
              className='duration-200 hover:text-blue-400'
            >
              Privacy Policy
            </Link>
          </section>
          <section>
            <Link
              href='https://github.com/AKeyNo/my-reading-reviews'
              className='duration-200 hover:text-blue-400'
            >
              GitHub
            </Link>
          </section>
          <section>
            <Link
              href='https://www.linkedin.com/in/ariel-aquino-cs/'
              className='duration-200 hover:text-blue-400'
            >
              LinkedIn
            </Link>
          </section>
        </div>
      </div>
    </footer>
  );
};
