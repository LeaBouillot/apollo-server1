const { gql } = require("apollo-server");
const dbworks = require("../dbWorks");
const dbWorks = require("../dbWorks");
const { supplies } = require("../database");

const typeDefs = gql`
  type Supply {
    id: String
    team: Int
  }
`;

const resolvers = {
  Query: {
    supplies: (parent, arg) => dbWorks.getSupplies(arg),
  },
  Mutation: {
    deleteSupply: (parent, arg) => dbWorks.deleteItem("supplies", arg),
  },
};

module.exports = {
  typeDefs: typeDefs,
  resolvers: resolvers,
};
