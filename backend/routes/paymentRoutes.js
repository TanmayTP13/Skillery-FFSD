import express from "express";
import {
  buySubscription,
  cancelSubscription,
  getRazorPayKey,
  paymentVerification,
} from "../controllers/paymentController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *      type: object
 *      properties:
 *        razorpay_signature:
 *          type: string
 *          required: true
 *        razorpay_payment_id:
 *          type: string
 *          required: true
 *        razorpay_subscription_id:
 *          type: string
 *          required: true
 *        createdAt:
 *          type: string
 *          format: date-time
 *          default: '2023-04-03T00:00:00.000Z'
 *      required:
 *          - razorpay_signature
 *          - razorpay_payment_id
 *          - razorpay_subscription_id
 *          - createdAt
 */

/**
 * @swagger
 * tags:
 *   name: Payment
 *   description: APIs related to payment and subscription management.
 */

// Buy Subscription
router.route("/subscribe").get(isAuthenticated, buySubscription);

// Verify Payment and save reference in database
/**
 * @swagger
 * /paymentverification:
 *   post:
 *     summary: Verify payment and save subscription details.
 *     tags: [Payment]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - razorpay_payment_id
 *               - razorpay_subscription_id
 *             properties:
 *               razorpay_payment_id:
 *                 type: string
 *                 description: The payment ID generated by Razorpay.
 *               razorpay_subscription_id:
 *                 type: string
 *                 description: The subscription ID generated by Razorpay.
 *             example:
 *               razorpay_payment_id: "pay_xxxxxxxxxxxxxx"
 *               razorpay_subscription_id: "sub_xxxxxxxxxxxxxx"
 *     responses:
 *       200:
 *         description: Returns the updated subscription details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 */
router.route("/paymentverification").post(isAuthenticated, paymentVerification);

/**
 * @swagger
 * /razorpaykey:
 *   get:
 *     summary: Get the Razorpay API key.
 *     tags: [Payment]
 *     responses:
 *       200:
 *         description: Returns the Razorpay API key.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 key:
 *                   type: string
 *                   description: The Razorpay API key.
 *               example:
 *                 key: "rzp_xxxxxxxxxxxxxx"
 */

// Get Razorpay key
router.route("/razorpaykey").get(getRazorPayKey);

// Cancel Subscription
/**
 * @swagger
 * /subscribe/cancel:
 *   delete:
 *     summary: Cancel an active subscription.
 *     tags: [Subscription]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a success message indicating the subscription was cancelled.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message indicating the subscription was cancelled.
 *             example:
 *               message: "Subscription cancelled successfully."
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 * 
 * 
 */
router.route("/subscribe/cancel").delete(isAuthenticated, cancelSubscription);

export default router;
