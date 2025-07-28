import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { string, z } from 'zod/v4'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'
import { generateAnswer, generateEmbeddings } from '../../services/gemini.ts'
import { and, eq, sql } from 'drizzle-orm'

export const createQuestionRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/rooms/:roomId/questions',
    {
      schema: {
        params: z.object({
           roomId: z.string(),
        }),
        body: z.object({
          question: z.string().min(1),
        }),
      },
    },
    async (request, reply) => {
      const { roomId } = request.params
      const { question } = request.body

      const embeddings = await generateEmbeddings(question)

      const embeddingsAsString = `[${embeddings.join(', ')}]`

      const chunks = await db
      .select({
        id: schema.audioChunks.id,
        transcription: schema.audioChunks.transcription,
        similarity: sql<number> `1 - (${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector)` // Similaridade de cosseno entre os vetores
      })
      .from(schema.audioChunks)
      .where(and(
        eq(schema.audioChunks.roomId, roomId),
        sql `1 - (${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector) > 0.7 `     // <=> Similaridade de cosseno entre os vetores, quando a similaridade é maior que 0.7, significa que os vetores são semelhantes
      )
    )
    .orderBy(sql`${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector`) // Ordena os chunks de áudio pela similaridade, do mais semelhante para o menos semelhante
    .limit(3)

    let answer: string | null = null
    
    if (chunks.length > 0) {
      const transcriptions = chunks.map(chunk => chunk.transcription)

      answer = await generateAnswer(question, transcriptions)
    }

      const result = await db
        .insert(schema.questions)
        .values({ roomId, question, answer })
        .returning()

      const insertedQuestion = result[0]

      if (!insertedQuestion) {
        throw new Error('Failed to create new question.')
      }

      return reply.status(201).send({
        questionId: insertedQuestion.id,
        answer,
      })
    }
  )
}