import mongoose from "mongoose";

const OrderSchema = mongoose.Schema(
    {
        products: [
            {
                productId: String
            },
        ],
        user: {
            type: String,
            required: true,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);
export default Order;
