import express from "express";
import dotenv from "dotenv";
import connectDB from "../config/dbConfig.js";
import Product from "./productModel.js";
import amqp from "amqplib";
import isAuthenticated from "../../../authentication.js";

dotenv.config({ path: "../" });
const PORT = process.env.PORT || 4040;

const app = express();
connectDB();

app.use(express.json());

let connection;
let channel;

const connect = async () => {
    const amqpServer = "amqp://localhost:5672";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("PRODUCT");
};
connect();

//create a product
app.post("/product/create", async (req, res) => {
    const { name, description, price } = req.body;
    const product = new Product({
        name,
        description,
        price,
    });
    product.save();
    return res.json(product);
});

let order;


//buy a product
app.post("/product/buy", async (req, res) => {
    const { ids } = req.body;
    const products = await Product.find({ _id: { $in: ids } });
    console.log("products for Orders:", products);

    channel.sendToQueue(
        "ORDERS",
        Buffer.from(
            JSON.stringify({
                products,
                userEmail: "hello@123gmail.com",
            })
        )
    );

    channel.consume("PRODUCT",(data)=>{
        console.log('Consuming the Ordered Products');
        order=JSON.parse(data.content);
    })
    return res.json(order)
});

app.listen(PORT, () => console.log(`user-auth service is running on ${PORT}`));
