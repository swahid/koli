const axios = require('axios');
import Config from "react-native-config";
const Base_URL = Config.API_HOST


const ResetPassword = Base_URL + 'api/users/reset'

export const doReset = (param) =>{
    return axios.post(ResetPassword,param)
    .then(response => response)
    .catch(error => error)
}