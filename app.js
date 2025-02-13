import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import { typeDefs } from './graphQL/types/index.js'
import { createYoga, createSchema } from 'graphql-yoga'
import { userResolver } from './graphQL/resolvers/userResolver.js'
import User from './models/userModel.js'
import jwt from "jsonwebtoken"

// Load environment variables from .env file
dotenv.config()

const app = express()

// Create a new GraphQL server
const yoga = createYoga({
    schema: createSchema({
        typeDefs,
        resolvers : userResolver
    }),
    context: async ({req}) => {
        const authToken = req?.headers?.authorization?.split('Bearer ')[1]
        console.log(authToken)
        const contextData = {}
        if (authToken) {
            try {
                const decoded = jwt.verify(authToken, "idrissa-login-key")
                console.log(decoded)
                let user = await User.findById(decoded?.id)
                // console.log(user)
                contextData.user = user
                console.log(contextData)
            } catch (error) {
                console.log(`"TOKEN_VERIFICATION_ERROR", ${error.message}`)
            }
        }
    }
})

//middleware
app.use(cors())

app.use('/graphql', yoga)

const mongoDB_url = process.env.MONGODB_URL

mongoose.connect(mongoDB_url)
    .then(() => {
        const port = process.env.PORT
        app.listen(port, () => {
            console.log(`🚀 Server running on http://localhost:${port}/graphql.......`)
        })
    })
    .catch(err => console.error("MongoDB Connection Error:", err))