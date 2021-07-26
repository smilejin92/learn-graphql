import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { MongoClient } from 'mongodb';
import schema from './schema/schema';

const app = express();

const { USER_ID, USER_PWD, DB_URL } = process.env;
const uri = `mongodb+srv://${USER_ID}:${USER_PWD}@${DB_URL}`;
const client = new MongoClient(uri);

client.connect(err => {
  // const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  console.log('connected to database');
  client.close();
});

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
