import { PropsWithChildren } from 'react';

// dataCy is used for testing with Cypress as it can't be accessed when using data-cy
// when calling this component
export const Card: React.FC<PropsWithChildren<any>> = ({
  children,
  colSpan,
  flex,
  dataCy,
}) => {
  return (
    <div
      className={`${colSpan} ${flex} p-4 bg-gray-800 rounded-md`}
      data-cy={dataCy}
    >
      {children}
    </div>
  );
};
