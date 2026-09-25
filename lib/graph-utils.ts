import type { DependencyEdge, Concept } from './types';

export function computeShortestPath(
  edges: DependencyEdge[],
  concepts: Concept[],
  startId: string,
  goalId: string
): string[] {
  const prereqEdges = edges.filter(
    (e) => e.type === 'prerequisite' || e.type === 'builds-on'
  );

  // Build adjacency: target -> list of sources (prerequisites)
  const adj = new Map<string, string[]>();
  for (const e of prereqEdges) {
    if (!adj.has(e.target)) adj.set(e.target, []);
    adj.get(e.target)!.push(e.source);
  }

  // BFS from goal backwards through prerequisites
  const visited = new Set<string>([goalId]);
  const queue: { id: string; path: string[] }[] = [{ id: goalId, path: [goalId] }];

  while (queue.length > 0) {
    const { id, path } = queue.shift()!;

    if (id === startId) return path.reverse();

    const prereqs = adj.get(id) || [];
    for (const p of prereqs) {
      if (!visited.has(p)) {
        visited.add(p);
        queue.push({ id: p, path: [...path, p] });
      }
    }
  }

  // Return all visited nodes sorted by dependency order if no direct path
  const allVisited = Array.from(visited);
  return allVisited.reverse();
}

export function getPrerequisiteChain(
  edges: DependencyEdge[],
  goalId: string
): string[] {
  const prereqEdges = edges.filter(
    (e) => e.type === 'prerequisite' || e.type === 'builds-on'
  );

  const adj = new Map<string, string[]>();
  for (const e of prereqEdges) {
    if (!adj.has(e.target)) adj.set(e.target, []);
    adj.get(e.target)!.push(e.source);
  }

  const visited = new Set<string>();
  const order: string[] = [];

  function dfs(nodeId: string) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    const prereqs = adj.get(nodeId) || [];
    for (const p of prereqs) {
      dfs(p);
    }
    order.push(nodeId);
  }

  dfs(goalId);
  return order;
}
