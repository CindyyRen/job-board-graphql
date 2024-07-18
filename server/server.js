import cors from 'cors';
import express from 'express';
import { authMiddleware, handleLogin } from './auth.js';
import { readFile } from 'node:fs/promises';
import { ApolloServer } from '@apollo/server';
import { resolvers } from './resolvers.js';
import { getUser } from './db/users.js';
import { expressMiddleware as apolloMiddleware } from '@apollo/server/express4';

const PORT = 9000;

const app = express();
app.use(cors(), express.json(), authMiddleware);

app.post('/login', handleLogin);
const typeDefs = await readFile('./schema.graphql', 'utf8');
// function getContext({ req }) {
//   return { auth: req.auth };
// }
async function getContext({ req }) {
  if (req.auth) {
    const user = await getUser(req.auth.sub);
    return { user };
  }
  return {};
}
const apolloServer = new ApolloServer({ typeDefs, resolvers });
await apolloServer.start();
// app.use('/graphql', apolloMiddleware(apolloServer));
app.use('/graphql', apolloMiddleware(apolloServer, { context: getContext }));
app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
});
