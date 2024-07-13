const express = require("express");
var { graphqlHTTP } = require("express-graphql");
const dotenv = require("dotenv");
const schema = require("./server/schema/schema");
const testSchema = require("./server/schema/types_schema");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 4000;
const cors = require("cors");

// Variable de entorno
dotenv.config({ path: ".env" });

app.use(cors());
app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema: schema,
  })
);

mongoose.connect(process.env.URI).then(() => {
    app.listen({ port: port }, () => {
      // console.log(process.env.mongoUserName);
      //localhost:4000
      console.log("Listening for requests on my awesome port " + port);
    });
  })
  .catch((e) => {
    // console.log(process.env.URI);
    return console.log("Error:::" + e);
  });
