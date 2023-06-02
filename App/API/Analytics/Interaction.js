const axios = require('axios');
import Config from "react-native-config";
const Base_URL = Config.API_HOST
const streamingMode = false

const Interaction = Base_URL + 'api/Nodes/send'
const InteractionClick = Base_URL + 'api/ClickAIs'
const InteractionSearch = Base_URL + 'api/SearchAIs'

export const logAI = (type, param) => {
    let targetURL = "";

    if(!streamingMode) {
        if(type === 'click') {
            targetURL = InteractionClick
        } else {
            targetURL = InteractionSearch
        }
    } else {
        targetURL = Interaction
    }

    return axios.post(targetURL, param)
    .then(response => response)
    .catch(error => error)
}
