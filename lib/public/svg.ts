export function shuffleColors() {
  // FIXME: !!
  // let colorArray =
  //   COLOR_PALETTES[Math.floor(Math.random() * (COLOR_PALETTES.length - 1))];
  // for (let i = colorArray.length - 1; i > 0; i--) {
  //   let j = Math.floor(Math.random() * (i + 1));
  //   let temp = colorArray[i];
  //   colorArray[i] = colorArray[j];
  //   colorArray[j] = temp;
  // }
  // return colorArray;
}

function HEX2HSL(H: string) {
  // Convert hex to RGB first
  let rgb = { r: 0, g: 0, b: 0 };
  if (H.length == 4) {
    rgb = {
      r: Number(`0x${H[1]}${H[1]}`),
      g: Number(`0x${H[2]}${H[2]}`),
      b: Number(`0x${H[3]}${H[3]}`),
    };
  } else if (H.length == 7) {
    rgb = {
      r: Number(`0x${H[1]}${H[2]}`),
      g: Number(`0x${H[3]}${H[4]}`),
      b: Number(`0x${H[5]}${H[6]}`),
    };
  }
  // Then to HSL
  rgb = { r: rgb.r / 255, g: rgb.g / 255, b: rgb.b / 255 };
  let hsl = { h: 0, s: 0, l: 0 };

  const cmin = Math.min(...Object.values(rgb));
  const cmax = Math.max(...Object.values(rgb));
  const delta = cmax - cmin;

  if (delta == 0) hsl.h = 0;
  else if (cmax == rgb.r) hsl.h = ((rgb.g - rgb.b) / delta) % 6;
  else if (cmax == rgb.g) hsl.h = (rgb.b - rgb.r) / delta + 2;
  else hsl.h = (rgb.r - rgb.g) / delta + 4;

  hsl.h = Math.round(hsl.h * 60);

  if (hsl.h < 0) hsl.h += 360;

  hsl.l = (cmax + cmin) / 2;
  hsl.s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * hsl.l - 1));
  hsl.s = +(hsl.s * 100).toFixed(1);
  hsl.l = +(hsl.l * 100).toFixed(1);

  return `hsla(${hsl.h},${hsl.s}%,${hsl.l}%,1)`;
}

const COLORS = [
  "hsla(0,0%,100%,1)",
  "hsla(258.5,59.4%,59.4%,1)",
  "hsla(339.6,82.2%,51.6%,1)",
  "hsla(198.7,97.6%,48.4%,1)",
  "hsla(47,80.9%,61%,1)",
];

export function svgBuild(
  width: number,
  height: number,
  path: string,
  mode: string
) {
  const handler = (function (mode: string) {
    switch (mode) {
      case "fill":
        return (color: string) => `stroke='none' fill='${color}'`;
    }

    return (color: string) => `stroke-width='1' stroke='${color}' fill='none'`;
  })(mode);

  return (
    `<svg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='${width}' height='${height}'><rect x='0' y='0' width='100%' height='100%' fill='${COLORS[0]}'/>` +
    path
      .split("~")
      .map((item, i) => item.replace("/>", ` ${handler(COLORS[i + 1])}/>`))
      .join("") +
    `</pattern></defs><rect width='100%' height='100%' fill='url(%23a)'/></svg>`
  );
}
