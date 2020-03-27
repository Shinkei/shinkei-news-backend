const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

const signup = async (root, args, context, info) => {
  const password = await bcrypt.hash(args.password, 10)
  const user = await context.prisma.createUser({ ...args, password })
  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user
  }
}

const login = async (root, args, context, info) => {
  const user = await context.prisma.user({ email: args.email })
  if (!user) {
    throw new Error('Error at login')
  }

  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error('Invalid Password')
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user
  }
}

const post = (root, args, context) => {
  const userId = getUserId(context)

  return context.prisma.createLink({
    url: args.url,
    description: args.description,
    postedBy: { connect: { id: userId } }
  })
}

const updateLink = async (root, { id, url, description }, context) => {
  const userId = getUserId(context)
  const link = await context.prisma.updateLink({
    data: {
      url,
      description
    },
    where: {
      id
    }
  }
  )

  return link
}

const deleteLink = async (root, args, context) => {
  const userId = getUserId(context)
  const link = await context.prisma.deleteLink({
      id: args.id
  })
}

const vote = async (root, args, context, info) => {
  const userId = getUserId(context)
  const voteExists = await context.prisma.$exists.vote({
    user: { id: userId },
    link: { id: args.linkId }
  })

  if (voteExists) {
    return voteExists
  }

  return context.prisma.createVote({
    user: { connect: { id: userId } },
    link: { connect: { id: args.linkId } }
  })
}

module.exports = {
  signup,
  login,
  post,
  vote,
  updateLink,
  deleteLink
}
