import express from "express"
import { singleUpload } from "../middleware/multer.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";


const router = express.Router();

router.route("/upload-video").post(singleUpload, async(req, res) => {
    try {
        const file = req.file;
        const fileUri = getDataUri(file)

        const result = await cloudinary.uploader.upload(fileUri, {
            resource_type:"auto"
        })
        
        res.status(200).json({
            success:true,
            message:"File Uploaded Successfully",
            data:result,
            url: result.secure_url
        })
    } catch (error) {
        console.error(error, "error in upload video");
        res.status(500).json({
            success:false,
            message:"Error Uploading file"
        })
    }
})

export default router;