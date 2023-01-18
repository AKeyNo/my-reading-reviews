import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className='flex items-center mt-4 h-14 bg-stone-900 px-72'>
      <p>Created by Ariel Aquino</p>
      <div className='flex ml-auto space-x-2 text-blue-500'>
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
