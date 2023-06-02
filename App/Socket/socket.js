import Config from "react-native-config";
const ChatbaseUrl = Config.Chat_baseUrl
import io from 'socket.io-client';
//console.warn('Chat_baseUrl==', ChatbaseUrl);
const socket = io(ChatbaseUrl);
socket.connect();
// console.warn('check 1==', socket.connected);
socket.on('connect', function() {
  // console.warn('check 2==', socket.connected);
});
socket.on('disconnect', function(){
  console.warn('disconnect socket', socket.connected);
  });
export default socket;