import { PropsWithChildren } from 'react';
import { Footer } from './Footer';
import { Header } from './Header';

export const Wrapper: React.FC<PropsWithChildren<any>> = ({ children }) => {
  return (
    <>
      <div className='min-h-screen flex flex-col'>
        <Header />
        <div className='mx-72 bg-gray-900 flex-1'>{children}</div>
        <Footer />
      </div>
    </>
  );
};
