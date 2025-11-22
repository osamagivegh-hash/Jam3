/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./app/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandBlue: "#1E3A8A",   // الأزرق الرئيسي
        brandLight: "#DBEAFE",  // الأزرق الفاتح
        brandGray: "#F3F4F6"    // الرمادي الفاتح للخلفيات
      },
      fontFamily: {
        tajawal: ['"Tajawal"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
