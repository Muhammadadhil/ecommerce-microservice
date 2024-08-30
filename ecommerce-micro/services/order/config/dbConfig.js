import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn=await mongoose.connect("mongodb://localhost:27017/order-service");
        console.log(`MongoDB Connected for order-service: ${conn.connection.host} port:${conn.connection.port}`);
    } catch (error) {
        console.error(`MongoDB Connection Error:${error.message}`);
    }
};

export default connectDB;
