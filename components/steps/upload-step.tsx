'use client';

import { useState, useRef, useCallback } from 'react';
import {
  Upload,
  FileText,
  AlertCircle,
  Loader2,
  Sparkles,
  BookOpen,
  FileType,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface UploadStepProps {
  onComplete: (text: string) => void;
}

const SAMPLE_TEXT = `Decision trees are predictive models in machine learning used for classification and regression tasks. 
They operate by recursively splitting the data space based on feature values that maximize information gain or minimize impurity. 
A key concept underlying decision tree learning is entropy, a mathematical measure of uncertainty or impurity from information theory. 
Calculating entropy requires understanding probability theory and probability distributions over discrete outcomes. 
When selecting the best split attribute at each internal node, decision tree algorithms evaluate information gain, which represents the expected reduction in entropy achieved by partitioning the dataset according to that specific attribute. 
Once constructed, decision trees often undergo a process called pruning. Pruning removes subtrees that provide little predictive power on unseen data, effectively mitigating the risk of overfitting and enhancing the model's generalization capabilities.`;

const ACCEPTED_EXTENSIONS = ['.pdf', '.docx', '.doc', '.pptx', '.ppt', '.txt'];

export function UploadStep({ onComplete }: UploadStepProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState<string>('');
  const [ocrProgress, setOcrProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const runClientOcr = async (file: File): Promise<string> => {
    setLoadingStatus('Initializing client-side OCR engine...');
    setOcrProgress(5);

    const { createWorker } = await import('tesseract.js');
    const worker = await createWorker('eng');

    setLoadingStatus('Scanning file contents with OCR...');
    const ret = await worker.recognize(file);
    setOcrProgress(100);

    await worker.terminate();
    return ret.data.text;
  };

  const processFile = async (file: File) => {
    setError(null);
    setWarningMessage(null);
    setIsLoading(true);
    setLoadingStatus('Extracting content from document...');

    const fileName = file.name.toLowerCase();
    const isValidFormat = ACCEPTED_EXTENSIONS.some((ext) => fileName.endsWith(ext));

    if (!isValidFormat) {
      setError('Unsupported file type. Please upload a PDF, DOCX, DOC, PPTX, PPT, or TXT file.');
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/extract-text', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to extract text from file.');
      }

      if (data.needsOcr) {
        setWarningMessage(data.message || 'Scanned PDF detected. Running client-side OCR...');
        const ocrText = await runClientOcr(file);

        if (!ocrText || ocrText.trim().length < 50) {
          throw new Error('OCR could not extract sufficient legible text. Please upload another file.');
        }

        onComplete(ocrText.trim());
        return;
      }

      if (!data.text || data.text.trim().length < 50) {
        throw new Error('Document contained insufficient text to analyze. Please try another document.');
      }

      onComplete(data.text);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while processing the file.');
    } finally {
      setIsLoading(false);
      setLoadingStatus('');
      setOcrProgress(0);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleUseSample = () => {
    setIsLoading(true);
    setLoadingStatus('Loading sample curriculum...');
    setTimeout(() => {
      onComplete(SAMPLE_TEXT);
    }, 400);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Upload Course Material
        </h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Upload your lecture notes, textbook chapters, or presentation slides. The AI will extract
          prerequisite dependencies, generate concept graphs, and construct your personalized study path.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">Processing Error</p>
            <p className="text-xs opacity-90 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {warningMessage && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">OCR Extraction Notice</p>
            <p className="text-xs opacity-90 mt-0.5">{warningMessage}</p>
          </div>
        </div>
      )}

      <Card className="border-border/60 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isLoading && fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center p-12 text-center cursor-pointer transition-colors border-2 border-dashed m-4 rounded-2xl ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-muted hover:border-primary/50 hover:bg-muted/20'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc,.pptx,.ppt,.txt"
              onChange={handleFileChange}
              className="hidden"
              disabled={isLoading}
            />

            {isLoading ? (
              <div className="space-y-4 max-w-xs">
                <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">{loadingStatus}</p>
                  {ocrProgress > 0 && (
                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all duration-300"
                        style={{ width: `${ocrProgress}%` }}
                      />
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">This may take a few moments...</p>
                </div>
              </div>
            ) : (
              <>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 shadow-inner">
                  <Upload className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-foreground mb-1 text-base">
                  Choose a file or drag and drop here
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Supports PDF, Word (.docx, .doc), PowerPoint (.pptx, .ppt), or TXT
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
                    <FileType className="w-3 h-3" /> PDF
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
                    <FileText className="w-3 h-3" /> DOCX / DOC
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
                    <FileType className="w-3 h-3" /> PPTX / PPT
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
                    <FileText className="w-3 h-3" /> TXT
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="bg-muted/30 p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-foreground">
                Don't have course notes handy?
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleUseSample}
              disabled={isLoading}
              className="text-xs"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-primary" />
              Use Sample: Machine Learning Decision Trees
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}