import styled from "styled-components";

const ToggleWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
`;

const ToggleButton = styled.button`
  background: ${({ theme }) => theme.accent};
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s;

  &:hover {
    background: ${({ theme }) => theme.success};
  }
`;

type Props = {
  toggleTheme: () => void;
  isDarkMode: boolean;
};

export const ThemeToggle = ({ toggleTheme, isDarkMode }: Props) => (
  <ToggleWrapper>
    <ToggleButton onClick={toggleTheme}>
      {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </ToggleButton>
  </ToggleWrapper>
);
