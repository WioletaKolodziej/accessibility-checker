import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./styles/theme";
import { GlobalStyle } from "./styles/globalStyles";
import { Checker } from "./components/Checker";
import { ThemeToggle } from "./components/ThemeToggle";

const Root = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <ThemeToggle toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      <Checker />
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
