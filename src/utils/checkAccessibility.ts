// src/utils/checkAccessibility.ts

export interface Issue {
  from: number;
  to: number;
  message: string;
}

export function checkAccessibility(html: string): Issue[] {
  const issues: Issue[] = [];

  // Check for <img> tags without alt attribute
  const imgRegex = /<img[^>]*>/gi;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    const imgTag = match[0];
    const hasAlt = /alt\s*=/.test(imgTag);

    if (!hasAlt) {
      issues.push({
        from: match.index,
        to: match.index + imgTag.length,
        message: "Missing alt attribute on <img> tag",
      });
    }
  }

  // Check for <form> elements that are missing a <label>
  const formRegex = /<form[\s\S]*?>([\s\S]*?)<\/form>/gi;
  while ((match = formRegex.exec(html)) !== null) {
    const formContent = match[1];
    const hasLabel = /<label[\s\S]*?>[\s\S]*?<\/label>/i.test(formContent);

    if (!hasLabel) {
      issues.push({
        from: match.index,
        to: match.index + match[0].length,
        message: "Form is missing a <label> element",
      });
    }
  }

  // Check for inline styles that may affect accessibility (e.g., poor contrast)
  const styleRegex = /style\s*=\s*"[^"]*"/gi;
  while ((match = styleRegex.exec(html)) !== null) {
    const styleAttr = match[0];
    const hasBadColor = /color:\s*(#fff|white);\s*background-color:\s*(#fff|white)/i.test(styleAttr);

    if (hasBadColor) {
      issues.push({
        from: match.index,
        to: match.index + styleAttr.length,
        message: "Inline style may have poor contrast (white text on white background)",
      });
    }
  }

  // Check for interactive elements missing accessible features
  const interactiveRegex = /<(button|a|input|textarea|select)[^>]*>/gi;
  while ((match = interactiveRegex.exec(html)) !== null) {
    const tag = match[0];
    const hasAriaLabel = /aria-label\s*=/.test(tag);
    const hasTitle = /title\s*=/.test(tag);
    const hasLabelledBy = /aria-labelledby\s*=/.test(tag);

    if (!hasAriaLabel && !hasTitle && !hasLabelledBy) {
      issues.push({
        from: match.index,
        to: match.index + tag.length,
        message: `Interactive element <${match[1]}> is missing accessible labeling (aria-label, title, or aria-labelledby)`,
      });
    }
  }

  return issues;
}
