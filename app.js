const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Lift = require('./models/olympic_lift')

const app = express();

const lifts = [];

app.use(bodyParser.json());

app.use(
    '/graphql',
    graphqlHTTP({
        schema: buildSchema(`

      type Lift {
        _id: ID!
        name: String!
        kinesiology_id: Int!
      }

      input LiftInput {
        name: String!
        kinesiology_id: Int!
      }

      type RootQuery {
        lifts: [Lift!]!
      }

      schema {
        query: RootQuery
      }
    `),
        rootValue: {
            lifts: async () => {
                try {
                    const result = await Lift.find();
                    console.log(result)
                    return result.map(lift => {
                        return { ...lift._doc };
                    });
                } catch (err) {
                    console.log(err);
                    throw err; // Propagate the error
                }
            },
            addLift: (args) => {
                const lift = new Lift({
                    name: args.liftInput.name
                });
                lift.save().then(lift => {
                    console.log(lift);
                    return {...lift._doc}
                }).catch(err => {
                    console.log(err);
                });
            },
        },
        graphiql: true,
    })
);

mongoose.connect(`mongodb://localhost:27017/test_database`)

// Get the default connection
const db = mongoose.connection;

// Event handlers for connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
  // Your code here
});

app.listen(3000, () => {
    console.log('GraphQL server is running at http://localhost:3000/graphql');
});
