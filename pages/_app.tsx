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
      {/* <Head>
        <link
          rel="preload"
          href={`${Config.self.base}/fonts/4bitfont.ttf`}
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href={`${Config.self.base}/fonts/3Dventure.ttf`}
          as="font"
          crossOrigin=""
        />
      </Head> */}
      {/* <Script defer src={`${Config.self.base}/js/lib/md5.js`}></Script> */}
      {/* <Script
        defer
        src={`${Config.self.base}/js/ip.js`}
        id="ip-min-js"
        data-path={Config.self.base}
      ></Script> */}
      <SessionProvider
        basePath={`${Config.self.base.api}/admin/auth`}
        session={session}
      >
        <Provider store={storeRef.current}>
          <ToastContainer />
          <Component {...pageProps} />
        </Provider>
      </SessionProvider>
    </>
  );
}
