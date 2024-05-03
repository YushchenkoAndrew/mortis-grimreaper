import Head from 'next/head';
import React, { memo } from 'react';
import { Config } from '../../config';
import { PUBLIC_FONT_4BITFONT } from '../../constants';
import { StringService } from '../../lib/common';

export interface HeaderProps {
  title: string;
  fonts?: string[];
  children?: React.ReactNode;
}

export default memo(function Header(props: HeaderProps) {
  const fonts = props.fonts ?? [PUBLIC_FONT_4BITFONT];

  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <link rel="icon" href={StringService.href('favicon.ico')} />
      <meta charSet="utf-8" />

      <meta name="description" content="Site with projects examples" />
      <meta name="author" content="Andrew Y" />
      <title>{props.title}</title>
      {fonts?.map((href, index) => (
        <link
          key={index}
          rel="preload"
          href={StringService.href('fonts', href)}
          as="font"
          crossOrigin=""
        />
      ))}
      {props.children}
    </Head>
  );
});
