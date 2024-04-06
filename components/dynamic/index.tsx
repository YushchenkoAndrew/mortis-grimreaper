import dynamic from 'next/dynamic';

export const AceEditor = dynamic(() => import('./AceEditor'), {
  ssr: false,
});

export const RenderHtml = dynamic(() => import('./RenderHtml'), {
  ssr: false,
});
