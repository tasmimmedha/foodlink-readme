import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/lib/api-client";

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  tags?: string[];
  likes: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommunityPostDto {
  title: string;
  content: string;
  tags?: string[];
}

export interface UpdateCommunityPostDto extends Partial<CreateCommunityPostDto> {}

export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
}

export async function getCommunityPosts(): Promise<CommunityPost[]> {
  return apiGet<CommunityPost[]>("/community/posts");
}

export async function getCommunityPost(id: string): Promise<CommunityPost> {
  return apiGet<CommunityPost>(`/community/posts/${id}`);
}

export async function createCommunityPost(data: CreateCommunityPostDto): Promise<CommunityPost> {
  return apiPost<CommunityPost, CreateCommunityPostDto>("/community/posts", data);
}

export async function updateCommunityPost(
  id: string,
  data: UpdateCommunityPostDto
): Promise<CommunityPost> {
  return apiPatch<CommunityPost, UpdateCommunityPostDto>(`/community/posts/${id}`, data);
}

export async function deleteCommunityPost(id: string): Promise<void> {
  return apiDelete<void>(`/community/posts/${id}`);
}

export async function likePost(id: string): Promise<void> {
  return apiPost<void>(`/community/posts/${id}/like`, {});
}

export async function getPostComments(id: string): Promise<Comment[]> {
  return apiGet<Comment[]>(`/community/posts/${id}/comments`);
}

export async function createComment(postId: string, content: string): Promise<Comment> {
  return apiPost<Comment>(`/community/posts/${postId}/comments`, { content });
}

