const mongoose = require('mongoose');

const mongoURI="mongodb+srv://Aditya:FYE3qYqCU1OSGUZI@inotebook.44b8nqa.mongodb.net/?retryWrites=true&w=majority"

const connectToMongo=()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("connected to mongo success")
    })
}
module.exports =connectToMongo