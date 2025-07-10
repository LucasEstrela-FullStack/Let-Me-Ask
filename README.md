# Let Me Ask - Backend

Este projeto é o backend do Let Me Ask, uma aplicação para perguntas e respostas em tempo real, desenvolvida com Node.js, Fastify e PostgreSQL (com suporte a vetores via pgvector).

## Tecnologias

- Node.js + TypeScript
- Fastify (framework web)
- PostgreSQL (com extensão pgvector)
- Docker (para banco de dados)
- Zod (validação de dados)
- Fastify CORS

## Como rodar

1. Instale as dependências:
   ```sh
   npm install
   ```

2. Configure o arquivo `.env` (use o `.env.example` como base).

3. Suba o banco de dados com Docker:
   ```sh
   docker-compose up -d
   ```

4. Inicie o servidor:
   ```sh
   npm run dev
   ```

O backend estará disponível em `http://localhost:3333`.

## Estrutura

- `src/server.ts`: Arquivo principal do servidor Fastify.
- `src/db/connection.ts`: Conexão com o banco de dados PostgreSQL.
- `docker-compose.yml`: Configuração do banco de dados PostgreSQL com pgvector.
- `.env.example`: Exemplo de variáveis de ambiente.

## Observações

- Não commite arquivos sensíveis como `.env` ou a pasta `node_modules`.
- O projeto utiliza validação de dados com Zod e CORS para integração com o frontend.
