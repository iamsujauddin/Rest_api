const express=require('express');
var bodyParser=require('body-parser');
const mongoose=require('mongoose');
const {MONGO_URI}=require('./config');
const app=express()

mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connntected to dattabase")
});

app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
const nailSchema = new mongoose.Schema({
    size: {
       type: Number,
       required:true
    },
    // rateByWeight: [
    //         {weight1:String,value1:Number},
    //         {weight2:String,value2:Number},
    //         {weight3:String,value3:Number}
    //     ]
    weight1:{
        type:Number,
        required:true
    },
    weight2:{
        type:Number,
        required:true
    },
    weight3:{
        type:Number,
        required:true
    },
    todayPrice:{
        type:Date,
        required:true,
        default:Date.now
    }
});

const Nail = mongoose.model('Nail', nailSchema); 


app.get('/',(req,res)=>{
    res.send('hello ');
});

app.get('/rates',async (req,res)=>{
    try{
        const nail= await Nail.find()
        res.send(nail);
    }catch(e){
        res.status(400).send("bad request")
    }
});

app.post('/',async(req,res)=>{

    const nail=new Nail({
        size:req.body.size,
        weight1:req.body.weight1,
        weight2:req.body.weight2,
        weight3:req.body.weight3
    })   
    try{
        const newNail=await nail.save()
        res.status(201).json(newNail)
    } catch(err){
        res.status(400).send("user give bad data")
    }
})

app.get('/rates/:id',async(req,res)=>{

try{
    const nail=await Nail.findById(req.params.id)
    res.json(nail);
}catch(err){
    res.send('eroor'+err);
}

// const result=parseFloat(req.params.id);
// const newNail=Nail.find({size:result});
// console.log(result);
// console.log(newNail);
//     res.send(newNail);
   // res.send(res.nail.size);
});

function getNails(req,res,next){
 let nail;
 try{
     nail= Nail.findById(req.params.id)
     if(nail==null){
         return res.status(404).json({message:'cannot find nails'});
     }
 }catch(err){
     return res.status(500).json({message:err.message})
 }
 res.nail=nail
 next()
}

app.listen(8888)