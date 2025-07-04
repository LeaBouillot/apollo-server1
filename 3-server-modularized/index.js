const { ApolloServer } = require("apollo-server");
const _ = require("lodash");

const queries = require("./typedefs-resolvers/_queries");
const mutations = require("./typedefs-resolvers/_mutations");
const equipments = require("./typedefs-resolvers/equipments");
const supplies = require("./typedefs-resolvers/supplies");
enums = require('./typedefs-resolvers/_enums')

const typeDefs = [queries, mutations, equipments.typeDefs, supplies.typeDefs, enums];

const resolvers = [equipments.resolvers, supplies.resolvers];

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
