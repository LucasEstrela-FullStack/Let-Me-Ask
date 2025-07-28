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

export async function generateEmbeddings(text: string) {
  const response = await gemini.models.embedContent({
    model: 'text-embedding-004',
    contents: [{ text}],
    config: {
      taskType: 'RETRIEVAL_DOCUMENT', // Usado para fazer buscas semânticas e utilizar depois
    }
  })

  if(!response.embeddings?.[0].values) {
    throw new Error('Não foi possível gerar o vetor semântico')
  }

  return response.embeddings[0].values
}

export async function generateAnswer(question: string, transcriptions: string[]) {
  const context = transcriptions.join('\n\n')

  const prompt = `
  Você é um assistente virtual que responde perguntas com base em transcrições de áudio, com base no texto fornecido abaixo como contexto, responda a pergunta de forma clara e com precisão utilizando o Português PT-br.
  
  CONTEXTO:
  ${context}

  PERGUNTA:
  ${question}

  INSTRUÇÕES:
  - Responda a pergunta de forma clara e objetiva, utilizando o contexto fornecido. Se a resposta não estiver presente no contexto, diga que não sabe ou que não tem informações suficientes;
  - Responda apenas com o texto, sem formatação ou marcação adicional;
  - Seja objetivo;
  - Cite trechos relevantes do contexto se apropriados;
  - Se for citar o contexto, utilize o temo "conteúdo da aula";
  `.trim()

  const response = await gemini.models.generateContent({
    model,
    contents: [
      {
        text: prompt,
      }
    ]
  })

  if (!response.text) {
    throw new Error('Falha ao gerar resposta com o Gemini');
  }

  return response.text
}