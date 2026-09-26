'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  UploadCloud,
  BookOpen,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertOctagon,
  History,
  Trash2,
  Sparkles,
  Network,
  User,
  X,
  FileText,
  Loader2,
  Compass,
  Cpu,
  Flame
} from 'lucide-react';
import { PRESET_COURSES, PresetCourse } from '@/lib/preset-courses';
import { getStudentProgress } from '@/lib/course-progress';

interface HistoryItem {
  id: string;
  courseName: string;
  date: string;
  totalNodes: number;
  gapCount: number;
  masteredCount: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTab, setModalTab] = useState<'presets' | 'upload'>('presets');

  // Load persistent history from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('assessment_history_v1');
      if (raw) {
        setHistory(JSON.parse(raw));
      }
    } catch (e) {
      console.error('Failed to parse history:', e);
    }
  }, []);

  const handleSelectPreset = (course: PresetCourse) => {
    const newId = `hist_${course.id}_${Date.now()}`;
    
    // Seed localStorage for this course
    localStorage.setItem('active_assessment_text', course.initialDocumentText);
    localStorage.setItem('active_assessment_name', course.title);
    localStorage.setItem('active_assessment_id', newId);

    // Initialize course progress record
    getStudentProgress(course.id, course.title);

    setIsModalOpen(false);
    // Route student straight to their learning curriculum workspace
    router.push(`/course/${course.id}`);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      let extractedText = '';

      if (
        file.type.includes('text') ||
        file.name.endsWith('.txt') ||
        file.name.endsWith('.md') ||
        file.name.endsWith('.json')
      ) {
        extractedText = await file.text();
      } else {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/extract-text', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          extractedText = data.text || '';
        }

        if (!extractedText || extractedText.trim().length < 50) {
          const buffer = await file.arrayBuffer();
          const bytes = new Uint8Array(buffer);
          let rawString = '';
          for (let i = 0; i < Math.min(bytes.length, 50000); i++) {
            const ch = bytes[i];
            if ((ch >= 32 && ch <= 126) || ch === 10 || ch === 13) {
              rawString += String.fromCharCode(ch);
            }
          }
          const words = rawString.match(/[a-zA-Z]{4,}/g) || [];
          extractedText = words.slice(0, 1000).join(' ');
        }
      }

      const newId = `hist_${Date.now()}`;
      localStorage.setItem('active_assessment_text', extractedText);
      localStorage.setItem('active_assessment_name', file.name);
      localStorage.setItem('active_assessment_id', newId);

      setIsModalOpen(false);
      router.push(`/learning-path?id=${newId}&action=new`);
    } catch (err) {
      console.error(err);
      alert('Upload failed. Check console.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm('Clear all previous assessment history?')) {
      localStorage.removeItem('assessment_history_v1');
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen relative bg-[#050505] text-[#f4f4f5] p-6 sm:p-10 overflow-x-hidden selection:bg-yellow-400 selection:text-black">
      {/* Ambient Amber Top Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[450px] pointer-events-none z-0 blur-3xl"
        style={{
          background: 'radial-gradient(rgba(250, 204, 21, 0.14) 0%, rgba(202, 138, 4, 0.04) 50%, transparent 80%)',
          mixBlendMode: 'screen',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        
        {/* Top Banner Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_8px_#facc15]" />
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400 font-medium">
                Cognitive Mastery Engine // v4.2
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
              Adaptive Learning <span className="text-yellow-400">Dashboard</span>
            </h1>
            <p className="text-sm text-neutral-400 mt-1 max-w-xl font-light">
              Choose from standardized curriculum tracks or upload customized lecture notes to derive topological prerequisite roadmaps.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/profile">
              <Button
                variant="outline"
                size="sm"
                data-cursor="USER"
                className="gap-1.5 text-xs rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all shadow-sm"
              >
                <User className="w-3.5 h-3.5 text-yellow-400" /> Profile
              </Button>
            </Link>
            <Button
              onClick={() => {
                setModalTab('presets');
                setIsModalOpen(true);
              }}
              data-cursor="COURSES"
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs gap-2 rounded-full px-5 shadow-[0_0_18px_rgba(250,204,21,0.35)] transition-all"
            >
              <Compass className="w-4 h-4 stroke-[2.5]" /> Analyze New Course
            </Button>
          </div>
        </div>

        {/* Quick Launch Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            data-cursor="TRACKS"
            className="group relative bg-[#0e0e11]/90 backdrop-blur-xl border border-white/10 hover:border-yellow-400/60 p-6 sm:p-7 rounded-3xl transition-all duration-300 shadow-2xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.2)] group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white group-hover:text-yellow-300 transition-colors font-sans">
                  Curated Concept Tracks
                </h3>
                <span className="text-[10px] font-mono uppercase tracking-wider text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/30">
                  5 Available
                </span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                Explore standardized industry tracks in Machine Learning, Python, Data Science, Next.js, and Cloud Infrastructure with sequential prerequisite gates.
              </p>
            </div>

            <div className="pt-6 mt-4 border-t border-white/10">
              <Button
                onClick={() => {
                  setModalTab('presets');
                  setIsModalOpen(true);
                }}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs rounded-xl py-5 shadow-[0_0_15px_rgba(250,204,21,0.25)] transition-all flex items-center justify-center gap-2"
              >
                <span>Browse Recommended Courses</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Button>
            </div>
          </div>

          <div
            data-cursor="UPLOAD"
            className="group relative bg-[#0e0e11]/90 backdrop-blur-xl border border-white/10 hover:border-yellow-400/60 p-6 sm:p-7 rounded-3xl transition-all duration-300 shadow-2xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.2)] group-hover:scale-105 transition-transform">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white group-hover:text-yellow-300 transition-colors font-sans">
                  Upload Custom Syllabus
                </h3>
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                  Custom
                </span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                Drop your own college lecture slides, textbook chapter, or PDF syllabus to extract concepts and compute instant prerequisite dependencies.
              </p>
            </div>

            <div className="pt-6 mt-4 border-t border-white/10">
              <Button
                onClick={() => {
                  setModalTab('upload');
                  setIsModalOpen(true);
                }}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs rounded-xl py-5 transition-all"
              >
                Upload Syllabus or PDF
              </Button>
            </div>
          </div>
        </div>

        {/* History List Section */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <Network className="w-4 h-4 text-yellow-400" />
              <h2 className="text-lg font-bold text-white tracking-tight font-sans">
                Assessment & Learning Path History
              </h2>
            </div>
            {history.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearHistory}
                data-cursor="TRASH"
                className="text-xs text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear History
              </Button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="p-10 border border-white/10 rounded-3xl bg-[#0e0e11]/60 backdrop-blur-xl text-center space-y-3">
              <BookOpen className="w-10 h-10 text-neutral-600 mx-auto" />
              <p className="text-sm font-semibold text-neutral-300">No Previous Assessments Found</p>
              <p className="text-xs text-neutral-500 max-w-md mx-auto leading-relaxed">
                When you complete an assessment, your diagnostic results, isolated knowledge gaps, and prerequisite dependency graph will be saved here automatically.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {history.map((item) => (
                <div
                  key={item.id}
                  data-cursor="GRAPH"
                  className="group bg-[#0e0e11]/90 backdrop-blur-xl border border-white/10 hover:border-yellow-400/60 p-5 rounded-2xl transition-all duration-300 shadow-xl flex flex-col justify-between space-y-4 hover:-translate-y-1 cursor-pointer"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-base font-bold text-white group-hover:text-yellow-300 transition-colors truncate" title={item.courseName}>
                        {item.courseName}
                      </h4>
                      <span className="text-[10px] text-neutral-400 whitespace-nowrap flex items-center gap-1 font-mono bg-white/5 px-2 py-0.5 rounded border border-white/10">
                        <Clock className="w-3 h-3 text-yellow-400" /> {item.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {item.masteredCount} Mastered
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-rose-400 font-medium">
                        <AlertOctagon className="w-3.5 h-3.5" /> {item.gapCount} Gap{item.gapCount === 1 ? '' : 's'}
                      </span>
                    </div>
                  </div>

                  <Link href={`/learning-path?id=${item.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 border-white/10 bg-white/5 hover:border-yellow-400 hover:bg-yellow-400 hover:text-black text-white text-xs rounded-xl py-4 transition-all"
                    >
                      <Network className="w-3.5 h-3.5" />
                      <span>View Prerequisite Graph</span>
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal: 5 Curated Course Tracks & Document Upload */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
            <div className="bg-[#0e0e11] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl space-y-6 relative my-8 max-h-[90vh] flex flex-col">
              
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-white/10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <h3 className="text-xl font-extrabold text-white tracking-tight font-sans">
                      Select or Analyze Course
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-400 font-light">
                    Pick one of 5 standardized tracks or ingest custom study notes.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-neutral-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tab Selector */}
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <button
                  type="button"
                  onClick={() => setModalTab('presets')}
                  className={`text-xs font-mono uppercase tracking-wider px-4 py-1.5 rounded-full transition-all ${
                    modalTab === 'presets'
                      ? 'bg-yellow-400 text-black font-bold shadow-[0_0_12px_rgba(250,204,21,0.3)]'
                      : 'text-neutral-400 hover:text-white bg-white/5'
                  }`}
                >
                  Recommended Tracks (5)
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab('upload')}
                  className={`text-xs font-mono uppercase tracking-wider px-4 py-1.5 rounded-full transition-all ${
                    modalTab === 'upload'
                      ? 'bg-yellow-400 text-black font-bold shadow-[0_0_12px_rgba(250,204,21,0.3)]'
                      : 'text-neutral-400 hover:text-white bg-white/5'
                  }`}
                >
                  Custom File Upload
                </button>
              </div>

              {/* Tab 1: 5 Curated Courses */}
              {modalTab === 'presets' && (
                <div className="overflow-y-auto space-y-3.5 pr-1 flex-1">
                  {PRESET_COURSES.map((course) => (
                    <div
                      key={course.id}
                      onClick={() => handleSelectPreset(course)}
                      className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-yellow-400/60 hover:bg-yellow-400/[0.04] transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/30">
                            {course.badge}
                          </span>
                          <span className="text-[11px] font-mono text-neutral-400">
                            {course.category} • {course.estimatedHours}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white group-hover:text-yellow-300 transition-colors font-sans">
                          {course.title}
                        </h4>
                        <p className="text-xs text-neutral-400 font-light leading-relaxed">
                          {course.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {course.topics.map((t, idx) => (
                            <span key={idx} className="text-[10px] font-mono text-neutral-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center justify-end">
                        <span className="px-4 py-2 rounded-xl bg-white/5 group-hover:bg-yellow-400 group-hover:text-black text-white text-xs font-bold transition-all flex items-center gap-1.5">
                          <span>Start Track</span>
                          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 2: Custom Document Upload */}
              {modalTab === 'upload' && (
                <div className="space-y-4 flex-1">
                  <label className="border-2 border-dashed border-white/15 hover:border-yellow-400/80 bg-white/[0.02] hover:bg-yellow-400/[0.03] rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 mb-3 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(250,204,21,0.2)]">
                      {isUploading ? (
                        <Loader2 className="w-6 h-6 animate-spin text-yellow-400" />
                      ) : (
                        <UploadCloud className="w-6 h-6 stroke-[2]" />
                      )}
                    </div>
                    <span className="text-sm font-semibold text-white group-hover:text-yellow-300 transition-colors">
                      {isUploading ? 'Extracting concepts & building graph...' : 'Choose or drop syllabus file'}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-500 uppercase mt-1">
                      PDF, DOCX, TXT, MD (Max 10MB)
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.docx,.txt,.md"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                  </label>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}