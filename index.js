const express = require("express");
const cors = require('cors');
require('dotenv').config();
const app =express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middle Wire 
app.use(cors())
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a3cooza.mongodb.net/?retryWrites=true&w=majority`;

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
    // collections

    //User collection 
    const userCollection = client.db("Task-managementBD").collection('Users');

    // Create Task collection
    const createCollection = client.db("Task-managementBD").collection('Create-Task');

// Users
app.post("/users", async (req, res) => {
    const user = req.body;
    const query = { email: user.email };
    //  console.log("Query", query);
    const existingUser = await userCollection.findOne(query);
    if (existingUser) {
         return res.send({ message: "user already exists" });
    }
    const result = await userCollection.insertOne(user);
    res.send(result);
});

    app.get('/users', async(req,res) => {
        const cursor = userCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      })

    //   Create Task

    app.post('/addTask',async(req,res) => {
        const newTask = req.body;

        const result = await createCollection.insertOne(newTask);
        res.send(result);
    })

    app.get('/addTask', async(req,res) => {
        const cursor = createCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      })
      app.get('/addTask/:id', async(req,res) => {
        const id = req.params.id;
           const quary = {_id: new ObjectId(id)};
           const result = await createCollection.findOne(quary);
        res.send(result);
      })

      app.delete('/addTask/:id', async(req,res) => {
        const id = req.params.id;

        console.log(id);
        const quary = {_id: new ObjectId(id)};
        const result = await createCollection.deleteOne(quary);
        res.send(result);
  })

  app.put('/addTask/:id',async(req,res) => {
    const id = req.params.id;
    console.log("delete",id);
    const filter = {_id : new ObjectId(id)};
    const updated = req.body;
    console.log(updated.status);
      if(updated.status === 'todo'){
        const updatedAssignment = {
            $set: {
              status: "ongoing"
            }
          } 
          const result = await createCollection.updateOne(filter,updatedAssignment);
          res.send(result);
      }
       if(updated.status === 'ongoing'){
        const updatedAssignment = {
            $set: {
              status: "completed"
            }
          } 
          const result = await createCollection.updateOne(filter,updatedAssignment);
          res.send(result);
      }
     
   })
//   app.patch('/addTask/:id',async(req,res) => {
//     const id = req.params.id;
//     console.log("hello",id);
//     const filter = {_id : new ObjectId(id)};
//     const updated = req.body;
//       const updatedAssignment = {
//         $set: {
//           status: "completed"
//         }
//       } 
//       const result = await createCollection.updateOne(filter,updatedAssignment);
//       res.send(result);
     
//    })


    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get ('/',(req,res) => {
    res.send('server is running')
});

app.listen(port ,() =>{
    console.log(`server is running on port:${port}`)
});