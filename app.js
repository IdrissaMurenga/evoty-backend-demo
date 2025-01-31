import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import { createYoga, createSchema } from 'graphql-yoga'

// Load environment variables from .env file
dotenv.config()

const app = express()

// Create a new GraphQL server
// const Yoga = createYoga({
//     schema: createSchema({
//         typeDefs,
//         resolvers
//     })
// })

//middleware
app.use(cors())
// app.use('/graphql/', Yoga)

const mongoDB_url = process.env.MONGODB_URL

mongoose.connect(mongoDB_url)
    .then(() => {
        const port = process.env.PORT
        app.listen(port, () => {
            console.log(`Server running on port ${port}.......`)
        })
    })
    .catch(err => console.log(err))