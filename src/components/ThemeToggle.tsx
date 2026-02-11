import styled from "styled-components";

const Toggle = styled.button<{ $isDark: boolean }>`
  position: relative;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme, $isDark }) =>
    $isDark
      ? `linear-gradient(120deg, ${theme.surface} 0%, ${theme.surfaceElevated} 100%)`
      : `linear-gradient(120deg, ${theme.surfaceElevated} 0%, ${theme.surface} 100%)`};
  color: ${({ theme }) => theme.text};
  border-radius: 999px;
  width: 150px;
  height: 40px;
  padding: 0 0.5rem;
  display: inline-grid;
  place-items: center;
  transition: background-color 0.25s ease, border-color 0.25s ease, transform 0.2s ease;

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.accent};
    outline-offset: 2px;
  }

  &:hover {
    background: ${({ theme }) => theme.surfaceElevated};
  }

  &:active {
    transform: scale(0.98);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const Thumb = styled.span<{ $isDark: boolean }>`
  position: absolute;
  top: 3px;
  left: 3px;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: ${({ theme }) => theme.accent};
  color: ${({ theme }) => theme.background};
  transform: translateX(${({ $isDark }) => ($isDark ? "112px" : "0px")});
  transition: transform 260ms cubic-bezier(0.22, 0.61, 0.36, 1);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const Icon = styled.span<{ $isDark: boolean }>`
  font-size: 0.95rem;
  transform: rotate(${({ $isDark }) => ($isDark ? "-14deg" : "0deg")});
  transition: transform 260ms cubic-bezier(0.22, 0.61, 0.36, 1);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const Text = styled.span`
  font-weight: 800;
  font-size: 0.82rem;
  line-height: 1;
  padding-inline: 2.2rem;
  text-align: center;
  user-select: none;
`;

type Props = {
  toggleTheme: () => void;
  isDarkMode: boolean;
  labels: {
    switcherLabel: string;
    light: string;
    dark: string;
    switchToLight: string;
    switchToDark: string;
  };
};

export const ThemeToggle = ({ toggleTheme, isDarkMode, labels }: Props) => {
  const nextTitle = isDarkMode ? labels.switchToLight : labels.switchToDark;

  return (
    <Toggle
      $isDark={isDarkMode}
      onClick={toggleTheme}
      type="button"
      aria-label={`${labels.switcherLabel}. ${nextTitle}`}
      aria-pressed={isDarkMode}
      title={nextTitle}
    >
      <Text>{isDarkMode ? labels.dark : labels.light}</Text>
      <Thumb $isDark={isDarkMode} aria-hidden="true">
        <Icon $isDark={isDarkMode}>{isDarkMode ? "🌙" : "☀️"}</Icon>
      </Thumb>
    </Toggle>
  );
};
