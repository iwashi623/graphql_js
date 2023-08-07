const { ApolloServer, gql } = require('apollo-server');

// リンクオブジェクトの配列
const links = [
    {
        id: 'link-0',
        url: 'www.howtographql.com',
        description: 'Fullstack tutorial for GraphQL',
    },
];

// GraphQL schema定義
const typeDefs = gql`
    type Query {
        info: String!
        feed: [Link!]!
    }

    type Mutation {
        post(url: String!, description: String!): Link!
    }

    type Link {
        id: ID!
        description: String!
        url: String!
    }
`;

// リゾルバー関数定義
const resolvers = {
    // infoフィールドのリゾルバー関数
    Query: {
        info: () => `This is the API of a Hackernews Clone`,
        feed: () => links,
    },

    Mutation: {
        post: (parent, args) => {
            let idCount = links.length;

            const link = {
                id: `link-${idCount++}`,
                description: args.description,
                url: args.url,
            };

            links.push(link);
            return link;
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

server
    .listen()
    .then(({ url }) => {
        console.log(`Server is running on ${url}`);
    });
