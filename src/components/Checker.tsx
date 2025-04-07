import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { checkAccessibility, Issue } from "../utils/checkAccessibility";
import { useCodeMirror } from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { Extension } from "@codemirror/state";
import { getAccessibilityExtension } from "../utils/highlightIssues";

const Container = styled.section`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Heading = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.accent};
  color: white;
  padding: 0.8rem 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.success};
  }
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:active {
    transform: scale(0.97);
  }
`;

const ResultsWrapper = styled.div`
  margin-top: 1.5rem;
  aria-live: polite;
`;

const ResultsList = styled.ul`
  margin-top: 1rem;
  padding-left: 1rem;
  list-style-type: disc;
  color: ${({ theme }) => theme.error};
  animation: fadeIn 0.3s ease-in;
`;

const SuccessMessage = styled.p`
  color: ${({ theme }) => theme.success};
  margin-top: 1rem;
`;

const Hint = styled.div`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.success};
  margin-bottom: 1rem;
  animation: fadeIn 0.5s ease-out;
`;

export const Checker = () => {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [extensions, setExtensions] = useState<Extension[]>([html()]);

  const { setContainer } = useCodeMirror({
    value: input,
    height: "200px",
    extensions,
    theme: "dark",
    onChange: (value) => setInput(value),
  });

  const handleCheck = () => {
    const issues: Issue[] = checkAccessibility(input);
    setResults(issues.map((i) => i.message));
    const accessibilityExt = getAccessibilityExtension(issues);
    setExtensions([html(), accessibilityExt]);
  };

  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hintRef.current) {
      hintRef.current.animate(
        [
          { opacity: 0, transform: "translateY(-10px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 800,
          easing: "ease-out",
          fill: "forwards",
        }
      );
    }
  }, []);

  return (
    <Container aria-labelledby="checker-heading">
      <Heading id="checker-heading">Accessibility Checker</Heading>

      <Hint ref={hintRef}>
        💡 Paste your HTML snippet like &lt;img src="..." /&gt;
      </Hint>

      <Label htmlFor="html-input">Paste your HTML code:</Label>
      
      <div ref={setContainer} />

      <Button onClick={handleCheck}>Check Accessibility</Button>

      <ResultsWrapper aria-live="polite">
        {results.length === 0 && input && (
          <SuccessMessage>No issues found 🎉</SuccessMessage>
        )}
        {results.length > 0 && (
          <ResultsList>
            {results.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ResultsList>
        )}
      </ResultsWrapper>
    </Container>
  );
};
