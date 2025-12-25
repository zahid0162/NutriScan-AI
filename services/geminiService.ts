
import { GoogleGenAI, Type } from "@google/genai";
import { FoodNutrition } from "../types";

const foodSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "The name of the food item identified." },
    calories: { type: Type.NUMBER, description: "Estimated calories per serving." },
    protein: { type: Type.NUMBER, description: "Estimated protein in grams." },
    carbs: { type: Type.NUMBER, description: "Estimated carbohydrates in grams." },
    fat: { type: Type.NUMBER, description: "Estimated fat in grams." },
    fiber: { type: Type.NUMBER, description: "Estimated fiber in grams." },
    sugar: { type: Type.NUMBER, description: "Estimated sugar in grams." },
    servingSize: { type: Type.STRING, description: "The serving size used for the estimate (e.g., 100g, 1 piece)." },
    additionalNutrients: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          amount: { type: Type.STRING }
        },
        required: ["name", "amount"]
      }
    }
  },
  required: ["name", "calories", "protein", "carbs", "fat", "servingSize"]
};

const sanitizeResponse = (data: any): Partial<FoodNutrition> => {
  return {
    name: data.name || "Unknown Food",
    calories: Number(data.calories) || 0,
    protein: Number(data.protein) || 0,
    carbs: Number(data.carbs) || 0,
    fat: Number(data.fat) || 0,
    fiber: Number(data.fiber) || 0,
    sugar: Number(data.sugar) || 0,
    servingSize: data.servingSize || "1 portion",
    additionalNutrients: Array.isArray(data.additionalNutrients) ? data.additionalNutrients : []
  };
};

export const analyzeFoodText = async (query: string): Promise<FoodNutrition> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the nutritional content of this food: "${query}". Provide estimates for standard portions if not specified.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: foodSchema,
    },
  });

  const rawData = JSON.parse(response.text || "{}");
  const sanitized = sanitizeResponse(rawData);

  return {
    ...sanitized,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  } as FoodNutrition;
};

export const analyzeFoodImage = async (base64Image: string, mimeType: string = "image/jpeg"): Promise<FoodNutrition> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const imagePart = {
    inlineData: {
      mimeType: mimeType,
      data: base64Image,
    },
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        imagePart,
        { text: "Identify the food in this image and provide its estimated nutritional content per serving." }
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: foodSchema,
    },
  });

  const rawData = JSON.parse(response.text || "{}");
  const sanitized = sanitizeResponse(rawData);

  return {
    ...sanitized,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    image: `data:${mimeType};base64,${base64Image}`
  } as FoodNutrition;
};
