import { GoogleGenAI } from '@google/genai'
import { env } from '../env.ts'

const gemini = new GoogleGenAI({
    apiKey: env.GEMINI_API_KEY,
})

const model = 'gemini-2.5-flash'

export async function transcribeAudio(audioAsBase64: string, mimeType: string) { //Converete o arquivo de áudio em texto
  const response = await gemini.models.generateContent({
    model,
    contents: [
     {
        text: 'Transcrev o áudio para Português do Brasil. Seja preciso e natural e mantenha pontuação adequada e divida o texto em parágrafos quando for apropriado',
     },
     {
        inlineData: {
            mimeType,
            data: audioAsBase64,
        },
     }
    ]
  }) 
  
  if (!response.text){
    throw new Error('Não foi possível converter o áudio');
  }

  return response.text
}