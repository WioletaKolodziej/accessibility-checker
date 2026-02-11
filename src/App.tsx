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
  display: flex;
  flex-direction: column;
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

const Footer = styled.footer`
  margin-top: auto;
  max-width: 1240px;
  width: 100%;
  margin-inline: auto;
  padding: 0.45rem 1rem 0.7rem;
  color: ${({ theme }) => theme.textMuted};
  font-size: 0.76rem;
  text-align: right;
  opacity: 0.9;
`;

const FooterLink = styled.a`
  color: ${({ theme }) => theme.accent};
  font-weight: 600;
  text-decoration: underline;
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
          <Brand>A11y Checker</Brand>
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
        <Footer>
          <span>{t.app.footerPrefix} </span>
          <FooterLink href="https://www.ui-kolo.com" target="_blank" rel="noreferrer noopener" aria-label={t.app.footerLinkAria}>
            UI-kolo
          </FooterLink>
          <span>. {t.app.footerRights}</span>
        </Footer>
      </AppShell>
    </ThemeProvider>
  );
}

export default App;
