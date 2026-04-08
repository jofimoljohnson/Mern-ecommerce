import Order from "../../models/Order.js";
import paypal from "../../helpers/paypal.js";
import Cart from "../../models/Cart.js";
import Product from '../../models/Product.js'

export const createOrder = async (req, res) => {
    try {
        const {
            userId,
            cartItems,
            addressInfo,
            orderStatus,
            paymentMethod,
            paymentStatus,
            totalAmount,
            orderDate,
            orderUpdateDate,
            paymentId,
            payerId,
            cartId,
        } = req.body;
        const create_payment_json = {
            intent: "sale",
            payer: {
                payment_method: "paypal",
            },
            redirect_urls: {
                return_url: "http://localhost:5173/shop/paypal-return",
                cancel_url: "http://localhost:5173/shop/paypal-cancel",
            },
            transactions: [
                {
                    item_list: {
                        items: cartItems.map((item) => ({
                            name: item.title,
                            sku: item.productId,
                            price: item.price.toFixed(2),
                            currency: "USD",
                            quantity: item.quantity,
                        })),
                    },
                    amount: {
                        currency: "USD",
                        total: totalAmount.toFixed(2),
                    },
                    description: "description",
                },
            ],
        };

        paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
            if (error) {
                console.log(error);
                return res.status(500).json({
                    success: false,
                    message: "Error while creating paypal payment",
                });
            } else {
                const newlyCreatedOrder = new Order({
                    userId,
                    cartItems,
                    addressInfo,
                    orderStatus,
                    paymentMethod,
                    paymentStatus,
                    totalAmount,
                    orderDate,
                    orderUpdateDate,
                    paymentId,
                    payerId,
                    cartId,
                });
                await newlyCreatedOrder.save();
                const approvalURL = paymentInfo.links.find((link) => link.rel === "approval_url").href;
                res.status(201).json({
                    success: true,
                    approvalURL,
                    orderId: newlyCreatedOrder._id,
                });
            }
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};





export const capturePayment = async (req, res) => {
    try {
        const { paymentId, payerId, orderId } = req.body;

        let order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order cannot be found",
            });
        }

        // ✅ 1. Prevent double execution (VERY IMPORTANT)
        if (order.paymentStatus === "paid") {
            return res.status(400).json({
                success: false,
                message: "Order already processed",
            });
        }

        // ✅ 2. STOCK UPDATE (SAFE)
        for (let item of order.cartItems) {
            let product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found",
                });
            }

            // ✅ Prevent negative stock
            if (product.totalStock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Only ${product.totalStock} items available for ${product.title}`,
                });
            }

            product.totalStock -= item.quantity;
            await product.save();
        }

        // ✅ 3. Update order AFTER stock success
        order.paymentStatus = "paid";
        order.orderStatus = "confirmed";
        order.paymentId = paymentId;
        order.payerId = payerId;

        // ✅ 4. Delete cart safely
        if (order.cartId) {
            await Cart.findByIdAndDelete(order.cartId);
        }

        await order.save();

        res.status(200).json({
            success: true,
            message: "Order confirmed",
            data: order,
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};













export const getAllOrdersByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ userId });
       
        if (!orders.length) {
            return res.status(200).json({
                success: true,
                data: [],
            });
        }
        res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

export const getOrderDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found!",
            });
        }
        res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

