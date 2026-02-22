import { GoogleGenAI } from '@google/genai';
import AIChatHistory, { IAIChatHistory } from '../models/AIChatHistory';
import { getWeddingSystemPrompt } from '../config/weddingContext';

// Model identifiers - client can send these or the full model IDs
const GEMINI_MODELS = ['gemini', 'gemini-3-flash-preview'];
const SARVAM_MODELS = ['sarvam', 'sarvam-m'];

function isGeminiModel(model: string): boolean {
  return GEMINI_MODELS.includes(model.toLowerCase());
}

function isSarvamModel(model: string): boolean {
  return SARVAM_MODELS.includes(model.toLowerCase());
}

async function getGeminiResponse(question: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables');
  }

  const ai = new GoogleGenAI({ apiKey });
  const systemInstruction = getWeddingSystemPrompt();

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: question,
    config: {
      systemInstruction,
    },
  });

  return response.text ?? '';
}

async function getSarvamResponse(question: string): Promise<string> {
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) {
    throw new Error('SARVAM_API_KEY is not configured in environment variables');
  }

  const systemInstruction = getWeddingSystemPrompt();

  const response = await fetch('https://api.sarvam.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-subscription-key': apiKey,
    },
    body: JSON.stringify({
      model: 'sarvam-m',
      messages: [
        {
          role: 'system' as const,
          content: systemInstruction,
        },
        {
          role: 'user' as const,
          content: question,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Sarvam API error (${response.status}): ${errorText}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content =
    data.choices?.[0]?.message?.content ?? 'No response received from Sarvam';
  return content;
}

export async function getAIResponse(
  model: string,
  question: string
): Promise<{ response: string; savedRecord: IAIChatHistory }> {
  const normalizedModel = model.trim();
  let response: string;

  if (isGeminiModel(normalizedModel)) {
    response = await getGeminiResponse(question);
  } else if (isSarvamModel(normalizedModel)) {
    response = await getSarvamResponse(question);
  } else {
    throw new Error(
      `Unknown model: "${model}". Supported: gemini, gemini-3-flash-preview, sarvam, sarvam-m`
    );
  }

  const savedRecord = await AIChatHistory.create({
    question,
    response,
    aiModel: normalizedModel,
  });

  return { response, savedRecord };
}
