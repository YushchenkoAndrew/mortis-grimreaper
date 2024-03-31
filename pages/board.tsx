import ComingSoon from '../components/Container/ComingSoon';
import Container from '../components/Container/Container';
import Header from '../components/Header/Header';
import GlitchItem from '../components/Navbar/GlitchItem';
import Navbar from '../components/Navbar/Navbar';
import { Config } from '../config';
import { NAVIGATION } from '../constants';

export interface BoardProps {}

export default function Board(props: BoardProps) {
  return (
    <>
      <Header title="Mortis Dashboard"></Header>

      <Container
        Navbar={
          <Navbar
            Item={GlitchItem}
            navigation={NAVIGATION}
            avatar={Config.self.github}
          />
        }
      >
        <ComingSoon />
      </Container>
    </>
  );
}
