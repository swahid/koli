
const axios = require('axios');
import Config from "react-native-config";
const Base_URL = Config.API_HOST

const UserDetail = Base_URL + 'api/APPUsers'

const InfluencerKeywords = Base_URL + 'api/InfluencerKeywords'
const Interest = Base_URL + 'api/nodes/interests'
const CityList = Base_URL + 'api/Cities'
const UpdateProfile = Base_URL + "api/AppUsers/updateProfile"
const BlockUser = Base_URL + "api/userBlockeds"
const helpsupport = Base_URL + "api/help"
const userCampaign = Base_URL + "api/Campaigns/usercampaign"
const subjectList = Base_URL + "api/Subjects"
const registeraccount = Base_URL + "api/registeraccount"
const AppVersions = Base_URL + "api/AppVersions"
const BlockUserlist = Base_URL + "api/userBlockeds"
const userFollowerscount = Base_URL + "api/userFollowers/count"
const userFollowers = Base_URL + "api/userFollowers"
const userFollowersunfallow = Base_URL + "api/userFollowers"
const userReviewList = Base_URL + "api/Reviews"
const AppUseruserDetail = Base_URL + 'api/AppUsers/userDetail'

export const getAppVersions = (param) =>{
    let url = AppVersions + "?filter=" + JSON.stringify(param)
    return axios.get(url)
    .then(response => response)
    .catch(error => error)
}
export const getUserDetail = (param) =>{
    let url = UserDetail + "?filter=" + JSON.stringify(param)
    return axios.get(url)
    .then(response => response)
    .catch(error => error)
}

export const getInterest = () =>{
    return axios.get(Interest)
    .then(response => response)
    .catch(error => error)
}

export const getCity = (param) =>{
    let url = CityList + "?filter=" + encodeURIComponent(JSON.stringify(param))
    return axios.get(url)
    .then(response => response)
    .catch(error => error)
}

export const submitState = (param, userId) =>{
    let url = InfluencerKeywords
    console.log('url:', JSON.stringify(param))
    return axios.put(url,param)
    .then(response => response)
    .catch(error => error)
}

export const updateUserProfile = (param, userId) =>{
    let url = UpdateProfile + "?userID=" + userId + "&profile=" + encodeURIComponent(JSON.stringify(param))
    console.log('url:',JSON.stringify(param))
    return axios.put(url)
    .then(response => response)
    .catch(error => error)
}

export const validateInstaUsername = (username) =>{
    let url = "https://www.instagram.com/" + username + "/?__a=1"
    console.log('url:',url)

    return axios.get(url)
    .then(response => response)
    .catch(error => error)
}

export const getNextPagePost = (endCurser, userId) =>{
    let url = "https://www.instagram.com/graphql/query/?query_id=17888483320059182&" + "id=" + userId + "&first=12&after=" + endCurser
    return axios.get(url)
    .then(response => response)
    .catch(error => error)
}

export const blockUser = (param) =>{
    return axios.post(BlockUser, param)
    .then(response => response)
    .catch(error => error)
}

export const getInstaUsername = (token) =>{
    let url = "https://graph.instagram.com/me?fields=id,username&access_token=" + token
    return axios.get(url)
    .then(response => response)
    .catch(error => error)
}

export const dohelpsupport = (param) =>{
   
    return axios.post(helpsupport,param) 
    .then(response => response)
    .catch(error => error)
} 
export const getUserCampaigns = (param) =>{
    let url = userCampaign
    if (param) {
        url = userCampaign + "?ownerId=" + param
    }
    console.log(url)
    return axios.post(url)
    .then(response => response)
    .catch(error => error)
}
export const getSubjectList = (param) =>{
    let url = subjectList + "?filter=" + encodeURIComponent(JSON.stringify(param))
    
    console.log(subjectList)
    return axios.get(url)
    .then(response => response)
    .catch(error => error)
}
export const registerStripeAccount = (param) =>{

    return axios.post(registeraccount,param) 
    .then(response => response)
    .catch(error => error)
}

export const getBlockUserList = (param) =>{
    let url = BlockUserlist+"?filter="+ encodeURIComponent(JSON.stringify(param))
    console.log(url)
    return axios.get(url)
    .then(response => response)
    .catch(error => error)
}

export const delUserfromList = (param) =>{
    let url = BlockUserlist+"/"+ param
    console.log(url)
    return axios.delete(url)
    .then(response => response)
    .catch(error => error)
}

export const userFollower = (param) =>{
    return axios.post(userFollowers, param)
    .then(response => response)
    .catch(error => error)
}

export const getuserFollowerscount = (param) =>{
    let url = userFollowerscount+"?where="+ encodeURIComponent(JSON.stringify(param))
    return axios.get(url)
    .then(response => response)
    .catch(error => error)
}


export const getuserFollowersunfallow = (param) =>{
    let url = userFollowersunfallow+"?filter="+ encodeURIComponent(JSON.stringify(param))
    return axios.get(url)
    .then(response => response)
    .catch(error => error)
}

export const delFollowersunfallow = (id) =>{
    let url = userFollowers+"/"+ id
    return axios.delete(url)
    .then(response => response)
    .catch(error => error)
}

export const getUserReviewList = (param) =>{
    let url = userReviewList+"?filter="+ encodeURIComponent(JSON.stringify(param))
    console.log(url)
    return axios.get(url)
    .then(response => response)
    .catch(error => error)
}

export const getAppUseruserDetail = (id,userid) =>{
    let url = AppUseruserDetail+"?id="+userid+"&userid="+(id!==null?id:"")
    console.log("url===1",url)
    return axios.get(url)
    .then(response => response)
    .catch(error => error)
}