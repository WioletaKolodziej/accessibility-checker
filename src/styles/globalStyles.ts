import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html,
  body,
  #root {
    min-height: 100%;
  }

  body {
    font-family: "Avenir Next", "Segoe UI", "Trebuchet MS", sans-serif;
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    line-height: 1.5;
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  a {
    color: inherit;
  }

  button,
  input,
  textarea {
    font: inherit;
  }

  button {
    cursor: pointer;
  }

  :focus-visible {
    outline: 3px solid ${({ theme }) => theme.accent};
    outline-offset: 2px;
  }

  ::selection {
    background: ${({ theme }) => theme.accent};
    color: ${({ theme }) => theme.background};
  }

  .accessibility-error {
    background-color: ${({ theme }) => theme.accentSoft};
    border-bottom: 2px dashed ${({ theme }) => theme.danger};
    border-radius: 2px;
  }

  .cm-editor {
    height: 100%;
    width: 100%;
    max-width: 100%;
    border-radius: 14px;
    background: ${({ theme }) => theme.surface};
  }

  .cm-scroller {
    overflow: auto !important;
    max-width: 100%;
  }

  .cm-focused {
    outline: none;
  }

  .cm-line.highlighted-temp {
    background: ${({ theme }) => theme.accentSoft};
    box-shadow: inset 5px 0 0 ${({ theme }) => theme.danger}, inset 0 0 0 1px ${({ theme }) => theme.danger};
    border-radius: 4px;
    animation: issue-line-flash 1.2s ease-in-out 2;
  }

  @keyframes issue-line-flash {
    0% {
      filter: brightness(1);
    }
    50% {
      filter: brightness(1.18);
    }
    100% {
      filter: brightness(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation: none !important;
      transition: none !important;
      scroll-behavior: auto !important;
    }
  }
`;
