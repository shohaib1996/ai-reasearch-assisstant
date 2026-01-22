"use client";

import { format } from "date-fns";
import { CheckCircle, RefreshCw, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Session } from "@/types";
import { cn } from "@/lib/utils";

interface SessionCardProps {
  session: Session;
  onClick?: () => void;
}

export default function SessionCard({ session, onClick }: SessionCardProps) {
  const getQualityColor = (score: number) => {
    if (score >= 80) return "bg-green-500/10 text-green-600 dark:text-green-400";
    if (score >= 60) return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
    return "bg-red-500/10 text-red-600 dark:text-red-400";
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <Card
      className={cn(
        "transition-all duration-200",
        onClick && "cursor-pointer hover:shadow-md hover:border-primary/50"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium line-clamp-2">
          {session.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {truncateText(session.answer || '', 150)}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={cn("gap-1 text-xs", getQualityColor(session.quality_score))}>
            <CheckCircle className="h-3 w-3" />
            {session.quality_score}%
          </Badge>
          <Badge variant="outline" className="gap-1 text-xs">
            <RefreshCw className="h-3 w-3" />
            {session.iterations}
          </Badge>
          <Badge variant="outline" className="gap-1 text-xs">
            <Clock className="h-3 w-3" />
            {format(new Date(session.created_at), "MMM d, HH:mm")}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
