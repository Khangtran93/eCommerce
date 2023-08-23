import path from 'path'
import express from 'express'
// import products from './data/products.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import productRoutes from "./routes/productRoutes.js"
import userRoutes from './routes/userRoutes.js'
import ordersRoute from './routes/ordersRoute.js'
import uploadRoutes from './routes/uploadRoutes.js'
dotenv.config()
import connectDB from './config/db.js'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'


const port = process.env.PORT || 5000

connectDB()
const app = express()

//Body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send("API is running");
})

//tell express to use custom modules
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', ordersRoute)
app.use('/api/upload', uploadRoutes)

app.get('/api/config/paypal', (req, res) => 
res.send({cliendId: process.env.PAYPAL_CLIENT_ID})
);

const __dirname = path.resolve(); //Set dirname to current directory
app.use('/uploads', express.static(path.join(__dirname, '/uploads'))); //concatenate /uploads to __dirname

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server runnning on port ${port}`))