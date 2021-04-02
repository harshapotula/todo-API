const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost/harshatodoDB";
const ObjectID = require('mongodb').ObjectID;
const express = require('express');
const app = express();
var db;

var http = require('http');
http.createServer(app).listen(80, () => {
   console.log('HTTP Server listening to port 80');
   Initialize();
});

var Initialize = async function(){
   const client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});
   await client.connect();
   console.log("Connected To Database");
   db = client.db('Harsha');
   setInterval(()=>{
      db.collection('Todo').deleteMany({deleteAt: {$gt: new Date()}})
   }, 60000) //delete expired docs (check after every 1 minutes), not using TTL in mongodb though can be used
}
app.use(express.json())
app.post('/add', async(req, res)=>{
   var createdAt = new Date();
   var deleteAt = new Date(createdAt.valueOf() + (Number(req.body.duration)*60000));
   var data = {
      name: req.body.name, 
      description: req.body.description, 
      creator: req.body.creator, 
      duration: req.body.duration, 
      createdAt: createdAt,
      deleteAt: deleteAt
   }
   var result = await db.collection('Todo').insert(data);
   if(result.result.ok == '1') res.send('Success')
   else res.send("Failed")
});

app.get('/list', async(req, res)=>{
   var docs = await db.collection('Todo').find().toArray();
   res.send(JSON.stringify(docs));
})

module.exports = {
    Initialize: Initialize,
}