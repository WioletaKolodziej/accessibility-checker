import axe from "axe-core";

export interface AxeIssue {
  message: string;
  html: string;
  impact?: string;
  id: string;
  tags: string[];
  from: number;
  to: number;
  wcagUrl?: string;
}

const IMG_TAG_REGEX = /<img\b[\s\S]*?>/gi;
const ANCHOR_TAG_REGEX = /<a\b[\s\S]*?>[\s\S]*?<\/a>/gi;
const BUTTON_TAG_REGEX = /<button\b[\s\S]*?>[\s\S]*?<\/button>/gi;
const HEADING_TAG_REGEX = /<h([1-6])\b[\s\S]*?>[\s\S]*?<\/h\1>/gi;
const TRUE_ARIA_VALUES = new Set(["true", ""]);
const PRESENTATION_ROLES = new Set(["presentation", "none"]);
const WCAG_QUICKREF_BASE = "https://www.w3.org/WAI/WCAG22/quickref/?versions=2.2&showtechniques=";

function getWcagQuickRefUrl(successCriterion: string): string {
  return `${WCAG_QUICKREF_BASE}${encodeURIComponent(successCriterion)}`;
}

function getWcagUrlFromTags(tags: string[]): string {
  const wcagTag = tags.find((tag) => /^wcag\d{3,4}$/i.test(tag));
  if (!wcagTag) {
    return "https://www.w3.org/WAI/standards-guidelines/wcag/";
  }

  const criterion = wcagTag.replace(/^wcag/i, "");
  return getWcagQuickRefUrl(criterion);
}

function parseAttributes(tag: string): Map<string, string> {
  const attributes = new Map<string, string>();
  const openTagMatch = tag.match(/^<[^>]+>/);
  if (!openTagMatch) return attributes;
  const attrText = openTagMatch[0].replace(/^<[^\s>]+\b/i, "").replace(/\/?>$/, "");
  const attrRegex = /([^\s"'=<>`/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let match: RegExpExecArray | null = null;

  while ((match = attrRegex.exec(attrText)) !== null) {
    const [, rawName, doubleQuotedValue, singleQuotedValue, unquotedValue] = match;
    const name = rawName.toLowerCase();
    const value = (doubleQuotedValue ?? singleQuotedValue ?? unquotedValue ?? "").trim();
    attributes.set(name, value);
  }

  return attributes;
}

function runCustomImageChecks(html: string): AxeIssue[] {
  const issues: AxeIssue[] = [];
  let match: RegExpExecArray | null = null;

  while ((match = IMG_TAG_REGEX.exec(html)) !== null) {
    const snippet = match[0];
    const from = match.index;
    const to = from + snippet.length;
    const attrs = parseAttributes(snippet);
    const hasAlt = attrs.has("alt");
    const altValue = attrs.get("alt") ?? "";
    const ariaHidden = (attrs.get("aria-hidden") ?? "").toLowerCase();
    const role = (attrs.get("role") ?? "").toLowerCase();
    const isHiddenDecorative = TRUE_ARIA_VALUES.has(ariaHidden) || PRESENTATION_ROLES.has(role);

    if (!hasAlt) {
      issues.push({
        message: 'Image elements need alternative text. Use `alt="..."` or mark decorative images with `alt=""` and `aria-hidden="true"`.',
        html: snippet,
        impact: "serious",
        id: "custom-img-alt-required",
        tags: ["custom", "images", "wcag2a"],
        from,
        to,
        wcagUrl: getWcagQuickRefUrl("111"),
      });
      continue;
    }

    if (!altValue && !isHiddenDecorative) {
      issues.push({
        message: 'Decorative images should be hidden from assistive tech. Add `aria-hidden="true"` when using `alt=""`.',
        html: snippet,
        impact: "moderate",
        id: "custom-img-decorative-hidden",
        tags: ["custom", "images", "wcag2a"],
        from,
        to,
        wcagUrl: getWcagQuickRefUrl("111"),
      });
    }
  }

  return issues;
}

function runCustomLinkChecks(html: string): AxeIssue[] {
  const issues: AxeIssue[] = [];
  let match: RegExpExecArray | null = null;

  while ((match = ANCHOR_TAG_REGEX.exec(html)) !== null) {
    const snippet = match[0];
    const from = match.index;
    const to = from + snippet.length;
    const attrs = parseAttributes(snippet);
    const href = (attrs.get("href") ?? "").trim();
    const isMissingHref = href === "";

    if (isMissingHref) {
      issues.push({
        message: "Links must have a valid `href` attribute.",
        html: snippet,
        impact: "serious",
        id: "custom-link-href-required",
        tags: ["custom", "links", "wcag2a"],
        from,
        to,
        wcagUrl: getWcagQuickRefUrl("244"),
      });
    }
  }

  return issues;
}

function runCustomButtonChecks(html: string): AxeIssue[] {
  const issues: AxeIssue[] = [];
  let match: RegExpExecArray | null = null;

  while ((match = BUTTON_TAG_REGEX.exec(html)) !== null) {
    const snippet = match[0];
    const from = match.index;
    const to = from + snippet.length;
    const attrs = parseAttributes(snippet);
    const textContent = snippet.replace(/^<button\b[\s\S]*?>/i, "").replace(/<\/button>$/i, "").replace(/<[^>]+>/g, "").trim();
    const ariaLabel = (attrs.get("aria-label") ?? "").trim();
    const ariaLabelledby = (attrs.get("aria-labelledby") ?? "").trim();
    const title = (attrs.get("title") ?? "").trim();
    const hasAccessibleName = textContent.length > 0 || ariaLabel.length > 0 || ariaLabelledby.length > 0 || title.length > 0;

    if (!hasAccessibleName) {
      issues.push({
        message: "Buttons must have an accessible name (text, `aria-label`, or `aria-labelledby`).",
        html: snippet,
        impact: "critical",
        id: "custom-button-name-required",
        tags: ["custom", "forms", "wcag2a"],
        from,
        to,
        wcagUrl: getWcagQuickRefUrl("412"),
      });
    }
  }

  return issues;
}

function runCustomHeadingChecks(html: string): AxeIssue[] {
  const issues: AxeIssue[] = [];
  let match: RegExpExecArray | null = null;
  let previousHeadingLevel: number | null = null;
  let headingIndex = 0;

  while ((match = HEADING_TAG_REGEX.exec(html)) !== null) {
    const snippet = match[0];
    const from = match.index;
    const to = from + snippet.length;
    const level = Number(match[1]);

    if (headingIndex === 0 && level !== 1) {
      issues.push({
        message: "The first heading on the page should be `<h1>`.",
        html: snippet,
        impact: "serious",
        id: "custom-heading-first-should-be-h1",
        tags: ["custom", "headings", "wcag2a"],
        from,
        to,
        wcagUrl: getWcagQuickRefUrl("131"),
      });
    }

    if (previousHeadingLevel !== null && level - previousHeadingLevel > 1) {
      issues.push({
        message: `Heading levels should not skip levels (found <h${previousHeadingLevel}> before <h${level}>).`,
        html: snippet,
        impact: "moderate",
        id: "custom-heading-level-skipped",
        tags: ["custom", "headings", "wcag2a"],
        from,
        to,
        wcagUrl: getWcagQuickRefUrl("131"),
      });
    }

    previousHeadingLevel = level;
    headingIndex += 1;
  }

  return issues;
}

function findExactNonOverlappingRange(
  source: string,
  snippet: string,
  occupiedRanges: Array<{ from: number; to: number }>
): { from: number; to: number } | null {
  if (!snippet) return null;

  let from = source.indexOf(snippet);

  while (from !== -1) {
    const to = from + snippet.length;
    const overlaps = occupiedRanges.some((range) => from < range.to && to > range.from);

    if (!overlaps && to > from) {
      return { from, to };
    }

    from = source.indexOf(snippet, from + 1);
  }

  return null;
}

export async function runAxeCheck(html: string): Promise<AxeIssue[]> {
  const customIssues = [
    ...runCustomImageChecks(html),
    ...runCustomLinkChecks(html),
    ...runCustomButtonChecks(html),
    ...runCustomHeadingChecks(html),
  ];
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.width = "1px";
  container.style.height = "1px";
  container.innerHTML = html;

  document.body.appendChild(container);

  try {
    let results: axe.AxeResults;
    try {
      results = await axe.run(container, {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa"]
        }
      });
    } catch (error) {
      console.error("axe-core run failed; returning custom checks only:", error);
      return customIssues;
    }

    const issues: AxeIssue[] = [];
    const occupiedRanges: Array<{ from: number; to: number }> = [];

    for (const violation of results.violations) {
      for (const node of violation.nodes) {
        const snippet = node.html;
        const range = findExactNonOverlappingRange(html, snippet, occupiedRanges);

        if (range) {
          occupiedRanges.push(range);
          issues.push({
            message: violation.help,
            html: snippet,
            impact: violation.impact ?? "unknown",
            id: violation.id,
            tags: violation.tags,
            from: range.from,
            to: range.to,
            wcagUrl: getWcagUrlFromTags(violation.tags),
          });
        }
      }
    }

    const merged = [...issues, ...customIssues];
    const deduplicated = new Map<string, AxeIssue>();

    for (const issue of merged) {
      deduplicated.set(`${issue.id}-${issue.from}-${issue.to}`, issue);
    }

    return [...deduplicated.values()];
  } finally {
    if (container.parentNode === document.body) {
      document.body.removeChild(container);
    }
  }
}
