const axios = require('axios');
import Config from "react-native-config";
const Base_URL = Config.API_HOST


const UserAccount = Base_URL + 'api/UserBankAccounts/'
const addbankaccount = Base_URL + 'api/addbankaccount/'

const changePassword = Base_URL + 'api/users/change-password'


export const getUserAccount = (param) =>{
    let url = UserAccount
    if (param) {
        url = UserAccount + "?filter=" + encodeURIComponent(JSON.stringify(param))
    }
    return axios.get(url)
    .then(response => response)
    .catch(error => error)
}
export const addUserAccount = (param) =>{
    let url = UserAccount
    // if (param) {
    //     url = UserAccount + "?filter=" + encodeURIComponent(JSON.stringify(param))
    // }
    return axios.post(UserAccount,param)
    .then(response => response)
    .catch(error => error)
}

export const updateUserAccount = (param) =>{
   // let url = UserAccount
    // if (param) {
    //     url = UserAccount + "?filter=" + encodeURIComponent(JSON.stringify(param))
    // }
    return axios.put(UserAccount,param)
    .then(response => response)
    .catch(error => error)
}
export const addStripeCreatedBankAccount = (param) =>{
    // let url = UserAccount
     // if (param) {
     //     url = UserAccount + "?filter=" + encodeURIComponent(JSON.stringify(param))
     // }
     return axios.post(addbankaccount,param)
     .then(response => response)
     .catch(error => error)
 }


 export const updatePassword = (param,accessToken) =>{
    var url = changePassword
    if (accessToken) {
        url = changePassword + "?access_token=" +accessToken
    }
    console.warn("url==",url,param)
     return axios.post(url,param)
     .then(response => response)
     .catch(error => error)
 }