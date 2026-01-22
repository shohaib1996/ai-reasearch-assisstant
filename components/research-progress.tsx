"use client";

import { useEffect, useState } from "react";
import {
  Brain,
  Search,
  FileText,
  CheckCircle2,
  Loader2,
  Sparkles,
  ListChecks,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressStep {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  duration: number; // milliseconds
}

const RESEARCH_STEPS: ProgressStep[] = [
  {
    id: "planning",
    label: "Planning Research",
    description: "Analyzing your question and creating a research plan...",
    icon: Brain,
    duration: 3000,
  },
  {
    id: "generating",
    label: "Generating Sub-questions",
    description: "Breaking down your query into focused research questions...",
    icon: ListChecks,
    duration: 4000,
  },
  {
    id: "searching",
    label: "Searching Sources",
    description: "Searching across multiple sources for relevant information...",
    icon: Search,
    duration: 8000,
  },
  {
    id: "analyzing",
    label: "Analyzing Results",
    description: "Reading and extracting key insights from sources...",
    icon: FileText,
    duration: 6000,
  },
  {
    id: "synthesizing",
    label: "Synthesizing Answer",
    description: "Combining information into a comprehensive response...",
    icon: MessageSquare,
    duration: 5000,
  },
  {
    id: "refining",
    label: "Refining & Quality Check",
    description: "Improving answer quality and verifying accuracy...",
    icon: Sparkles,
    duration: 4000,
  },
];

interface ResearchProgressProps {
  isActive: boolean;
  onComplete?: () => void;
}

export default function ResearchProgress({ isActive }: ResearchProgressProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [elapsedTime, setElapsedTime] = useState(0);

  // Reset when starting new research
  useEffect(() => {
    if (isActive) {
      setCurrentStepIndex(0);
      setCompletedSteps(new Set());
      setElapsedTime(0);
    }
  }, [isActive]);

  // Progress through steps
  useEffect(() => {
    if (!isActive) return;

    const currentStep = RESEARCH_STEPS[currentStepIndex];
    if (!currentStep) return;

    const timer = setTimeout(() => {
      setCompletedSteps((prev) => new Set([...prev, currentStep.id]));

      if (currentStepIndex < RESEARCH_STEPS.length - 1) {
        setCurrentStepIndex((prev) => prev + 1);
      }
    }, currentStep.duration);

    return () => clearTimeout(timer);
  }, [isActive, currentStepIndex]);

  // Track elapsed time
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isActive) return null;

  return (
    <div className="w-full space-y-6">
      {/* Header with elapsed time */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="font-medium">Research in Progress</span>
        </div>
        <span className="text-sm text-muted-foreground font-mono">
          {formatTime(elapsedTime)}
        </span>
      </div>

      {/* Progress Steps */}
      <div className="space-y-3">
        {RESEARCH_STEPS.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = completedSteps.has(step.id);
          const isCurrent = index === currentStepIndex && !isCompleted;
          const isPending = index > currentStepIndex;

          return (
            <div
              key={step.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg transition-all duration-300",
                isCompleted && "bg-green-500/10",
                isCurrent && "bg-primary/10 border border-primary/20",
                isPending && "opacity-50"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full shrink-0 transition-colors",
                  isCompleted && "bg-green-500/20 text-green-600 dark:text-green-400",
                  isCurrent && "bg-primary/20 text-primary",
                  isPending && "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : isCurrent ? (
                  <Icon className="h-5 w-5 animate-pulse" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "font-medium text-sm",
                    isCompleted && "text-green-600 dark:text-green-400",
                    isCurrent && "text-primary",
                    isPending && "text-muted-foreground"
                  )}
                >
                  {step.label}
                </p>
                {(isCurrent || isCompleted) && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {isCompleted ? "Completed" : step.description}
                  </p>
                )}
              </div>
              {isCurrent && (
                <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      {/* Fun facts / tips while waiting */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground text-center">
          <span className="font-medium">Did you know?</span> Our AI agent searches multiple sources,
          cross-references information, and iterates to improve answer quality.
        </p>
      </div>
    </div>
  );
}
