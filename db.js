const mongoose = require('mongoose');

const mongoURI="mongodb://localhost:27017/inotebookNEW"

const connectToMongo=()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("connected to mongo success")
    })
}
module.exports =connectToMongo