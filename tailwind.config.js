/** @type {import('tailwindcss').Config} */
module.exports = {
  'postcss-import': {},
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Note the addition of the `app` directory.
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
    // require('tailwindcss/plugin')(({ addVariant }) => {
    //   addVariant('only-dark', ['.dark&', ':is(.only-dark &)']);
    // }),
  ],
};
