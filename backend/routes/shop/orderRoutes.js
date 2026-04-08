import express from "express";

import { createOrder, capturePayment, getAllOrdersByUser, getOrderDetails } from "../../controller/shop/orderController.js";


const orderRouter = express.Router();
orderRouter.post("/create", createOrder);
orderRouter.post("/capture", capturePayment);
orderRouter.get('/list/:userId',getAllOrdersByUser)
orderRouter.get('/details/:id',getOrderDetails)
export default orderRouter;
