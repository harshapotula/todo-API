const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://Harshavardhan:Harsha@1@cluster0.f5e7u.mongodb.net/todoDB?retryWrites=true&w=majority";
const ObjectID = require('mongodb').ObjectID;
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
var db;

var http = require('http');
http.createServer(app).listen(PORT, () => {
   console.log('HTTP Server listening to port 80');
   Initialize();
});

var Initialize = async function(){
   const client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});
   client.connect(err => {
      const collection = client.db("test").collection("todo");
      // perform actions on the collection object
      client.close();
    }).catch(error =>console.log(error));
   setInterval(()=>{
      db.collection('todo').deleteMany({deleteAt: {$gt: new Date()}})
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
   var result = await db.collection('todo').insert(data);
   if(result.result.ok == '1') res.send('Success')
   else res.send("Failed")
});

app.get('/list', async(req, res)=>{
   var docs = await db.collection('todo').find().toArray();
   res.send(JSON.stringify(docs));
})

module.exports = {
    Initialize: Initialize,
}