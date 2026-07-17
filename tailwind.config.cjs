/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6F0FF',
          500: '#0052CC',
          600: '#0747A6'
        },
        secondary: {
          500: '#36B37E'
        },
        danger: {
          500: '#DE350B'
        },
        warning: {
          500: '#FFAB00'
        },
        info: {
          500: '#00B8D9'
        },
        gray: {
          50: '#F7F8FA',
          100: '#EBECF0',
          500: '#6B778C',
          900: '#172B4D'
        }
      },
      boxShadow: {
        card: '0 1px 3px rgba(15, 23, 42, 0.12)',
        'card-hover': '0 4px 12px rgba(15, 23, 42, 0.16)'
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px'
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif']
      }
    }
  },
  plugins: []
};
