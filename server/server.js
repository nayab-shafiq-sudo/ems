import express from "express"
import cors from "cors"
import "dotenv/config"
import multer from "multer"
import ConnectDb from "./config/db.js"


const app = express()
const PORT = process.env.PORT || 4000;

// MIDDLEWARE
app.use(cors())
app.use(express.json())
app.use(multer().none())


// ROUTES
app.get('/', (req, res) => res.send("Server is running!"))


await ConnectDb();
app.listen(PORT, ()=>{
    console.log(`Server is running fine on port ${PORT}`)
})

