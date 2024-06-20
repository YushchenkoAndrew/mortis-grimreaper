import { ReactNode, useContext } from 'react';
import { Config } from '../../../config';
import { PUBLIC_FONT_4BITFONT } from '../../../constants';
import Header from '../../Header/Header';
import Navbar from '../../Navbar/Navbar';
import NavbarItem from '../../Navbar/NavbarItem';
import Container from '../Container';

export interface AdminLayoutProps {
  title: string;

  background?: string;
  className?: string;
  children?: ReactNode;
  Sidebar?: ReactNode;
}

export default function AdminLayout(props: AdminLayoutProps) {
  return (
    <>
      <Header title={props.title} fonts={[PUBLIC_FONT_4BITFONT]}></Header>

      <Container
        className={
          props.className ?? 'overflow-y-hidden w-full h-[calc(100vh-4rem)]'
        }
        background={props.background}
        Sidebar={props.Sidebar}
        Navbar={
          <Navbar
            Item={NavbarItem}
            navigation={[
              { name: 'Home', href: '/admin' },
              { name: 'Dashboard', href: '/admin/dashboard' },
              { name: 'Projects', href: '/admin/projects' },
              { name: 'Logout', href: '/admin/logout' },
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
