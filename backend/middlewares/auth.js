const jwt = require("jsonwebtoken");

exports.userAuthentication = (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Please login to access"
        })
    } else {
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.userId = decode.id;
            req.userRole = decode.role;
            req.userEmail = decode.email;

            next();
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
}

exports.userAuthorization = (requiredRole) => {
    return (req, res, next) => {
        if(!requiredRole.includes(req.userRole)) {
             return res.status(403).json({
                success: false,
                message: "Access forbidden"
            })
        }

        next();
    }
}