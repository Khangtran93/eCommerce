import jwt from 'jsonwebtoken'
import asyncHandler from './asyncHandler.js'
import User from '../model/userModel.js'

//protect routes

const protect = asyncHandler(async(req, res, next) => {
    let token;

    //read the token from cookie. At this point we already have the token in the cookies 
    //(.jwt because we set the res.cookie in the userController file to be 'jwt')
    token = req.cookies.jwt;

    if(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            //calling await User and pass in id will return the entire object, that's why we can tap into password field.
            //userId is the field we set: const token = jwt.sign({userId: user._id},)
            req.user = await User.findById(decoded.userId).select('-password')
            next();
        }
        catch {
            res.status(401);
            throw new Error("Not authorized, no token")
        }

    }
    else {
        res.status(401);
        throw new Error("Not authorize, no token")
    }
})

const admin = (req, res, next) => {
    if(req.user && req.user.isAdmin) {
        next();
    }
    else {
        res.status(401);
        throw new Error("Not authorized as admin")
    }
}

export {protect, admin};
