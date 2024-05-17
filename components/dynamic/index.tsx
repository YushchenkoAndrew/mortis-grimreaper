import dynamic from 'next/dynamic';

export const AceEditor = dynamic(() => import('./AceEditor'), { ssr: false }); // prettier-ignore
export const RenderHtml = dynamic(() => import('./RenderHtml'), { ssr: false }); // prettier-ignore

export const ToastContainer = dynamic(() =>
  import('react-toastify').then((e) => e.ToastContainer),
);
