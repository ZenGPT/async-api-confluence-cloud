const colors = require('./node_modules/tailwindcss/colors');

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      // added custom colors required for asyncapi react components
      // https://blog.montoulieu.dev/post/how-to-add-colors-from-the-new-color-palette-in-tailwindcss-v2-0
      colors: {
        teal: colors.teal,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
