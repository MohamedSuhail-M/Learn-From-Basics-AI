'use client';

import { useMemo, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  MarkerType,
  Node,
  Edge,
  Position,
} from 'reactflow';
// @ts-ignore
import 'reactflow/dist/style.css';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { Concept, DependencyEdge } from '@/lib/types';

interface ConceptGraphProps {
  concepts: Concept[];
  edges: DependencyEdge[];
  onSelectConcept?: (conceptId: string) => void;
}

export function ConceptGraph({ concepts, edges, onSelectConcept }: ConceptGraphProps) {
  const [selectedEdge, setSelectedEdge] = useState<DependencyEdge | null>(null);

  const initialNodes: Node[] = useMemo(() => {
    const cols = 3;
    return concepts.map((c, idx) => ({
      id: c.id,
      data: { label: c.name, description: c.description },
      position: { x: (idx % cols) * 260 + 50, y: Math.floor(idx / cols) * 140 + 50 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      style: {
        background: '#ffffff',
        border: '1.5px solid hsl(var(--primary))',
        borderRadius: '12px',
        padding: '12px',
        fontSize: '12px',
        fontWeight: 600,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      },
    }));
  }, [concepts]);

  const initialEdges: Edge[] = useMemo(() => {
    return edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: `${e.type} (${e.confidence}%)`,
      animated: e.type === 'prerequisite',
      markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--primary))' },
      style: { stroke: 'hsl(var(--primary))', strokeWidth: 1.5 },
    }));
  }, [edges]);

  const handleEdgeClick = (_: any, edge: Edge) => {
    const matched = edges.find((e) => e.id === edge.id);
    if (matched) setSelectedEdge(matched);
  };

  return (
    <div className="relative w-full h-[520px] rounded-2xl border border-border/80 overflow-hidden bg-background">
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        onEdgeClick={handleEdgeClick}
        onNodeClick={(_, node) => onSelectConcept && onSelectConcept(node.id)}
        fitView
      >
        <Background gap={16} size={1} />
        <Controls />
        <MiniMap nodeStrokeWidth={3} className="border rounded-lg overflow-hidden" />
      </ReactFlow>

      {selectedEdge && (
        <Card className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md shadow-lg border-primary/30 bg-card/95 backdrop-blur z-20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-primary font-bold">
              Evidence-Backed Dependency Citation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <blockquote className="pl-2 border-l-2 border-primary italic text-muted-foreground">
              "{selectedEdge.evidence}"
            </blockquote>
            {selectedEdge.whyLearnFirst && (
              <p className="text-foreground">
                <span className="font-semibold text-primary">Why: </span>
                {selectedEdge.whyLearnFirst}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}