require('dotenv').config()
const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const cookieParser=require('cookie-parser')
const fileUpload=require('express-fileupload')

const app=express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles:true
}))

//Routes
app.use('/user',require('./routes/userRoute'))
app.use('/todo',require('./routes/todoRoute'))
//Connect to mongo Db
const uri=process.env.MONGODB_URI
mongoose.connect(uri,{
    useNewUrlParser:true,
    useUnifiedTopology:true
},err=>{
    if(err) throw err;
    console.log("Connected to MongoDB")
})

app.use('/',(req,res,next)=>{
    res.json({message:"Hey Bro! Add your Todo"})
})

const PORT=process.env.PORT ||8080
app.listen(PORT,()=>{
    console.log(`Server is Runnig at Port Number:${PORT}`)
})