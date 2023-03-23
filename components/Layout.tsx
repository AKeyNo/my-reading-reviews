import { PropsWithChildren } from 'react';
import { Footer } from './Footer';
import { Header } from './Header';

export const Layout: React.FC<PropsWithChildren<any>> = ({ children }) => {
  return (
    <div className='flex flex-col w-screen min-h-screen'>
      <Header />
      <div className='flex w-full max-w-screen-lg p-4 mx-auto my-4'>
        {children}
      </div>
      <Footer />
    </div>
  );
};
