import amqp from "amqplib";

let connection;
let channel;

export const connectRabbitMQ = async () => {
    try {
        const amqpServer = "amqp://localhost:5672";
        connection = await amqp.connect(amqpServer);
        channel = await connection.createChannel();
        await channel.assertQueue("PRODUCT");
    } catch (error) {
        console.error("Failed to Connect to RabbitMQ", error);
        process.exit(1);
    }
};

export const getChannel=()=>{
    if (!channel) {
        throw new Error("RabbitMQ channel is not initialized. Call connectRabbitMQ() first.");
    }
    return channel;
}

export const closeConnection=async ()=>{
    try {
        await channel.close();
        await connection.close();
        console.log('Rabbit Connection closed');
        
    } catch (error) {
        console.error("Error closing RabbitMQ connection", error);
    }
}
