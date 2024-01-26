const { User } = require('../models');
const { signToken, AuthError } = require('../utils/auth');

const resolver = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select("__v -password").populate('savedBooks');
        return userData;
      }
      throw new AuthError();
    },
  },

  Mutation: {
    addUser: async (parent, { email, password }) => {
      const addedUser = await User.findOne({ email });

      if (!addedUser) {
        throw new AuthError();
      }

      const correctPassword = await addedUser.correctPassword(password);

      if (!correctPassword) {
        throw new AuthError();
      }

      const coinToken = signToken(addedUser);

      return { coinToken, addedUser };
    },

    login: async (parent, { email, password }) => {
      const alreadyAUser = await User.findOne({ email });

      if (!alreadyAUser) {
        throw new AuthError();
      }

      const loginPassword = await alreadyAUser.correctPassword(password);

      if (!loginPassword) {
        throw new AuthError();
      }

      const loginToken = signToken(alreadyAUser);
      return { loginToken, alreadyAUser };
    },
  },
};

module.exports = resolver;
