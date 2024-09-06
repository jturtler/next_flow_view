import type { Config } from "tailwindcss";

const config: Config = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', "./app/**/*.{js,ts,jsx,tsx,mdx}",],
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "royal-blue": "#0053af",
        "sky-blue": "#0fa0d5",
        "light-sky-blue": "#9ad7ea ",
        "pale-blue": "#daf1f7",
        "bright-blue": "#3db2de",
        "powder-blue": "#bed3ec ",
        "very-light-blue": "#dceaf4",
        "sunray": "#ebbe79",
        "torch-red": "#fc3441",
        "blue-navy": "#1d3a82",
        "gold": "#FFD700",
        "sea-green": "#00A36C"
      },
      rotate: {
        '-15': '-5deg',
        '15': '15deg',
      },
      backgroundImage: {
        'wave': "url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 1440 320%27%3E%3Cpath fill=%27%230053af%27 fill-opacity=%271%27 d=%27M0,128L48,144C96,160,192,192,288,208C384,224,480,224,576,213.3C672,203,768,181,864,160C960,139,1056,117,1152,128C1248,139,1344,181,1392,202.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z%27%3E%3C/path%3E%3C/svg%3E')",
      },
    },
  },
  plugins: [],
};
export default config;
