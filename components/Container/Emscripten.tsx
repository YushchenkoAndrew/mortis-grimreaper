import { useEffect } from 'react';
import { AttachmentEntity } from '../../lib/attachment/entities/attachment.entity';
import hljs from 'highlight.js/lib/core';
import cpp from 'highlight.js/lib/languages/cpp';

import 'highlight.js/styles/github.css';

hljs.registerLanguage('cpp', cpp);

export interface EmscriptenProps {
  scripts: AttachmentEntity[];
}

export default function Emscripten(props: EmscriptenProps) {
  useEffect(() => {
    var Module: any = {
      preRun: [],
      postRun: [],
      canvas: (function () {
        const canvas = document.getElementById('emscripten-canvas');

        // As a default initial behavior, pop up an alert when webgl context is lost. To make your
        // application robust, you may want to override this behavior before shipping!
        // See http://www.khronos.org/registry/webgl/specs/latest/1.0/#5.15.2
        canvas.addEventListener(
          'webglcontextlost',
          (e) => {
            alert('WebGL context lost. You will need to reload the page.');
            e.preventDefault();
          },
          false,
        );

        return canvas;
      })(),
    };

    Module.canvas.addEventListener('resize', (e: any) => {
      let viewWidth = e.detail.width;
      let viewHeight = e.detail.width / Module._olc_WindowAspectRatio;

      if (viewHeight > e.detail.height) {
        viewHeight = e.detail.height - 75;
        viewWidth = e.detail.height * Module._olc_WindowAspectRatio;
      }

      // update dom attributes
      Module.canvas.setAttribute('width', viewWidth);
      Module.canvas.setAttribute('height', viewHeight);

      const top = (e.detail.height - viewHeight) / 2;
      const left = (e.detail.width - viewWidth) / 2;

      // update styles
      Module.canvas.style.position = 'fixed';
      Module.canvas.style.top = `${top + 30}px`;
      Module.canvas.style.left = `${left}px`;
      Module.canvas.style.width = '';
      Module.canvas.style.height = '';

      // trigger PGE update
      Module._olc_PGE_UpdateWindowSize(viewWidth, viewHeight);

      // ensure canvas has focus
      Module.canvas.focus();
      e.preventDefault();
    });
  }, []);

  return (
    <>
      {/* <sc */}
      {props.scripts.map((src) => (
        <script key={src.id} src={src._url()} />
      ))}

      <div className="flex h-full w-full overflow-hidden">
        {/* <div
          className="flex-1"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `<div id="p5js-container"></div>`,
          }}
        /> */}
        <canvas
          id="emscripten-canvas"
          onContextMenu={(e) => e.preventDefault()}
          tabIndex={-1}
        ></canvas>
      </div>
    </>
    // <script src={`${Config.self.base.web}/js/lib/p5.min.js`} />
  );
}
