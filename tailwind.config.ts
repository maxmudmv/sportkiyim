import type { Config } from "tailwindcss";

/**
 * "Technical Kinetic" design system — exact tokens from the ApexVelocity
 * Stitch design system (dark base #131313, electric neon green #c3f400,
 * high-vis orange #ff5708, Space Grotesk + Inter).
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#131313",
        "on-background": "#e5e2e1",
        surface: "#131313",
        "surface-dim": "#131313",
        "surface-bright": "#393939",
        "surface-container-lowest": "#0e0e0e",
        "surface-container-low": "#1c1b1b",
        "surface-container": "#201f1f",
        "surface-container-high": "#2a2a2a",
        "surface-container-highest": "#353534",
        "surface-variant": "#353534",
        "on-surface": "#e5e2e1",
        "on-surface-variant": "#c4c9ac",
        outline: "#8e9379",
        "outline-variant": "#444933",
        primary: "#ffffff",
        "on-primary": "#283500",
        "primary-container": "#c3f400",
        "on-primary-container": "#556d00",
        "primary-fixed": "#c3f400",
        "primary-fixed-dim": "#abd600",
        "on-primary-fixed": "#161e00",
        secondary: "#ffb59c",
        "on-secondary": "#5c1900",
        "secondary-container": "#ff5708",
        "on-secondary-container": "#511500",
        error: "#ffb4ab",
        "error-container": "#93000a",
        "on-error-container": "#ffdad6",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["64px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-mobile": ["40px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg": ["32px", { lineHeight: "1.2", fontWeight: "600" }],
        "headline-md": ["24px", { lineHeight: "1.2", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "label-md": ["14px", { lineHeight: "1.2", letterSpacing: "0.05em", fontWeight: "600" }],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        sm: "0.125rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
      },
      maxWidth: {
        container: "1280px",
      },
      boxShadow: {
        neon: "0 0 15px rgba(195, 244, 0, 0.2)",
        "neon-strong": "0 0 25px rgba(195, 244, 0, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
