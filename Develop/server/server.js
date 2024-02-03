const express = require('express');
// added 2 lines
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
// added 2 lines 
const { authMiddleware } = require('./utils/auth');
// Import the two parts of a GraphQL schema
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

// const routes = require('./routes');

const app = express();

const PORT = process.env.PORT || 3001;
//added 3 lines
const server = new ApolloServer({
  typeDefs,
  resolvers,
})
// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
  await server.start();
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware
  }));


  // if we're in production, serve client/build as static assets
  // GGL Are the below 6 lines part of React, If yes we do not need them for the refact
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(_dirname, '../client/dist/index.html'));
    });
  }

  // app.use(routes);

  db.once('open', () => {
    // replaced below line for Graphql arrow funtion line
    // app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

// Call the async function to start the server
startApolloServer();