import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface LineFormPreviewProps {
  className?: string;
  text: string;
  scale?: number;
  ms?: number;

  stop?: boolean;
  setOptions?: Partial<{
    fontSize: string;
    textColor: string;
    fontFamily: string;
  }>;
}

export default memo(function LineFormPreview(props: LineFormPreviewProps) {
  const [length, setLength] = useState(0);
  const [text, setText] = useState(props.text);

  const offsetRef = useRef(0);

  const spanRef = useCallback((node: HTMLSpanElement) => {
    if (!node) return;
    const fontSize = window
      .getComputedStyle(node, null)
      .getPropertyValue('font-size');

    const length = Math.floor(node.clientWidth / (parseInt(fontSize) || 1)); // prettier-ignore
    setLength(Math.floor(length * (props.scale || 1)));
  }, []);

  // const length = useMemo(() => {
  //   if (!spanRef.current) return 0;
  //   const fontSize = window
  //     .getComputedStyle(spanRef.current, null)
  //     .getPropertyValue('font-size');

  //   // const length = Math.floor(spanRef.current.clientWidth / (parseInt(fontSize) || 1));
  //   // setText(props.text.slice(0, length));

  //   // console.log({ text: props.text.slice(0, length), length });

  //   console.log({ with: spanRef.current.clientWidth });

  //   return 0;
  // }, [spanRef.current?.clientWidth]);

  // console.log(spanRef.current?.clientWidth);
  // // const text = props.text.replace(/ /g, '_') + '_';

  useEffect(() => {
    if (props.stop || !length) return;
    // if ((props.size ?? 5) >= props.text.length) return;
    const interval = setInterval(() => {
      offsetRef.current = (offsetRef.current + 1) % props.text.length;

      const chars: string[] = [];
      for (let i = 0; i < length; i++) {
        chars.push(props.text.charAt((i + offsetRef.current) % props.text.length)); // prettier-ignore
      }

      setText(chars.join(''));
    }, props.ms ?? 250);
    return () => clearInterval(interval);
  }, [length, props.stop]);

  // function pieSlice(str: string, offset: number, size: number) {
  //   if (offset + size < str.length) return str.substr(offset, size);
  //   return str.substr(offset) + str.substr(0, offset + size - str.length);
  // }

  return (
    <span
      ref={spanRef}
      className={`${props.setOptions?.textColor ?? 'text-white'} ${
        props.setOptions?.fontFamily ?? 'text-3Dventure'
      } ${props.setOptions?.fontSize ?? 'text-3xl'} ${props.className ?? ''}`}
    >
      {text}
    </span>
  );
});
