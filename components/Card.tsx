import { PropsWithChildren } from 'react';

export const Card: React.FC<PropsWithChildren<any>> = ({
  children,
  colSpan,
}) => {
  return (
    <div className={`${colSpan} p-4 bg-gray-800 rounded-md`}>{children}</div>
  );
};
