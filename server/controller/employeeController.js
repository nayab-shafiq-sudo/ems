import employeeModel from "../models/Employee.js";
import userModel from "../models/User.js";
import bcrypt from "bcrypt"

// GET EMPLOYEES
// GET /api/employees
export const getEmployees = async (req, res) => {
    try {
        const { department } = req.query;
        const where = {}
        if (department)  where.department = department;

        const employees = (await employeeModel.find(where)).toSorted({createdAt: -1}).populate("userId", "email role").lean();

        const result = employees.map((emp)=> ({
            ...emp,
            id: emp._id.toString(),
            user: emp.userId ? {email: emp.userId.email, role:emp.userId.role} : null
        }))
        return res.json(result)
    } catch (error) {
        return res.status(500).json({error: "Failed to fetch employees"})
    }
}


// CREATE EMPLOYEE
// POST /api/employees
export const createEmployee = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, position, basicSalary, allowances, deductions, role, joinDate, bio, department, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({message: "Missing required field"})
        }
        // BCRYPTING PASSWORD
        const hashed = await bcrypt.hash(password, 10)
        // CREATING USER
        const user = await userModel.create({ email, password:hashed, role: role || "EMPLOYEE"})
        // CREATING EMPLOYEE
        const employee = await employeeModel.create({ userId: user._id, firstName, lastName, email, phone, position, department: department || "Engineering", basicSalary: Number(basicSalary) || 0, allowances: Number(allowances) || 0, deductions: Number(deductions) || 0, joinDate: new Date(joinDate), bio: bio || "" })
        
        return res.status(201).json({success: true, employee})
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({error: "Email already exists"})
        }
        console.error("Creating employee error:", error)
        return res.status(500).json({ error: "Failed to create employee" })
    }
}


// UPDATE EMPLOYEE
// PUT /api/employees/:id
export const updateEmployee = async (req, res) => {
   try {
     const {id} = req.params;
     const { firstName, lastName, email, phone, position, basicSalary, allowances, deductions, role, bio, department, password, employmentStatus } = req.body;
 
     const employee = await employeeModel.findById(id);
     if (!employee) return res.status(404).json({error: "Employee not found"})
 
    await employeeModel.findByIdAndUpdate(id, {
        firstName,
        lastName,
        email,
        phone,
        position,
        department: department || "Engineering",
        basicSalary: Number(basicSalary) || 0,
        allowances: Number(allowances) || 0,
        deductions: Number(deductions) || 0,
        employmentStatus: employmentStatus || "ACTIVE",
        bio: bio || ""
    })

    // UPDATE USER RECORD
    const userUpdate = {email}
    if (role) userUpdate.role = role;
    if (password) userUpdate.password = await bcrypt.hash(password, 10);
    await userModel.findByIdAndUpdate(employee.userId, userUpdate)

    return res.json({ success: true})

   } catch (error) {
    if (error.code === 11000) {
        return res.status(400).json({error: "Email already exists"})
    }
    return res.status(500).json({error: "Failed to update employee"})
   }
}


// DELETE EMPLOYEE
// DELETE /api/employees/:id
export const deleteEmployee = async (req, res) => {
    try {
        const {id} = req.params
        const employee = await employeeModel.findById(id)
        if (!employee) return res.status(404).json({message: "Employee not found"})
        
        employee.isDeleted = true;
        employee.employmentStatus = "INACTIVE";
        await employee.save()
        
        return res.json({success: true})
    } catch (error) {
        return res.status(500).json({error: "Failed to delete employee"})
    }
}