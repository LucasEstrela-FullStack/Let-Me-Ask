// Arquivo que resporta ao schema do banco de dados

import { audioChunks } from "./audio-chunks.ts";
import { questions } from "./questions.ts";
import { rooms } from "./rooms.ts";

export const schema = {
  rooms,
  questions,
  audioChunks,
};