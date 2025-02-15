import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from 'dotenv'
import authRoute from "./Routes/auth.js"
import userRoute from "./Routes/user.js"
import mentorRoute from "./Routes/mentor.js"

dotenv.config()

const app = express()

const port = process.env.PORT || 8000

const corsOptions = {
    origin: true
}


app.get('/', (req, res)=>{
    res.send('Server is working')
})

// database connection
mongoose.set('strictQuery', false)
const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        console.log("MongoDB database is connected successfully");
    }

    catch(err){
        console.log('MongoDB database connection is failed',err);
    }
}

// middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))
app.use('/api/v1/auth', authRoute) //domain/api/v1/auth/register
app.use("/api/v1/users", userRoute)
app.use("/api/v1/mentors", mentorRoute)

app.listen(port, ()=>{
    connectDB()
    console.log(`Server is running on port ` + port);
})