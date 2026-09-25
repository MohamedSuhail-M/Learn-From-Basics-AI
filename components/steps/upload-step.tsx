'use client';

import { useCallback, useState } from 'react';
import { UploadCloud, FileText, Loader2, Sparkles, ScanLine, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { SAMPLE_MATERIAL } from '@/lib/sample-material';

interface UploadStepProps {
  onComplete: (text: string, fileName: string) => void;
}

export function UploadStep({ onComplete }: UploadStepProps) {
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [preview, setPreview] = useState<{ text: string; fileName: string } | null>(null);
  const { toast } = useToast();

  const runOcr = useCallback(async (file: File): Promise<string> => {
    setOcrLoading(true);
    setOcrProgress(0);
    try {
      const Tesseract = (await import('tesseract.js')).default;
      const result = await Tesseract.recognize(file, 'eng', {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === 'recognizing text') {
            setOcrProgress(Math.round(m.progress * 100));
          }
        },
      });
      return result.data.text;
    } finally {
      setOcrLoading(false);
      setOcrProgress(0);
    }
  }, []);

  const handleFile = useCallback(async (file: File) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/extract-text', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to extract text');
      }

      if (data.needsOcr) {
        toast({
          title: 'No text found in PDF',
          description: 'This looks like a scanned document. Running OCR to extract text from images...',
        });
        setLoading(false);
        const ocrText = await runOcr(file);
        if (!ocrText || ocrText.trim().length < 50) {
          toast({
            title: 'OCR found too little text',
            description: 'Try a different file or use the sample material.',
            variant: 'destructive',
          });
          return;
        }
        setPreview({ text: ocrText, fileName: file.name });
        toast({
          title: 'OCR extraction complete',
          description: `${ocrText.length} characters recovered via OCR.`,
        });
        return;
      }

      setPreview({ text: data.text, fileName: data.fileName });
      toast({ title: 'Text extracted successfully', description: `${data.text.length} characters from ${data.fileName}` });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process file';
      toast({ title: 'Extraction failed', description: message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast, runOcr]);

  const handleSample = useCallback(() => {
    setPreview({ text: SAMPLE_MATERIAL, fileName: 'sample-data-structures.txt' });
    toast({ title: 'Sample material loaded', description: 'Intro to Data Structures — ready to analyze.' });
  }, [toast]);

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Upload Course Material</h2>
        <p className="text-muted-foreground">Upload a PDF or TXT file, or use our pre-loaded sample to see the full flow instantly.</p>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
          dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
        }`}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".pdf,.txt"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-muted-foreground">Extracting text...</p>
          </div>
        ) : ocrLoading ? (
          <div className="flex flex-col items-center gap-3">
            <ScanLine className="w-10 h-10 text-primary animate-pulse" />
            <p className="text-muted-foreground font-medium">Running OCR on scanned PDF...</p>
            <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-300" style={{ width: `${ocrProgress}%` }} />
            </div>
            <p className="text-xs text-muted-foreground">{ocrProgress}%</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <UploadCloud className="w-10 h-10 text-primary" />
            <p className="font-medium text-foreground">Drop your file here or click to browse</p>
            <p className="text-sm text-muted-foreground">Supports PDF and TXT files</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-sm text-muted-foreground">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={handleSample}
        disabled={loading || ocrLoading}
      >
        <Sparkles className="w-4 h-4 mr-2" />
        Use Sample Material (Data Structures)
      </Button>

      {preview && (
        <Card className="mt-6 p-5 animate-slide-up">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">{preview.fileName}</span>
            <span className="text-xs text-muted-foreground ml-auto">{preview.text.length} chars</span>
          </div>
          <div className="max-h-40 overflow-y-auto text-sm text-muted-foreground bg-muted/50 rounded-lg p-3 leading-relaxed">
            {preview.text.slice(0, 800)}...
          </div>
          <Button className="w-full mt-4" onClick={() => onComplete(preview.text, preview.fileName)}>
            Analyze Concepts
          </Button>
        </Card>
      )}
    </div>
  );
}
