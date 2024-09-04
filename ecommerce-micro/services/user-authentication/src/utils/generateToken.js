import jwt from 'jsonwebtoken';

const generateToken=(userId,email,role='user')=>{
    const payload = { email,userId, role };
    const token = jwt.sign(payload,process.env.JWT_SECRET ,{expiresIn:'30m'});
    return token;
    // res.cookie("jwt", token, {
    //     httpOnly: true,
    //     sameSite: "strict", //prevent csrf attack
    //     maxAge: 15 * 60 * 1000,
    // });

}

export default generateToken;