import { ReactNode } from 'react';
import { Config } from '../../../config';
import { PUBLIC_FONT_4BITFONT } from '../../../constants';
import Header from '../../Header/Header';
import GlitchItem from '../../Navbar/GlitchItem';
import Navbar from '../../Navbar/Navbar';
import Container from '../Container';

export interface DefaultLayoutProps {
  title: string;
  className?: string;
  children?: ReactNode;
  background?: string;
}

export default function DefaultLayout(props: DefaultLayoutProps) {
  return (
    <>
      <Header title={props.title} fonts={[PUBLIC_FONT_4BITFONT]}></Header>

      <Container
        className={
          props.className ?? 'overflow-y-hidden w-full h-[calc(100vh-4rem)]'
        }
        background={props.background}
        Navbar={
          <Navbar
            Item={GlitchItem}
            navigation={[
              { name: 'about_me', href: '/' },
              { name: 'working_on', href: '/dashboard' },
              { name: 'art', href: '/art' },
              { name: 'programming', href: '/projects' },
              { name: 'contact_me', href: '/contacts' },
            ]}
            avatar={Config.self.github}
          />
        }
        // Breadcrumbs={<Breadcrumbs path={['Home', 'Projects']} />}
      >
        {props.children}
      </Container>
    </>
  );
}
