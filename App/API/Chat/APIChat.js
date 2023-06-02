import { RNS3 } from 'react-native-aws3';
import Config from "react-native-config";


export const Media_Base_URL = Config.MEDIA_BASE_URL

/**
 * 
 * @param {*} uploadPath name of folder to upload file 
 * @param {*} file  file to be uploaded
 */
export const uploadChatFile = async (uploadPath, file) => {

    const optionsUpload = {
        keyPrefix: uploadPath + "/",
        // bucket: "koli-media",
        bucket: Config.CHAT_BUCKET,
        region: Config.S3REGION,
        accessKey: Config.S3_ACCESS_KEY,
        secretKey: Config.S3_SECRET_KEY,
        successActionStatus: 201,
    }

    return RNS3.put(file, optionsUpload)
        .then(response => {
            console.log(response)
            if (response.status !== 201)
            {
                throw new Error("Failed to upload image to S3");
            }
            return response

        }).catch(error => {
            return null
        });
 
       

}
