"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCommunityPosts,
  getCommunityPost,
  createCommunityPost,
  updateCommunityPost,
  deleteCommunityPost,
  likePost,
  getPostComments,
  createComment,
  type CreateCommunityPostDto,
  type UpdateCommunityPostDto,
} from "@/modules/community/community.service";

export function useCommunityPosts() {
  const query = useQuery({
    queryKey: ["community", "posts"],
    queryFn: getCommunityPosts,
  });

  // Listen for post updates
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleUpdate = () => query.refetch();
    window.addEventListener("communityPostsUpdated", handleUpdate);
    return () => window.removeEventListener("communityPostsUpdated", handleUpdate);
  }, [query]);

  return query;
}

export function useCommunityPost(id: string) {
  return useQuery({
    queryKey: ["community", "posts", id],
    queryFn: () => getCommunityPost(id),
    enabled: !!id,
  });
}

export function useCreateCommunityPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCommunityPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community", "posts"] });
      queryClient.refetchQueries({ queryKey: ["community", "posts"] });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('communityPostsUpdated'));
      }
    },
  });
}

export function useUpdateCommunityPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCommunityPostDto }) =>
      updateCommunityPost(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["community", "posts"] });
      queryClient.invalidateQueries({ queryKey: ["community", "posts", variables.id] });
      queryClient.refetchQueries({ queryKey: ["community", "posts"] });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('communityPostsUpdated'));
      }
    },
  });
}

export function useDeleteCommunityPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCommunityPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community", "posts"] });
      queryClient.refetchQueries({ queryKey: ["community", "posts"] });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('communityPostsUpdated'));
      }
    },
  });
}

export function useLikePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: likePost,
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ["community", "posts"] });
      queryClient.invalidateQueries({ queryKey: ["community", "posts", postId] });
      queryClient.refetchQueries({ queryKey: ["community", "posts"] });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('communityPostsUpdated'));
      }
    },
  });
}

export function usePostComments(postId: string) {
  const query = useQuery({
    queryKey: ["community", "posts", postId, "comments"],
    queryFn: () => getPostComments(postId),
    enabled: !!postId,
  });

  // Listen for comment updates
  useEffect(() => {
    if (typeof window === "undefined" || !postId) return;
    const handleUpdate = () => query.refetch();
    window.addEventListener("communityCommentsUpdated", handleUpdate);
    return () => window.removeEventListener("communityCommentsUpdated", handleUpdate);
  }, [query, postId]);

  return query;
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, content }: { postId: string; content: string }) =>
      createComment(postId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["community", "posts", variables.postId, "comments"],
      });
      queryClient.invalidateQueries({ queryKey: ["community", "posts", variables.postId] });
      queryClient.refetchQueries({
        queryKey: ["community", "posts", variables.postId, "comments"],
      });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('communityCommentsUpdated'));
        window.dispatchEvent(new CustomEvent('communityPostsUpdated'));
      }
    },
  });
}

