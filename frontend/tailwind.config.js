import { heroui } from "@heroui/react";
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],

  darkMode: "class",

  //login form animation border
  theme: {
    extend: {
      animation: {
        rotate: "rotate 10s linear infinite",
      },
      keyframes: {
        rotate: {
          "0%": { transform: "rotate(0deg) scale(10)" },
          "100%": { transform: "rotate(-360deg) scale(10)" },
        },
      },
      transform: {
        scaleDown: "scale(0.8)", // Adjust the scale factor as needed
      },
    },
  },

  plugins: [
    heroui({
      prefix: "nextui", // prefix for themes variables
      addCommonColors: false, // override common colors (e.g. "blue", "green", "pink").
      defaultTheme: "light", // default theme from the themes object
      defaultExtendTheme: "light",
      layout: {
        disabledOpacity: "0.3", // opacity-[0.3]
        radius: {
          small: "6px", // rounded-small
          medium: "8px", // rounded-medium
          large: "12px", // rounded-large
        },
        borderWidth: {
          small: "1px", // border-small
          medium: "1px", // border-medium
          large: "2px", // border-large
        },
      },
      themes: {
        light: {
          colors: {
            background: "#ffffff", // or DEFAULT
            primary: {
              foreground: "#FFFFFF",
            },
          },
          layout: {},
        },
        dark: {
          colors: {
            background: "#18181b",
          },
          layout: {},
        },
      },
    }),
  ],

  variants: {
    scrollbar: ["dark"], // Enable dark mode for the scrollbar
  },
};
