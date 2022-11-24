const { AuthenticationError } = require('apollo-server-express');
const { User } = require("../models");
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
user: async (parent, { username, id }) => {
    if (username || id) {
    return User.findOne({ $or: [{ _id: id }, { username: username }], })
    }
    throw new AuthenticationError('No user found')
}
    },
    Mutation: {
addUser: async (parent, { username, email, password }) => {
    const user = await User.create({ username, email, password });
    const token = signToken(user);
    return { token, user };
},
login: async (parent, { username, email, password }) => {
    const user = await User.findOne({ $or: [{ email: email}, { username: username }] });
    if (!user) {
        throw new AuthenticationError('No user matches')
    }
    const correctPw = await user.isCorrectPassword(password);
    if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
    }
    const token = signToken(user);

    return { token, user };
},
saveBook: async (parent, args, context) => {
    if (context.user) {
        const book = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $addToSet: { savedBooks: args } },
        { new: true, runValidators: true }
        );
        return book;
    }
    throw new AuthenticationError('You need to be logged in!');
}, 
deleteBook: async (parent, { bookId }, context) => {
    if (context.user) {
    const book = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId } } },
        { new: true }
    );
    return book;
    }
    throw new AuthenticationError('You need to be logged in!');
}
    }
};

module.exports = resolvers;