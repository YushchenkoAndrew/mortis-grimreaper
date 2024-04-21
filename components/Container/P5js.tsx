import { Config } from '../../config';

export interface P5jsProps {
  className?: string;
  scripts: string[];
}

export default function P5js(props: P5jsProps) {
  return (
    <>
      <script src={`${Config.self.base.web}/js/lib/p5.min.js`} />
      {props.scripts.map((src, index) => (
        <script key={index} src={`${Config.self.base.api}${src}`} />
      ))}

      <div
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: `<div id="p5js-container" />`,
        }}
      />
    </>
  );
}
