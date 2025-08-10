import { discoverApiClient } from "./apiClient";

export const discoverAPI = {
  search: async (
    q: string,
    size: number = 10,
    from: number = 0
  ): Promise<{ results: any[]; total: number }> => {
    const response = await discoverApiClient.get("/discover/search", {
      params: { q, size, from },
    });
    return response.data;
  },

  getFeed: async (
    size: number = 10,
    from: number = 0
  ): Promise<{ results: any[]; total: number }> => {
    const response = await discoverApiClient.get("/discover/feed", {
      params: { size, from },
    });
    return response.data;
  },
};
