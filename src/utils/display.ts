import { Graph } from 'graphlib';
import { Occurrence } from './types';
import { analyzeFunctionUsage } from './codeAnalysis';

export function displayResults(occurrences: Occurrence[]): void {
    console.log("Occurrences of the identifier:\n");

    occurrences.forEach(occurrence => {
        console.log(`- File: ${occurrence.file}`);
        console.log(`  Function: ${occurrence.function}`);
        console.log(`  Location: Line ${occurrence.location.start.line}, Column ${occurrence.location.start.column}`);
        console.log(`  Code Block:\n${occurrence.codeBlock}\n`);
    });
}

export async function displayGraphWithCode(graph: Graph, occurrences: Occurrence[]): Promise<Graph> {

    for (const [key, value] of Object.entries(occurrences)) {
        graph.setNode(key, value);
      }
      for (const [key, value] of Object.entries(occurrences)) {
        for (const [key2, value2] of Object.entries(value)) {
          graph.setEdge(key, key2, value2);
        }
      }
    return graph;
}
