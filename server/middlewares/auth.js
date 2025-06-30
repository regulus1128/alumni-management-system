import jwt from "jsonwebtoken";

const authorizeRole = (allowedRoles = []) => {
    return (req, res, next) => {
        try {
            const token = req.cookies.token;
            
            if(!token) return res.status(401).json({ message: "Unauthorized!" });

            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            // console.log('decoded: ', decoded);
            req.user = {
                _id: decoded.id,
                // email: decoded.email,
                role: decoded.role,
            };
            // console.log(req.user);

            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({ message: "Forbidden: Access denied" });
              }
        
            next();

        } catch (error) {
            console.log(error);
            res.status(401).json({ message: "Invalid token" });
        }
    }
}

export default authorizeRole;