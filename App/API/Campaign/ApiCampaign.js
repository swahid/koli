
const axios = require('axios');
import { RNS3 } from 'react-native-aws3';
import Config from "react-native-config";


const Base_URL = Config.API_HOST
export const Media_Base_URL = 'https://koli-media-stag.s3.amazonaws.com/campaigns/'
const Campaigns = Base_URL + 'api/Campaigns'
const MostAppliedCampaigns = Base_URL + 'api/campaignbymostapplied'
const Mostappliedrecent = Base_URL + 'api/campaignbymostappliedrecent'
const MyCampaigns = Base_URL + 'api/Campaigns/mycampaign'
const CountryList = Base_URL + 'api/Countries'
const states = Base_URL +'InfuencerKeywords'
const JobStatus = Base_URL + "api/Remarks"
const ReportCampaign = Base_URL + "api/Reports"
const CampaignDetails = Base_URL + "api/Campaigns/campaigndetails"
const Campaignsupdate = Base_URL + "api/Campaigns/update"
const Campaigndatabyid = Base_URL + "api/Campaigns/"
const updatedeviceinfo_url = Base_URL + "api/updatedeviceinfo"
const campaignCatgories = Base_URL + "api/campaignCatgories"
const myApplications = Base_URL + "api/Remarks"
const userPayment = Base_URL + "api/campaignpayment"
const stripeInfo = Base_URL + "api/stripeinfo"
const uploadBase64Image = Base_URL + "api/getBase64ImgPath"
const markAsCompleteCampaign = Base_URL + "api/Remarks/update"
const transferAmount = Base_URL + "api/transferamounttocustomer"
const payoutAmountAPI = Base_URL + "api/payoutamounttocustomer"
const removeFromRemarklist = Base_URL + "api/Remarks"
const getPayPalToken = Base_URL + 'api/client_token'
const checkOutPayPal = Base_URL + 'api/payoutcheckout'
const releasePayment = Base_URL + 'api/release-payment'
const AddReview = Base_URL + "api/Reviews"
const remarkDetails = Base_URL + "api/Remarks"
const CampaignLikes = Base_URL + "api/CampaignLikes"
const  Comments= Base_URL + "api/CampaignComments"
const  userFollowList= Base_URL + "api/userFollowers"



export const getCampaigns = (param) =>{
    let url = Campaigns
    if (param) {
        url = Campaigns + "?filter=" + encodeURIComponent(JSON.stringify(param))
    }
    return axios.get(url)
    .then(response => response)
    .catch(error => error)
}
export const getMostAppliedCampaigns = (param) =>{
    let url = MostAppliedCampaigns
    if (param) {
        url = MostAppliedCampaigns + "?filter=" + encodeURIComponent(JSON.stringify(param))
    }
  
    return axios.post(url)
    .then(response => response)
    .catch(error => error)
}
export const getMostappliedrecent = (param) =>{
    let url = Mostappliedrecent
    if (param) {
        url = Mostappliedrecent + "?filter=" + encodeURIComponent(JSON.stringify(param))
    }
    return axios.post(url)
    .then(response => response)
    .catch(error => error)
}
export const getMyCampaigns = (param) =>{
    return axios.post(MyCampaigns + "?ownerId=" + param,{})
    .then(response => response)
    .catch(error => error)
}

export const getCountry = () =>{
    return axios.get(CountryList)
    .then(response => response)
    .catch(error => error)
}



export const getStates = (states) =>{
    return axios.get(StateList)
    .then(response => response)
    .catch(error => error)
}


export const postCampaign = (param) =>{
    return axios.post(Campaigns, param)
    .then(response => response)
    .catch(error => error)
}


export const getJobStatus = (param) =>{
    let url = JobStatus + "?filter=" + JSON.stringify(param)
    return axios.get(url)
    .then(response => response)
    .catch(error => error)
}
export const reportCampaign = (param) =>{
    return axios.post(ReportCampaign, param)
    .then(response => response)
    .catch(error => error)
}


export const applyForCampaign = (param) =>{
    return axios.post(JobStatus, param)
    .then(response => response)
    .catch(error => error)
}
export const getCampaignDetails = (id) =>{
    let url = CampaignDetails + "?campaignId=" + id
    console.log('getCampaignDetails:',url)
    return axios.post(url)
    .then(response => response)
    .catch(error => error)
}

export const doCampaignsupdate = (param,campaignId) =>{
    let values=JSON.stringify({id:campaignId})
    let url=Campaignsupdate+'?where='+values
    console.log('postCampaign url:',url)

    return   axios.post(url,param
      ).then(response =>response)  
    .catch(error => error)
} 

export const getCampaigndatabyid = (id) =>{
    let url = Campaigndatabyid +id
    return axios.get(url)
    .then(response => response)
    .catch(error => error)
}

export const doupdatedeviceinfo = (param) =>{
    console.warn('updatedeviceinfo_url=',param)
    return axios.post(updatedeviceinfo_url, param)
    .then(response => response)
    .catch(error => error)
}


/**
 * 
 * @param {*} uploadPath name of folder to upload file 
 * @param {*} file  file to be uploaded
 */
export const uploadFile = async (uploadPath, file) => {

    const optionsUpload = {
        keyPrefix: uploadPath + "/",
        bucket: Config.BUCKET,
        region: Config.S3REGION,
        accessKey: Config.S3_ACCESS_KEY,
        secretKey: Config.S3_SECRET_KEY,
        successActionStatus: 201,
    }

    return RNS3.put(file, optionsUpload)
        .then(response => {
            if (response.status !== 201)
                throw new Error("Failed to upload image to S3");
            
            return true

        }).catch(error => {
            return false
        });
 
       

}
export const uploadMultipleImages = (uploadPath, multipleImages) => {
    const optionsUpload = {
        keyPrefix: uploadPath + "/",
        bucket: Config.BUCKET,
        region: Config.S3REGION,
        accessKey: Config.S3_ACCESS_KEY,
        secretKey: Config.S3_SECRET_KEY,
        successActionStatus: 201,
    }
    return Promise.all(multipleImages.map((image) => {
        return RNS3.put(image, optionsUpload)
        .then(response => {
            if (response.status !== 201)
            {
                throw new Error("Failed to upload image to S3");
            }
            return true

        }).catch(error => {
            return false
        });
   }))
  }
export const getCampaignCategories = () =>{
    console.log("getCampaignCategories: ", campaignCatgories)
    let condition = {
        order: [ "categoryName ASC"],
        }
   let url = campaignCatgories + "?filter=" + encodeURIComponent(JSON.stringify(condition))
    return axios.get(url)
    .then(response => response)
    .catch(error => error)
}
export const getMyApplications = (param) =>{
    let url = myApplications
    if (param) {
        url = myApplications + "?filter=" + encodeURIComponent(JSON.stringify(param))
    }
    return axios.get(url)
    .then(response => response)
    .catch(error => error)
}
export const getStripeData = () =>{
    return axios.get(stripeInfo)
    .then(response => response)
    .catch(error => error)
}
export const initiateInflencerPayment = (token,param) =>{
    let url = userPayment
    if (token) {
        url = userPayment + "?access_token=" +token
    }
    return axios.post(url, param)
    .then(response => response)
    .catch(error => error)
}
export const uploadImage = (param) =>{
   // console.warn('updatedeviceinfo_url=',param)
    return axios.post(uploadBase64Image, param)
    .then(response => response)
    .catch(error => error)
}
export const markCampaignCompleted = (param,dataParam) =>{
    let url = markAsCompleteCampaign + "?where=" + encodeURIComponent(JSON.stringify(param))
    console.log(url)
    return axios.post(url,dataParam)
    .then(response => response)
    .catch(error => error)
}

export const cancelCampFromBothInfluenerBrand = (campaignId,dataParam) =>{
    let url = Campaigns+"/"+campaignId
    console.log(url)
    return axios.patch(url,dataParam)
    .then(response => response)
    .catch(error => error)
}


export const transferCampaignAmount = (dataParam) =>{
    return axios.post(transferAmount,dataParam)
    .then(response => response)
    .catch(error => error)
}
export const payoutAmountToUser = (dataParam) =>{
    return axios.post(payoutAmountAPI,dataParam)
    .then(response => response)
    .catch(error => error)
}

export const delUserfromRemarkList = (id) =>{
    let url = removeFromRemarklist+"/"+ id
    console.log('url remove',url)
    return axios.delete(url)
    .then(response => response)
    .catch(error => error)
}

export const ShortListedRemark = (remarkID,dataParam) =>{
    let values=JSON.stringify({id:remarkID})
    let url=markAsCompleteCampaign+'?where='+values
    return   axios.post(url,dataParam).then(response =>response)  
    .catch(error => error)


   
}
export const getClientTokenPayPal = () =>{
    return axios.get(getPayPalToken)
    .then(response => response)
    .catch(error => error)
}
export const checkoutPaypalUsingNonce = (token,dataParam) =>{
    var url = checkOutPayPal
    if (token) {
        url = checkOutPayPal + "?access_token=" +token
    }
    return axios.post(url,dataParam )
    .then(response => response)
    .catch(error => error)
}
export const releaseUserPayment = (token,dataParam) =>{
    var url = releasePayment
    if (token) {
        url = releasePayment + "?access_token=" +token
    }
    return axios.post(url,dataParam)
    .then(response => response)
    .catch(error => error)

}
export const SubmitReview = (dataParam) =>{
    console.warn("dataParam",dataParam)
    let url=AddReview
    return   axios.post(url,dataParam).then(response =>response)  
    .catch(error => error)


   
}

export const getCampaignDetailsdata = (param,campaignId) =>{
    let url = Campaigns+"/"+campaignId
    if (param) {
        url = url + "?filter=" + encodeURIComponent(JSON.stringify(param))
    }
    return axios.get(url)
    .then(response => response)
    .catch(error => error)
}

export const getremarkDetails = (param) =>{
    let url = remarkDetails + "?filter=" + JSON.stringify(param)
    return axios.get(url)
    .then(response => response)
    .catch(error => error)
}

export const PostCampaignLikes = (dataParam) =>{
    console.warn("dataParam",dataParam)
    let url=CampaignLikes
    return   axios.post(url,dataParam).then(response =>response)  
    .catch(error => error)
}

    export const getCampaignByLike = (dataParam) =>{
        let url=CampaignLikes+ "?filter=" + encodeURIComponent(JSON.stringify(dataParam))
        return   axios.get(url).then(response =>response)  
        .catch(error => error)
    
   
}

export const delUserLikeFromkList = (id) =>{
    let url = CampaignLikes+"/"+ id
    console.log('url remove',url)
    return axios.delete(url)
    .then(response => response)
    .catch(error => error)
}

export const PostComment = (dataParam) =>{
    console.warn("dataParam",dataParam)
    let url=Comments
    return   axios.post(url,dataParam).then(response =>response)  
    .catch(error => error)
}

export const getCampaignByComment = (dataParam) =>{
    let url=Comments+ "?filter=" + encodeURIComponent(JSON.stringify(dataParam))
    return   axios.get(url).then(response =>response)  
    .catch(error => error)


}


export const getuserFollowList = (param) =>{
    let url = userFollowList+"?filter="+ encodeURIComponent(JSON.stringify(param))
    return axios.get(url)
    .then(response => response)
    .catch(error => error)
}