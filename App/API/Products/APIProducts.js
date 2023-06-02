const axios = require('axios');
import Config from "react-native-config";
const Base_URL = Config.API_HOST

const ProductsApi = Base_URL + "api/Products"
const ProductsPayment = Base_URL + "api/productpayment"
const GetTransactions = Base_URL + "api/Transactions"
const MerchantDashboard = Base_URL + "api/Transactions/merchantdashboard"
const EarnSpendList = Base_URL + "api/Transactions/earnspendlist"


export const addProduct = (param) =>{
    return axios.post(ProductsApi, param)
    .then(response => response)
    .catch(error => error)
}
export const getProducts = (param) =>{
    let url = ProductsApi
    if (param) {
        url = ProductsApi + "?filter=" + encodeURIComponent(JSON.stringify(param))
    }
    return axios.get(url)
    .then(response => response)
    .catch(error => error)
}

export const productPayment = (token,param) =>{
    let url = ProductsPayment
    if (token) {
        url = ProductsPayment + "?access_token=" +token
    }
    return axios.post(url, param)
    .then(response => response)
    .catch(error => error)
}
export const getTransactions = (param) =>{
    let url = ProductsApi
    if (param) {
        url = GetTransactions + "?filter=" + encodeURIComponent(JSON.stringify(param))
    }
    return axios.get(url)
    .then(response => response)
    .catch(error => error)
}
export const getMerchantData = (productOwnerId) =>{
    let url = MerchantDashboard
    if (productOwnerId) {
        url = MerchantDashboard + "?productOwnerId=" +productOwnerId
    }
    return axios.post(url)
    .then(response => response)
    .catch(error => error)
}
export const getEarnedSpend = (param) =>{
       const url = EarnSpendList + "?" + param
    return axios.get(url)
    .then(response => response)
    .catch(error => error)
}
