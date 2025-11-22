/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./app/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandPrimary: "#0fa3b1",
        brandPrimaryDark: "#0c7c86",
        brandAccent: "#f5b312",
        brandSoft: "#f1f9f9",
        brandMuted: "#e6f3f4",
      },
      fontFamily: {
        tajawal: ['"Tajawal"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
