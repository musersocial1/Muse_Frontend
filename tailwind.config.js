/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#121212",
        secondary: "#0368FF",
        grayish: {
          100: "#1C1C1C",
          200: "#363636",
          300: "#F3F3F3",
        },
        light: {
          blue: "#F3F7FF",
          green: "#F3FFF6",
          red: "#FFF3F3",
        },
        border: {
          gray: "#585858",
          blue: "#0368FF",
          green: "#18FF037D",
          red: "#FF03037D",
        },
        disabled: "#F2F2F2",
      },
      fontFamily: {
        sans: ["NeutralSans-Regular"],

        "neutral-regular": ["NeutralSans-Regular"],
        "neutral-bold": ["NeutralSans-Bold"],
        "neutral-black": ["NeutralSans-Black"],
        "neutral-medium": ["NeutralSans-Medium"],

        "sfpro-regular": ["SFProDisplay-Regular"],
        "sfpro-bold": ["SFProDisplay-Bold"],
        "sfpro-medium": ["SFProDisplay-Medium"],
        "sfpro-light-italic": ["SFProDisplay-LightItalic"],
        "sfpro-semibold-italic": ["SFProDisplay-SemiboldItalic"],
        "sfpro-ultralight-italic": ["SFProDisplay-UltralightItalic"],
        "sfpro-black-italic": ["SFProDisplay-BlackItalic"],
        "sfpro-heavy-italic": ["SFProDisplay-HeavyItalic"],
        "sfpro-thin-italic": ["SFProDisplay-ThinItalic"],
      },
    },
  },
  plugins: [],
};
