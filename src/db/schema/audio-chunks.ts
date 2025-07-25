import { pgTable, text, timestamp, uuid, vector } from 'drizzle-orm/pg-core'
import { rooms } from './rooms.ts'

export const audioChunks = pgTable('audio_chuncks', {
  id: uuid().primaryKey().defaultRandom(),
  roomId: uuid()
    .references(() => rooms.id)
    .notNull(),
  transcription: text().notNull(),
  embeddings: vector({ dimensions: 768 }).notNull(), // Representação dos Vetores para Comparar e fazer a busca por significado
  createdAt: timestamp().defaultNow().notNull(),
})