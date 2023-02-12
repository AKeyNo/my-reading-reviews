import { CircleNotch } from 'phosphor-react';

interface Props {
  hScreen?: boolean;
  'data-cy'?: string;
}

const Loading = ({ hScreen, 'data-cy': dataCy }: Props): JSX.Element => {
  return (
    <div
      className={`flex items-center justify-center ${
        hScreen ? 'h-screen' : 'm-4'
      }`}
      data-cy={dataCy}
    >
      <CircleNotch size={32} weight='fill' className='animate-spin' />
    </div>
  );
};

export default Loading;
