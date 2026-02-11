import { useEffect, useMemo, useRef, useState } from "react";
import styled, { useTheme } from "styled-components";
import { useCodeMirror } from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { EditorView } from "codemirror";
import { Extension } from "@codemirror/state";

import { getAccessibilityExtensions } from "../utils/highlightIssues";
import { runAxeCheck, AxeIssue } from "../utils/runAxeCheck";
import HTMLVisualizer from "./HTMLVisualizer";
import { Hint, Label } from "./SharedStyles";
import { ThemeType } from "../styles/theme";
import { I18nMessages } from "../i18n";

const Page = styled.main`
  width: min(100%, 100vw);
  margin: 0;
  padding: 1.25rem 1rem 3rem;
`;

const Hero = styled.section`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.heroGradient};
  border-radius: 24px;
  padding: clamp(1rem, 1.8vw, 2rem);
  box-shadow: ${({ theme }) => theme.shadow};
`;

const Title = styled.h2`
  font-size: clamp(1.5rem, 4vw, 2.4rem);
  line-height: 1.1;
  letter-spacing: 0.01em;
`;

const Subtitle = styled.p`
  margin-top: 0.55rem;
  max-width: 70ch;
  color: ${({ theme }) => theme.textMuted};
`;

const Grid = styled.section`
  display: grid;
  margin-top: 1.2rem;
  gap: 1rem;
  grid-template-columns: 1.2fr 0.8fr;
  width: 100%;

  > * {
    min-width: 0;
  }

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.section`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  border-radius: 20px;
  padding: 1rem;
  box-shadow: ${({ theme }) => theme.shadow};
  min-width: 0;
  overflow: hidden;
`;

const EditorFrame = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 14px;
  overflow: hidden;
  height: clamp(320px, 56vh, 680px);
  max-height: 680px;
  min-width: 0;
  margin-top: 0.65rem;
`;

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-top: 0.9rem;
`;

const Button = styled.button`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceElevated};
  color: ${({ theme }) => theme.text};
  border-radius: 12px;
  padding: 0.65rem 1rem;
  font-weight: 700;

  &:hover {
    filter: brightness(0.98);
  }
`;

const PrimaryButton = styled(Button)`
  background: ${({ theme }) => theme.accent};
  border-color: ${({ theme }) => theme.accent};
  color: ${({ theme }) => theme.background};
`;

const ResultMeta = styled.p`
  margin-top: 0.5rem;
  color: ${({ theme }) => theme.textMuted};
`;

const ResultList = styled.ol`
  margin-top: 0.9rem;
  display: grid;
  gap: 0.55rem;
  list-style: none;
`;

const ResultsViewport = styled.div`
  margin-top: 0.65rem;
  max-height: clamp(280px, 56vh, 680px);
  overflow: auto;
  padding-right: 0.25rem;
`;

const ResultItem = styled.li`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  overflow: hidden;
`;

const ResultButton = styled.button`
  width: 100%;
  text-align: left;
  border: 0;
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;

  &:hover {
    background: ${({ theme }) => theme.surfaceElevated};
  }
`;

const ResultTop = styled.span`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
`;

const Severity = styled.span<{ $impact: string }>`
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
  border-radius: 999px;
  padding: 0.2rem 0.5rem;
  background: ${({ theme, $impact }) => {
    if ($impact === "critical") return theme.danger;
    if ($impact === "serious") return theme.warning;
    if ($impact === "moderate") return theme.accent;
    return theme.border;
  }};
  color: ${({ theme }) => theme.background};
`;

const Snippet = styled.code`
  font-size: 0.82rem;
  color: ${({ theme }) => theme.textMuted};
  white-space: normal;
  word-break: break-word;
  overflow-wrap: anywhere;
`;

const SuccessMessage = styled.p`
  margin-top: 0.9rem;
  padding: 0.75rem;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.success};
  color: ${({ theme }) => theme.success};
  font-weight: 700;
`;

const ScrollToPreview = styled.button`
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  border: 0;
  border-radius: 999px;
  padding: 0.75rem 1rem;
  font-weight: 800;
  color: ${({ theme }) => theme.background};
  background: ${({ theme }) => theme.accent};
  box-shadow: ${({ theme }) => theme.shadow};
`;

const impactOrder: Record<string, number> = {
  critical: 0,
  serious: 1,
  moderate: 2,
  minor: 3,
  unknown: 4,
};

const DEMO_HTML = `<main>
  <h1>Product card</h1>
  <img src="/shoe.png">
  <a>Read details</a>
  <button></button>
</main>`;

type Props = {
  messages: I18nMessages;
};

export const Checker = ({ messages }: Props) => {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<AxeIssue[]>([]);
  const [extensions, setExtensions] = useState<Extension[]>([html()]);
  const [hasChecked, setHasChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const editorRef = useRef<EditorView | null>(null);
  const visualizerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme() as ThemeType;

  const sortedResults = useMemo(
    () => [...results].sort((a, b) => (impactOrder[a.impact ?? "unknown"] ?? 4) - (impactOrder[b.impact ?? "unknown"] ?? 4)),
    [results]
  );

  const { setContainer } = useCodeMirror({
    value: input,
    height: "100%",
    extensions,
    theme: theme.editorTheme,
    onCreateEditor: (view) => {
      editorRef.current = view;
    },
    onChange: (value) => {
      setInput(value);
    },
  });

  const handleCheck = async () => {
    if (!input.trim()) {
      setHasChecked(true);
      setResults([]);
      setExtensions([html()]);
      return;
    }

    setLoading(true);
    const issues = await runAxeCheck(input);
    setResults(issues);
    setExtensions([html(), getAccessibilityExtensions(issues)]);
    setHasChecked(true);
    setLoading(false);

    if (issues.length > 0 && editorRef.current) {
      editorRef.current.dispatch({
        effects: EditorView.scrollIntoView(issues[0].from, { y: "start", x: "start" }),
      });
    }
  };

  const scrollToIssue = (from: number) => {
    if (!editorRef.current) return;

    editorRef.current.dispatch({
      effects: EditorView.scrollIntoView(from, { y: "start", x: "start" }),
    });

    const node = editorRef.current.domAtPos(from)?.node;
    const target = node instanceof HTMLElement ? node : node.parentElement;

    if (target instanceof HTMLElement) {
      target.classList.add("highlighted-temp");
      window.setTimeout(() => target.classList.remove("highlighted-temp"), 1300);
    }
  };

  useEffect(() => {
    const node = visualizerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowScrollButton(!entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [input, hasChecked]);

  return (
    <Page aria-labelledby="checker-heading">
      <Hero>
        <Title id="checker-heading">{messages.checker.title}</Title>
        <Subtitle>{messages.checker.subtitle}</Subtitle>
      </Hero>

      <Grid>
        <Card aria-labelledby="editor-section-title">
          <Label as="h3" id="editor-section-title">
            {messages.checker.editorTitle}
          </Label>
          <Hint>{messages.checker.editorHint}</Hint>
          <EditorFrame aria-label={messages.checker.editorAriaLabel} ref={setContainer} />
          <Controls>
            <PrimaryButton type="button" onClick={handleCheck} disabled={loading}>
              {loading ? messages.checker.checking : messages.checker.runCheck}
            </PrimaryButton>
            <Button
              type="button"
              onClick={() => {
                setInput(DEMO_HTML);
                setResults([]);
                setHasChecked(false);
                setExtensions([html()]);
              }}
            >
              {messages.checker.loadExample}
            </Button>
            <Button
              type="button"
              onClick={() => {
                setInput("");
                setResults([]);
                setHasChecked(false);
                setExtensions([html()]);
              }}
            >
              {messages.checker.clear}
            </Button>
          </Controls>
        </Card>

        <Card aria-labelledby="results-section-title">
          <Label as="h3" id="results-section-title">
            {messages.checker.resultsTitle}
          </Label>
          <Hint>{messages.checker.resultsHint}</Hint>

          <ResultsViewport aria-live="polite">
            {hasChecked && !input.trim() && (
              <ResultMeta>{messages.checker.emptyInputInfo}</ResultMeta>
            )}

            {hasChecked && results.length === 0 && input.trim() && (
              <SuccessMessage>{messages.checker.success}</SuccessMessage>
            )}

            {sortedResults.length > 0 && (
              <>
                <ResultMeta>{messages.checker.foundIssues(sortedResults.length)}</ResultMeta>
                <ResultList>
                  {sortedResults.map((issue, index) => {
                    const impact = issue.impact ?? "unknown";
                    return (
                      <ResultItem key={`${issue.id}-${index}`}>
                        <ResultButton type="button" onClick={() => scrollToIssue(issue.from)}>
                          <ResultTop>
                            <Severity $impact={impact}>{impact}</Severity>
                            <strong>{issue.message}</strong>
                          </ResultTop>
                          <Snippet>{issue.html}</Snippet>
                        </ResultButton>
                      </ResultItem>
                    );
                  })}
                </ResultList>
              </>
            )}
          </ResultsViewport>
        </Card>
      </Grid>

      {input && hasChecked && /<[^>]+>/.test(input) && (
        <div ref={visualizerRef}>
          <HTMLVisualizer html={input} messages={messages.preview} />
        </div>
      )}

      {showScrollButton && (
        <ScrollToPreview
          type="button"
          onClick={() => visualizerRef.current?.scrollIntoView({ behavior: "smooth" })}
          aria-label={messages.checker.previewButtonAria}
        >
          {messages.checker.previewButtonText}
        </ScrollToPreview>
      )}
    </Page>
  );
};
