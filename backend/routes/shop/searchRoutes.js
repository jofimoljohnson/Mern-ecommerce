import express from "express";
import { searchProducts } from "../../controller/shop/searchController.js";


const searchRouter = express.Router();
searchRouter.get('/:keyword',searchProducts)


export default searchRouter;
