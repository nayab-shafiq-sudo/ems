import express from "express"
import cors from "cors"
import "dotenv/config"
import multer from "multer"
import ConnectDb from "./config/db.js"
import authRouter from "./routes/authRoutes.js"
import employeesRouter from "./routes/employeeRoutes.js"
import profileRouter from "./routes/profileRoutes.js"
import attendanceRouter from "./routes/attendanceRoutes.js"


const app = express()

// MIDDLEWARE
app.use(cors())
app.use(express.json())
app.use(multer().none())


// ROUTES
app.get('/', (req, res) => res.send("Server is running!"))
app.use('/api/auth', authRouter)
app.use('/api/employees', employeesRouter)
app.use('/api/profile', profileRouter)
app.use('/api/attendance', attendanceRouter)


await ConnectDb();

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>{
    console.log(`Server is running fine on port ${PORT}`)
})

