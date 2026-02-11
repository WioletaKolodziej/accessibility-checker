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

const PriorityTabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-top: 0.75rem;
`;

const PriorityTabButton = styled.button<{ $active: boolean }>`
  border: 1px solid ${({ theme, $active }) => ($active ? theme.accent : theme.border)};
  background: ${({ theme, $active }) => ($active ? theme.accentSoft : theme.surface)};
  color: ${({ theme }) => theme.text};
  border-radius: 999px;
  padding: 0.35rem 0.65rem;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.8rem;
  font-weight: 700;
`;

const TabCount = styled.span`
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceElevated};
  min-width: 1.4rem;
  text-align: center;
  padding: 0.05rem 0.35rem;
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

const IssueMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.65rem 0.75rem 0.75rem;
  border-top: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceElevated};
  color: ${({ theme }) => theme.textMuted};
  font-size: 0.8rem;
`;

const WcagLink = styled.a`
  color: ${({ theme }) => theme.accent};
  text-decoration: underline;
  font-weight: 700;
`;

const SuccessMessage = styled.p`
  margin-top: 0.9rem;
  padding: 0.75rem;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.success};
  color: ${({ theme }) => theme.success};
  font-weight: 700;
`;

const EmptyPriorityMessage = styled.p`
  margin-top: 0.9rem;
  color: ${({ theme }) => theme.textMuted};
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

const impactTabs = ["all", "critical", "serious", "moderate", "minor", "unknown"] as const;
type ImpactTab = (typeof impactTabs)[number];

const DEMO_HTML = `<main>
  <h1>Product card</h1>
  <img src="/shoe.png">
  <a>Read details</a>
  <button></button>
</main>`;

type Props = {
  messages: I18nMessages;
};

function getLineNumber(source: string, from: number): number {
  if (!source) return 1;
  const safeFrom = Math.max(0, Math.min(from, source.length));
  const prefix = source.slice(0, safeFrom);
  return prefix.split("\n").length;
}

export const Checker = ({ messages }: Props) => {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<AxeIssue[]>([]);
  const [extensions, setExtensions] = useState<Extension[]>([html()]);
  const [hasChecked, setHasChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [activeTab, setActiveTab] = useState<ImpactTab>("all");

  const editorRef = useRef<EditorView | null>(null);
  const checkRunIdRef = useRef(0);
  const highlightTimeoutRef = useRef<number | null>(null);
  const visualizerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme() as ThemeType;

  const sortedResults = useMemo(
    () => [...results].sort((a, b) => (impactOrder[a.impact ?? "unknown"] ?? 4) - (impactOrder[b.impact ?? "unknown"] ?? 4)),
    [results]
  );

  const tabCounts = useMemo(() => {
    const counts: Record<ImpactTab, number> = {
      all: sortedResults.length,
      critical: 0,
      serious: 0,
      moderate: 0,
      minor: 0,
      unknown: 0,
    };

    for (const issue of sortedResults) {
      const impact = issue.impact ?? "unknown";
      const key: ImpactTab = impactTabs.includes(impact as ImpactTab) ? (impact as ImpactTab) : "unknown";
      counts[key] += 1;
    }

    return counts;
  }, [sortedResults]);

  const visibleResults = useMemo(() => {
    if (activeTab === "all") return sortedResults;
    return sortedResults.filter((issue) => (issue.impact ?? "unknown") === activeTab);
  }, [activeTab, sortedResults]);

  useEffect(() => {
    if (activeTab !== "all" && tabCounts[activeTab] === 0) {
      setActiveTab("all");
    }
  }, [activeTab, tabCounts]);

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

  const highlightIssueLine = (position: number) => {
    if (!editorRef.current) return;

    const { node } = editorRef.current.domAtPos(position);
    const baseElement = node instanceof HTMLElement ? node : node.parentElement;
    const lineElement = baseElement?.closest(".cm-line");

    if (!(lineElement instanceof HTMLElement)) return;

    editorRef.current.dom.querySelectorAll(".cm-line.highlighted-temp").forEach((element) => {
      element.classList.remove("highlighted-temp");
    });

    lineElement.classList.add("highlighted-temp");

    if (highlightTimeoutRef.current !== null) {
      window.clearTimeout(highlightTimeoutRef.current);
    }

    highlightTimeoutRef.current = window.setTimeout(() => {
      lineElement.classList.remove("highlighted-temp");
      highlightTimeoutRef.current = null;
    }, 1800);
  };

  const handleCheck = async () => {
    if (!input.trim()) {
      setHasChecked(true);
      setResults([]);
      setExtensions([html()]);
      return;
    }

    const runId = checkRunIdRef.current + 1;
    checkRunIdRef.current = runId;
    setLoading(true);

    try {
      const issues = await runAxeCheck(input);

      if (checkRunIdRef.current !== runId) return;

      setResults(issues);
      try {
        setExtensions([html(), getAccessibilityExtensions(issues)]);
      } catch (extensionError) {
        console.error("Could not build highlight extensions:", extensionError);
        setExtensions([html()]);
      }
      setHasChecked(true);

      if (issues.length > 0 && editorRef.current) {
        const firstIssuePos = Math.max(0, Math.min(issues[0].from, editorRef.current.state.doc.length));
        editorRef.current.dispatch({
          selection: { anchor: firstIssuePos },
          effects: EditorView.scrollIntoView(firstIssuePos, { y: "center", x: "start" }),
        });
        highlightIssueLine(firstIssuePos);
      }
    } catch (error) {
      if (checkRunIdRef.current !== runId) return;
      console.error("A11y check failed:", error);
      setResults([]);
      setExtensions([html()]);
      setHasChecked(true);
    } finally {
      if (checkRunIdRef.current === runId) {
        setLoading(false);
      }
    }
  };

  const scrollToIssue = (from: number) => {
    if (!editorRef.current) return;
    const safeFrom = Math.max(0, Math.min(from, editorRef.current.state.doc.length));

    editorRef.current.dispatch({
      selection: { anchor: safeFrom },
      effects: EditorView.scrollIntoView(safeFrom, { y: "center", x: "start" }),
    });
    highlightIssueLine(safeFrom);
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

  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current !== null) {
        window.clearTimeout(highlightTimeoutRef.current);
      }
    };
  }, []);

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
                setActiveTab("all");
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
                setActiveTab("all");
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
                <PriorityTabs role="tablist" aria-label={messages.checker.resultsTitle}>
                  {impactTabs.map((tab) => (
                    <PriorityTabButton
                      key={tab}
                      type="button"
                      role="tab"
                      aria-selected={activeTab === tab}
                      $active={activeTab === tab}
                      onClick={() => setActiveTab(tab)}
                    >
                      <span>{messages.checker.priorityTabs[tab]}</span>
                      <TabCount>{tabCounts[tab]}</TabCount>
                    </PriorityTabButton>
                  ))}
                </PriorityTabs>

                {visibleResults.length === 0 && (
                  <EmptyPriorityMessage>{messages.checker.noIssuesInPriority}</EmptyPriorityMessage>
                )}

                {visibleResults.length > 0 && (
                  <ResultList>
                    {visibleResults.map((issue, index) => {
                      const impact = issue.impact ?? "unknown";
                      const lineNumber = getLineNumber(input, issue.from);
                      return (
                        <ResultItem key={`${issue.id}-${index}`}>
                          <ResultButton type="button" onClick={() => scrollToIssue(issue.from)}>
                            <ResultTop>
                              <Severity $impact={impact}>{impact}</Severity>
                              <strong>{issue.message}</strong>
                            </ResultTop>
                            <Snippet>{issue.html}</Snippet>
                          </ResultButton>
                          <IssueMeta>
                            <span>{messages.checker.lineInfo(lineNumber)}</span>
                            <WcagLink
                              href={issue.wcagUrl ?? "https://www.w3.org/WAI/standards-guidelines/wcag/"}
                              target="_blank"
                              rel="noreferrer noopener"
                            >
                              {messages.checker.wcagLinkLabel}
                            </WcagLink>
                          </IssueMeta>
                        </ResultItem>
                      );
                    })}
                  </ResultList>
                )}
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
