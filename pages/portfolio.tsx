import ComingSoon from '../components/Container/ComingSoon';
import Container from '../components/Container/Container';
import Header from '../components/Header/Header';
import GlitchItem from '../components/Navbar/GlitchItem';
import Navbar from '../components/Navbar/Navbar';
import { Config } from '../config';

export interface PortfolioPageProps {}

export default function PortfolioPage(props: PortfolioPageProps) {
  return (
    <>
      <Header title="Mortis Portfolio"></Header>

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
