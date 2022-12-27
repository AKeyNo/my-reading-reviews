import { PropsWithChildren } from 'react';

export const Dialog: React.FC<PropsWithChildren<any>> = ({
  children,
  isActive,
}) => {
  return isActive ? (
    <div className='fixed inset-0 flex items-center justify-center w-full h-full overflow-y-auto bg-gray-900 bg-opacity-50'>
      {children}
    </div>
  ) : null;
};
