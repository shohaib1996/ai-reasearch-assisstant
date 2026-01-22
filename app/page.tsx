"use client";

import { useEffect, useRef } from "react";
import { Brain, Sparkles, Zap, Shield } from "lucide-react";
import ResearchForm from "@/components/research-form";
import ResearchResult from "@/components/research-result";
import ResearchProgress from "@/components/research-progress";
import { Card, CardContent } from "@/components/ui/card";
import { useResearchStore } from "@/store/research-store";

export default function Home() {
  const { isLoading, result, error } = useResearchStore();
  const resultSectionRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to result section when loading starts or result arrives
  useEffect(() => {
    if (isLoading || result) {
      resultSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }, [isLoading, result]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Hero Section */}
      <div className="text-center mb-8 space-y-4">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-primary/10">
            <Brain className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          AI-Powered Research Assistant
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get comprehensive, well-researched answers to your questions.
          Our AI agent searches, analyzes, and synthesizes information for you.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
          <Sparkles className="h-5 w-5 text-primary shrink-0" />
          <div>
            <p className="font-medium text-sm">Intelligent Research</p>
            <p className="text-xs text-muted-foreground">Multi-iteration deep analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
          <Zap className="h-5 w-5 text-primary shrink-0" />
          <div>
            <p className="font-medium text-sm">Quality Scoring</p>
            <p className="text-xs text-muted-foreground">Confidence-rated answers</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
          <Shield className="h-5 w-5 text-primary shrink-0" />
          <div>
            <p className="font-medium text-sm">Source Verified</p>
            <p className="text-xs text-muted-foreground">Cited and referenced</p>
          </div>
        </div>
      </div>

      {/* Research Form */}
      <div className="mb-8">
        <ResearchForm />
      </div>

      {/* Result Section - scroll target */}
      <div ref={resultSectionRef} className="scroll-mt-4">
        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 rounded-lg bg-destructive/10 text-destructive text-center">
            {error}
          </div>
        )}

        {/* Loading State with Progress */}
        {isLoading && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <ResearchProgress isActive={isLoading} />
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {result && !isLoading && (
          <div className="mb-8">
            <ResearchResult result={result} />
          </div>
        )}
      </div>
    </div>
  );
}
