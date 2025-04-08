import { Decoration, ViewPlugin, DecorationSet, ViewUpdate } from "@codemirror/view";
import { Extension } from "@codemirror/state";
import { AxeIssue } from "./runAxeCheck";

export function getAccessibilityExtensions(issues: AxeIssue[]): Extension {
  const marks = issues.map(issue =>
    Decoration.mark({
      class: "accessibility-error",
      attributes: { title: issue.message }
    }).range(issue.from, issue.to)
  );

  const decorations = Decoration.set(marks);

  return ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;

      constructor() {
        this.decorations = decorations;
      }

      update(_update: ViewUpdate) {}

      destroy() {}
    },
    {
      decorations: plugin => plugin.decorations
    }
  );
}
