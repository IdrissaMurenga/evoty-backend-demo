export const userType = `
    type User {
        id: ID!
        firstName: String!
        lastName: String!
        email: String!
        password: String!
    }

    type Query {
        users: [User!]!
        user(id: ID): User
    }

    type AuthPayload {
        user: User!
        token: String!
    }

    type Mutation {
        Signup(input: SignupInput!): AuthPayload!
        Login(input: LoginInput!): AuthPayload!
    }

    input SignupInput {
        firstName: String!
        lastName: String!
        email: String!
        password: String!
    }

    input LoginInput {
        email: String!
        password: String!
    }
`;