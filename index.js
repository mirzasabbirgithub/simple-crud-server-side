const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

const app = express();

// app.use(cors());
const corsConfig = {
          origin: '*',
          credentials: true,
          methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors(corsConfig))
app.options("*", cors(corsConfig))

app.use(function (req, res, next) {
          res.header("Access-Control-Allow-Origin", "*")
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,authorization")
          next()
})
app.use(express.json());

const uri = "mongodb+srv://simplecrud:I7TBXTbqIYsehlci@cluster0.wblcv.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
          try {
                    await client.connect();
                    console.log('database connected');
                    const recordCollection = client.db('allRecords').collection('record');

                    //get data from mongodb
                    app.get('/record', async (req, res) => {
                              const query = {};
                              const cursor = recordCollection.find(query);
                              const records = await cursor.toArray();
                              res.send(records);
                    });

                    //add record
                    app.post('/record', async (req, res) => {
                              const newRecord = req.body;
                              const result = await recordCollection.insertOne(newRecord);
                              res.send(result);
                    });

                    //detele record
                    app.delete('/record/:id', async (req, res) => {
                              const id = req.params.id;
                              const query = { _id: ObjectId(id) };
                              const result = await recordCollection.deleteOne(query);
                              res.send(result);
                    });

                    //Individual Record
                    app.get('/record/:id', async (req, res) => {
                              const id = req.params.id;
                              const query = { _id: ObjectId(id) };
                              const records = await recordCollection.findOne(query);
                              res.send(records);
                    });



                    //update 
                    app.put('/record/:id', async (req, res) => {
                              const id = req.params.id;
                              const record = req.body;
                              console.log(record)
                              const filter = { _id: ObjectId(id) };
                              const options = { upsert: true };

                              const updateDoc = {
                                        $set: {
                                                  name: record.name,
                                                  detials: record.detial,
                                                  img1: record.img1,
                                                  img2: record.img2

                                        },
                              };
                              const result = await recordCollection.updateOne(filter, updateDoc, options)
                              res.send(result);
                    });

          }

          finally {
          }

}

run().catch(console.dir);

app.get('/', (req, res) => {
          res.send('Server is runnning');
});

app.listen(port, () => {
          console.log('Listening to port', port);
})