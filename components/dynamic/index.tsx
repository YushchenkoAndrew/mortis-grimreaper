import dynamic from 'next/dynamic';
import { forwardRef } from 'react';
import { RenderHtmlProps } from './RenderHtml';

export const AceEditor = dynamic(() => import('./AceEditor'), {
  ssr: false,
});

const RenderHtml = dynamic(() => import('./RenderHtml'), {
  ssr: false,
});

export const RenderHtmlRef = forwardRef((props: RenderHtmlProps, ref) => (
  <RenderHtml {...props} iframe_ref={ref as any} />
));
