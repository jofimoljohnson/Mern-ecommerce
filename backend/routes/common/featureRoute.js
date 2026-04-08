import express from "express";
import { addFeatureImage, getFeatureImage } from "../../controller/common/featureController.js";
const featureRouter = express.Router();
featureRouter.post("/add", addFeatureImage);
featureRouter.get("/get", getFeatureImage);

export default featureRouter;
