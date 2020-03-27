const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('./generated/prisma-client')

const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const Subscription = require('./resolvers/Subscription')

const User = require('./resolvers/User')
const Link = require('./resolvers/Link')
const Vote = require('./resolvers/Vote')

const typeDefs = './src/schema.graphql'

// const resolvers = {
//   Query: {
//     info: () => 'This is the API for shinkeinews',
//     feed: (root, args, context, info) => {
//       return context.prisma.links()
//     },
//     //Todo implement it with prisma
//     link: (root, { id }, context) => {
//       return context.prisma.link({ id } )
//     }
//   },
//   Mutation: {
//     post: (root, args, context) => {
//       return context.prisma.createLink({
//         url: args.url,
//         description: args.description
//       })
//     },
//     update: (parent, { id, url, description }) => {
//       const link = links.find(link => link.id === id)
//       link.url = url ? url : link.url
//       link.description = description ? description : link.description

//       return link
//     },
//     delete: (parent, { id }) => {
//       const [link] = links.splice(links.indexOf(link => link.id === id), 1)
//       return link
//     }
//   }
// }

const resolvers = {
  Query,
  Mutation,
  Subscription,
  Link,
  User,
  Vote
}

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: request => { // esto se hace para que se pueda leet el Auth header
    return {
      ...request,
      prisma
    }
  }
})

server.start(() => console.log('🏃 on port 4000'))