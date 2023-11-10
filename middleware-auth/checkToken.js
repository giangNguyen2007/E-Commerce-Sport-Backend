
const jwt = require('jsonwebtoken');


// check if request has valid token
const checkToken = async (req, res, next) => {
    const authHeader = req.headers.token;
    
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        try {
            const user = jwt.verify(token, process.env.JWT_SECRET)
            req.user = user;
            console.log(`Token authentication sucessful`)
            next();
                
        } catch (error) {
            res.status(403).json("Unvalid token");
        }

    } else {
        res.status(403).json("Access Token required");
    }
}

// checkIdentity can be called only after checkToken
const checkIdentity = (req, res, next) => {
    if (!req.user) {
        return res.status(403).json("Unchecked authentication");
    }

    if (req.user.id == req.params.id & req.user.id == req.body.userId ) {
        console.log('User identity matched')
        next();
    } else {
        return res.status(403).json("Unauthorisation due to identity mismatch");
    }
}


const checkAdmin = (req, res, next) => {
    if (req.user.isAdmin) {
        console.log('Admin identification successful')
        next();
    } else {
        console.log('Admin identification failed')
        res.status(403).json("Admin authorisation required");
    }
}


module.exports ={checkToken, checkAdmin, checkIdentity};