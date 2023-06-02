const axios = require('axios');
import Config from "react-native-config";
const Base_URL = Config.API_HOST


const Signup = Base_URL + 'api/AppUsers/createAccount'

export const doSignUp = (param) =>{
    return axios.post(Signup,param,{timeout:1000*20})
    .then(response => response)
    .catch(error => error)
}