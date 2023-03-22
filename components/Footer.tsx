import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className='z-50 flex items-center px-4 mt-4 h-14 bg-stone-900 md:px-16 lg:px-72'>
      <div>
        <p className='text-xs'>
          Google Books™ service is a trademark of Google LLC.
        </p>
      </div>

      <div className='flex ml-auto space-x-2 text-blue-500'>
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
    </footer>
  );
};
