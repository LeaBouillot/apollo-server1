const { gql } = require("apollo-server");
const typeDefs = gql`
  enum Role {
    developer
    designer
    planner
  }
  enum NewOrUsed {
    new
    used
  }
`;
//used_by: Role!
//new_or_used: NewOrUsed!
module.exports = typeDefs;
