import axe from "axe-core";

export interface AxeIssue {
  message: string;
  html: string;
  impact?: string;
  id: string;
  tags: string[];
  from: number;
  to: number;
}

export async function runAxeCheck(html: string): Promise<AxeIssue[]> {
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.width = "1px";
  container.style.height = "1px";
  container.innerHTML = html;

  document.body.appendChild(container);

  try {
    const results = await axe.run(container, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa"]
      }
    });

    const issues: AxeIssue[] = [];
    let lastIndex = 0;

    for (const violation of results.violations) {
      for (const node of violation.nodes) {
        const snippet = node.html;
        const from = html.indexOf(snippet, lastIndex);
        const to = from + snippet.length;

        if (from !== -1) {
          issues.push({
            message: violation.help,
            html: snippet,
            impact: violation.impact ?? "unknown",
            id: violation.id,
            tags: violation.tags,
            from,
            to
          });

          lastIndex = to; 
        }
      }
    }

    return issues;
  } finally {
    document.body.removeChild(container);
  }
}
