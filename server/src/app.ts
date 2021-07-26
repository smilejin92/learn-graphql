import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import schema from './schema/schema';

const app = express();

// graphql middleware
app.use(
  '/graphql',
  graphqlHTTP({
    // define schema - allow queries to jump into graph and retrieve data
    schema,
    graphiql: true,
  }),
);

app.listen(4000, () => {
  console.log('listening for requests on port 4000');
});
