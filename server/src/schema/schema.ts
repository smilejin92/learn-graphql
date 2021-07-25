import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';

// 1. define type
// 2. define relationship between types
// 3. define root queries
const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: {
        id: { type: GraphQLString },
      },
      resolve: (parent, args) => {
        // code to get data from DB or other source
      },
    },
  },
});

export default new GraphQLSchema({
  query: RootQuery,
});
