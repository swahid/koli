const axios = require('axios');
import Config from "react-native-config";
const Base_URL = Config.API_HOST


const termsCondition = Base_URL + 'api/cmspage?slug=terms-and-conditions'
const Privacypolicy = Base_URL + 'api/cmspage?slug=privacy-policy'

export const gettermsCondition = () =>{
    return axios.get(termsCondition)
    .then(response => response)
    .catch(error => error)
}


export const getPrivacypolicy = () =>{
    return axios.get(Privacypolicy)
    .then(response => response)
    .catch(error => error)
}