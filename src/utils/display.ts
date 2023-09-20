import { Graph } from "graphlib";
import { Occurrence } from "./types";

export async function displayGraphWithCode(
  graph: Graph,
  occurrences: Occurrence[]
): Promise<Graph> {
  occurrences.sort((a, b) => {
    if (a.file === b.file) {
      return (
        a.location.start.line - b.location.start.line ||
        a.location.start.column - b.location.start.column
      );
    }
    return a.file.localeCompare(b.file);
  });

  let nodeMap = new Map();

  occurrences.forEach((occurrence, index) => {
    const key = `${occurrence.file}-${occurrence.function}-${occurrence.codeBlock}-${occurrence.context}`;
    if (!nodeMap.has(key)) {
      nodeMap.set(key, index);
      graph.setNode(index.toString(), occurrence);
    }
  });

  const setGraphEdge = (source: Occurrence, target: Occurrence) => {
    const edgeLabel = `${source.context} -> ${target.context}`;
    graph.setEdge(
      nodeMap
        .get(
          `${source.file}-${source.function}-${source.codeBlock}-${source.context}`
        )
        .toString(),
      nodeMap
        .get(
          `${target.file}-${target.function}-${target.codeBlock}-${target.context}`
        )
        .toString(),
      { label: edgeLabel }
    );
  };

  for (let source of occurrences) {
    for (let target of occurrences) {
      if (
        source.function !== target.function &&
        source.context !== "Function Call"
      )
        continue;

      type ValidContext =
        | "Function Parameter"
        | "Function Call"
        | "JSX Attribute"
        | "Import Statement"
        | "Variable Declaration";

      const validConnections: Record<ValidContext, string[]> = {
        "Function Parameter": [
          "Equality or Comparison Check",
          "Function Call",
          "Return Statement",
        ],
        "Function Call": ["Function Parameter"],
        "JSX Attribute": ["Hook Declaration"],
        "Import Statement": ["JSX Element"],
        "Variable Declaration": [
          "Equality or Comparison Check",
          "Function Call",
          "Return Statement",
        ],
      };
      function getValidConnections(context: string): string[] | undefined {
        return validConnections[context as ValidContext];
      }

      if (getValidConnections(source.context)?.includes(target.context)) {
        if (
          source.context === "Function Call" &&
          target.context === "Function Parameter" &&
          target.declaration.includes(source.codeBlock)
        ) {
          setGraphEdge(target, source);
          continue;
        } else if (
          source.context === "Function Call" &&
          target.context === "Function Parameter" &&
          source.codeBlock.includes(target.function)
        ) {
          setGraphEdge(source, target);
        } else if (
          source.context === "Function Call" &&
          target.context === "Function Parameter"
        ) {
          continue;
        }

        setGraphEdge(source, target);
      }
    }
  }

  return graph;
}
