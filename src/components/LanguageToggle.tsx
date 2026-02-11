import styled from "styled-components";
import { Language } from "../i18n";

const Wrapper = styled.div`
  display: inline-flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 999px;
  background: ${({ theme }) => theme.surface};
  overflow: hidden;
`;

const Option = styled.button<{ $active: boolean }>`
  border: 0;
  background: ${({ theme, $active }) => ($active ? theme.accent : "transparent")};
  color: ${({ theme, $active }) => ($active ? theme.background : theme.text)};
  padding: 0.5rem 0.8rem;
  font-weight: 700;
  line-height: 1;

  &:hover {
    background: ${({ theme, $active }) => ($active ? theme.accent : theme.surfaceElevated)};
  }
`;

type Props = {
  language: Language;
  setLanguage: (language: Language) => void;
  labels: {
    switcherLabel: string;
    polish: string;
    english: string;
  };
};

export const LanguageToggle = ({ language, setLanguage, labels }: Props) => (
  <Wrapper role="group" aria-label={labels.switcherLabel}>
    <Option
      type="button"
      onClick={() => setLanguage("pl")}
      $active={language === "pl"}
      aria-pressed={language === "pl"}
      title={labels.polish}
    >
      PL
    </Option>
    <Option
      type="button"
      onClick={() => setLanguage("en")}
      $active={language === "en"}
      aria-pressed={language === "en"}
      title={labels.english}
    >
      EN
    </Option>
  </Wrapper>
);
