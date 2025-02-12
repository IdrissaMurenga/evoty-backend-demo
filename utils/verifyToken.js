import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { GraphQLError } from "graphql";


export const verifyToken = async ({ req }) => {

    // Ensure req and req.headers exist before accessing them
    if (!req || !req.headers) {
        console.error("Request or headers are undefined");
        throw new GraphQLError("Not authenticated", {
            extensions: { code: "UNAUTHORIZED" },
        });
    }

    // Extract token from the request headers
    const authHeader = req.headers.authorization;

    // Check if token is provided and starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new GraphQLError('Not authenticated');
    }

    // Extract the token from the header and verify it using the secret key
    const token = authHeader.split(' ')[1];

    try {

        // Verify the token and decode it to get the user id
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Find the user in the database by the user id and exclude the password field
        const user = await User.findById(decoded.id).select('-password');

        // If user is not found, throw an error
        if (!user) {
            throw new GraphQLError('User not found');
        }

        return { user }; // Attach user to the context

    } catch (error) {
        throw new GraphQLError('Invalid token');
    }
}