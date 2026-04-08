import express from "express";
import { getFilterProducts,getProductDetails } from "../../controller/shop/productsController.js";

const shopRouter = express.Router();
shopRouter.get('/get',getFilterProducts)
shopRouter.get('/get/:id',getProductDetails)


export default shopRouter;
