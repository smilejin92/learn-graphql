import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { connect } from 'mongoose';
import schema from './schema/schema';
import cors from 'cors';

const app = express();
app.use(
  cors({
    origin: '*',
  }),
);

const { USER_ID, USER_PWD, DB_URL } = process.env;
const uri = `mongodb+srv://${USER_ID}:${USER_PWD}@${DB_URL}`;
const connectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

connect(uri, connectOptions).then(() => console.log('Connected to database'));

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
