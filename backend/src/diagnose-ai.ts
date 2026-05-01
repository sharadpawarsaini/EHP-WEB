import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';
import axios from 'axios';

async function listModels() {
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  console.log('--- AI DIAGNOSTIC START ---');
  console.log('Testing Key:', apiKey.substring(0, 10) + '...');
  
  try {
    const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
    const response = await axios.get(url);
    console.log('SUCCESS! Available Models:');
    response.data.models.forEach((m: any) => console.log(` - ${m.name}`));
  } catch (error: any) {
    console.error('FAILED!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
  }
}

listModels();
