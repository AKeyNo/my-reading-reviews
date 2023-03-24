import { PropsWithChildren, useEffect } from 'react';

export const Dialog: React.FC<PropsWithChildren<any>> = ({
  children,
  isActive,
  'data-cy': dataCy,
}) => {
  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = 'hidden';
      return;
    }

    document.body.style.overflow = 'unset';
  }, [isActive]);

  return (
    isActive && (
      <div
        className='fixed inset-0 z-50 flex items-center justify-center w-full min-h-screen overflow-y-auto bg-gray-900 bg-opacity-50'
        data-cy={dataCy}
      >
        {children}
      </div>
    )
  );
};
