"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
}

export interface RecommendMealsRequest {
  prompt: string;
}

export interface GenerateMealContentRequest {
  title: string;
  category: string;
  ingredients: string;
}

export interface AISearchSuggestion {
  id: string;
  text: string;
  type: "meal" | "category" | "provider";
  subText?: string;
  image?: string;
}

export interface AIResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

// 1. Chat with AI
export const chatWithAI = async (messages: ChatMessage[]) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await fetch(`${API_URL}/ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ messages }),
    });

    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to communicate with AI",
    };
  }
};

// 2. Recommend Meals
export const recommendMeals = async (prompt: string) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await fetch(`${API_URL}/ai/recommend-meals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ prompt }),
    });

    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to get meal recommendations",
    };
  }
};

// 3. Generate Meal Content (Provider)
export const generateMealContent = async (payload: GenerateMealContentRequest) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await fetch(`${API_URL}/ai/generate-meal-content`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to generate meal content",
    };
  }
};

// 4. Search Suggestions
export const getAISearchSuggestions = async (query: string) => {
  try {
    const res = await fetch(`${API_URL}/ai/search-suggestions?query=${query}`, {
      method: "GET",
      cache: "no-store",
    });

    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch suggestions",
      data: [],
    };
  }
};
