/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
    "./node_modules/tw-elements-react/dist/js/**/*.js"
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      screens: {
        '3xl': '1600px',
      },
      extend: {
        gridTemplateColumns: {
          7: "repeat(7, minmax(0, 1fr))", // Define grid-cols-7
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      colors: {
        lightGreen: "#B0E5D6",
        darkGreen: "#096A56",
        lightGrey: "#F7F7F7",
        iconColor: "#b0b0b0",
        darkIcon: "#353F4E",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        sans: ["Poppins", "sans"],
        smoochSans:["Smooch","sans"]
      },
      // backgroundImage: {
      //   'green-gradient': 'linear-gradient(146.43deg, #B0E5D6 0%, #79AFA0 100%)',
      // },
      stroke: (theme) => ({
        red: theme("colors.red.500"),
        green: theme("colors.green.500"),
        blue: theme("colors.blue.500"),
      }),
    },
    backgroundImage: {
      'kkslogo2': "url('/assets/kks-icon.png')",
    },
  },
  plugins: [require("tailwindcss-animate")],
  // plugins: [require("tw-elements-react/dist/plugin.cjs")],
};
