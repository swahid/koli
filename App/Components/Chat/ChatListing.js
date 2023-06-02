import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Platform } from 'react-native';
// import { strings } from '../../Locales/i18';
import metrics from '../../Themes/Metrics';
import Moment from 'moment';
import colors from '../../Themes/Colors';
import images from '../../Themes/Images';
import { getAllChatList, join, online } from '../../Socket'
import { getChatDataFetched, getUserId, setChatDataFetched } from '../../SupportingFIles/Utills';
import socket from '../../Socket/socket';
import { getChat, getAllUser, doMigration, getUnreadChatCountRoom } from '../../Socket/ChatDb/LocalChatDb'
import { getUserDetail } from '../../API/Profile/User/ApiProfile';
import Loader from '../../SupportingFIles/Loader';
import messaging from '@react-native-firebase/messaging';
import { inject, observer } from 'mobx-react';
import { commonStyles } from '../../SupportingFIles/Constants';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import FastImage from 'react-native-fast-image'

class ChatListing extends Component {

    constructor(props) {
        super(props);
        this.state = {
            realm: null,
            chatListData: [],
            unreadArr: [],
            userData: null,
            userIds: [],
            isLoading: false,
            isLoadingFirstTime: true,
            initialArr: Array.from({ length: 40 }, () => Math.floor(Math.random() * 40))

        };
    }
    componentDidMount() {
        this.props.navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity style={{ ...commonStyles.backButtonContainer }}
                    onPress={() => this.props.navigation.goBack()}
                >
                    <Image source={images.backImage} />
                </TouchableOpacity>
            ),
        }
        )
        socket.on('online', message => {
            console.log('Response online:' + JSON.stringify(message))
            // Alert.alert(JSON.stringify(message))
        });
        // socket.on('uniqueUser', message => {
        //    // console.log('Response uniqueUser test:' + message)
        //     message.forEach(element => {
        //         const obj = JSON.parse(element.mostRecentMessage[0])
        //         console.log('Response uniqueUser message:' + JSON.stringify(obj))
        //     });
        //     // Alert.alert(JSON.stringify(message))
        // });
        doMigration()

        this.props.navigation.addListener('focus', () => {
            if (this.props.AuthStore.isLogin) {
                this.getChatUserList()
            } else {
                //  console.warn('this.props.navigation:',this.props.navigation)
                // this.props.AuthStore.setNavigation(this.props.navigation)
                this.props.navigation.navigate('AuthStack')
            }
        });

        this.addSockedOnMessageListner()
    }

    addSockedOnMessageListner = () => {
        socket.on('sendMessage', message => {
            //console.warn('Response server:'+JSON.stringify(message))
            //Alert.alert(JSON.stringify(message))

            //join({userId:userid})
            getChat(this.state.userId).then(chats => {
                this.setState({ chatData: chats })
                if (this.state.fetchedUsersData !== null) {
                    this.setState({
                        unreadArr: this.state.unreadArr.map(el => {
                            if (el.roomId === message.message.roomId) {
                                el.unreadCount = el.unreadCount + 1
                            }
                            return el;
                        })
                    });
                    this.mapUserDataToChatData(this.state.fetchedUsersData)
                }
            })
        });
    }

    getChatUserList = async () => {
        const token = await messaging().getToken();

        getUserId().then(userid => {

            join({ userId: userid, fcmToken: token })
            online({ userId: userid })
            
            getChatDataFetched().then(isFetched=>{
                console.log("getChatDataFetched:",isFetched)
                //if(!isFetched){
                  setChatDataFetched('true')
                  getAllChatList(parseInt(userid,10))
              //  }
              })
            getChat(userid).then(async chats => {
                var unreadArr = []
                for (let i = 0, len = chats.length; i < len; i++) {
                    await getUnreadChatCountRoom(chats[i].roomId).then(chatsData => {
                        const obj = { unreadCount: chatsData, roomId: chats[i].roomId }
                        unreadArr.push(obj)
                        chats[i].unreadCount = chatsData
                    })
                }
                console.log('in start:', chats)
                this.setState({ chatData: chats, userId: userid, unreadArr: unreadArr, chatListData: chats, isLoadingFirstTime: false })
                const users = getAllUser(userid)
                //  getAllUser(userid).then(users => {
                console.log('in getAllUser:', JSON.stringify(users))
                const userIds = users.map(item => {
                    return (item._id)
                });
                console.log('in userIds:', userIds)
                this.setState({ userIds })
                this.getUserDetailsUsingIds(userIds)
                //  })
            })
        })
    }
    getUserDetailsUsingIds = (userIds) => {

        const param = { where: { ownerId: { inq: userIds } } }
        //console.log("getUserDetails:",param)
        if (this.state.isLoadingFirstTime) {
            this.setState({ isLoading: true })
        }

        getUserDetail(param).then(response => {
            //this.setLoading(false)
            const { data } = response

            //console.log('response getUserDetail:',data)
            // let result = JSON.parse(data.message[0].profile);
            if(data.length==0){
                this.getChatUserList()
            }
            this.mapUserDataToChatData(data)
        }).catch(error => {
            //console.log('error getUserDetail:',error)

        })
    }
    getUserDetails = (userIds, item, recerverUserData) => {

        const param = { where: { ownerId: userIds } }
        console.log("getUserDetails:", param)
        console.log("item:", item)

        if (this.state.isLoadingFirstTime) {
            this.setState({ isLoading: true })
        }

        getUserDetail(param).then(response => {
            //this.setLoading(false)
            const { data } = response
            console.log('response getUserDetail:', data)
            this.props.navigation.navigate('ChatDetail',
                {
                    chatObj: item,
                    recerverUserData:
                        recerverUserData,
                    title: recerverUserData.name,
                    receiverUserProfile: data[0]
                })
            //console.log('response getUserDetail:',data)
            // let result = JSON.parse(data.message[0].profile);

            // this.mapUserDataToChatData(data)
        }).catch(error => {
            //console.log('error getUserDetail:',error)

        })
    }
    mapUserDataToChatData = (data) => {
        const chatListData = this.state.chatData.map((chat) => {
            // var unreadCount = 0 
            //  getUnreadChatCountRoom(chat.roomId).then(chatsData => {
            //     unreadCount = chatsData
            // })
           // console.log('response userObj:', JSON.stringify(data))

            const userObj = data.filter(item => {
                return (parseInt(item.ownerId, 10) === parseInt(chat.receiverId, 10) || parseInt(item.ownerId, 10) === parseInt(chat.userId, 10))
            })
           // console.log('response userObj:', userObj)
            if (userObj.length > 0) {
                const name = (userObj[0].first ? userObj[0].first : '') + " " + (userObj[0].last ? userObj[0].last : '')
                chat.name = name
                chat.avatar = userObj[0].avatarUrl
            }
            // chat.unreadCount=unreadCount
            //console.log('chat.obj:',chat)

            return chat;

        });
        this.setState({ chatListData, isLoading: false, fetchedUsersData: data, isLoadingFirstTime: false })
    }

    render() {
        return (
            <View style={{ backgroundColor: colors.white, flex: 1, }}>
                {/* <Loader loading={this.state.isLoadingFirstTime ? this.state.isLoading : false} /> */}
                {/* <Text style={styles.headerTextStyle}>{strings('Chat')}</Text> */}
                {/* <Text style={styles.headerTextStyle}>
          {info}
        </Text> */}
                {this.state.chatListData.length > 0 &&
                    <FlatList
                        style={styles.chatList}
                        data={this.state.chatListData}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => this.renderChatItem(item, index)}
                        keyExtractor={(item, index) => index.toString()}
                    />}
                {/* {this.state.chatListData !== null && !this.state.isLoading && !this.state.isLoadingFirstTime && this.renderNoChatView()} */}
                {this.state.chatListData !== null && !this.state.isLoading && this.renderNoChatView()}

                {this.state.isLoadingFirstTime && this.renderPlaceHolderView()}

            </View>
        );
    }
    renderChatItem = (item, index) => {
        getUnreadChatCountRoom(item.roomId).then(chatsData => {
            item.unreadCount = chatsData
        })
        var imageUrl = (item.avatar === null || item.avatar === '' || item.avatar === 'NA' || item.avatar === undefined) ? images.userPlaceholder : { uri: item.avatar }
        var imageUrlToSend = item.avatar
        var userName = item.name
        const isImage = item.messageType === 'image' ? true : false
        if (item.name === undefined) {
            //const userData = this.state.userId === item.receiver._id ? item.user : item.receiver
            const userData = parseInt(this.state.userId,10) === parseInt(item.receiverId,10)  ? item.user : item.receiver
            imageUrl = userData.avatar == null || userData.avatar === '' ? images.userPlaceholder : { uri: userData.avatar }
            imageUrlToSend = userData.avatar
            userName = userData.name
        }
        const unreadMessageCount = this.state.unreadArr[index] != null ? this.state.unreadArr[index].unreadCount : ''


        var outputDate = Moment(item.createdAt).calendar(null, {
            // when the date is closer, specify custom values
            lastWeek: 'dddd',
            lastDay: '[Yesterday]',
            sameDay: 'h:mm A',
            nextDay: '[Tomorrow]',
            nextWeek: 'dddd',
            // when the date is further away, use from-now functionality             
            sameElse: 'DD/MM/yy'
        });
        //console.log("renderChatItem:",item)
        return (
            <View>
                <View style={styles.viewListItem}>
                    {/* <Image
                        style={styles.userImage}
                        source={imageUrl}
                    /> */}
                       <TouchableOpacity
                        onPress={() => {
                            const recerverUserData = {
                                _id: parseInt( parseInt(this.state.userId,10) !== parseInt(item.receiverId,10) ? item.userId : item.receiverId, 10),
                                name: userName,
                                avatar: imageUrlToSend
                            }
                            if (this.state.fetchedUsersData !== undefined) {
                                const userData = this.state.fetchedUsersData.filter(userDataFiltered => {
                                    return (parseInt(userDataFiltered.ownerId, 10) === parseInt(item.receiverId, 10) || parseInt(userDataFiltered.ownerId, 10) === parseInt(item.userId, 10))
                                })
                                this.props.navigation.navigate('ChatDetail',
                                    {
                                        chatObj: item,
                                        recerverUserData:
                                            recerverUserData,
                                        title: userName,
                                        //receiverUserProfile: userData[0],
                                        receiverUserProfile: recerverUserData
                                    })
                            }
                            else {
                                this.getUserDetails(recerverUserData._id, item, recerverUserData)
                            }
                        }}>
                    <Image
                    
                        // renderPlaceholder={this.renderPlaceholder}
                        // renderErrorImage={this.renderPlaceholder}
                        style={styles.userImage}
                        resizeMode='cover'
                        fallback
                      defaultSource={images.userPlaceholder}
                        source={imageUrl}
                    />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            const recerverUserData = {
                                _id: parseInt( parseInt(this.state.userId,10) !== parseInt(item.receiverId,10) ? item.userId : item.receiverId, 10),
                                name: userName,
                                avatar: imageUrlToSend
                            }
                            if (this.state.fetchedUsersData !== undefined) {
                                const userData = this.state.fetchedUsersData.filter(userDataFiltered => {
                                    return (parseInt(userDataFiltered.ownerId, 10) === parseInt(item.receiverId, 10) || parseInt(userDataFiltered.ownerId, 10) === parseInt(item.userId, 10))
                                })
                                this.props.navigation.navigate('ChatDetail',
                                    {
                                        chatObj: item,
                                        recerverUserData:
                                            recerverUserData,
                                        title: userName,
                                        //receiverUserProfile: userData[0],
                                        receiverUserProfile: recerverUserData
                                    })
                            }
                            else {
                                this.getUserDetails(recerverUserData._id, item, recerverUserData)
                            }
                        }}
                        style={{ justifyContent: 'center', flex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 10 }}>
                            <Text style={styles.textName} >{userName}</Text>
                            <Text style={styles.textTime}>{outputDate}</Text>

                        </View>
                        {/* <View style={{left:10, position:'absolute', width: 15, height: 15, borderRadius: 7.5, borderColor: 'white', borderWidth: 1,backgroundColor:'red' }}>
                            <Text style={{color:'white',fontSize:10}}> 2</Text>
                        </View> */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 10 }}>
                            <Text style={styles.textMessage} numberOfLines={2}>{isImage ? 'Image' : item.text}</Text>
                            <View style={
                                {
                                    marginTop: metrics.dimen_8,
                                    marginRight: metrics.dimen_10,
                                    height: metrics.dimen_15,
                                    borderRadius: metrics.dimen_7,
                                    borderColor: colors.white,
                                    backgroundColor: colors.app_RedColor
                                }}>
                                {unreadMessageCount !== '' && unreadMessageCount !== 0 && <Text style={
                                    {
                                        color: colors.white,
                                        fontSize: metrics.text_11,
                                        alignSelf: 'center',
                                        justifyContent: 'center',
                                        paddingHorizontal: 5
                                    }}>{unreadMessageCount}
                                </Text>}
                            </View>
                        </View>

                    </TouchableOpacity>
                </View>
                {/* <View
                    style={{
                        borderBottomColor: '#DFE1E5',
                        borderBottomWidth: 0.5,
                        marginLeft: metrics.dimen_12,

                    }}
                /> */}
            </View>
        )
    }
    renderPlaceholder = () => {
        return (
            <Image source={images.userPlaceholder}
                style={{ width: metrics.dimen_30, height: metrics.dimen_30, borderRadius: metrics.dimen_30 / 2, }}

            />)

    }
    renderNoChatView = () => {
        if (this.state.chatListData.length === 0 && !this.state.isLoadingFirstTime)  {
            return (
                <View style={styles.noChatView}>
                    <Image style={styles.chatIconNoChat}
                        source={images.noChat}
                        resizeMode="contain"
                    >
                    </Image>
                    <Text style={styles.textNoConversation}>
                        No Conversation
                </Text>
                    <Text style={styles.textNoConversationDetail}>
                        You haven't made any conversation yet
                </Text>

                </View>
            )
        }
    }
    renderPlaceHolderView = () => {
        return (
            this.state.initialArr.map(obj => (

                <SkeletonPlaceholder >
                    <SkeletonPlaceholder.Item marginLeft={metrics.dimen_12} marginTop={20}>


                        <View style={{ flexDirection: 'row' }}>
                            <View style={[styles.userImage, { marginTop: 0 }]} />
                            <SkeletonPlaceholder.Item flexDirection={'row'} justifyContent={'space-between'} width={'70%'}>
                                <SkeletonPlaceholder.Item
                                    width={90}
                                    height={30}
                                    borderRadius={4}
                                />
                                <SkeletonPlaceholder.Item
                                    width={30}
                                    height={10}
                                    borderRadius={4}
                                />
                            </SkeletonPlaceholder.Item>
                        </View>
                        <View style={{ marginTop: Platform.OS === 'ios' ? -30 : -15, marginBottom: metrics.dimen_5, width: '70%', height: 50, marginLeft: metrics.dimen_80 }} />

                    </SkeletonPlaceholder.Item>

                </SkeletonPlaceholder>

            ))
        )
    }

}

const styles = StyleSheet.create({
    // headerTextStyle: {
    //     fontFamily: metrics.Lato_Bold,
    //     fontSize: metrics.text_xxxl,
    //     marginLeft: metrics.dimen_20,

    //     color: 'rgba(61, 64, 70, 1)',
    // },
    chatList: {
        marginTop: metrics.dimen_18
    },
    viewListItem: {
        flexDirection: 'row'
    },
    userImage: {
        marginLeft: metrics.dimen_12,
        marginVertical: metrics.dimen_13,
        marginRight: metrics.dimen_18,
        height: metrics.dimen_50,
        width: metrics.dimen_50,
        borderRadius: metrics.dimen_25,

    },
    textName: {
        fontFamily: metrics.Lato_Bold,
        fontSize: metrics.text_16,
        textTransform: 'capitalize',
        color: colors.app_black,
        width: '75%',
        //marginRight: metrics.dimen_10,
    },
    textTime: {
        fontFamily: metrics.Lato_Regular,
        fontSize: metrics.getFontSize(12),
        color: '#A3A3A3',
        marginRight: metrics.dimen_10,

    },
    textMessage: {
        flex: 1, flexWrap: 'wrap',
        fontFamily: metrics.Lato_Regular,
        fontSize: metrics.getFontSize(12),
        marginTop: metrics.dimen_8,
        color: '#A3A3A3',
        marginRight: metrics.dimen_10
    },
    noChatView: {
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '80%'
    },
    chatIconNoChat: {
        width: metrics.getW(95),
        height: metrics.getH(97)
    },
    textNoConversation: {
        fontFamily: metrics.Lato_Bold,
        fontSize: metrics.text_16,
        color: colors.app_black,
        marginTop: metrics.dimen_5

    },
    textNoConversationDetail: {
        fontFamily: metrics.Lato_Regular,
        fontSize: metrics.text_11,
        color: colors.app_black,
        marginTop: metrics.dimen_5
    }
})
export default inject('AuthStore')(observer(ChatListing))