const axios = require('axios');
import Config from "react-native-config";
const Base_URL = Config.API_HOST


const UserLogin = Base_URL + 'api/userlogin'
const FacebookLogin = Base_URL + "auth/token"
const AppleLogin = Base_URL + "api/appletoken"
const CheckUserName = Base_URL + 'api/checkusername'
const logout_url = Base_URL + 'api/logout'



export const doLogin = (param) =>{
    return axios.post(UserLogin,param)
    .then(response => response)
    .catch(error => error)
}

export const doFacebookLogin = (param) =>{
    return axios.post(FacebookLogin, param)
    .then(response => response)
    .catch(error => error)
}

export const doAppleLoginRequest = (param) =>{
    return axios.post(AppleLogin, param)
    .then(response => response)
    .catch(error => error)
} 

export const checkUserName = (userName) =>{
    let param = {username: userName}
    return axios.post(CheckUserName, param)
    .then(response => response)
    .catch(error => error)
}

export const dologout = (ownerid) =>{
    let param = {ownerId: ownerid}
    console.warn('logout param=',param)
    return axios.post(logout_url, param)
    .then(response => response)
    .catch(error => error)
}