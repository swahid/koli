import {action, observable, decorate} from 'mobx';



class ChatStore{
    constructor(rootStore){
        this.rootStore = rootStore
    }
    messageArray=[]
    updateChat=false
    unreadConversations=0
    isOnChatDetail=false
    

    setMessages = (message) =>{
        var messageArray = [message, ...this.messageArray]

        this.messageArray=messageArray
    }
    clearMessages = () =>{

        this.messageArray=[]
    }
    updateChatList = (status) =>{

        this.updateChat=status
    }
    updateUnreadConversations = (unreadCount) =>{
        console.log('updateUnreadConversations:',unreadCount)
        this.unreadConversations=unreadCount
    }
    setIsOnChatDetail = (status) =>{
        this.isOnChatDetail=status
    }
    
}

decorate(ChatStore, {
    
    messageArray: observable,
    clearMupdateChatessages: observable,
    unreadConversations: observable,
    isOnChatDetail: observable,

    setMessages: action,
    clearMessages: action,
    updateChatList: action,
    updateUnreadConversations:action,
    setIsOnChatDetail:action


});
export default ChatStore;