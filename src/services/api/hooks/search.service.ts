import { axiosClient } from "../axios.client";


// Helper function to handle empty queries
const validateQuery = (query: string): boolean => {
  return !!(query && query.trim().length >= 2);
};

export const searchService = {
    searchArtists : async (query: string) => {
        if (!validateQuery(query)) return [];
        try {
            const response = await axiosClient.post("/search", {
                query: query,
            });
            return response.data;
        } catch (error) {
            console.error("Search artists error:", error);
            throw error;
        }
    },
    searchSongs : async (query: string) => {
        if (!validateQuery(query)) return [];
        try {
            const response = await axiosClient.get("/search/track", {
                params: {
                    q: query,
                    limit: 50,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Search songs error:", error);
            throw error;
        }
    },
    searchAlbums : async (query: string) => {
        if (!validateQuery(query)) return [];
        try {
            const response = await axiosClient.get("/search/album", {
                params: {
                    q: query,
                    limit: 50,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Search albums error:", error);
            throw error;
        }
    },
    searchPlaylists : async (query: string) => {
        if (!validateQuery(query)) return [];
        try {
            const response = await axiosClient.get("/search/playlist", {
                params: {
                    q: query,
                    limit: 50,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Search playlists error:", error);
            throw error;
        }
    },
    searchPodcasts : async (query: string) => {
        if (!validateQuery(query)) return [];
        try {
            const response = await axiosClient.get("/search/podcast", {
                params: {
                    q: query,
                    limit: 50,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Search podcasts error:", error);
            throw error;
        }
    }
}