import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  button {
    font-family: inherit;
  }

  ::selection {
    background: ${({ theme }) => theme.accent};
    color: white;
  }

.accessibility-error {
  background-color: rgba(255, 0, 0, 0.2);
  border-bottom: 1px dotted red;
  cursor: help;
}

.cm-line .highlighted-temp {
  background-color: yellow;
  transition: background-color 0.3s ease;
}

`;
