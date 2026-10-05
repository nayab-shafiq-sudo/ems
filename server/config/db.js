import mongoose from "mongoose"

const ConnectDb = async () => {
    try {
        mongoose.connection.on('connected', ()=> console.log("Database Connected"))
        await mongoose.connect(process.env.MONGO_URI)
    } catch (error) {
        console.error("Database connection failed:", error.mesage)
    }
}


export default ConnectDb;