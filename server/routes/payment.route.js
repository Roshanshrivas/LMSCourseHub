import express from 'express';
import { generatePayment, verifyPayment } from '../controllers/payment.controller.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';

const router = express.Router();

router.route("/generate").post(generatePayment);
router.route("/verify").post(isAuthenticated, verifyPayment);

export default router;