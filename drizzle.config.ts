import { defineConfig } from 'drizzle-kit';
import { env } from './src/env.ts';

export default defineConfig({
    dialect: 'postgresql',
    casing: 'snake_case',   
    schema: './src/db/schema/**.ts',  // ** Interpreta todos os arquivos .ts dentro do diretório são relacionados a Banco
    out: './src/db/migrations',  // Pasta onde os arquivos de migrations serão gerados
    dbCredentials:{
        url: env.DATABASE_URL,
    }
})