import express from "express";
import { addAddress,fetchAllAddress,editAddress,deleteAddress } from "../../controller/shop/addressController.js";

const addressRouter = express.Router();
addressRouter.post('/add',addAddress)
addressRouter.get('/get/:userId',fetchAllAddress)
addressRouter.put('/update/:userId/:addressId',editAddress)
addressRouter.delete('/delete/:userId/:addressId',deleteAddress)
export default addressRouter;
