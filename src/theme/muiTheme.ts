import { createTheme } from "@mui/material/styles";

export const muiTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1E88E5",
      light: "#6AB7FF",
      dark: "#005CB2"
    },
    secondary: {
      main: "#FFB300",
      light: "#FFE082",
      dark: "#C68400"
    },
    background: {
      default: "#0F172A",
      paper: "#111827"
    },
    text: {
      primary: "#F9FAFB",
      secondary: "#9CA3AF"
    },
    error: {
      main: "#EF5350"
    },
    success: {
      main: "#4CAF50"
    },
    warning: {
      main: "#FFB300"
    }
  },
  shape: {
    borderRadius: 12
  },
  typography: {
    fontFamily: [
      "Inter",
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "sans-serif"
    ].join(","),
    fontSize: 14,
    h1: {
      fontSize: "24px",
      fontWeight: 600
    },
    h2: {
      fontSize: "20px",
      fontWeight: 600
    },
    h3: {
      fontSize: "18px",
      fontWeight: 600
    },
    body1: {
      fontSize: "14px"
    },
    body2: {
      fontSize: "12px"
    }
  }
});
