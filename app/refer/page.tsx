'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Share2, Copy, Check, Users, Gift, Sparkles } from 'lucide-react';

export default function ReferPage() {
  const [copied, setCopied] = useState(false);
  const referralLink = 'https://learn-from-basics-ai.vercel.app/?ref=LEARN_BASICS';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container max-w-3xl py-12 px-4 space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-2">
          <Gift className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Refer Friends & Learn Together</h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Share your referral link with classmates. Unlock unlimited Gemini-powered concept extraction and diagnostic quizzes.
        </p>
      </div>

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Share2 className="w-4 h-4 text-primary" /> Your Personal Invite Link
          </CardTitle>
          <CardDescription>Anyone who signs up using this link joins your study network.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input readOnly value={referralLink} className="font-mono text-xs bg-muted/50" />
            <Button onClick={copyToClipboard} variant="outline" className="gap-1.5 shrink-0 text-xs">
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex gap-4 p-5 rounded-xl border bg-card/60">
          <Users className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold text-sm">Collaborative Dependency Graphs</div>
            <div className="text-xs text-muted-foreground">
              Compare knowledge maps with peers to find common gaps and study more effectively.
            </div>
          </div>
        </div>

        <div className="flex gap-4 p-5 rounded-xl border bg-card/60">
          <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold text-sm">Priority LLM Generation</div>
            <div className="text-xs text-muted-foreground">
              Higher rate limits on deep syllabus extraction and automated quiz generation.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}