'use client';

import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  type Node,
  type Edge,
  type NodeMouseHandler,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Loader2, Network, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import type { Concept, DependencyEdge, RelationshipType } from '@/lib/types';
import { mockConcepts, mockEdges } from '@/lib/mock-data';

const EDGE_COLORS: Record<RelationshipType, string> = {
  prerequisite: '#0d9488',
  'builds-on': '#16a34a',
  related: '#94a3b8',
  'example-of': '#f59e0b',
};

const EDGE_LABELS: Record<RelationshipType, string> = {
  prerequisite: 'Prerequisite',
  'builds-on': 'Builds On',
  related: 'Related',
  'example-of': 'Example Of',
};

interface GraphStepProps {
  sourceText: string;
  onComplete: (concepts: Concept[], edges: DependencyEdge[]) => void;
}

export function GraphStep({ sourceText, onComplete }: GraphStepProps) {
  const [loading, setLoading] = useState(true);
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [edges, setEdges] = useState<DependencyEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Concept | null>(null);
  const [nodeEvidence, setNodeEvidence] = useState<DependencyEdge[]>([]);
  const [usedFallback, setUsedFallback] = useState(false);
  const { toast } = useToast();

  const runExtraction = useCallback(async () => {
    setLoading(true);
    try {
      const conceptRes = await fetch('/api/extract-concepts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceText }),
      });
      const conceptData = await conceptRes.json();
      if (!conceptRes.ok) throw new Error(conceptData.error);

      const depRes = await fetch('/api/detect-dependencies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concepts: conceptData.concepts, sourceText }),
      });
      const depData = await depRes.json();
      if (!depRes.ok) throw new Error(depData.error);

      setConcepts(conceptData.concepts);
      setEdges(depData.edges);
      toast({
        title: 'Analysis complete',
        description: `${conceptData.concepts.length} concepts and ${depData.edges.length} relationships found.`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to analyze text';
      console.warn('[GraphStep] Falling back to mock data:', message);
      setConcepts(mockConcepts);
      setEdges(mockEdges);
      setUsedFallback(true);
      toast({
        title: 'Using sample data',
        description: 'AI analysis unavailable — showing demo concepts instead.',
      });
    } finally {
      setLoading(false);
    }
  }, [sourceText, toast]);

  useEffect(() => {
    runExtraction();
  }, [runExtraction]);

  const handleNodeClick: NodeMouseHandler = useCallback((_, node) => {
    const concept = concepts.find((c) => c.id === node.id);
    if (concept) {
      setSelectedNode(concept);
      const related = edges.filter((e) => e.source === concept.id || e.target === concept.id);
      setNodeEvidence(related);
    }
  }, [concepts, edges]);

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="text-center mb-6">
          <Skeleton className="h-8 w-64 mx-auto mb-2" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="flex-1 h-[450px] rounded-xl" />
          <div className="w-72 space-y-4">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-40 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const nodes: Node[] = concepts.map((c, i) => {
    const cols = Math.ceil(Math.sqrt(concepts.length));
    const x = (i % cols) * 200;
    const y = Math.floor(i / cols) * 120;
    return {
      id: c.id,
      data: { label: c.name },
      position: { x: x + 50, y: y + 50 },
      style: {
        padding: '10px 16px',
        borderRadius: '8px',
        border: `2px solid ${selectedNode?.id === c.id ? '#0d9488' : '#cbd5e1'}`,
        background: selectedNode?.id === c.id ? '#ccfbf1' : '#fff',
        fontSize: '13px',
        fontWeight: 500,
      },
    };
  });

  const rfEdges: Edge[] = edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: `${e.confidence}%`,
    labelStyle: { fontSize: 10, fill: '#64748b' },
    style: { stroke: EDGE_COLORS[e.type], strokeWidth: 2 },
    animated: e.type === 'prerequisite',
    type: 'smoothstep',
  }));

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
          <Network className="w-6 h-6 text-primary" />
          Concept Dependency Graph
        </h2>
        <p className="text-muted-foreground">Click any node to see its relationships and evidence from the source.</p>
      </div>

      {usedFallback && (
        <div className="mb-4 flex items-center gap-2 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Showing demo data (AI was unavailable). Add an OpenAI API key for real analysis.</span>
        </div>
      )}

      <div className="flex gap-4">
        <div className="flex-1 h-[450px] rounded-xl border border-border overflow-hidden bg-white">
          <ReactFlow
            nodes={nodes}
            edges={rfEdges}
            onNodeClick={handleNodeClick}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.3}
            maxZoom={1.8}
          >
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#e2e8f0" />
            <Controls showInteractive={false} />
          </ReactFlow>
        </div>

        <div className="w-72 space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold text-sm mb-3">Legend</h3>
            <div className="space-y-2">
              {(Object.keys(EDGE_COLORS) as RelationshipType[]).map((type) => (
                <div key={type} className="flex items-center gap-2">
                  <div className="w-6 h-0.5 rounded" style={{ background: EDGE_COLORS[type] }} />
                  <span className="text-xs text-muted-foreground">{EDGE_LABELS[type]}</span>
                </div>
              ))}
            </div>
          </Card>

          {selectedNode ? (
            <Card className="p-4 animate-slide-up">
              <h3 className="font-semibold text-sm mb-1">{selectedNode.name}</h3>
              <p className="text-xs text-muted-foreground mb-3">{selectedNode.description}</p>
              {nodeEvidence.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold mb-2 text-foreground">Relationships ({nodeEvidence.length})</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {nodeEvidence.map((e) => {
                      const otherId = e.source === selectedNode.id ? e.target : e.source;
                      const other = concepts.find((c) => c.id === otherId);
                      const direction = e.source === selectedNode.id ? '\u2192' : '\u2190';
                      return (
                        <div key={e.id} className="text-xs">
                          <div className="flex items-center gap-1 mb-1">
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5"
                              style={{ borderColor: EDGE_COLORS[e.type], color: EDGE_COLORS[e.type] }}
                            >
                              {EDGE_LABELS[e.type]}
                            </Badge>
                            <span className="text-muted-foreground">
                              {direction} {other?.name || otherId}
                            </span>
                          </div>
                          {e.evidence && (
                            <p className="italic text-muted-foreground pl-2 border-l-2" style={{ borderColor: EDGE_COLORS[e.type] }}>
                              &ldquo;{e.evidence}&rdquo;
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </Card>
          ) : (
            <Card className="p-4">
              <p className="text-xs text-muted-foreground text-center">Select a node to view details.</p>
            </Card>
          )}
        </div>
      </div>

      <Button className="w-full mt-6" onClick={() => onComplete(concepts, edges)}>
        Continue to Diagnostic Quiz
      </Button>
    </div>
  );
}
