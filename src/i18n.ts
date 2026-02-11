export type Language = "pl" | "en";

export type I18nMessages = {
  app: {
    languageSwitcherLabel: string;
    languagePolish: string;
    languageEnglish: string;
    themeSwitcherLabel: string;
    themeLight: string;
    themeDark: string;
    switchToLight: string;
    switchToDark: string;
  };
  checker: {
    title: string;
    subtitle: string;
    editorTitle: string;
    editorHint: string;
    editorAriaLabel: string;
    runCheck: string;
    checking: string;
    loadExample: string;
    clear: string;
    resultsTitle: string;
    resultsHint: string;
    emptyInputInfo: string;
    success: string;
    foundIssues: (count: number) => string;
    previewButtonAria: string;
    previewButtonText: string;
  };
  preview: {
    wrapperAriaLabel: string;
    title: string;
    hint: string;
  };
};

export const messages: Record<Language, I18nMessages> = {
  pl: {
    app: {
      languageSwitcherLabel: "Zmien jezyk",
      languagePolish: "Polski",
      languageEnglish: "English",
      themeSwitcherLabel: "Zmien motyw",
      themeLight: "Jasny",
      themeDark: "Ciemny",
      switchToLight: "Przelacz na motyw jasny",
      switchToDark: "Przelacz na motyw ciemny",
    },
    checker: {
      title: "Accessibility Checker",
      subtitle:
        "Wklej fragment HTML, uruchom sprawdzenie WCAG 2A/2AA i przejdz od razu do miejsc, ktore wymagaja poprawy.",
      editorTitle: "Edytor HTML",
      editorHint:
        "Korzystaj z semantycznych znacznikow, jednoznacznych etykiet i odpowiedniego kontrastu. Problematyczne fragmenty zostana oznaczone bezposrednio w kodzie.",
      editorAriaLabel: "Edytor kodu HTML",
      runCheck: "Sprawdz dostepnosc",
      checking: "Sprawdzanie...",
      loadExample: "Wczytaj przyklad",
      clear: "Wyczysc",
      resultsTitle: "Wyniki sprawdzenia",
      resultsHint: "Wybierz problem, aby przewinac edytor do odpowiedniego fragmentu kodu.",
      emptyInputInfo: "Najpierw dodaj kod HTML, a potem uruchom sprawdzenie.",
      success: "Nie wykryto problemow WCAG w tym fragmencie.",
      foundIssues: (count: number) => `Wykryto ${count} problemow. Lista jest uporzadkowana od najpowazniejszych.`,
      previewButtonAria: "Przewin do podgladu HTML",
      previewButtonText: "Podglad HTML",
    },
    preview: {
      wrapperAriaLabel: "Podglad wyrenderowanego HTML",
      title: "Podglad HTML",
      hint: "Podglad pokazuje, jak ten fragment HTML zostanie wyrenderowany przez przegladarke.",
    },
  },
  en: {
    app: {
      languageSwitcherLabel: "Switch language",
      languagePolish: "Polish",
      languageEnglish: "English",
      themeSwitcherLabel: "Switch theme",
      themeLight: "Light",
      themeDark: "Dark",
      switchToLight: "Switch to light theme",
      switchToDark: "Switch to dark theme",
    },
    checker: {
      title: "Accessibility Checker",
      subtitle:
        "Paste an HTML snippet, run a WCAG 2A/2AA check, and jump straight to the lines that need attention.",
      editorTitle: "HTML Editor",
      editorHint:
        "Use semantic tags, clear labels, and accessible contrast. Problematic code fragments are highlighted directly in the editor.",
      editorAriaLabel: "HTML code editor",
      runCheck: "Check accessibility",
      checking: "Checking...",
      loadExample: "Load example",
      clear: "Clear",
      resultsTitle: "Check results",
      resultsHint: "Select an issue to scroll the editor to the relevant code fragment.",
      emptyInputInfo: "Add HTML first, then run the check.",
      success: "No WCAG issues were found in this snippet.",
      foundIssues: (count: number) => `${count} issues found. Ordered by severity.`,
      previewButtonAria: "Scroll to HTML preview",
      previewButtonText: "HTML preview",
    },
    preview: {
      wrapperAriaLabel: "Rendered HTML preview",
      title: "HTML Preview",
      hint: "This preview shows how your HTML snippet is rendered by the browser.",
    },
  },
};
