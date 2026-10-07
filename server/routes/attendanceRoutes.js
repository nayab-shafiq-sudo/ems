import { Router } from "express"
import { clockInOut, getAttendance } from "../controller/attendanceController.js";
import { protect } from "../middleware/authMiddleware.js";




const attendanceRouter = Router()



attendanceRouter.post('/', protect, clockInOut)
attendanceRouter.get('/', protect, getAttendance)





export default attendanceRouter;