import express from "express";
import { addToCart,fetchCartItems,updateCartItemsQuantity,deleteCartItems } from "../../controller/shop/cartController.js";


const cartRouter = express.Router();
cartRouter.post('/add',addToCart)
cartRouter.get('/get/:userId',fetchCartItems)
cartRouter.put('/update-cart',updateCartItemsQuantity)
cartRouter.delete('/:userId/:productId',deleteCartItems)

export default cartRouter;
