const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// { origin: ["localhost url", "live url"] }

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ufkobjs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const database = client.db("tourismDB")
        const tourismCollection = database.collection("tourism")

        app.get("/travel", async (req, res) => {
            const cursor = tourismCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get("/travel/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await tourismCollection.findOne(query);
            res.send(result);
        })

        app.post("/travel", async (req, res) => {
            const data = req.body;
            console.log(data);
            const result = await tourismCollection.insertOne(data);
            res.send(result);
        })

        app.put("/travel/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedPlace = req.body;
            const place = {
                $set: {
                    photo: updatedPlace.photo,
                    touristsSpot: updatedPlace.touristsSpot,
                    countryName: updatedPlace.countryName,
                    location: updatedPlace.location,
                    description: updatedPlace.description,
                    averageCost: updatedPlace.averageCost,
                    seasonality: updatedPlace.seasonality,
                    travelTime: updatedPlace.travelTime,
                    totaVisitors: updatedPlace.totaVisitors,
                }
            }
            const result = await tourismCollection.updateOne(filter, place, options);
            res.send(result);
        })

        app.delete("/travel/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await tourismCollection.deleteOne(query);
            res.send(result);
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get("/", (req, res) => {
    res.send("Tourism Management Server is Running")
})

app.listen(port, () => {
    console.log("Tourism Server Running on", port);
})