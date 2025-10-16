import { GoogleGenAI } from '@google/genai';
import config from '@/config/env.config';

const ai = new GoogleGenAI({
  apiKey: config.GOOGLE_API_KEY,
});

export default ai;
