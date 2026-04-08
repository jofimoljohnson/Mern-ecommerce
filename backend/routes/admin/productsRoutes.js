import express from "express";
import { handleImageUpload,addNewProduct,editProduct,fetchAllProduct,deleteProduct } from "../../controller/admin/productController.js";
import { upload } from "../../helpers/cloudinary.js";

const productsRouter = express.Router();

productsRouter.post("/uploadimage", upload.single("my_file"), handleImageUpload);
productsRouter.post('/add',addNewProduct)
productsRouter.put('/edit/:id',editProduct)
productsRouter.delete('/delete/:id',deleteProduct)
productsRouter.get('/get',fetchAllProduct)

export default productsRouter;
