const express = require('express');
const app = express();
const cors = require("cors");

require('dotenv').config();
const port = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m8ez0de.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const db = client.db('Admissiondb');
    const usersCollection = db.collection('users');

    app.post("/users", async (req, res) => {
      const user = req.body;

      const query = { email: user.email };
      const existingUser = await usersCollection.findOne(query);

      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      const result = await usersCollection.insertOne(user);
      res.status(201).json({ message: "User created successfully", data: result.ops[0] });
    });

    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.status(200).json(result);
    });

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('sports is start');
});

app.listen(port, () => {
  console.log(`sports is start on port ${port}`);
});
