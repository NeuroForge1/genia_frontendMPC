/** @type {import("tailwindcss").Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Branding Colors based on pasted_content.txt
        "genia-mint": "#00ffa3",
        "genia-blue": "#017aff",
        "genia-black": "#000000",
        "genia-white": "#ffffff",
        // Grays from branding
        "genia-gray-light": "#f9fafb", // Lightest background
        "genia-gray-medium": "#d1d5db", // Medium text/borders
        "genia-gray-dark": "#4b5563", // Darker text/elements
        "genia-sidebar": "#1f2937", // Specific dark gray for sidebar
        
        // Keep primary/secondary/accent for potential component library use, but map to branding
        primary: "#00ffa3", // Map primary to mint green
        secondary: "#017aff", // Map secondary to electric blue
        accent: "#fb923c", // Keep orange as accent for now, can be adjusted
        
        // Existing palette (can be pruned later if not used)
        gray: defaultTheme.colors.gray,
      },
      fontFamily: {
        // Branding Fonts
        sans: ["Inter", ...defaultTheme.fontFamily.sans], // Main font: Inter
        alt: ["DM Sans", ...defaultTheme.fontFamily.sans], // Secondary font: DM Sans
      },
      borderRadius: {
        // Branding Border Radius
        "2xl": "1rem", // For cards
        "xl": "0.75rem", // For inputs
        "lg": "0.5rem", // Default large
        "md": "0.375rem", // Default medium
        "full": "9999px",
      },
      boxShadow: {
        // Branding Shadows (neumorphic style)
        "md": "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
        "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)",
        "xl": "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
        "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.1)", // Adjusted for more presence
        "inner": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)",
        "none": "none",
        // Glow effect (can be kept or removed)
        "glow": "0 0 15px rgba(0, 255, 163, 0.5)", // Adjusted glow to mint green
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        // Keep pulse-slow or add others as needed
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
  ],
};

