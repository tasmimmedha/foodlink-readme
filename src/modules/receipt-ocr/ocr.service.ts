import { apiPost } from "@/lib/api-client";

export interface ReceiptUploadDto {
  file: File;
}

export interface ReceiptItem {
  name: string;
  quantity: number;
  unit?: string;
  price?: number;
  category?: string;
}

export interface ReceiptOCRResult {
  id: string;
  items: ReceiptItem[];
  total?: number;
  store?: string;
  date?: string;
  processedAt: string;
}

export async function uploadReceipt(data: ReceiptUploadDto): Promise<ReceiptOCRResult> {
  const formData = new FormData();
  formData.append("file", data.file);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/receipts/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload receipt");
  }

  const result = await response.json();
  return result.data;
}

export async function processReceipt(id: string): Promise<ReceiptOCRResult> {
  return apiPost<ReceiptOCRResult>(`/receipts/${id}/process`, {});
}

export async function getReceipt(id: string): Promise<ReceiptOCRResult> {
  return apiPost<ReceiptOCRResult>(`/receipts/${id}`, {});
}

