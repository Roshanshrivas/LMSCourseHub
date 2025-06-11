import express from 'express';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js";
import cookieParser from 'cookie-parser';
import mediaRoute from "./routes/media.route.js";
import paymentRoute from "./routes/payment.route.js";
import cors from 'cors';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json()) // to parse JSON bodies;
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // to parse URL-encoded bodies
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}))

// apis 
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/payment", paymentRoute);



app.listen(PORT, () => {
    connectDB();
    console.log(`Server is listen at Port ${PORT}`);
});




