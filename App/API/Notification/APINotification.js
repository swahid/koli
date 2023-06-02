const axios = require('axios');
import Config from "react-native-config";
const Base_URL = Config.API_HOST

const AllNotifications = Base_URL + "api/UserNotifications"
const UpdateNotifications = Base_URL + "api/UserNotifications/update"


export const getAllNotifications = (param) =>{

    let url = AllNotifications + "?filter=" + encodeURIComponent(JSON.stringify(param))
    console.log('in getAllNotifications:',url)

    return axios.get(url)
    .then(response => response)
    .catch(error => error)
}
export const updateNotifications = (param,dataParam) =>{

    let url = UpdateNotifications + "?where=" + encodeURIComponent(JSON.stringify(param))
    console.log('url updateNotifications:',url)
    return axios.post(url,dataParam)
    .then(response => response)
    .catch(error => error)
}
