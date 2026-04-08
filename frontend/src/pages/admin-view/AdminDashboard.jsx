import { ProductImageUpload } from "@/components";
import { Button } from "@/components/ui/button";
import { addFeatureImages, getFeatureImages } from "@/store/common";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const AdminDashboard = () => {
    const [imageFile, setImageFile] = useState(null);
    const [uploadImageUrl, setUploadImageUrl] = useState("");
    const [imageLoadingState, setImageLoadingState] = useState(false);
    const dispatch=useDispatch()
    const {featureImageList}=useSelector((state)=>state.feature)

const handleUploadFeatureImage=()=>{
dispatch(addFeatureImages(uploadImageUrl))
.then((data)=>{
  if(data?.payload?.success){
    dispatch(getFeatureImages())
    setImageFile(null)
    setUploadImageUrl('')
  }
}

)
}



useEffect(() => {
dispatch(getFeatureImages())
}, [dispatch])


console.log("feature image list",featureImageList)
    return (
        <div>
            <ProductImageUpload
                imageFile={imageFile}
                setImageFile={setImageFile}
                uploadImageUrl={uploadImageUrl}
                setUploadImageUrl={setUploadImageUrl}
                setImageLoadingState={setImageLoadingState}
                imageLoadingState={imageLoadingState}
                isCustomStyling={true}
            />
            <Button onClick={handleUploadFeatureImage}
            className="mt-5 w-full">Upload</Button>
           <div className="flex flex-col gap-4 mt-5">
             {
              featureImageList && featureImageList.length>0?
              featureImageList.map((featureImage)=><div className="relative">
                <img src={featureImage?.image} alt="" />
              </div>):null
            }
           </div>

        </div>
    );
};

export default AdminDashboard;
