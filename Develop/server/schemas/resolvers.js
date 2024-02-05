// const { User, Book } = require('../models');
const { User, Book } = require('../models');
// import sign token function from auth
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('c');
      }
      throw AuthenticationError;
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (parent, { title, authors, bookId, description, image, link }, context) => {
      if (context.user) {
       const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: {title, authors, bookId, description, image, link} } },
          {new: true}
        );

        return user;
      }
      throw AuthenticationError;
      ('You need to be logged in!');
    },

    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: {bookId} } },
          {new: true}
        );

        return user;
      }
      throw AuthenticationError;
    },
    
  },
};

module.exports = resolvers;
