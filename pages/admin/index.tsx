import React from 'react';
import DefaultHeader from '../../components/admin/default/DefaultHeader';
import Header from '../../components/Header/Header';
import DefaultHead from '../../components/Header/Header';
// import defaultServerSideHandler from '../../lib/api/session';

export default function Index() {
  return (
    <>
      <Header title="Admin"></Header>

      <DefaultHeader />
    </>
  );
}

// export const getServerSideProps = defaultServerSideHandler;
