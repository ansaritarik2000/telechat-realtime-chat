import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1]; // Expecting 'Bearer <token>'

    if (!token) {
        return res.status(401).json({ error: "Access token missing." });
    }

    // console.log( 'token', token );
    // console.log( 'secret', process.env.JWT_SECRET );

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Invalid or expired token." });
        }

        // Add user information from the token to the request object
        req.user = {
            id: decoded.id,
            email: decoded.email,
        };

        next();
    });
};
