import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { useRef } from 'react';
import { AppStore, store } from '../lib/common/store';
import { ToastContainer } from 'react-toastify';
import { config } from '@fortawesome/fontawesome-svg-core';
import { SessionProvider } from 'next-auth/react';

import 'react-toastify/dist/ReactToastify.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import '../styles/globals.scss';
import { Config } from '../config';

config.autoAddCss = false;

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const storeRef = useRef<AppStore>();
  storeRef.current ??= store();

  // useEffect(() => {
  //   localStorage.getItem('id')
  //     ? fetch(`${basePath}/api/view/page?id=${localStorage.getItem('id')}`, {
  //         method: 'PATCH',
  //       }).catch(() => null)
  //     : null;
  // }, []);
  return (
    <>
      <SessionProvider
        basePath={`${Config.self.base.api}/admin/auth`}
        session={session}
      >
        <Provider store={storeRef.current}>
          <ToastContainer stacked theme="colored" />
          <Component {...pageProps} />
        </Provider>
      </SessionProvider>
    </>
  );
}
