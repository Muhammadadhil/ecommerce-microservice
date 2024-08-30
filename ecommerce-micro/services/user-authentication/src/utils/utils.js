import jwt from 'jsonwebtoken';

const generateToken=(userId,res,role='user')=>{
    
    const token = jwt.sign({ userId, role },process.env.JWT_SECRET ,{expiresIn:'15m'});
    res.cookie("jwt", token, {
        httpOnly: true,
        sameSite: "strict", //prevent csrf attack
        maxAge: 15 * 60 * 1000,
    });

}

export default generateToken;