import employeeModel from "../models/Employee.js"




// GET PROFILE
// GET /api/profile
export const getProfile = async (req, res) => {
    try {
        // Get logged-in user
        const session = req.session
        // Find employee profile
        const employee = await employeeModel.findOne({userId: session.userId})

        if (!employee) {
            // AUTHANTICATED USER IS NOT AN EMPLOYEE - RETURN ADMIN PROFILE
            return res.json({
                firstName: "Admin", lastName: "", email: session.email
            })
        }
        // Return employee profile
        return res.json(employee)
    } catch (error) {
        return res.status(500).json({error: "Failed to fetch profile"})
    }
}

// UPDATE PROFILE
// PUT /api/profile
export const updateProfile = async (req, res) => {
    try {
        // Get logged-in user
        const session = req.session;
        // Find employee profile
        const employee = await employeeModel.findOne({userId: session.userId})
        if (!employee) return res.status(404).json({message: 'Employee not found'})
        // CHECK EPLOYEE IS INACTIVE
        if (employee.isDeleted) return res.status(403).json({error: "Your account is deactivated. You cannot update your profile"})
        // Update profile bio
        await employeeModel.findByIdAndUpdate(employee._id, {
            bio: req.body.bio
        })
        return res.json({success : true});
    } catch (error) {
        return res.status(500).json({error: "Failed to update profile"})
    }
}