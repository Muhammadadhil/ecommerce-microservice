import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app=express();

app.use(cors());
app.use(helmet()); // Add security headers
app.use(morgan("combined")); // Log HTTP requests

const paths={
    auth:'http://localhost:3030',
    product:'http://localhost:4040',
    order:'http://localhost:5050',
    notification:'http://localhost:6060'
}

app.use('/auth',createProxyMiddleware({target:paths.auth,changeOrigin:true}));
app.use('/product',createProxyMiddleware({target:paths.product,changeOrigin:true}))

const port=process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`API Gateway is running on the port ${port}`);
})