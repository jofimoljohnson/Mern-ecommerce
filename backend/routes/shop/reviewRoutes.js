import express from "express";
import { addProductReview,getProductReview } from "../../controller/shop/reviewConroller.js";

const reviewRouter = express.Router();
reviewRouter.post('/add',addProductReview)
reviewRouter.get('/:productId',getProductReview)


export default reviewRouter;
