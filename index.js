const { ApolloServer, UserInputError, gql } = require("apollo-server");
const mongoose = require("mongoose");
const Author = require("./models/author");
const Book = require("./models/book");

const MONGODB_URI =
  "mongodb+srv://ceci:qwerty123@cluster0-2waa6.mongodb.net/gql-library?retryWrites=true&w=majority";

console.log("connecting to", MONGODB_URI);

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

const typeDefs = gql`
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]
    ): Book

    editAuthor(name: String!, setBornTo: Int!): Author
  }
`;

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre) {
        return Book.find({}).populate("author");
      }
      if (!args.author && args.genre) {
        return Book.find({ genres: { $in: [args.genre] } }).populate("author");
      }
      if (args.author && !args.genre) {
        return Book.find({ author: args.author });
      }
      if (args.author && args.genre) {
        return Book.find({ author: args.author, genre: args.genre });
      }
    },
    allAuthors: () => Author.find({}),
  },
  Author: {
    bookCount: async (root) => {
      const author = await Author.findOne({ name: root.name });
      const authorBooks = await Book.collection.countDocuments({
        author: author._id,
      });
      return authorBooks;
    },
  },
  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.findOne({ name: args.author });

      if (!author) {
        author = new Author({ name: args.author });
        try {
          author.save();
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          });
        }
      }

      const book = new Book({ ...args, author: author._id });

      try {
        await book.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }

      return book;
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name });
      author.born = args.setBornTo;

      try {
        await author.save();
      } catch (error) {
        console.log("error", error.message);
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }

      return author;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
