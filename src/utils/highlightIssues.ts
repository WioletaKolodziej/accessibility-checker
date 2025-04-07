import { Decoration, ViewPlugin, DecorationSet, ViewUpdate } from "@codemirror/view";
import { Extension } from "@codemirror/state";
import { Issue } from "./checkAccessibility";

export function getAccessibilityExtension(issues: Issue[]): Extension {
  const decorations = Decoration.set(
    issues.map(issue =>
      Decoration.mark({
        class: "accessibility-error",
        attributes: { title: issue.message }
      }).range(issue.from, issue.to)
    )
  );

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
