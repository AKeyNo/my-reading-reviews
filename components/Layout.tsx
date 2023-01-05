import { PropsWithChildren } from 'react';
import { Footer } from './Footer';
import { Header } from './Header';

export const Layout: React.FC<PropsWithChildren<any>> = ({ children }) => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <div className='flex-1 bg-gray-900 mx-72'>{children}</div>
      <Footer />
    </div>
  );
};
