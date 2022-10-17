import { useRouter } from 'next/router';
import styled from 'styled-components';

type Props = {};

const Button = styled.button`
  position: relative;
  display: block;
  margin: 0 auto;
  width: 140px;
  height: 30px;
  border-radius: 30px;
  background: #fff;
  color: #e63c44;
  border: none;
  font-weight: bold;
  font-size: 12px;
  cursor: pointer;
  outline: none;
`;

const randomColor = (): string => {
  const newColour = ((Math.random() * 0xffffff) << 0).toString(16);
  if (newColour.length < 6) {
    return randomColor();
  }
  return newColour;
};

const Random = ({}: Props) => {
  const router = useRouter();
  const handleClick = () => {
    const color = `/${randomColor()}`;
    router.push(color + '?color=' + color, color, {
      shallow: true,
    });
  };
  return <Button onClick={handleClick}>Random</Button>;
};

export default Random;
