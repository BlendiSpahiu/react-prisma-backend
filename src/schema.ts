import { makeExecutableSchema } from '@graphql-tools/schema';
import { Post } from '@prisma/client';
import { GraphQLContext } from './context';

const typeDefinitions = /* GraphQL */ `
  type Query {
    info: String!
    posts: [Post!]!
  }

  type Mutation {
    insertPost(title: String!, description: String, authorName: String!): Post!
  }

  type Post {
    id: ID!
    description: String
    title: String!
    authorName: String!
    authorEmail: String!
  }
`;

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    posts: async (parent: unknown, args: {}, context: GraphQLContext) => {
      return context.prisma.post.findMany();
    },
  },
  Post: {
    id: (parent: Post) => parent.id,
    description: (parent: Post) => parent.content,
    title: (parent: Post) => parent.title,
    authorName: (parent: Post) => parent.authorName,
    authorEmail: (parent: Post) => parent.authorEmail,
  },
  Mutation: {
    insertPost: async (
      parent: unknown,
      args: {
        content: string;
        title: string;
        authorName: string;
        authorEmail: string;
      },
      context: GraphQLContext
    ) => {
      const newPost = await context.prisma.post.create({
        data: {
          title: args.title,
          content: args.content,
          authorName: args.authorName,
          authorEmail: args.authorEmail,
        },
      });
      return newPost;
    },
  },
};

export const schema = makeExecutableSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefinitions],
});
