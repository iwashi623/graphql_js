const { ApolloServer, gql } = require('apollo-server');

// GraphQL schema定義
const typeDefs = gql`
    type Query {
        info: String!
    }
`;

// リゾルバー関数定義
const resolvers = {
    // infoフィールドのリゾルバー関数
    Query: {
        info: () => `This is the API of a Hackernews Clone`
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
