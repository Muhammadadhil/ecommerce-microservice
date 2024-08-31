import express from "express";
import amqp from "amqplib";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

const app = express();
const port = process.env.NOTIFICATION_PORT || 6060;

dotenv.config({path:'../../.env'});

app.get("/", (req, res) => {
    res.send("notification server is running");
});

//send mail functionality
const sendEmail = async (email,subject,text) => {
    try {
        //nodemailer-mail transporter
        const transpoter = nodemailer.createTransport({
            host: "smtp.gmail.com", //(Simple Mail Transfer Protocol)
            port: 587,
            auth: {
                user: process.env.USER_EMAIL ,
                pass: process.env.USER_PASSWORD ,
            },
        });

        //mail option
        const mailOptions = {
            from: "muhammadadhil934@gmail.com",
            to: email,
            subject: subject,
            html: `
            <html>
                <body style="font-family: 'Arial', sans-serif; background-color: #f4f4f4; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                        <h1 style="color: #333;">${subject}</h1>
                        <p style="font-size: 24px; font-weight: bold; color: #007bff;">${text}</p>
                    </div>
                </body>
            </html>`,
        };

        transpoter.sendMail(mailOptions,(err,info)=>{
            if(err){
                console.log('Error while sending Email:',err);            
            }else{
                console.log('info:',info);
            }
        });

    } catch (error) {
        console.log('Error in nodemailer:',error)
    }
};

//consuming messages from rabbitmq
const consumeNotification = async () => {
    const connection = await amqp.connect("amqp://localhost"); //we are interacting rabbitmq with this protocol
    const channel =await connection.createChannel();
    const queue = "NOTIFICATION";
    await channel.assertQueue(queue);

    console.log('Notification service waiting to send notifications!!');
    
    channel.consume(queue, async (message) => {
        const { type, payload } = JSON.parse(message.content.toString());
        console.log('type:',type,"payload:",payload);
        
        switch (type) {
            case "ORDER_SUCCES":
                console.log('Order sucresss email going to send');
                
                await sendEmail(payload.userEmail,'Order Confirmation', `Your Order ${payload.orderId} has been confirmed`);
                break;

            case "USER_REGISTERED":
                await sendEmail(payload.userEmail,'Welcome', 'Thank you for registering with us!');
                break;
            
            default:
                console.log("Unknown notification type:", type);
        }
        channel.ack(message);
    },{noAck:true});
};
async function startServer(){
    app.listen(port, () => console.log(`Notification Server is running on Port ${port}`));
    await consumeNotification();
}
startServer();
