/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        script: ['"Great Vibes"', 'cursive'],
        'Dancing_Script': ['"Dancing Script"', 'cursive'],
        dancing: ['"Dancing Script"', 'cursive'],
        playfair: ['"Playfair Display"', 'serif'],
      },
      keyframes: {
        'slide-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-20%)' },
        },
      },
      animation: {
        'slide-left': 'slide-left 10s linear infinite',
      },
    },
  },
  plugins: [],
};

