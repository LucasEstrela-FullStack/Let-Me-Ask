import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { desc, eq } from 'drizzle-orm'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'
import { z } from 'zod/v4'

export const getRoomsQuestions: FastifyPluginCallbackZod = (app) => {
   app.get('/rooms/:roomId/questions', {
    schema:{
        params: z.object({
            roomId: z.string(),
        }),
    },
   }, async (request) => {
      const { roomId } = request.params

      console.log(roomId)

      const result = await db
      .select({
        id: schema.questions.id,
        question: schema.questions.question,
        aswer: schema.questions.answer,
        createdAt: schema.questions.createdAt,
      })
      .from(schema.questions)
      .where(eq(schema.questions.roomId, roomId))
      .orderBy(desc(schema.questions.createdAt))

      return result
   })
}