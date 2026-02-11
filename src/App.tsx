import { useState } from "react";
import styled from "styled-components";
import { ThemeProvider } from "styled-components";

import { GlobalStyle } from "./styles/globalStyles";
import { darkTheme, lightTheme } from "./styles/theme";
import { ThemeToggle } from "./components/ThemeToggle";
import { LanguageToggle } from "./components/LanguageToggle";
import { Checker } from "./components/Checker";
import { Language, messages } from "./i18n";

const AppShell = styled.div`
  min-height: 100dvh;
  position: relative;
`;

const Header = styled.header`
  max-width: 1240px;
  margin: 0 auto;
  padding: 1rem 1rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const Brand = styled.p`
  font-weight: 900;
  letter-spacing: 0.03em;
  text-transform: uppercase;
`;

const HeaderControls = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
`;

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<Language>("pl");
  const t = messages[language];

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <AppShell>
        <Header>
          <Brand>A11y Studio</Brand>
          <HeaderControls>
            <LanguageToggle
              language={language}
              setLanguage={setLanguage}
              labels={{
                switcherLabel: t.app.languageSwitcherLabel,
                polish: t.app.languagePolish,
                english: t.app.languageEnglish,
              }}
            />
            <ThemeToggle
              toggleTheme={() => setIsDarkMode((prev) => !prev)}
              isDarkMode={isDarkMode}
              labels={{
                switcherLabel: t.app.themeSwitcherLabel,
                light: t.app.themeLight,
                dark: t.app.themeDark,
                switchToLight: t.app.switchToLight,
                switchToDark: t.app.switchToDark,
              }}
            />
          </HeaderControls>
        </Header>
        <Checker messages={t} />
      </AppShell>
    </ThemeProvider>
  );
}

export default App;
