"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { formatDate } from "@/lib/helpers";
import { cn } from "@/lib/helpers";

interface CommunityPostCardProps {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  tags?: string[];
  likes?: number;
  comments?: number;
  onLike?: (id: string) => void;
  onComment?: (id: string) => void;
  onShare?: (id: string) => void;
  className?: string;
}

export function CommunityPostCard({
  id,
  title,
  content,
  author,
  createdAt,
  tags,
  likes = 0,
  comments = 0,
  onLike,
  onComment,
  onShare,
  className,
}: CommunityPostCardProps) {
  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">
              by {author} • {formatDate(createdAt)}
            </p>
          </div>
        </div>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4 line-clamp-3">{content}</p>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLike?.(id)}
            className="gap-2"
          >
            <Heart className="h-4 w-4" />
            {likes}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onComment?.(id)}
            className="gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            {comments}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShare?.(id)}
            className="gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

