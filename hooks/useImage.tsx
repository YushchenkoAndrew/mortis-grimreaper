import { useEffect } from 'react';

export function useImage(src: string) {
  useEffect(() => {
    if (!src || /^data:image/.test(src)) return;
    if (window['images']?.[src]) return;

    const img = new Image();

    window['images'] ||= {};
    window['images'][(img.src = src)] = img;
  }, [src]);

  return src;
}
