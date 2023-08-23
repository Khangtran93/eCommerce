import express from 'express'
import {admin, protect } from '../middleware/authMiddleware.js'
import { addOrderItems, getMyOrder, getOrderById, getOrders, getUsersOrders,
     updateOrderToDelivered, updateOrderToPaid } from '../controllers/orderController.js';

const router = express.Router();

router.route('/').get(protect, admin, getOrders).post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrder);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/:id').get(protect, getOrderById);
router.route('/users/:id').get(protect, admin, getUsersOrders);

export default router;