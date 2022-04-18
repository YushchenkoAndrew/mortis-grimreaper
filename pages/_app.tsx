import Head from "next/head";
import { useEffect } from "react";
import { AppProps } from "next/app";
import { basePath } from "../config";
import Script from "next/script";

import "../styles/globals.scss";

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    localStorage.getItem("id")
      ? fetch(`${basePath}/api/view/page?id=${localStorage.getItem("id")}`, {
          method: "PATCH",
        }).catch(() => null)
      : null;
  }, []);
  return (
    <>
      <Head>
        <link
          rel="preload"
          href={`${basePath}/fonts/4bitfont.ttf`}
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href={`${basePath}/fonts/3Dventure.ttf`}
          as="font"
          crossOrigin=""
        />
      </Head>
      <Script defer src={`${basePath}/js/lib/md5.js`}></Script>
      {/* <script
          defer
          src={`${basePath}/js/lib/ip.min.js`}
          id="ip-min-js"
          data-path={basePath}
        ></script> */}
      <Script
        defer
        src={`${basePath}/js/ip.js`}
        id="ip-min-js"
        data-path={basePath}
      ></Script>
      <Component {...pageProps} />
    </>
  );
}
