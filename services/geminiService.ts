import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { UserData, ScheduleTask } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const scheduleSchema = {
  type: Type.OBJECT,
  properties: {
    schedule: {
      type: Type.ARRAY,
      description: "The array of schedule tasks for the day.",
      items: {
        type: Type.OBJECT,
        properties: {
          time: { type: Type.STRING, description: "Time of the task in HH:MM format." },
          type: { type: Type.STRING, description: "Type of task: Meal, Workout, Hydration, Mindfulness, Other." },
          title: { type: Type.STRING, description: "A short title for the task." },
          description: { type: Type.STRING, description: "A detailed description of the task." },
        },
        required: ["time", "type", "title", "description"],
      },
    },
  },
  required: ["schedule"],
};


export const generateSchedule = async (userData: UserData, weather: string): Promise<Omit<ScheduleTask, 'id' | 'completed' | 'imageUrl'>[]> => {
    const { weight, height, goal, workout, workoutDuration, workoutIntensity } = userData;
    const bmi = (weight / ((height / 100) * (height / 100))).toFixed(1);

    const prompt = `
        You are an expert nutritionist and fitness coach. Your task is to generate a personalized daily health schedule for a user based on the following data. The output must be a valid JSON object matching the provided schema.

        User Profile:
        - Goal: ${goal}
        - BMI: ${bmi}
        - Occupation: Software developer (works from home, mostly sedentary)
        - Workout Preference: ${workout} for ${workoutDuration} minutes at ${workoutIntensity} intensity.
        - Location Context: The weather today is ${weather}.

        User's Daily Timings (adhere to these strictly):
        - Wake up: 06:00 AM
        - Breakfast: 08:00 AM
        - Work Start: 09:00 AM
        - Lunch: 02:00 PM
        - Work End: 06:00 PM
        - Dinner: 09:00 PM
        - Sleep: 11:00 PM

        Dietary Preferences (must include these):
        - eggs, coffee, pumpkin seeds, water, dal and rice, raw vegetables, chicken, curd, milk

        Schedule Requirements:
        - Create a full-day schedule from morning to night based on the user's timings.
        - Include breakfast, lunch, and dinner at the specified times.
        - Add 1-2 healthy snacks, scheduled appropriately between meals (e.g., around 11:00 AM and 05:00 PM).
        - Incorporate the user's preferred workout. The workout description should be detailed and appropriate for the specified duration and intensity. Fit it in logically (e.g., before work, during lunch, or after work).
        - Add multiple hydration reminders throughout the day, especially during work hours.
        - Include short mindfulness/break reminders (e.g., stretching, short walk) to counteract the sedentary work style, placing them during the 09:00 AM to 06:00 PM work block.
        - Keep the total daily calorie intake appropriate for the user's goal.
        - All meal and workout descriptions should be concise and clear.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: scheduleSchema,
            },
        });

        const jsonResponse = JSON.parse(response.text);
        if (jsonResponse && jsonResponse.schedule) {
            return jsonResponse.schedule;
        } else {
            throw new Error("Invalid schedule format received from API.");
        }
    } catch (error) {
        console.error("Error generating schedule:", error);
        throw new Error("Failed to generate your personalized schedule. Please try again.");
    }
};

export const generateImage = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                return `data:image/png;base64,${base64ImageBytes}`;
            }
        }
        throw new Error("No image data found in response.");
    } catch (error) {
        console.error("Error generating image:", error);
        return ""; // Return empty string on failure to not break the UI
    }
};

export const getMealImagePrompt = (description: string) => 
    `A vibrant, appetizing photo of ${description}, professionally shot for a health food blog, on a clean white background.`;

export const getWorkoutImagePrompt = (description: string) => 
    `A clean, minimalist, black and white line-art illustration of a person doing this exercise: ${description}. The illustration should clearly show correct form and posture, on a plain white background.`;
