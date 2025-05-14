/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,ts,jsx,tsx}',
    './components/**/*.{html,js,ts,jsx,tsx}',
    './pages/**/*.{html,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))', // Define the border color variable
        background: 'hsl(var(--background))', // Define the background color variable
        foreground: 'hsl(var(--foreground))', // Define the foreground color variable
      },
    },
  },
  plugins: [],
};

