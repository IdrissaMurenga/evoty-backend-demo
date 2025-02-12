import User from "../../models/userModel.js"
import bcrypt from "bcryptjs"
import { GraphQLError } from "graphql"
import { generateToken } from "../../utils/generateToken.js"


export const userResolver = {
    Query: {
        user: async (_, __, context) => {
            // if (!context.user) {
            //     throw new GraphQLError('Not authenticated', {
            //         extensions: { code: 'UNAUTHORIZED' },
            //     });
            // }
            // console.log(context.user)

            try {
                // Fetch user by ID
                const user = await User.findById(id);
                if (!user) {
                    throw new GraphQLError('User not found', {
                        extensions: { code: 'USER_NOT_FOUND' },
                    });
                }

                return {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                };
            } catch (error) {
                throw new GraphQLError(`Error fetching user: ${error.message}`, {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' },
                });
            }
        }
    },
    Mutation: {
        Signup: async (_, { input }) => {
            //extract first name, last name, email and password from the input object
            const { firstName, lastName, email, password } = input
            try {
                //check if user with the provided email already exists in the database
                const userExist = await User.findOne({ email })

                //if user exists, throw an error message
                if (userExist) {
                    throw new GraphQLError('User already exists')
                }

                //hash the created password using bcrypt
                const hashedPassword = await bcrypt.hash(password, 10)

                //create a new user with the provided information and save it to the database
                const user = new User({
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword
                })

                await user.save()

                //save the user to the database and generate a token for the user
                const token = generateToken(user._id)

                //return the user data and the generated token
                return {
                    user: {
                        id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                    },
                    token
                }
            } catch (error) {
                throw new Error(`Error signin up: ${error.message}`)
            }
        },
        Login: async (_, { input }) => {
            //extract email and password from the input object
            const { email, password } = input
            try {
                //find the user by the provided email
                const findUser = await User.findOne({ email })
                
                //check if user with the provided email exist
                if (!findUser) {
                    throw new GraphQLError("User with the provided email not found")
                }

                //check if the password provided matches the one in the database
                const passwordMatch = await bcrypt.compare(password, findUser.password)
                console.log("Password Match:", passwordMatch); // Debuggin

                //if password does not match, throw an error
                if (!passwordMatch) {
                    throw new GraphQLError("your password is incorrect")
                }

                //if password matches, generate a token and return the user data and the token
                const token = generateToken(findUser._id)
                console.log("Authenticated User:", User); // Debugging line

                return {
                    user: {
                        id: findUser._id,
                        firstName: findUser.firstName,
                        lastName: findUser.lastName,
                        email: findUser.email,
                    },
                    token,
                }
            } catch (error) {
                throw new GraphQLError(`Error logging in: ${error.message}`)
            }
        }
    }
}