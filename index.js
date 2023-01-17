const connectToMongo =require('./db');
var cors = require('cors')
connectToMongo();
const cors=require("cors");
const corsOptions ={
  origin:'*', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}

app.use(cors(corsOptions))
const express = require('express')
const app = express()
const port = 5000


app.use(cors())

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello mongoose!')
})
//available routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))




app.listen(port, () => {
  console.log(`CloudNotebook app listening on port http://localhost:${port}`)
})