"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useResearchStore } from "@/store/research-store";
import { performResearch } from "@/lib/api-functions";
import { toast } from "sonner";

export default function ResearchForm() {
  const [query, setQuery] = useState("");
  const { isLoading, startResearch, setResult, setError } = useResearchStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      toast.error("Please enter a research question");
      return;
    }

    startResearch();

    try {
      const result = await performResearch(query.trim());
      setResult(result);
      toast.success("Research completed successfully!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Research failed";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Enter your research question... (e.g., 'What are the latest advancements in quantum computing?')"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isLoading}
              className="min-h-[120px] resize-none text-base"
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoading || !query.trim()}
              size="lg"
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Researching...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Research
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
