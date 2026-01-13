import { db, Upload } from "./db";
import { generateId, getTimestamp, delay, fileToBase64, formatFileSize } from "./helpers";
import { getCurrentUser } from "./auth.server";

export interface UploadFileInput {
  file: File;
  associatedType?: "inventory" | "log" | "profile";
  associatedId?: string;
}

export interface UploadMetadata {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileSizeFormatted: string;
  associatedType?: "inventory" | "log" | "profile";
  associatedId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Upload a file
 */
export async function uploadFile(
  token: string,
  input: UploadFileInput
): Promise<UploadMetadata> {
  await delay(300);

  const currentUser = await getCurrentUser(token);
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  // Convert file to base64
  const base64Data = await fileToBase64(input.file);

  const now = getTimestamp();
  const upload: Upload = {
    id: generateId(),
    userId: currentUser.id,
    fileName: input.file.name,
    fileType: input.file.type,
    fileSize: input.file.size,
    data: base64Data,
    associatedType: input.associatedType,
    associatedId: input.associatedId,
    createdAt: now,
    updatedAt: now,
  };

  await db.uploads.add(upload);

  return {
    id: upload.id,
    fileName: upload.fileName,
    fileType: upload.fileType,
    fileSize: upload.fileSize,
    fileSizeFormatted: formatFileSize(upload.fileSize),
    associatedType: upload.associatedType,
    associatedId: upload.associatedId,
    createdAt: upload.createdAt,
    updatedAt: upload.updatedAt,
  };
}

/**
 * Get upload metadata by ID
 */
export async function getUploadMetadata(
  token: string,
  id: string
): Promise<UploadMetadata | null> {
  await delay(100);

  const currentUser = await getCurrentUser(token);
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  const upload = await db.uploads.get(id);
  if (!upload || upload.userId !== currentUser.id) {
    return null;
  }

  return {
    id: upload.id,
    fileName: upload.fileName,
    fileType: upload.fileType,
    fileSize: upload.fileSize,
    fileSizeFormatted: formatFileSize(upload.fileSize),
    associatedType: upload.associatedType,
    associatedId: upload.associatedId,
    createdAt: upload.createdAt,
    updatedAt: upload.updatedAt,
  };
}

/**
 * Get upload file data (base64)
 */
export async function getUploadData(
  token: string,
  id: string
): Promise<string | null> {
  await delay(100);

  const currentUser = await getCurrentUser(token);
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  const upload = await db.uploads.get(id);
  if (!upload || upload.userId !== currentUser.id) {
    return null;
  }

  return upload.data;
}

/**
 * Get upload URL (data URL for display)
 */
export async function getUploadUrl(
  token: string,
  id: string
): Promise<string | null> {
  await delay(100);

  const data = await getUploadData(token, id);
  if (!data) {
    return null;
  }

  const upload = await db.uploads.get(id);
  if (!upload) {
    return null;
  }

  return `data:${upload.fileType};base64,${data}`;
}

/**
 * Get all uploads for the current user
 */
export async function getUserUploads(
  token: string,
  associatedType?: "inventory" | "log" | "profile"
): Promise<UploadMetadata[]> {
  await delay(150);

  const currentUser = await getCurrentUser(token);
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  let uploads = await db.uploads.where("userId").equals(currentUser.id).toArray();

  if (associatedType) {
    uploads = uploads.filter((upload) => upload.associatedType === associatedType);
  }

  return uploads.map((upload) => ({
    id: upload.id,
    fileName: upload.fileName,
    fileType: upload.fileType,
    fileSize: upload.fileSize,
    fileSizeFormatted: formatFileSize(upload.fileSize),
    associatedType: upload.associatedType,
    associatedId: upload.associatedId,
    createdAt: upload.createdAt,
    updatedAt: upload.updatedAt,
  }));
}

/**
 * Get uploads associated with a specific item
 */
export async function getAssociatedUploads(
  token: string,
  associatedType: "inventory" | "log" | "profile",
  associatedId: string
): Promise<UploadMetadata[]> {
  await delay(100);

  const currentUser = await getCurrentUser(token);
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  const allUploads = await db.uploads.where("userId").equals(currentUser.id).toArray();
  const uploads = allUploads.filter(
    (upload) => upload.associatedType === associatedType && upload.associatedId === associatedId
  );

  return uploads.map((upload) => ({
    id: upload.id,
    fileName: upload.fileName,
    fileType: upload.fileType,
    fileSize: upload.fileSize,
    fileSizeFormatted: formatFileSize(upload.fileSize),
    associatedType: upload.associatedType,
    associatedId: upload.associatedId,
    createdAt: upload.createdAt,
    updatedAt: upload.updatedAt,
  }));
}

/**
 * Delete an upload
 */
export async function deleteUpload(token: string, id: string): Promise<void> {
  await delay(150);

  const currentUser = await getCurrentUser(token);
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  const upload = await db.uploads.get(id);
  if (!upload || upload.userId !== currentUser.id) {
    throw new Error("Upload not found");
  }

  await db.uploads.delete(id);
}

/**
 * Update upload association
 */
export async function updateUploadAssociation(
  token: string,
  id: string,
  associatedType: "inventory" | "log" | "profile",
  associatedId: string
): Promise<UploadMetadata> {
  await delay(200);

  const currentUser = await getCurrentUser(token);
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  const upload = await db.uploads.get(id);
  if (!upload || upload.userId !== currentUser.id) {
    throw new Error("Upload not found");
  }

  await db.uploads.update(id, {
    associatedType,
    associatedId,
    updatedAt: getTimestamp(),
  });

  const updatedUpload = await db.uploads.get(id);
  if (!updatedUpload) {
    throw new Error("Upload not found");
  }

  return {
    id: updatedUpload.id,
    fileName: updatedUpload.fileName,
    fileType: updatedUpload.fileType,
    fileSize: updatedUpload.fileSize,
    fileSizeFormatted: formatFileSize(updatedUpload.fileSize),
    associatedType: updatedUpload.associatedType,
    associatedId: updatedUpload.associatedId,
    createdAt: updatedUpload.createdAt,
    updatedAt: updatedUpload.updatedAt,
  };
}

