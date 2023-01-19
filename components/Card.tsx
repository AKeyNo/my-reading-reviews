import { PropsWithChildren } from 'react';

export const Card: React.FC<PropsWithChildren<any>> = ({
  children,
  colSpan,
  flex,
}) => {
  return (
    <div className={`${colSpan} ${flex} p-4 bg-gray-800 rounded-md`}>
      {children}
    </div>
  );
};
