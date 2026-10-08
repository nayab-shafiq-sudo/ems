import employeeModel from "../models/Employee.js"
import payslipModel from "../models/Payslip.js"




// CREATE PAYSLIP
// POST /api/payslis
export const createPayslip = async (req, res) => {
    try {
        const { employeeId, month, year, basicSalary, allowances, deductions } = req.body
        if (!employeeId || !month || !year || !basicSalary || !allowances || !deductions) {
            return res.status(400).json({error: "Missing fields"})
        }

        const netSalary = Number(basicSalary) + Number(allowances || 0) - Number(deductions || 0)

        const payslip = await payslipModel.create({
            employeeId,
            month: Number(month),
            year: Number(year),
            basicSalary: Number(basicSalary),
            allowances: Number(allowances || 0),
            deductions: Number(deductions || 0),
            netSalary
        })
        return res.json({success: true, data: payslip})
    } catch (error) {
        return res.status(500).json({error: "Failed"})
    }
}

// GET PAYSLIP
// GET /api/payslis
export const getPayslip = async (req, res) => {
    try {
        const session = req.session;
        const isAdmin = session.role === "ADMIN";
        if (isAdmin) {
            const payslips = await payslipModel.find().populate('employeeId').sort({createdAt: -1});

            const data = payslips.map((p)=>{
                const obj = p.toObject()
                return {
                    ...obj,
                    id: obj._id.toString(),
                    employee: obj.employeeId,
                    employeeId: obj.employeeId?._id?.toString(),
                }
            })
            return res.json({data})
        } else {
            const employee = await employeeModel.findOne({userId: session.userId})
            if (!employee) return res.status(404).json({error: "Employee not found"});

            const payslip = await payslipModel.find({employeeId: employee._id}).sort({createdAt: -1});
            return res.json({data: payslip})
        }

    } catch (error) {
        return res.status(500).json({error: "Failed"})
    }
}

// GET PAYSLIP BY ID
// GET /api/payslis/:id
export const getPayslipById = async (req, res) => {
    try {
        const payslip = await payslipModel.findById(req.params.id).populate('employeeId').lean();
        if (!payslip) return res.status(404).json({error: "Payslip not found"});

        const result = {
            ...payslip,
            id: payslip._id.toString(),
            employee: payslip.employeeId,
        }
        return res.json(result)
    } catch (error) {
        return res.status(500).json({error: "Failed"})
    }
}