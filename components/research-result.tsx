"use client";

import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import { CheckCircle, RefreshCw, Clock, ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResearchResponse } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ResearchResultProps {
  result: ResearchResponse;
}

export default function ResearchResult({ result }: ResearchResultProps) {
  const [copied, setCopied] = useState(false);

  const getQualityColor = (score: number) => {
    if (score >= 80) return "bg-green-500/10 text-green-600 dark:text-green-400";
    if (score >= 60) return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
    return "bg-red-500/10 text-red-600 dark:text-red-400";
  };

  const getQualityLabel = (score: number) => {
    if (score >= 80) return "High Quality";
    if (score >= 60) return "Medium Quality";
    return "Low Quality";
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.answer);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-xl">Research Result</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={cn("gap-1", getQualityColor(result.quality_score))}>
              <CheckCircle className="h-3 w-3" />
              {result.quality_score}% - {getQualityLabel(result.quality_score)}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <RefreshCw className="h-3 w-3" />
              {result.iterations} iterations
            </Badge>
            {result.created_at && (
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                {format(new Date(result.created_at), "MMM d, yyyy HH:mm")}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6 space-y-6">
        {result.research_plan && (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Research Plan
            </h3>
            {typeof result.research_plan === 'string' ? (
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.research_plan}</p>
            ) : (
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {result.research_plan.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Answer
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="gap-1 h-8"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            <div className="prose prose-sm dark:prose-invert max-w-none wrap-break-word overflow-hidden">
              <ReactMarkdown>{result.answer}</ReactMarkdown>
            </div>
          </div>
        </div>

        {result.sources && result.sources.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Sources
            </h3>
            <div className="grid gap-2">
              {result.sources.map((source, index) => (
                <a
                  key={index}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 p-2 rounded-md hover:bg-muted transition-colors text-sm group"
                >
                  <ExternalLink className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground group-hover:text-primary" />
                  <div>
                    <p className="font-medium group-hover:text-primary">{source.title}</p>
                    {source.snippet && (
                      <p className="text-muted-foreground text-xs line-clamp-2">{source.snippet}</p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
