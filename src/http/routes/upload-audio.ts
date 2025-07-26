import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'
import { generateEmbeddings, transcribeAudio,  } from '../../services/gemini.ts'

export const uploadAudioRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/rooms/:roomId/audio',
    {
      schema: {
        params: z.object({
           roomId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { roomId } = request.params
      const audio = await request.file()

      // Streams para enviar o arquivo de áudio em pedaços em vez de carregar tudo na memória: 1GB para AGUARDAR 
      
        if (!audio) {
          throw new Error('Audio é obrigatório')
        }

        const audioBuffer = await audio.toBuffer() // Converte o arquivo de áudio para Buffer e depois para Base64
        const audioAsBase64 = audioBuffer.toString('base64')

        const transcription = await transcribeAudio(audioAsBase64, audio.mimetype)
        const embeddings = await generateEmbeddings (transcription)

        return { transcription, embeddings }

        // 1. Transcrever o Audio utilizando geminiIA
        // 2. Gerar vetor semântico/ embeddings do texto transcrito
        // 3. Armazenar os vetores no banco de dados
        
    }
  )
}