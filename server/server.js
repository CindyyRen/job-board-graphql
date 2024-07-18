import cors from 'cors';
import express from 'express';
import { authMiddleware, handleLogin } from './auth.js';
import { readFile } from 'node:fs/promises';
import { ApolloServer } from '@apollo/server';
import { resolvers } from './resolvers.js';
import { expressMiddleware as apolloMiddleware } from '@apollo/server/express4';

const PORT = 9000;

const app = express();
app.use(cors(), express.json(), authMiddleware);

app.post('/login', handleLogin);
const typeDefs = await readFile('./schema.graphql', 'utf8');
const apolloServer = new ApolloServer({ typeDefs, resolvers });
await apolloServer.start();
app.use('/graphql', apolloMiddleware(apolloServer));
app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
});
