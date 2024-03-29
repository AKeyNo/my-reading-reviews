import { PropsWithChildren } from 'react';

export const Card: React.FC<PropsWithChildren<any>> = ({
  children,
  colSpan,
  flex,
  className,
  'data-cy': dataCy,
}) => {
  return (
    <div
      className={`${colSpan} ${flex} p-4 bg-gray-800 rounded-md ${className}`}
      data-cy={dataCy}
    >
      {children}
    </div>
  );
};
