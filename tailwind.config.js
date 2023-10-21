
module.exports = {
  prefix: '',
  enabled: process.env.NODE_ENV === 'production',
  content: [
    './src/**/*.{html,ts,css,scss,sass,less,styl}'
  ],
  media: false, // 'darkMode' or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'primary': "#B333FF",
        'secondary': {
          DEFAULT: '#b0d0d3',
          100: '#9ebbbd',
          200: '#8ca6a8',
          300: '#7b9193',
          400: '#697c7e',
          500: '#586869',
          600: '#465354',
          700: '#343e3f',
          800: '#23292a',
          900: '#111415',
        },
        // 'secondary': '#b0d0d3',
        'focused-primary': "#1b47a6",
        'bg': "#E1E1E1",
        'pr-font': "#262433",
        'secondary-font': "#71707A",
        'default-ring': "#3B82F680"
      },
      screens: {
        'xs': { 'min': '0px', 'max': '767px' },
        'sm': { 'min': '768px', 'max': '1023px' },
        'md': { 'min': '1024px', 'max': '1279px' },
        'lg': { 'min': '1280px', 'max': '1535px' },
        'xlg': { 'min': '1536px' },
      },
      fontFamily: {
        poppins: ['Poppins'],
        ubuntu: ['Ubuntu']
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
