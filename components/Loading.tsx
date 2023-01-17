import { CircleNotch } from 'phosphor-react';

interface Props {
  hScreen?: boolean;
}

const Loading = ({ hScreen }: Props): JSX.Element => {
  return (
    <div
      className={`flex items-center justify-center ${
        hScreen ? 'h-screen' : 'm-4'
      }`}
    >
      <CircleNotch size={32} weight='fill' className='animate-spin' />
    </div>
  );
};

export default Loading;
