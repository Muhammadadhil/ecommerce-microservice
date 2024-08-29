import express from "express";
import dotenv from "dotenv";
import User from "./userModel.js";
import bcrypt from "bcryptjs";
import connectDB from "../config/config.js";
import generateToken from "../utils/generateToken.js";
const PORT = process.env.PORT || 3030;

const app = express();

dotenv.config({ path: "../" });
connectDB();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("hello, from user-auth");
});

app.post("/register", async (req, res) => {
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
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user) {
            const matchPassword = await bcrypt.compare(password, user.password);
            if (matchPassword) {
                generateToken(user._id, res);
                res.status(201).json({
                    id: user._id,
                    name: user.name,
                    email: user.email,
                });
            }else{
                res.status(400).json({ errorMsg: "invalid email or password" });
            }
        } else {
            res.status(400).json({ errorMsg: "invalid email or password" });
        }
    } catch (error) {
        console.log(error.message);
    }
});

app.listen(PORT, () => console.log(`user-auth service is running on ${PORT}`));
