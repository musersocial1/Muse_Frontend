import { aiApiClient } from "./apiClient";

export const aiAPI = {
  getAiUploadUrl: async (
    fileType: string,
    mediaType: "image" | "audio" | "video" | "file" = "image"
  ): Promise<{
    success: boolean;
    uploadURL: string;
    key: string;
    fileURL: string;
  }> => {
    const query = new URLSearchParams({ fileType, mediaType });
    const response = await aiApiClient.get(
      `/ai/get-ai-upload-url?${query.toString()}`
    );
    return response.data;
  },

  sendChatMessage: async (data: {
    conversationId?: string;
    message?: string;
    type: "text" | "audio" | "image" | "video" | "file";
    audio?: { url: string; key?: string };
    image?: { url: string; key?: string };
    video?: { url: string; key?: string };
    file?: { url: string; key?: string };
  }): Promise<{
    success: boolean;
    conversationId: string;
    messages: any[];
    aiMessage?: any;
  }> => {
    const response = await aiApiClient.post("/ai/chat", data);
    return response.data;
  },
};
