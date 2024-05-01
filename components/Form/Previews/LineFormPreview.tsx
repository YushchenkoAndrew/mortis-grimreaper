import { memo, useEffect, useState } from 'react';

export interface LineFormPreviewProps {
  className?: string;
  text: string;
  size?: number;
  onHover?: (flag: boolean) => void;
}

export default memo(function LineFormPreview(props: LineFormPreviewProps) {
  const [stop, onCycleStop] = useState(0);
  const [offset, setOffset] = useState(0);

  const text = props.text.replace(/ /g, '_') + '_';

  useEffect(() => {
    if ((props.size ?? 5) >= props.text.length) return;
    const interval = setInterval(() => {
      if (stop > 0) return onCycleStop(stop - 1);
      onCycleStop((offset + 1) % text.length ? 0 : 3);
      setOffset((offset + 1) % text.length);
    }, 250);
    return () => clearInterval(interval);
  });

  function pieSlice(str: string, offset: number, size: number) {
    if (offset + size < str.length) return str.substr(offset, size);
    return str.substr(offset) + str.substr(0, offset + size - str.length);
  }

  return (
    // <span className="text-white text-3Dventure text-3xl">
    <span className={props.className}>
      {(props.size ?? 5) >= props.text.length
        ? props.text
        : pieSlice(text, offset, props.size ?? 5)}
    </span>
  );
});
