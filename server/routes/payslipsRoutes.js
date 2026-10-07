import { Router } from "express";
import { protect, protectAdmin } from "../middleware/authMiddleware.js";
import { createPayslip, getPayslip, getPayslipById } from "../controller/payslipController.js";



const payslipRouter = Router()


payslipRouter.post('/', protect, protectAdmin, createPayslip)
payslipRouter.get('/', protect, getPayslip)
payslipRouter.get('/:id', protect, getPayslipById)







export default payslipRouter;