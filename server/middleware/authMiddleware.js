import jwt from "jsonwebtoken";




export const protect = (req, res, next) => {
    try {
        // GET AUTH HEADER
        const authHeader = req.headers.authorization;
        // CHECKING BEARER TOKEN
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({error: "Unauthorized"})
        }
        // GET TOKEN
        const token = authHeader.split(" ")[1]
        // VERIFY TOKEN
        const session = jwt.verify(token, process.env.JWT_SECRET)
        if (!session) return res.status(401).json({error: "Unauthorized"})
        // STORE TOKEN
        req.session = session;
        next();
    } catch (error) {
        return res.status(401).json({error: "Unauthorized"})
    }
}


export const protectAdmin = (req, res, next) => {
    if (req?.session?.role !== "ADMIN") {
        return res.status(403).json({error: "Admin access required"})
    }
    next();
}