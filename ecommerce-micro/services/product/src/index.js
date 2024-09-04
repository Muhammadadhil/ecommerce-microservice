import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/dbConfig.js";
import productRouter from "./routes/productRoutes.js";
import { connectRabbitMQ, closeConnection } from "./rabbitmq/rabbitmq.js";

dotenv.config({ path: "../" });
const PORT = process.env.PORT || 4040;

const app = express();

connectDB();

app.use(express.json());
    
app.use("/", productRouter);

const startServer = async () => {
    try {
        await connectRabbitMQ();
        app.listen(PORT, () => console.log(`product service is running on ${PORT}`));
        process.on("exit", closeConnection);
    } catch (error) {
        console.error("Failed to start the server ", error);
        process.exit(1);
    }
};

startServer();
