const express =require('express');
const mongoose=require('mongoose');
const app=express()
const cors=require('cors')
app.use(cors())
app.use(express.json())
const port =8000;
// app.get('/',(req,res)=>{
//     res.send("Hello world!!")
// })

//connecting mogodb 

mongoose.connect('mongodb://localhost:27017/project-mern')
.then(()=>{
    console.log('Db connected')
})
.catch((err)=>{
    console.log(err)
})

//creating schema...
const todoSchema=new mongoose.Schema({
    title:{
        required:true,
        type:String
    },
    description:String
})
//creating model
const todoModel=mongoose.model('Todo',todoSchema);
//temporary variable to store the value....
// let todos=[]



app.post('/todos',async(req,res)=>{
     const {title,description}=req.body;
    // const newTodo={
    //     id:todos.length+1,
    //     title,
    //     description,
    // }
    // todos.push(newTodo);
    // console.log(todos);

    try{
        const newTodo=new todoModel({title,description});
        await newTodo.save();
        res.status(201).json(newTodo);
        // console.log(newTodo)
    }catch(error){
    console.log(error)
    res.status(500).json({message:error.message});
    }
    // res.status(201).json(newTodo)
})

app.get('/todos',async(req,res)=>{
    // res.json(todos);

    try{
        const todos=await todoModel.find();
        res.json(todos);
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:error.message});
    }
})

app.put("/todos/:id",async(req,res)=>{
    try{
        const {title,description}=req.body;
        const id=req.params.id;
        const updateTodo=await todoModel.findByIdAndUpdate(
            id,
            {title,description}
        )
        if(!updateTodo){
            return res.status(404).json({message:"Todo not found"})
        }
        res.json(updateTodo)
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:error.message});
    }
})

//delete 

app.delete('/todos/:id',async(req,res)=>{
     try{
        const id=req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
     }catch(error){
        console.log(error)
        res.status(500).json({message:error.message});
     }    
})

app.listen(port,()=>{
    console.log("server is running in the port:"+port)
})