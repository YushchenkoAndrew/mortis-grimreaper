import ComingSoon from '../components/Container/ComingSoon';
import Container from '../components/Container/Container';
import Header from '../components/Header/Header';
import GlitchItem from '../components/Navbar/GlitchItem';
import Navbar from '../components/Navbar/Navbar';
import { Config } from '../config';

export interface ContactsPageProps {}

export default function ContactsPage(props: ContactsPageProps) {
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
