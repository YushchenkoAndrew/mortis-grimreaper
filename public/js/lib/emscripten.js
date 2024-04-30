const canvas = function () {
  const canvas = document.getElementById('canvas');

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

  canvas.addEventListener('resize', (e) => {
    let viewWidth = e.detail.width;
    let viewHeight = e.detail.width / Module._olc_WindowAspectRatio;

    if (viewHeight > e.detail.height) {
      viewHeight = e.detail.height;
      viewWidth = e.detail.height * Module._olc_WindowAspectRatio;
    }

    // update dom attributes
    canvas.setAttribute('width', viewWidth);
    canvas.setAttribute('height', viewHeight);

    // update styles
    // canvas.style.position = 'fixed';
    canvas.style.position = 'relative';
    canvas.style.top = '0px';
    canvas.style.left = '0px';
    canvas.style.width = '';
    canvas.style.height = '';

    // trigger PGE update
    _olc_PGE_UpdateWindowSize(viewWidth, viewHeight);

    // ensure canvas has focus
    canvas.focus();
    e.preventDefault();
  });

  return canvas;
};

var Module = {
  preRun: [],
  postRun: [],
  canvas: canvas(),
};
