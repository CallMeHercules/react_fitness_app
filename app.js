const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

app.use(bodyParser.json());

app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(`
      type RootQuery {
        lifts: [String!]!
      }

      type RootMutation {
        addLift(name: String): String
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }
    `),
    rootValue: {
      lifts: () => {
        return ['Bench Press', 'Squat', 'Deadlift'];
      },
      addLift: (args) => {
        const liftName = args.name;
        return liftName;
      },
    },
    graphiql: true,
  })
);

app.listen(3000, () => {
  console.log('GraphQL server is running at http://localhost:3000/graphql');
});
