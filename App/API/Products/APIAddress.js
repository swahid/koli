const axios = require('axios');
import Config from "react-native-config";
const Base_URL = Config.API_HOST

const AddressApi = Base_URL + "api/Addresses"


export const addAddress = (param) =>{
    return axios.post(AddressApi, param)
    .then(response => response)
    .catch(error => error)
}
export const getAddress = (param) =>{
    let url = AddressApi
    if (param) {
        url = AddressApi + "?filter=" + encodeURIComponent(JSON.stringify(param))
    }
    return axios.get(url)
    .then(response => response)
    .catch(error => error)
}
