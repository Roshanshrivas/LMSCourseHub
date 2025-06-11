import Razorpay from "razorpay";
import crypto from "crypto";
import {Payment} from "../models/payment.model.js";
import {User} from "../models/user.model.js";
import {Course} from "../models/course.model.js";


const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});


export const generatePayment = async(req, res) => {
    //Do not accept amount from client
    const {courseId} = req.body;
    // find right amount in courseId
    const course = await Course.findById(courseId);

    if(!course) {
        return res.status(404).json({
            success:false,
            message:"Course Not Found"
        })
    }

    const amount = course.coursePrice;
    

    //create an order
    const options = {
      amount: amount * 100, // Razorpay accepts smallest unit (i.e., paise)
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    try {
        razorpayInstance.orders.create(options, (err, order) => {
            if(err) {
                return res.status(500).json({
                    success: false,
                    message: "Error in Orders"
                })
            }
            return res.status(200).json({
                success:true,
                order
            })
        })
    } catch (error) {
        console.error("Error in generatePayment:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to generate Payment",
        });
    }
}



//verifyPayment 

export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            courseId,
            courseTitle,
            author,
            amount,
        } = req.body;
        

        const body = razorpay_order_id + "|" + razorpay_payment_id; 

        const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");

        const isValid = expectedSignature === razorpay_signature;

        if(!isValid) {
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }

        //save payment
        const payment = await Payment.create({
            purchaserId: req.id,
            courseId,
            title: courseTitle,
            author,
            price: amount,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
        });
        

        // Update user's enrolledCourses
        await User.findByIdAndUpdate(req.id, {
        $addToSet: { enrolledCourses: courseId },
        });


        // Update course's enrolledStudents
        await Course.findByIdAndUpdate(courseId, {
        $addToSet: { enrolledStudents: req.id },
        });

        return res.status(200).json({ 
            success: true, 
            message: "Payment verified & saved" 
        });


    } catch (error) {
        console.error("Error in verifyPayment:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to Verify Payment",
        });
    }
}