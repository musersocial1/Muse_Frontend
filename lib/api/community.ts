import { communityApiClient } from "./apiClient";

export const communityAPI = {
  getCoverImageUploadUrl: async (
    fileType: string,
    oldKey?: string
  ): Promise<{
    success: boolean;
    uploadURL: string;
    key: string;
    fileURL: string;
  }> => {
    const query = new URLSearchParams({ fileType });
    if (oldKey) query.append("oldKey", oldKey);

    const response = await communityApiClient.get(
      `/community/get-cover-image-upload-url?${query.toString()}`
    );

    return response.data;
  },

  createCommunity: async (data: {
    name: string;
    coverImage: { url: string; key: string };
    bio: string;
    links: string[];
    price: number;
    type: string;
    guideline: string;
    category: string;
  }): Promise<any> => {
    const response = await communityApiClient.post(
      "/community/create-community",
      data
    );
    return response.data;
  },

  getMyCommunity: async (): Promise<any> => {
    const response = await communityApiClient.get("/community/my-community");
    return response.data;
  },
};
