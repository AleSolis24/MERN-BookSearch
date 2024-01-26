const { User } = require('../models');
const {signToken, AuthError } = require('../utils/auth');

const resolver = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData  = await User.findOne({ _id: context.user._id }).select("__v -password").populate('savedBooks');

                return userData; 
            }
            throw AuthError;
        },
    },

    Mutation: {
        addUser: async (parent, {email, password}) => {
            const addedUser = await User.findOne({ email });

            if (!addedUser) {
                throw new AuthError;
            }

            const correctPassowrd = await addedUser.correctPassowrd(password);

            if (!correctPassowrd) {
                throw new AuthError
            }

            const coinToken = signToken(addedUser);

            return {coinToken, addedUser };
        },
    }
}




module.exports = resolver; 