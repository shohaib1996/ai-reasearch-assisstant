"use client";

import { useEffect, useState } from "react";
import { History, Search, RefreshCw, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import SessionCard from "@/components/session-card";
import { useSessionStore } from "@/store/session-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ResearchResult from "@/components/research-result";
import { ResearchResponse } from "@/types";

export default function HistoryPage() {
  const { sessions, isLoading, error, fetchSessions, selectedSession, selectSession, clearSelection } = useSessionStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSessions(20);
  }, [fetchSessions]);

  const filteredSessions = sessions.filter((session) =>
    (session.question?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (session.answer?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const handleSessionClick = (sessionId: string) => {
    selectSession(sessionId);
  };

  const convertToResearchResponse = (session: typeof selectedSession): ResearchResponse | null => {
    if (!session) return null;
    return {
      answer: session.answer,
      quality_score: session.quality_score,
      iterations: session.iterations,
      research_plan: session.research_plan,
      sources: session.sources,
      session_id: session.session_id,
      created_at: session.created_at,
    };
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <History className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Research History</h1>
            <p className="text-muted-foreground">
              Browse your past research sessions
            </p>
          </div>
        </div>

        {/* Search and Refresh */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your research history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => fetchSessions(20)}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center gap-2 p-8 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !sessions.length && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3 p-4 border rounded-lg">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredSessions.length === 0 && (
        <div className="text-center py-16 space-y-4">
          <History className="h-12 w-12 mx-auto text-muted-foreground" />
          <h2 className="text-xl font-semibold">No research sessions found</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {searchQuery
              ? "No sessions match your search. Try a different query."
              : "Start researching to build your history."}
          </p>
        </div>
      )}

      {/* Sessions Grid */}
      {!isLoading && filteredSessions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSessions.map((session) => (
            <SessionCard
              key={session.session_id}
              session={session}
              onClick={() => handleSessionClick(session.session_id)}
            />
          ))}
        </div>
      )}

      {/* Session Detail Dialog */}
      <Dialog open={!!selectedSession} onOpenChange={() => clearSelection()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold line-clamp-2">
              {selectedSession?.question}
            </DialogTitle>
          </DialogHeader>
          {selectedSession && (
            <ResearchResult result={convertToResearchResponse(selectedSession)!} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
