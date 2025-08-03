import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// color design tokens export
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        grey: {
          100: "#e0e0e0",
          200: "#c2c2c2",
          300: "#a3a3a3",
          400: "#858585",
          500: "#666666",
          600: "#525252",
          700: "#3d3d3d",
          800: "#292929",
          900: "#141414",
        },
        primary: {
          100: "#d0d1d5",
          200: "#a1a4ab",
          300: "#727681",
          400: "#1F2A40",
          500: "#141b2d",
          600: "#101624",
          700: "#0c101b",
          800: "#080b12",
          900: "#040509",
        },
        greenAccent: {
          100: "#dbf5ee",
          200: "#b7ebde",
          300: "#94e2cd",
          400: "#70d8bd",
          500: "#4cceac",
          600: "#3da58a",
          700: "#2e7c67",
          800: "#1e5245",
          900: "#0f2922",
        },
        redAccent: {
          100: "#f8dcdb",
          200: "#f1b9b7",
          300: "#e99592",
          400: "#e2726e",
          500: "#db4f4a",
          600: "#af3f3b",
          700: "#832f2c",
          800: "#58201e",
          900: "#2c100f",
        },
        blueAccent: {
          100: "#e1e2fe",
          200: "#c3c6fd",
          300: "#a4a9fc",
          400: "#868dfb",
          500: "#6870fa",
          600: "#535ac8",
          700: "#3e4396",
          800: "#2a2d64",
          900: "#151632",
        },
      }
    : {
        // Light Mode Tokens - Muted yellow/gold theme, less bright
        grey: {
          100: "#3d320f", // Deep brown for primary text (high contrast on yellow)
          200: "#998a3d",
          300: "#7a6a2f", // Medium brown for secondary text
          400: "#d9c97a",
          500: "#e6d88c", // Muted yellow for backgrounds
          600: "#ede3a8",
          700: "#f5edc6",
          800: "#f9f6e2",
          900: "#fdfbf5", // Off-white for highlights
        },
        primary: {
          100: "#fdfbf5", // Off-white background
          200: "#f9f6e2",
          300: "#f5edc6",
          400: "#e6d88c", // Muted yellow for UI elements
          500: "#bfae5a",
          600: "#998a3d",
          700: "#7a6a2f",
          800: "#5c4d21",
          900: "#3d320f",
        },
        greenAccent: {
          100: "#e3fcec",
          200: "#b7f5d8",
          300: "#7de2b8",
          400: "#43c59e",
          500: "#34a97b",
          600: "#278a63",
          700: "#1b6b4b",
          800: "#0f4c33",
          900: "#062d1b",
        },
        redAccent: {
          100: "#fff0e0",
          200: "#ffd1b3",
          300: "#ffb380",
          400: "#ff944d",
          500: "#ff751a",
          600: "#cc5e15",
          700: "#994610",
          800: "#662f0a",
          900: "#331705",
        },
        blueAccent: {
          100: "#f0f4ff",
          200: "#d1e0ff",
          300: "#a3c2ff",
          400: "#75a3ff",
          500: "#4785ff",
          600: "#386acc",
          700: "#295099",
          800: "#1a3566",
          900: "#0d1b33",
        },
      }),
});

// mui theme settings
export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              main: colors.primary[500],
            },
            secondary: {
              main: colors.greenAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: colors.primary[500],
            },
          }
        : {
            // palette values for light mode
            primary: {
              main: colors.primary[400], // Muted yellow for UI elements
            },
            secondary: {
              main: colors.greenAccent[400],
            },
            neutral: {
              dark: colors.grey[100], // Muted dark gold for text
              main: colors.grey[400], // Muted yellow for borders/dividers
              light: colors.grey[700], // Light beige for backgrounds
            },
            background: {
              default: '#f7f3e9', // Very light beige background
              paper: colors.grey[700], // Light beige for cards/surfaces
              sidebar: colors.primary[200], // Slightly darker beige for sidebar
            },
            text: {
              primary: colors.grey[100], // Deep brown for high contrast
              secondary: colors.grey[300], // Medium brown for secondary text
            },
            divider: colors.grey[400], // Muted yellow for dividers
          }),
    },
    typography: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};

// context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState("dark");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};