const { gql } = require('apollo-server-express');

const typeDefs = gql`
type User {
_id: ID
username: String
email: String
password: String
bookCount: Int
savedBooks: [Book]
}
type Book {
_id: ID
authors: [String]
description: String
image: String
link: String
title: String
}
type Auth {
token: ID!
user: User
}
type Query {
users: [User]
user(username: String!): User
me: User
}
type Mutation {
addUser(username: String!, email: String!, password: String!): Auth
login(email: String!, password: String!): Auth
saveBook(bookId: ID!): Book
deleteBook(bookId: ID!): Book
}`;

module.exports = typeDefs;