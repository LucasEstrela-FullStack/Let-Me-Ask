import { z } from "zod";

const envSchema = z.object({
    PORT: z.coerce.number().default(3333), // Coverte a string para number e define um valor padrão de 3333
    DATABASE_URL: z.string().url().startsWith('postgresql://'), // Verifica se a string é uma URL e começa com 'postgresql://'
    GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required"), // Verifica se a chave da API do Gemini é uma string não vazia
})

export const env = envSchema.parse(process.env); // Faz a validação do schema e retorna o objeto com as variáveis de ambiente
