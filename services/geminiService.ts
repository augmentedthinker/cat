import { GoogleGenAI, Type, Schema } from "@google/genai";
import { StoryGraph } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const storySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Title of the generated story" },
    startNodeId: { type: Type.STRING, description: "ID of the first node" },
    nodes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          text: { type: Type.STRING, description: "Narrative text for this scene (approx 30-50 words)" },
          imagePrompt: { type: Type.STRING, description: "Visual description for image generation (no text in image)" },
          isEnding: { type: Type.BOOLEAN },
          choices: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                targetId: { type: Type.STRING },
              },
              required: ["text", "targetId"],
            },
          },
        },
        required: ["id", "text", "imagePrompt", "choices"],
      },
    },
  },
  required: ["title", "startNodeId", "nodes"],
};

export const generateStory = async (subject: string): Promise<StoryGraph> => {
  const model = "gemini-2.5-flash";
  
  const systemPrompt = `
    You are an interactive fiction engine. Create a short, atmospheric story based on the user's subject.
    The story should be structured as a graph of nodes.
    - Start with an intro node.
    - Include 3-5 distinct scenes/nodes minimum.
    - At least one node should have a branching choice.
    - Ensure all targetIds exist in the nodes array.
    - Keep narrative text concise (under 50 words) to fit on mobile screens.
    - Image prompts should be descriptive and artistic (e.g., "cinematic lighting, neon details").
    - The theme is: ${subject}
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Generate a story about: ${subject}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: storySchema,
        temperature: 0.8, 
      },
    });

    const data = JSON.parse(response.text || "{}");

    // Convert array of nodes to record for easier lookup
    const nodesRecord: Record<string, any> = {};
    if (data.nodes && Array.isArray(data.nodes)) {
      data.nodes.forEach((node: any) => {
        nodesRecord[node.id] = node;
      });
    }

    return {
      title: data.title,
      startNodeId: data.startNodeId,
      nodes: nodesRecord,
    };
  } catch (error) {
    console.error("Failed to generate story:", error);
    throw new Error("Story generation failed. Please try a different subject.");
  }
};