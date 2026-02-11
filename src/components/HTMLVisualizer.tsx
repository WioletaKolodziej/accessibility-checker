import React from "react";
import styled from "styled-components";
import { Hint, Label } from "./SharedStyles";
import { I18nMessages } from "../i18n";

const Wrapper = styled.section`
  width: 100%;
  max-width: 1200px;
  margin: 2rem auto 0;
  padding: 1.25rem;
  border-radius: 18px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};
`;

const PreviewContainer = styled.div`
  width: 100%;
  min-height: 280px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  border-radius: 14px;
  padding: 1rem;
  overflow: auto;
`;

interface HTMLVisualizerProps {
  html: string;
  messages: I18nMessages["preview"];
}

const HTMLVisualizer: React.FC<HTMLVisualizerProps> = ({ html, messages }) => {
  return (
    <Wrapper aria-label={messages.wrapperAriaLabel}>
      <Label as="h3">{messages.title}</Label>
      <Hint>{messages.hint}</Hint>
      <PreviewContainer>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </PreviewContainer>
    </Wrapper>
  );
};

export default HTMLVisualizer;
