const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
// MIDDLEWARE
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Social media server is running");
});

app.listen(port, () => {
  console.log(`social media server is running on port ${port}`);
});

// MONGODB

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gqpfnmn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const run = async () => {
  try {
    const postCollections = client.db("socialMedia").collection("posts");
    const userCollections = client.db("socialMedia").collection("users");
    //add posts
    app.post("/post", async (req, res) => {
      const post = req.body;
      const result = await postCollections.insertOne(post);
      res.send(result);
    });
    //get posts
    app.get("/posts", async (req, res) => {
      const query = {};
      const result = await postCollections.find(query).toArray();
      res.send(result);
    });
    //add user
    app.post("/user", async (req, res) => {
      const user = req.body;
      const result = await userCollections.insertOne(user);
      res.send(result);
    });
  } finally {
  }
};
run().catch((error) => console.error(error));
