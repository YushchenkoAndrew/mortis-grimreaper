import ComingSoon from '../components/Container/ComingSoon';
import Container from '../components/Container/Container';
import Header from '../components/Header/Header';
import GlitchItem from '../components/Navbar/GlitchItem';
import Navbar from '../components/Navbar/Navbar';
import { Config } from '../config';
import { PUBLIC_FONT_4BITFONT } from '../constants';

export interface BoardPageProps {}

export default function BoardPage(props: BoardPageProps) {
  return (
    <>
      <Header title="Mortis Dashboard"></Header>

      <Container
        Navbar={
          <Navbar
            Item={GlitchItem}
            navigation={Config.self.navigation}
            avatar={Config.self.github}
          />
        }
      >
        <ComingSoon />
      </Container>
    </>
  );
}
