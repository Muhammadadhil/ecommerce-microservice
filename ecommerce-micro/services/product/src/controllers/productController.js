import Product from "../models/productModel.js";
import { getChannel } from "../rabbitmq/rabbitmq.js";

let order;

//buy a product
export const buyProduct= async (req, res) => {
    const { ids } = req.body;
    const products = await Product.find({ _id: { $in: ids } });

    const channel=getChannel();
    channel.sendToQueue("ORDERS", Buffer.from(JSON.stringify({ products, userEmail: "hello@123gmail.com" })));
    console.log(`Publishing Message to ORDERS queue with ${products}`);

    channel.consume("PRODUCT", (data) => {
        console.log("Consuming the Ordered Products");
        order = JSON.parse(data.content);
    });
    return res.json(order);
};

//create a product
export const createProduct=async (req, res) => {
    const { name, description, price } = req.body;
    const product = new Product({
        name,
        description,
        price,
    });
    product.save();
    return res.json(product);
};
