import "dotenv/config"
import ConnectDb from "./config/db.js"
import userModel from "./models/User.js"
import bcrypt from "bcrypt"

const TemporaryPassword = "admin@123"


async function registerAdmin() {
    try {
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL
        if (!ADMIN_EMAIL) {
            console.error("Missing ADMIN_EMAIL env variable")
            process.exit(1)
        }
        await ConnectDb()
        const existingAdmin = await userModel.findOne({email: process.env.ADMIN_EMAIL});
        if (existingAdmin) {
            console.log("User already exists as role:", existingAdmin.role);
            process.exit(0)
        }

        const hashPassword = await bcrypt.hash(TemporaryPassword, 10)
        const admin = await userModel.create({
            email: process.env.ADMIN_EMAIL,
            password: hashPassword,
            role: "ADMIN",

        })
        console.log("Admin user created.")
        console.log("\nemail:",admin.email)
        console.log("\password:", TemporaryPassword)
        console.log("\nchnage the password after login.")

        process.exit(0)
    } catch (error) {
        console.error("Seed Failed:", error)
    }
}
registerAdmin()