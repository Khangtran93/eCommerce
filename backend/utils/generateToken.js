import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
    //generate token
    const token = jwt.sign({userId}, 
        process.env.JWT_SECRET, 
        {expiresIn: '30d'});

    //set JWT as http only cookie and srote it in cookie
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 *60 * 1000 //set maxAge to 30days
    })
}

export default generateToken;