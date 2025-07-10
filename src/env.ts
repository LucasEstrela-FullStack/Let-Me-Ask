import { z } from "zod";

const envSchema = z.object({
    PORT: z.coerce.number().default(3333), // Coverte a string para number e define um valor padrão de 3333
    DATABASE_URL: z.string().url().startsWith('postgresql://'), // Verifica se a string é uma URL e começa com 'postgresql://'
})

export const env = envSchema.parse(process.env); // Faz a validação do schema e retorna o objeto com as variáveis de ambiente
