const links = (root, args, context) => {
  return context.prisma.user({ id: root.id }).links()
}

const votes = (root, args, context) => {
  return context.prisma.user({ id: root.id }).votes()
}

module.exports = {
  links,
  votes
}