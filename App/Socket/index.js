import socket from './socket';
import { addMessage } from './ChatDb/LocalChatDb'
import { getUserId } from '../SupportingFIles/Utills';
import { inject, observer } from 'mobx-react';
import ChatStore from '../Stores/ChatStore'

var realmDb = null
let chatStore;
export function getChatstore() {
  if (!chatStore)
  {
    chatStore = new ChatStore();
  }
  return chatStore;
}
export const Chat = inject("ChatStore")(observer((props) => {
  console.log('Chat St:',props)
}));
  socket.on('join', message => {
    console.log('Response join:'+JSON.stringify( message))
    //console.log('Response server:'+JSON.stringify( message))
    // getUnreadChatCountFromALlChat().then(chats => {
    //   console.log('getUnreadChatCountFromALlChat join:',JSON.stringify(chats) )
    //   const chtStore = getChatstore();
    //   chtStore.updateUnreadConversations(chats.length)  
    // })
  });

//   socket.on('sendMessage', message => {
//     //Alert.alert(JSON.stringify( JSON.stringify(message)))
//     const chtStore = getChatstore();
//   if(message !== null)
//   {
//     getUserId().then(userid => {
//       console.warn('chtStore.isOnChatDetail:',chtStore.isOnChatDetail)
//       if(parseInt(userid,10) === parseInt(message.receiverId,10) && !chtStore.isOnChatDetail)
//       {
//         console.warn('Response sendMessage:'+JSON.stringify(message))
//        // console.warn('userid receiverId:'+userid,message.receiverId)
//         message.message.read=false
//       }
//       addMessage(message,message.userId,message.receiverId,realmDb)
// getUnreadChatCountFromALlChat().then(chats => {
//       console.log('getUnreadChatCountFromALlChat sendMessage:',JSON.stringify(chats) )
     
//       chtStore.unreadConversations=chats.length
//       chtStore.updateUnreadConversations(chats.length)  
//     })
//   })

//   }

//   });


  socket.on('online', message => {
    //console.log('Response online nilesh:',message)
    for (var key in message) {
      if (message.hasOwnProperty(key)) {
        var messageObj = JSON.parse(message[key])
        messageObj.message.read=false
        console.log('Response online:',message)
        addMessage(messageObj ,messageObj.userId,messageObj.receiverId,realmDb)
      }
  }
  if(message !== null)
  {
    getUserId().then(userid => {
      socket.emit('ack',{ userId:userid})
  })
  }
  
    //console.log('Response server online:'+JSON.stringify(messageArray[0]))
    //Alert.alert(JSON.stringify( JSON.stringify(message)))
    //addMessage(message,message.userId,message.receiverId,realmDb)
    //socket.emit('ack',{ userId:'1552'})

  });
  socket.on('ack', message => {
    console.log('Response ack:'+JSON.stringify(message))
    //Alert.alert(JSON.stringify( JSON.stringify(message)))
  });
  export const online = (user) => {
    socket.emit('online',user)
  };
  export const join = (user) => {
    socket.emit('join',user)
    //realmDb=openDB()
  };
  export const disconnect = (user) => {
    socket.emit('disconnect',user)
  };
  export const login = (credentials, navigation) => {
    socket.emit('join', credentials)
  };
  export const openChat = users => {
    socket.emit('chat', users);
  };
  export const sendMessage = (message,userId,receiverId) => {
    socket.emit('sendMessage', { message,userId:userId,receiverId:receiverId });
   // addMessage(message,userId,receiverId,realmDb)
    //console.log(realmDb)
  };
  export const getAllMessages = (roomId, fromDate, toDate) => {
    //new Date().getTime()
    console.log('roomId, fromDate, toDate', roomId, fromDate, toDate)
    //socket.emit('sync', { fromdate:fromDate,todate: toDate,roomId:roomId, limit:200});
    socket.emit('sync', { fromdate:fromDate,todate: toDate,roomId:roomId});

  };
  export const getAllChatList = (loginUserId) => {
    //new Date().getTime()
    socket.emit('uniqueUser', { userId:loginUserId});
  };
  socket.on('uniqueUser', message => {
   // console.log('Response uniqueUser test:' + message)
    message.forEach(element => {
      const obj = JSON.parse(element.mostRecentMessage[0])
      //  console.log('Response uniqueUser:',message)
        const messageObj = {message:obj}
        addMessage(messageObj ,obj.userId,obj.receiverId,realmDb)
      console.log('Response uniqueUser message:' + JSON.stringify(obj))
      
  });

   // console.log('Response uniqueUser test:' + JSON.stringify(message))
    // Alert.alert(JSON.stringify(message))
});
  socket.on('sync', message => {
    console.log('Sync socket response:',message)
    // for (var obj in message) {
    //   console.log("reqmessagedata:",JSON.parse(obj.reqmessagedata))
    // }
  //   for (var key in message) {
  //     if (message.hasOwnProperty(key)) {
  //       var messageObj = JSON.parse(message[key])
  //       messageObj.message.read=false
  //       addMessage(messageObj ,messageObj.userId,messageObj.receiverId,realmDb)
  //     }
  // }
  
    //console.log('Response server online:'+JSON.stringify(messageArray[0]))
    //Alert.alert(JSON.stringify( JSON.stringify(message)))
    //addMessage(message,message.userId,message.receiverId,realmDb)
    //socket.emit('ack',{ userId:'1552'})

  });