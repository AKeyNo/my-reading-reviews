import { PropsWithChildren } from 'react';

export const Dialog: React.FC<PropsWithChildren<any>> = ({
  children,
  isActive,
  'data-cy': dataCy,
}) => {
  return (
    isActive && (
      <div
        className='fixed inset-0 z-50 flex items-center justify-center w-full h-full max-w-screen-lg mx-auto overflow-y-auto bg-gray-900 bg-opacity-50'
        data-cy={dataCy}
      >
        {children}
      </div>
    )
  );
};
