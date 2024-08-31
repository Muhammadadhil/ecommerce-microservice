import express from "express";
import dotenv from "dotenv";
import connectDB from "../config/dbConfig.js";
dotenv.config({ path: "../" });
import amqp from "amqplib";
import Order from "./orderModel.js";
const PORT = process.env.PORT || 5050;

const app = express();
connectDB();

app.use(express.json());

let connection;
let channel;

const createOrder = (products, email) => {
    let totalPrice = 0;
    for (let i = 0; i < products.length; i++) {
        totalPrice += products[i].price;
    }

    const newOrder = new Order({
        products,
        user: email,
        totalPrice,
    });
    console.log("newOrder:", newOrder);

    newOrder.save();
    return newOrder;
};

const connectToRabbitMQ = async () => {
    const amqpServer = "amqp://localhost:5672";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("ORDERS");
};

const getOrder = async () => {
    channel.consume("ORDERS", (data) => {
        console.log("Consuming Order Service!!");

        const { products, userEmail } = JSON.parse(data.content);
        const newOrder = createOrder(products, userEmail);

        channel.ack(data);
        channel.sendToQueue("PRODUCT", Buffer.from(JSON.stringify({ newOrder })));
        channel.sendToQueue("NOTIFICATION", Buffer.from(JSON.stringify({ type: "ORDER_SUCCES", payload: { userEmail, orderId: newOrder._id } })));
    });
};

const startServer = async () => {
    app.listen(PORT, () => console.log(`user-auth service is running on ${PORT}`));
    await connectToRabbitMQ();
    await getOrder();
};
startServer();
