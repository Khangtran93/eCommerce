import Order from '../model/orderModel.js'
import asyncHandler from "../middleware/asyncHandler.js"

// @desc    create order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async(req, res, next) => {
    const {
        orderItems,
        shippingAddress,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice, 
        paymentMethod
    } = req.body;

    if (orderItems && orderItems.length === 0){
        res.status(400);
        throw new Error("No order item")
    }
    else {
        const order = new Order ({
            orderItems: orderItems.map((x) => ({...x, product: x._id, _id: undefined})),
            user: req.user._id,
            paymentMethod,
            shippingAddress,
            itemsPrice,
            taxPrice,
            totalPrice,
            shippingPrice
        });
        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    }
});

// @desc    get Logged In user's order
// @route   GET /api/orders/myorder
// @access  Private
const getMyOrder = asyncHandler(async(req, res, next) => {
    const myOrder = await Order.find({user: req.user._id});
    res.status(200).json(myOrder);
})

// @desc    get order by id 
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async(req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name  email');
    if (order){
        res.status(200).json(order)
    } else {
        res.status(404);
        throw new Error("Order not found")
    }
    
})

// @desc    update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async(req, res, next) => {
    const order = await Order.findById(req.params.id);
    
    if(order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address
        }
        const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
    
    
}

// @desc    update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async(req, res, next) => {
    const order = await Order.findById(req.params.id);
    if(order){
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = order.save();
        res.status(200).json(updatedOrder)
    }
    else {
        res.status(404);
        throw new Error("Order not found")
    }
}

// @desc    get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async(req, res, next) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.status(200).json(orders);
    // if (orders){
    //     res.status(200).json(orders);
    // }
    // else {
    //     res.status(404);
    //     throw new Error("No order found");
    // }

}

export {addOrderItems, getMyOrder, getOrderById, getOrders, updateOrderToDelivered, updateOrderToPaid}