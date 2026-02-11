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
    footerPrefix: string;
    footerRights: string;
    footerLinkAria: string;
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
    lineInfo: (lineNumber: number) => string;
    wcagLinkLabel: string;
    priorityTabs: {
      all: string;
      critical: string;
      serious: string;
      moderate: string;
      minor: string;
      unknown: string;
    };
    noIssuesInPriority: string;
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
      footerPrefix: "© 2026",
      footerRights: "Wszelkie prawa zastrzezone.",
      footerLinkAria: "Przejdz do strony UI-kolo",
    },
    checker: {
      title: "Accessibility Checker",
      subtitle:
        "Wklej lub wpisz fragment HTML, uruchom sprawdzenie WCAG 2.2 i przejdz od razu do miejsc, ktore wymagaja poprawy.",
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
      lineInfo: (lineNumber: number) => `Linia: ${lineNumber}`,
      wcagLinkLabel: "Opis WCAG",
      priorityTabs: {
        all: "Wszystkie",
        critical: "Krytyczne",
        serious: "Powazne",
        moderate: "Srednie",
        minor: "Niskie",
        unknown: "Nieznane",
      },
      noIssuesInPriority: "Brak problemow w wybranym priorytecie.",
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
      footerPrefix: "© 2026",
      footerRights: "All rights reserved.",
      footerLinkAria: "Go to UI-kolo website",
    },
    checker: {
      title: "Accessibility Checker",
      subtitle:
        "Paste or write an HTML snippet, run a WCAG 2.2 check, and jump straight to the lines that need attention.",
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
      lineInfo: (lineNumber: number) => `Line: ${lineNumber}`,
      wcagLinkLabel: "WCAG description",
      priorityTabs: {
        all: "All",
        critical: "Critical",
        serious: "Serious",
        moderate: "Moderate",
        minor: "Minor",
        unknown: "Unknown",
      },
      noIssuesInPriority: "No issues in the selected priority.",
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
