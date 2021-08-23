import type { AppProps } from "next/app";
import Head from "next/head";

import "../styles/globals.css";
import "../styles/bootstrap.min.css";
import { useEffect } from "react";

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    localStorage.getItem("id")
      ? fetch(
          `/projects/api/view/page?id=${localStorage.getItem("id")}&url=${
            window.location.pathname
          }`,
          {
            method: "PATCH",
          }
        )
          .then((res) => null)
          .catch((err) => null)
      : null;
  }, []);
  return (
    <>
      <Head>
        <link
          rel="preload"
          href="/projects/fonts/4bitfont.ttf"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/projects/fonts/3Dventure.ttf"
          as="font"
          crossOrigin=""
        />
        <script defer src="/projects/js/lib/md5.js"></script>
        {/* <script defer src="/projects/js/ip.js"></script> */}
        <script defer src="/projects/js/lib/ip.min.js"></script>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
