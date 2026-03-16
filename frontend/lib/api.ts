import axios from "axios";
import {
  AuthResponse,
  Career,
  CompatibilityResult,
  Trial,
  TrialProgress,
  User
} from "./types";

const normalizeApiUrl = (rawUrl: string): string => {
  const cleanedUrl = rawUrl
    .trim()
    .replace(/^['"]+|['"]+$/g, "")
    .replace(/\/+$/, "");

  if (!cleanedUrl) {
    return cleanedUrl;
  }

  // Keep relative paths untouched (e.g., "/api" behind a proxy).
  if (cleanedUrl.startsWith("/")) {
    return cleanedUrl;
  }

  try {
    const parsedUrl = new URL(cleanedUrl);
    if (!parsedUrl.pathname || parsedUrl.pathname === "/") {
      parsedUrl.pathname = "/api";
    }
    return parsedUrl.toString().replace(/\/+$/, "");
  } catch {
    return cleanedUrl;
  }
};

const API_URL = normalizeApiUrl(
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api"
);

const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("tac_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const authApi = {
  signup: async (payload: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/signup", payload);
    return response.data;
  },
  login: async (payload: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", payload);
    return response.data;
  },
  me: async (): Promise<{ user: User }> => {
    const response = await api.get<{ user: User }>("/auth/me");
    return response.data;
  }
};

export const careerApi = {
  list: async (): Promise<Career[]> => {
    const response = await api.get<{ careers: Career[] }>("/careers");
    return response.data.careers;
  },
  getOne: async (id: string): Promise<Career> => {
    const response = await api.get<{ career: Career }>(`/careers/${id}`);
    return response.data.career;
  }
};

export const trialApi = {
  getTrialByCareer: async (career: string): Promise<{
    career: Career;
    trial: Trial;
    progress: TrialProgress | null;
  }> => {
    const response = await api.get<{
      career: Career;
      trial: Trial;
      progress: TrialProgress | null;
    }>(`/trials/${career}`);
    return response.data;
  },
  getMyProgress: async (career: string): Promise<{ progress: TrialProgress }> => {
    const response = await api.get<{ progress: TrialProgress }>(
      `/trials/${career}/progress`
    );
    return response.data;
  },
  saveProgress: async (
    career: string,
    payload: TrialProgress
  ): Promise<{ progress: TrialProgress }> => {
    const response = await api.post<{ progress: TrialProgress }>(
      `/trials/${career}/progress`,
      payload
    );
    return response.data;
  }
};

export const resultApi = {
  submit: async (payload: {
    careerId: string;
    taskScore: number;
    quizScore: number;
    gameScore: number;
  }): Promise<CompatibilityResult> => {
    const response = await api.post<{ result: CompatibilityResult }>(
      "/results",
      payload
    );
    return response.data.result;
  },
  listMine: async (): Promise<CompatibilityResult[]> => {
    const response = await api.get<{ results: CompatibilityResult[] }>("/results");
    return response.data.results;
  },
  latest: async (): Promise<CompatibilityResult> => {
    const response = await api.get<{ result: CompatibilityResult }>(
      "/results/latest"
    );
    return response.data.result;
  }
};
