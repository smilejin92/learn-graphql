import {
  GraphQLID,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
} from 'graphql';
import _ from 'lodash';
import Author from '../models/author';

// 1. define type
// 2. define relationship between types
// 3. define root queries
const BookType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Book',
  // 함수를 사용하는 이유 = 함수 스코프 내부에서 참조하는 타입이 런타임에 먼저 생성될 수 있도록
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve: (parent, args) => {
        // parent = book(id)
        // return _.find(authors, { id: parent.authorId });
      },
    },
  }),
});

const AuthorType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve: (parent, args) => {
        // parent = AuthorType
        // return _.filter(books, { authorId: parent.id });
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: (parent, args) => {
        // code to get data from DB or other source
        // return _.find(books, { id: args.id });
      },
    },
    author: {
      type: AuthorType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: (parent, args) => {
        // return _.find(authors, { id: args.id });
      },
    },
    books: {
      type: new GraphQLList(BookType),
      resolve: (parent, args) => {
        // return books;
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve: (parent, args) => {
        // return authors;
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve: (parent, args) => {
        const author = new Author({
          name: args.name,
          age: args.age,
        });

        return author.save();
      },
    },
  },
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
