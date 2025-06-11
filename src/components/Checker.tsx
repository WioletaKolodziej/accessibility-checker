// React and external imports
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useCodeMirror } from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { EditorView } from "codemirror";
import { Extension } from "@codemirror/state";

// Utility functions for accessibility checking and highlighting
import { getAccessibilityExtensions } from "../utils/highlightIssues";
import { runAxeCheck, AxeIssue } from "../utils/runAxeCheck";

// Components imports
import HTMLVisualizer from "./HTMLVisualizer";
import { Hint, Label } from "./SharedStyles";


// Styled components for layout and UI
const Container = styled.section`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: calc(100dvh - 5rem);
  overflow: hidden;
  padding: 2rem;
  box-sizing: border-box;
`;

const Heading = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  gap: 2rem;
  margin-top: 1.5rem;
  overflow: hidden;
`;

const EditorWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 50%;
  height: 100%;
  min-height: 50vh;
  position: relative;
  overflow: hidden;
`;

const EditorTop = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const CodeMirrorWrapper = styled.div`
  flex: 1;
  height: 100%;
  max-height: calc(100dvh - 300px);
  overflow: auto;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.border};
`;

const StickyButton = styled.button`
  position: sticky;
  bottom: 1rem;
  margin-top: 2rem;
  background-color: ${({ theme }) => theme.accent};
  color: white;
  padding: 0.8rem 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  z-index: 10;
  align-self: flex-start;

  &:hover {
    background-color: ${({ theme }) => theme.success};
  }
  &:active {
    transform: scale(0.97);
  }
`;

const Panel = styled.div`
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  position: relative;
`;

const ResultsWrapper = styled.div`
  aria-live: polite;
`;

const ResultsList = styled.ul`
  margin-top: 0.5rem;
  padding-left: 1rem;
  list-style-type: disc;
  animation: fadeIn 0.3s ease-in;

  .error-critical {
    color: #d9534f;
  }
  .error-serious {
    color: #f0ad4e;
  }
  .error-moderate {
    color: #f7c948;
  }
  .error-minor {
    color: #999;
  }

  li {
    cursor: pointer;
  }
`;

const SuccessMessage = styled.p`
  color: ${({ theme }) => theme.success};
  margin-top: 1rem;
`;

const VisualizerWrapper = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const impactIconMap: Record<string, string> = {
  critical: "❌",
  serious: "⚠️",
  moderate: "ℹ️",
  minor: "💡",
};

const ScrollToVisualizerButton = styled.button`
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${({ theme }) => theme.accent};
  color: white;
  padding: 0.8rem 1.4rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1rem;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  transition: opacity 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.success};
  }

  &:active {
    transform: translateX(-50%) scale(0.96);
  }
`;


export const Checker = () => {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<AxeIssue[]>([]);
  const [extensions, setExtensions] = useState<Extension[]>([html()]);
  const [hasChecked, setHasChecked] = useState(false);
  const editorRef = useRef<EditorView | null>(null);
  const visualizerRef = useRef<HTMLDivElement>(null);

  const { setContainer } = useCodeMirror({
    value: input,
    height: "100%",
    extensions,
    theme: "dark",
    onCreateEditor: (view) => {
      editorRef.current = view;
    },
    onChange: (value) => {
      setInput(value);
    },
  });

  const handleCheck = async () => {
    const issues = await runAxeCheck(input);
    setResults(issues);
    const decoration = getAccessibilityExtensions(issues);
    setExtensions([html(), decoration]);
    setHasChecked(true);
    if (issues.length > 0 && editorRef.current) {
      editorRef.current.dispatch({
        effects: EditorView.scrollIntoView(issues[0].from, {
          y: "start",
          x: "start",
        }),
      });
    }
  };

  const scrollToIssue = (from: number) => {
    if (!editorRef.current) return;

    editorRef.current.dispatch({
      effects: EditorView.scrollIntoView(from, {
        y: "start",
        x: "start",
      }),
    });

    const dom = editorRef.current.domAtPos(from)?.node;
    if (dom instanceof HTMLElement) {
      dom.classList.add("highlighted-temp");
      setTimeout(() => dom.classList.remove("highlighted-temp"), 1500);
    }
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

  const [showScrollButton, setShowScrollButton] = useState(false);

useEffect(() => {
  const node = visualizerRef.current;
  if (!node) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      setShowScrollButton(!entry.isIntersecting);
    },
    {
      root: null,
      threshold: 0.1,
    }
  );

  observer.observe(node);

  return () => {
    observer.unobserve(node);
  };
}, [input, hasChecked]);


  return (
  <>
    <Container aria-labelledby="checker-heading">
      <Heading id="checker-heading">Accessibility Checker</Heading>

      <ContentWrapper>
        <EditorWrapper>
          <EditorTop>
            <Hint ref={hintRef}>
              💡 Type or paste your HTML snippet below (e.g. &lt;img src="..."&gt;) and then press the <strong>Check Accessibility</strong> button to run analysis and see if your code meets accessibility standards.
            </Hint>
            <Label htmlFor="html-input">Paste your HTML code:</Label>
            <CodeMirrorWrapper ref={setContainer} />
          </EditorTop>
          <StickyButton onClick={handleCheck}>Check Accessibility</StickyButton>
        </EditorWrapper>

        <Panel>
          <ResultsWrapper aria-live="polite">
            {hasChecked && results.length === 0 && input && (
              <SuccessMessage>No issues found 🎉</SuccessMessage>
            )}
            {results.length > 0 && (
              <>
                <Hint>
                  💡 Click on an issue to scroll to the affected element in the editor:
                </Hint>
                <ResultsList>
                  {results.map((r, i) => (
                    <li
                      key={i}
                      className={`error-${r.impact}`}
                      onClick={() => scrollToIssue(r.from)}
                    >
                      {impactIconMap[r.impact ?? "minor"]} [{r.impact}] {r.message} — <code>{r.html}</code>
                    </li>
                  ))}
                </ResultsList>
              </>
            )}
          </ResultsWrapper>
        </Panel>
      </ContentWrapper>
    </Container>
    {input && hasChecked && /<[^>]+>/.test(input) && (
  <VisualizerWrapper ref={visualizerRef}>
    <HTMLVisualizer html={input} />
  </VisualizerWrapper>
)}
{showScrollButton && (
  <ScrollToVisualizerButton onClick={() => {
    visualizerRef.current?.scrollIntoView({ behavior: "smooth" });
  }}
  aria-label="Press to scroll to the HTML preview section">
    ⬇️ Browser Preview
  </ScrollToVisualizerButton>
)}
  </>
  );
};
