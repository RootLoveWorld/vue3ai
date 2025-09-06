// Shared types for document preview components
export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  content?: string | ArrayBuffer | null;
  previewUrl?: string;
}

export interface DocumentPreviewProps {
  document: Document;
}