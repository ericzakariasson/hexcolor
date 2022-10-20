import { GetStaticPaths, GetStaticProps } from 'next';
import Error from 'next/error';
import ColorView from '../components/ColorView';
import SEO from '../components/SEO';
import { ColorContextProvider } from '../context/ColorContext';
import useColorMatch from '../hooks/useColorMatch';
import { stringIsHex } from '../utils/regex';

type Props = {
  isEmptyPage?: boolean;
  color?: string;
};

const ColorPage = ({ color }: Props) => {
  const { hex, wantedColor } = useColorMatch(color);

  console.log({ color, wantedColor, hex });
  if (!stringIsHex(hex)) {
    return <Error statusCode={404} />;
  }

  return (
    <ColorContextProvider color={wantedColor}>
      <SEO title={`${hex} - ${color}.eth`} image={`/api/og?color=${color}`} />
      <ColorView />
    </ColorContextProvider>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const [color] = params?.color || [];
  const hex = `#${color}`;

  if (!hex.match(/^#([A-F0-9]{3}|[A-F0-9]{6})$/i)) {
    return {
      props: {
        isEmptyPage: true,
      },
      revalidate: false,
    };
  }

  return {
    props: {
      color,
    },
    revalidate: false,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export default ColorPage;
