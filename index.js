const express =require('express')
const cors = require('cors')
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app=express();
const port=process.env.PORT || 5000;

// middleware
app.use(cors({
  origin:["http://localhost:5173","https://craft-verse-55d42.web.app","https://craft-verse-55d42.firebaseapp.com"]
}))
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cxuuz57.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const craftCollection = client.db("craftDB").collection("craft");

    // Data post
    app.post("/craft",async(req,res)=>{
        const newCraft=req.body;
        const result= await craftCollection.insertOne(newCraft)
        res.send(result)
    })

    // Data read all
    app.get("/craft",async(req,res)=>{
      const cursor=craftCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    // Data read with email
    app.get("/craft/:email",async(req,res)=>{
      const result= await craftCollection.find({email:req.params.email}).toArray();
      res.send(result)
    })

    // Data read with id
    app.get("/singleCraft/:id",async(req,res)=>{
      const id=req.params.id
      const query = {_id: new ObjectId(id)} 
      const result= await craftCollection.findOne(query)
      res.send(result)
    })

    // Data update
    app.put("/updateCraft/:id",async(req,res)=>{
      const id=req.params.id;
      const filter = {_id: new ObjectId(id)} 
      const options={upsert:true};
      const updatedCraft = req.body;
      const data={
          $set:{
              item_name:updatedCraft.item_name,
              subcategory:updatedCraft.subcategory,
              rating:updatedCraft.rating,
              price:updatedCraft.price,
              description:updatedCraft.description,
              customization:updatedCraft.customization,
              stockStatus:updatedCraft.stockStatus,
              processing_time:updatedCraft.processing_time,
              photo:updatedCraft.photo,
          }
      }
      const result= await craftCollection.updateOne(filter,data,options)
      res.send(result)
    })

    // Data Delete
    app.delete("/delete/:id",async(req,res)=>{
      const id=req.params.id;
      const query = {_id: new ObjectId(id)};
      const result=await craftCollection.deleteOne(query);
      res.send(result)
    })

  } finally {

  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('art and craft processing')
})

app.listen(port,()=>{
    console.log(`art and craft processing on port: ${port}`)
})