import dynamic from 'next/dynamic';
import { forwardRef, useRef, useState } from 'react';
import { RenderHtmlProps } from './RenderHtml';

export const AceEditor = dynamic(() => import('./AceEditor'), {
  ssr: false,
});

export const RenderHtml = dynamic(() => import('./RenderHtml'), {
  ssr: false,
});
