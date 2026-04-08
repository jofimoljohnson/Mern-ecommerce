import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer'

cloudinary.config({
    cloud_name:'dyb5dferg',
    api_key:'198923539513975',
    api_secret:"ExdgS8gYDPVZxxrcQlwXLYKlmLk"
})

const storage = multer.memoryStorage()


const imageUploadUtils=async(file)=>{
const result=await cloudinary.uploader.upload(file,{
    resource_type:"auto"
})

return result
}


const upload=multer({storage})

export {imageUploadUtils,upload}