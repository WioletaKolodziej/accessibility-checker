import styled from "styled-components";

const Toggle = styled.button`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  border-radius: 999px;
  padding: 0.35rem 0.5rem 0.35rem 0.4rem;
  min-width: 132px;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.55rem;
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.surfaceElevated};
  }

  &:active {
    transform: scale(0.98);
  }
`;

const Icon = styled.span`
  width: 32px;
  height: 32px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: ${({ theme }) => theme.accent};
  color: ${({ theme }) => theme.background};
  font-size: 0.95rem;
`;

const Text = styled.span`
  font-weight: 800;
  font-size: 0.9rem;
  line-height: 1;
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
      onClick={toggleTheme}
      type="button"
      aria-label={`${labels.switcherLabel}. ${nextTitle}`}
      aria-pressed={isDarkMode}
      title={nextTitle}
    >
      <Icon aria-hidden="true">{isDarkMode ? "🌙" : "☀️"}</Icon>
      <Text>{isDarkMode ? labels.dark : labels.light}</Text>
    </Toggle>
  );
};
