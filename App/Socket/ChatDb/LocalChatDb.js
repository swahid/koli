const Realm = require('realm');
var realmDB=null
const ChatSchema = {
    name: 'Chat',
    primaryKey: '_id',
    properties: {
        _id: 'string',
        text: 'string',
        createdAt: 'date',
        user: 'User',
        receiver: 'User',
        userId: 'int',
        receiverId: 'int',
        roomId:'string',
        image:'string?',
        messageType:'string',
        messageId:'string',
        pending: 'bool?',
        read: 'bool?',
        campaignId: 'int?'
    }
};

const UserSchema = {
    name: 'User',
    properties: {
        _id: 'int',
        name: 'string',
        avatar: 'string'
    }
};

export const openDB = () => {
    // Get the default Realm with support for our objects
    Realm.open({ schema: [ChatSchema, UserSchema] })
        .then(realm => {
            // ...use the realm instance here
            realmDB=realm
            return realm
        })
        .catch(error => {
            // Handle the error here if something went wrong
            console.log('DB Error:',error)
            return null
        });
}

export const addMessage = (message, userId, receiverId,realmDBA) => {
    console.log('relam db:',message)
    const messageData = message.message
    Realm.open({ schema: [ChatSchema, UserSchema],schemaVersion: 3, })
    .then(realm => {
        try {
            realm.write(() => {
                realm.create('Chat', {
                    _id: messageData._id,
                    messageId: messageData.messageId,
                    text: messageData.text,
                    image:messageData.image,
                    messageType:messageData.messageType,
                    createdAt: messageData.createdAt,
                    userId: parseInt(userId,10),
                    receiverId: parseInt(receiverId,10),
                    user: messageData.user,
                    roomId:messageData.roomId,
                    receiver:messageData.receiver,
                    pending:messageData.pending,
                    read:messageData.read,
                    campaignId:messageData.campaignId

                });
            });

        } catch (e) {
            console.warn("Error on creation", e);
        }
    })
    .catch(error => {
        // Handle the error here if something went wrong
        console.log('DB Error:',error)
    });
        
}
export const modifyPendingMessage = (message) => {
    const messageData = message.message
    Realm.open({ schema: [ChatSchema, UserSchema],schemaVersion: 3, })
    .then(realm => {
        try {
            realm.write(() => {
                realm.create('Chat', {
                    _id: messageData._id,
                    pending:false
                }, 'modified');
            });

        } catch (e) {
            console.warn("Error on creation", e);
        }
    })
    .catch(error => {
        // Handle the error here if something went wrong
        console.log('DB Error:',error)
    });
        
}
export const getChat = (userId) => {
    console.log('getChatUserList:')

   return Realm.open({ schema: [ChatSchema, UserSchema],schemaVersion: 3, })
    .then(realm => {
        realmDB = realm
        console.log("Realm DB Location:",realm.path)
        // ...use the realm instance here
        const chatData = realm !== undefined ? realm.objects('Chat').filtered(`userId == ${userId} OR receiverId == ${userId} SORT(createdAt DESC) DISTINCT(roomId)`) : []
        console.log('chatData:',JSON.stringify(chatData) )

        return chatData
    })
    .catch(error => {
        // Handle the error here if something went wrong
        console.log('DB Error:',error)
        return []
    });
  
}
export const getAllChatForUser = (roomId) => {
    console.log(roomId)
    return Realm.open({ schema: [ChatSchema, UserSchema], schemaVersion: 3, })
     .then(realm => {
         // ...use the realm instance here
         const chatData = realm !== undefined ? realm.objects('Chat').filtered(`roomId == "${roomId}" SORT(createdAt DESC)`) : []
         console.log('chatData:',chatData)
         if(realm !== undefined)
         {
            realm.write(() => {
                for (let i = 0, len = chatData.length; i < len; i++) {
                    chatData[i].read = true;
                }
            });
         }
        
         return chatData
     })
     .catch(error => {
         // Handle the error here if something went wrong
         console.log('DB Error:',error)
         return []
     });
 }
 export const getUnreadChatCountFromALlChat = () => {
    return Realm.open({ schema: [ChatSchema, UserSchema], schemaVersion: 3, })
     .then(realm => {
         // ...use the realm instance here
         const chatData = realm !== undefined ? realm.objects('Chat').filtered("read == false SORT(createdAt DESC) DISTINCT(roomId)") : []
         console.log('chatData:',chatData)
         return chatData
     })
     .catch(error => {
         // Handle the error here if something went wrong
         console.log('DB Error:',error)
         return []
     });
   
 }
 export const getUnreadChatCountRoom = (roomId) => {
    return Realm.open({ schema: [ChatSchema, UserSchema], schemaVersion: 3, })
     .then(realm => {
         // ...use the realm instance here
         const chatData = realm !== undefined ? realm.objects('Chat').filtered(`roomId == "${roomId}" AND read == false`) : []
         console.log('chatDatauread:',chatData.length)
         return chatData.length
     })
     .catch(error => {
         // Handle the error here if something went wrong
         console.log('DB Error:',error)
         return []
     });
   
 }
 export const getAllUser = (userId) => {
    console.log(userId)
    // return Realm.open({ schema: [UserSchema], schemaVersion: 3, })
    //  .then(realm => {
         // ...use the realm instance here
         const userData = realmDB !== undefined ? realmDB.objects('User').filtered(`_id != "${userId}" DISTINCT(_id)`) : []
          console.log('userData:',JSON.stringify(userData) )
 
         return userData
    //  })
    //  .catch(error => {
    //      // Handle the error here if something went wrong
    //      console.log('DB Error:',error)
    //      return []
    //  });
   
 }

 export const doMigration = () =>{
    Realm.open({
        schema: [ChatSchema, UserSchema],
        schemaVersion: 3,
        migration: (oldRealm, newRealm) => {
          // only apply this change if upgrading to schemaVersion 1
          if (oldRealm.schemaVersion < 1) {
            const oldObjects = oldRealm.objects('Chat');
            const newObjects = newRealm.objects('Chat');
      
            // loop through all objects and set the name property in the new schema
            for (let i = 0; i < oldObjects.length; i++) {
              newObjects[i].pending = false;
            }
          }
          if (oldRealm.schemaVersion === 2) {
            const oldObjects = oldRealm.objects('Chat');
            const newObjects = newRealm.objects('Chat');
      
            // loop through all objects and set the name property in the new schema
            for (let i = 0; i < oldObjects.length; i++) {
              newObjects[i].read = true;
              newObjects[i].campaignId = null;

            }
          }
        }
      }).then(realm => {
        //const fullName = realm.objects('Person')[0].name;
        console.log('DB Success:',realm)
        return realm;
      }).catch(error => {
        // Handle the error here if something went wrong
        console.log('DB Error:',error)
        return error;
    });
 }
 export const getChatForCampaignId = (roomId,userId) => {

   return Realm.open({ schema: [ChatSchema, UserSchema],schemaVersion: 3, })
    .then(realm => {
        // ...use the realm instance here
       // (userId == 1455 OR receiverId == 1455) AND roomId == "14552053" AND campaignId != null SORT(createdAt ASC) DISTINCT(roomId)
        const chatData = realm !== undefined ? realm.objects('Chat')
        .filtered(`(userId == ${userId} OR receiverId == ${userId}) AND roomId == "${roomId}" AND campaignId != null SORT(createdAt ASC) DISTINCT(roomId)`) 
        : []
        // console.log('getChatForCampaignId:',JSON.stringify(chatData) )

        return chatData
    })
    .catch(error => {
        // Handle the error here if something went wrong
        console.log('DB Error:',error)
        return []
    });
  
}