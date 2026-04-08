import express from "express";
import { getAllOrdersByAllUsers,getOrderDetailsForAdmin,updateOrderStatus } from "../../controller/admin/orderController.js";

const orderRouter = express.Router();
orderRouter.get('/get',getAllOrdersByAllUsers)
orderRouter.get('/details/:id',getOrderDetailsForAdmin)
orderRouter.put('/update/:id',updateOrderStatus)


export default orderRouter;
