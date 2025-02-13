import userResolver from "./userResolver.js";

export const resolver = {
    Query: {
      ...userResolver.Query,
    },
    Mutation: {
     ...userResolver.Mutation
    },
  }