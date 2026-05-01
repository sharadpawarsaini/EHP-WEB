import { Request, Response } from 'express';
import { EmergencyLink } from '../models/EmergencyLink';
import { Profile } from '../models/Profile';
import { MedicalDetails } from '../models/MedicalDetails';
import axios from 'axios';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const callGroq = async (systemPrompt: string, userMessage: string, history: any[] = []) => {
  const apiKey = (process.env.GROQ_API_KEY || '').trim();
  if (!apiKey) throw new Error('GROQ_API_KEY is missing in .env');

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map(h => ({
      role: h.role === 'model' ? 'assistant' : 'user',
      content: h.parts[0].text
    })),
    { role: 'user', content: userMessage }
  ];

  const response = await axios.post(
    GROQ_API_URL,
    {
      model: 'llama-3.3-70b-versatile',
      messages: messages,
      temperature: 0.7,
      max_tokens: 500
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data.choices[0].message.content;
};

export const getAIGuidance = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const { message, history } = req.body;
  try {
    const link = await EmergencyLink.findOne({ publicSlug: slug });
    if (!link) return res.status(404).json({ message: 'Profile not found' });
    const profile = await Profile.findOne({ userId: link.userId });
    const medical = await MedicalDetails.findOne({ userId: link.userId });

    const systemPrompt = `You are the EHP First-Aid Assistant. Patient: ${profile?.fullName}, Blood: ${profile?.bloodGroup}. Allergies: ${medical?.allergies?.join(', ') || 'None'}. Provide concise, life-saving first-aid instructions only. Use bold for actions.`;
    
    const text = await callGroq(systemPrompt, message, history);
    res.json({ text });
  } catch (error: any) {
    console.error('Groq AI Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'AI Assistant currently unavailable' });
  }
};

export const getAIDemoGuidance = async (req: Request, res: Response) => {
  const { message, history } = req.body;
  try {
    const systemPrompt = `You are the EHP Assistant in DEMO MODE. Patient: John Doe, Peanut Allergy, Type 1 Diabetes. Provide concise first-aid instructions. Use bold for actions.`;
    
    const text = await callGroq(systemPrompt, message, history);
    res.json({ text });
  } catch (error: any) {
    console.error('Groq Demo Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'AI Assistant Demo currently unavailable' });
  }
};
