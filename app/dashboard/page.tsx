'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flame, CheckCircle, AlertTriangle, ArrowRight, Brain, BookOpen } from 'lucide-react';

export default function DashboardPage() {
  const [streak] = useState(3);

  const masteryData = [
    { concept: 'Dynamic Programming', status: 'weak', attempts: 4 },
    { concept: 'Recursion & Base Cases', status: 'mastered', attempts: 8 },
    { concept: 'Graph Traversals (BFS/DFS)', status: 'mastered', attempts: 6 },
    { concept: 'Topological Sort', status: 'weak', attempts: 3 },
  ];

  return (
    <div className="container max-w-5xl py-8 space-y-8 px-4">
      {/* Header Profile / Streak Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card border rounded-2xl p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Learning Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track your mastery levels, daily progress, and prerequisite blockers.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 px-4 py-2.5 rounded-xl">
          <Flame className="w-6 h-6 text-amber-500 fill-amber-500 animate-pulse" />
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold text-amber-500">Streak</div>
            <div className="text-lg font-extrabold text-foreground">{streak} Days</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Quick Stats */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Mastered Concepts</CardDescription>
            <CardTitle className="text-3xl font-extrabold text-emerald-600">2</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Solid retention across recent diagnostic tests.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Blockers</CardDescription>
            <CardTitle className="text-3xl font-extrabold text-amber-600">2</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Critical bottlenecks blocking target goals.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Next Milestone</CardDescription>
            <CardTitle className="text-xl font-bold">Topological Sort</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/learning-path">
              <Button size="sm" variant="outline" className="w-full gap-1.5 text-xs">
                Resume Path <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Concept Breakdown Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" /> Mastery Breakdown
          </CardTitle>
          <CardDescription>
            Evaluated directly from your uploaded materials and diagnostic quiz answers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {masteryData.map((item, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {item.status === 'mastered' ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  )}
                  <span className="font-medium text-sm">{item.concept}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    {item.attempts} questions answered
                  </span>
                  <Badge
                    variant={item.status === 'mastered' ? 'default' : 'secondary'}
                    className={
                      item.status === 'mastered'
                        ? 'bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-700 hover:bg-amber-500/20'
                    }
                  >
                    {item.status === 'mastered' ? 'Mastered' : 'Needs Practice'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}