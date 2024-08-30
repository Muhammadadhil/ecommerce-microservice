import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email: email });
        // if (userExists) {
        //     return res.status(400).json({ message: "user already exist" });
        // }
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("hash::", hashedPassword);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        if (user) {
            console.log("user._id:", user._id);

            generateToken(user._id, res);
            res.status(201).json({
                id: user._id,
                name: user.name,
                email: user.email,
            });
        } else {
            res.status(400);
            throw new Error("invalid user data");
        }
    } catch (error) {
        console.log(error);
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user) {
            const matchPassword = await bcrypt.compare(password, user.password);
            if (matchPassword) {
                const token = generateToken(user._id, res);
                res.setHeader("Authorisation", `Bearer ${token}`);

                res.status(201).json({ token: token });
            } else {
                res.status(400).json({ errorMsg: "invalid email or password" });
            }
        } else {
            res.status(400).json({ errorMsg: "invalid email or password" });
        }
    } catch (error) {
        console.log(error.message);
    }
};
