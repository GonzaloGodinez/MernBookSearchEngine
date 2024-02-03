// const { User, Book } = require('../models');
const { User, Book } = require('../models');
// import sign token function from auth
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    users: async () => {
      // return User.find().populate('savedBooks');
      return User.find().populate('savedBooks');
    },
    user: async (parent, { username }) => {
      return User.findOne({ username }).populate('savedBooks');
    },
    savedBooks: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Book.find(params).sort({ createdAt: -1 });
    },
    book: async (parent, { bookId }) => {
      return Book.findOne({ _id: bookId });
    },
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
    addBook: async (parent, { title }, context) => {
      if (context.user) {
        const book = await Book.create({
          title,
          authors: context.user.username,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: book._id } }
        );

        return book;
      }
      throw AuthenticationError;
      ('You need to be logged in!');
    },

    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const book = await Book.findOneAndDelete({
          _id: bookId,
          authors: context.user.username,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: book._id } }
        );

        return book;
      }
      throw AuthenticationError;
    },
    
  },
};

module.exports = resolvers;
