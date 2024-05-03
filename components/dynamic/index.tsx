import dynamic from 'next/dynamic';

export const AceEditor = dynamic(() => import('./AceEditor'), {
  ssr: false,
});

export const RenderHtml = dynamic(() => import('./RenderHtml'), {
  ssr: false,
});

export const P5js = dynamic(() => import('../Container/Project/P5js'), {
  ssr: false,
});
