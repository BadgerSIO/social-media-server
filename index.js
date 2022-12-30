const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const reviewCollections = client.db("socialMedia").collection("reviews");
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
    //get single post
    app.get("/posts/:id", async (req, res) => {
      const postId = req.params.id;
      const query = {
        _id: ObjectId(postId),
      };
      const result = await postCollections.findOne(query);
      res.send(result);
    });
    //add user
    app.post("/user", async (req, res) => {
      const user = req.body;
      const result = await userCollections.insertOne(user);
      res.send(result);
    });
    //get user
    app.get("/user/:email", async (req, res) => {
      const reqEmail = req.params.email;
      const query = {
        userEmail: reqEmail,
      };
      const result = await userCollections.findOne(query);
      res.send(result);
    });
    //add review
    app.post("/comment", async (req, res) => {
      const comment = req.body;
      const result = await reviewCollections.insertOne(comment);
      res.send(result);
    });
    //get review
    app.get("/comment/:postId", async (req, res) => {
      const postId = req.params.postId;
      const query = {
        postId: postId,
      };
      const result = await reviewCollections.find(query).toArray();
      res.send(result);
    });
  } finally {
  }
};
run().catch((error) => console.error(error));
