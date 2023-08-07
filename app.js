//npm install the dependencies
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
let list=[];
let Task;
async function dbConnect(){
    await mongoose.connect('mongodb://127.0.0.1:27017/todoList');
    console.log("connected to db");
    const taskSchema =new mongoose.Schema({
        taskToDo:String
    })

    Task=mongoose.model("Task",taskSchema)

    let dbTasks=await Task.find({});
    let arr=[]
    dbTasks.forEach(ele => {
        arr.push(ele.taskToDo)
    });
    list= arr;
}
dbConnect().catch(function(err){
    console.log(err);
});

async function insertData(data){
    const task= new Task({
        taskToDo:data
    })
    await task.save();
    console.log("inserted "+data+" in db");
}

async function deleteData(data){
    await Task.deleteOne({taskToDo:data})
    console.log("deleted "+data+" from db");
}

async function clearTaskListInDB(){
    try {
        // Deletes all documents in the collection
        const result = await Task.deleteMany({});
        console.log(`Deleted ${result.deletedCount} documents from the collection.`);
      } catch (err) {
        console.error('Error clearing collection:', err);
      }
}


const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");

var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
var today  = new Date();
var currentDate=today.toLocaleDateString("en-US", options);


app.get("/", function(req,res){
    console.log(list)
    res.render("index.ejs",{todoList:list,todaysDate:currentDate});
})

app.post("/",async function(req,res){
    console.log(req.body,"zzzzzzzzzzzzzzzzzzzzzzzzzzzzz")
    let addedTask=req.body.taskInput;
    console.log(addedTask)
    list.push(addedTask);
    await insertData(addedTask);
    res.redirect("/");
})

app.post("/removeItem",async function(req,res){
    console.log(req.body.hiddenVal);
    var indexToRemove=req.body.hiddenVal;
    await deleteData(list[indexToRemove]);
    list.splice(indexToRemove,1);
    res.redirect("/");
})

app.post("/clearList",async function(req,res){
    list=[];
    await clearTaskListInDB();
    res.redirect("/");
})

app.listen(3000,function () { 
    console.log("server running in port 3000");
 })

//when running with nodmon database connection closed message is inconsistent, works perfectly when ruinning with "node app.js"
process.on('SIGINT', async () => {
    console.log('SIGINT event triggered.');
    try {
        await mongoose.connection.close();
        console.log('Database connection closed.');
        process.exit(0);
      } catch (err) {
        console.error('Error closing database connection:', err);
        process.exit(1);
      }
});

process.on('exit', (code) => {
    console.log(`Exiting with code ${code}`);
  });
  
