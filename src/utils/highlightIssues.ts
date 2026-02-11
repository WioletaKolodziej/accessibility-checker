import { Decoration, ViewPlugin, DecorationSet } from "@codemirror/view";
import { Extension } from "@codemirror/state";
import { AxeIssue } from "./runAxeCheck";

export function getAccessibilityExtensions(issues: AxeIssue[]): Extension {
  const marks = issues
    .filter((issue) => Number.isInteger(issue.from) && Number.isInteger(issue.to) && issue.from >= 0 && issue.to > issue.from)
    .sort((a, b) => (a.from === b.from ? a.to - b.to : a.from - b.from))
    .map((issue) =>
      Decoration.mark({
        class: "accessibility-error",
        attributes: { title: issue.message }
      }).range(issue.from, issue.to)
    );

  const decorations = Decoration.set(marks, true);

  return ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;

      constructor() {
        this.decorations = decorations;
      }

      update() {}

      destroy() {}
    },
    {
      decorations: plugin => plugin.decorations
    }
  );
}
