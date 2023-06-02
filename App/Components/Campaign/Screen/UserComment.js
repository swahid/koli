
import React, { Component } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, Image,KeyboardAvoidingView ,Alert} from 'react-native';
import { inject, observer } from 'mobx-react';
import metrics from '../../../Themes/Metrics';
import colors from '../../../Themes/Colors';
import { strings } from '../../../Locales/i18'
import Images from '../../../Themes/Images';
import CommentSend from '../../../Assets/Images/commentsend';
import { ScrollView } from 'react-native-gesture-handler';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { time_ago,getUserId } from '../../../SupportingFIles/Utills';
import { runInAction } from 'mobx';
import ReadMoreText from '../../CommonComponents/ReadMoreLessComment'
import { commonStyles } from '../../../SupportingFIles/Constants'
const upButtonHandler = () => {
  //OnCLick of Up button we scrolled the list to top
  listViewRef.scrollToOffset({
    offset: 0,
    animated: true
  });
};
let listViewRef;

class UserComment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            height: metrics.dimen_50,
            textInput_Holder: '',
            comment:"",
            initialArr : Array.from({length: 15}, () => Math.floor(Math.random() * 15))
        }
    }
    updateSize = (height) => {
        this.setState({
            height
        });
    }
    componentDidMount() {
      // this.input.focus();

        const store = this.props.HomeStore
        if(this.props.route.params.campaignData.comments.length>0)
        {
          store.getCommentByCampaign(this.props.route.params.campaignData.id)
        }else{
          this.props.HomeStore.setCampaignCommentList([])

        }
        this.setState({comment:""})
        this.props.navigation.addListener('focus', () => { 
            this.props.navigation.setOptions({
              headerLeft: () => (
                <TouchableOpacity style={styles.backButtonContainer}
                  onPress={() => this.props.navigation.goBack()}
                >
                  <Image source={Images.backImage} />
                </TouchableOpacity>
              ),
        
             
            }
            )
          });

    }


    joinData = () => {

      if(this.state.comment.trim()==="")
      {
        Alert.alert('',"Please enter comment");
      }else{
        this.props.HomeStore.postCommentOnCampaign(this.props.route.params.campaignData.id,this.state.comment)
        const profileUrl= this.props.route.params.userProfileUrl
        const fName= this.props.route.params.Userdata&&this.props.route.params.Userdata.first?this.props.route.params.Userdata.first:""
        const lName= this.props.route.params.Userdata&&this.props.route.params.Userdata.last?this.props.route.params.Userdata.last:""

        const obj = {"ownerId":this.props.HomeStore.UserLoginID,campaignId:this.props.route.params.campaignData.id,commentText:this.state.comment,createdAt: new Date(),profile:{avatarUrl:profileUrl,first:fName,last:lName} }

        runInAction(() => {
            this.props.HomeStore.CampaignCommentList.unshift(obj)
          })
         this.setState({comment:""})
         this.setState({height:50})
      }
      if(this.props.HomeStore.CampaignCommentList.length>3)
      {
        upButtonHandler() 
      }
        
    }
    render() {
        const store = this.props.HomeStore
        const {CampaignCommentList} = store

        return (
            <SafeAreaView style={styles.mainView}>
        {store.isLoadingLikelist===true?this.renderPlaceHolderView():null}

            <KeyboardAvoidingView keyboardVerticalOffset={100} behavior={Platform.OS === "ios" ?'padding':null} style={styles.container}>
 

               {CampaignCommentList.length>0? 
               <FlatList
                   style={{width:'100%',marginBottom:this.props.AuthStore.isLogin ?metrics.dimen_55:metrics.dimen_10}}
                    data={CampaignCommentList}
                    extraData={CampaignCommentList}
                    keyExtractor={(index) => index.toString()}
                    renderItem={({ item }) => this.renderItem(item)}

                    ref={(ref) => {
                      listViewRef = ref;
                    }}
            

                  />
                  : this.nODataRender()}

               {this.props.AuthStore.isLogin&&store.isLoadingLikelist===false?this.renderKeypadView():null}

                
            
            </KeyboardAvoidingView>
            </SafeAreaView>
        )
    }
    renderItem = (item) => {

    const urlPic = item.profile.avatarUrl
    const imageUrl = (urlPic === null || urlPic === 'NA' || urlPic === '') ? Images.userPlaceholder : { uri: urlPic }
    var aDay = 24 * 60 * 60;

        return (
            <View style={styles.commentload}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                <TouchableOpacity  onPress={()=>this.OpenUserProfile(item.profile)}>
                    <Image style={{ height: metrics.dimen_44, width: metrics.dimen_44, borderRadius: metrics.dimen_22, marginVertical: metrics.dimen_15  }} source={imageUrl} /></TouchableOpacity>
                    <View style={{width:"89%", paddingLeft:metrics.dimen_14, flexDirection:'column',paddingTop:metrics.dimen_12}}  > 
                    {/* <ReadMoreText style={{ ...styles.itemdata }}
                    seeMoreStyle={{ ...commonStyles.itemDataName,fontSize:metrics.text_medium, color:colors.app_Blue,marginTop:metrics.dimen_20,backgroundColor:'transparent'}}
                    seeLessStyle={{ ...commonStyles.itemDataName,color:colors.app_Blue,fontSize:metrics.text_medium,  }}
                    backgroundColor='transparenrt'> */}
                     <Text style={styles.itemdata}>
                       <Text style={styles.itemDataName}>{item.profile.first+" "+item.profile.last+" "} 
                     </Text>
        
                     {item.commentText.trim()}</Text>


                     {/* </ReadMoreText> */}
                   
                   
                    {/* <ReadMore
                    numberOfLines={2}
                    renderTruncatedFooter={this._renderTruncatedFooter}
                    renderRevealedFooter={this._renderRevealedFooter}
                    
                    >
                     <Text style={styles.itemdata}><Text style={styles.itemDataName}>{item.profile.first+" "+item.profile.last+" "} 
                     </Text>{item.commentText.trim()}</Text>
                    </ReadMore>         */}
                       
                        <Text style={styles.itemTime}>{`${time_ago(new Date(new Date(item.createdAt) - aDay))} ${strings('ago')}`}</Text>

                    </View>
                </View>

            </View>

        );
    }

    _renderTruncatedFooter = (handlePress) => {
      return (
        <Text style={{ ...styles.normalText, marginTop: metrics.dimen_5, color: 'rgba(22, 88, 211, 1)' }} onPress={handlePress}>
          {strings('ReadMore')}
        </Text>
      );
    }
  
    _renderRevealedFooter = (handlePress) => {
      return (
        <Text style={{ ...styles.normalText, marginTop: metrics.dimen_5, color: 'rgba(22, 88, 211, 1)' }} onPress={handlePress}>
          {strings('ShowLess')}
        </Text>
      );
    }
    renderPlaceHolderView = () => {
        return (
          this.state.initialArr.map(obj => (
            <SkeletonPlaceholder>

              <View style={[styles.itemMainView, {paddingTop: metrics.dimen_5}]}>
    
                <View style={styles.imageType} />
                <View style={styles.textContentView}>
                  <View style={[styles.textblockuser, { width: '95%', height: metrics.dimen_60, borderRadius: 4, marginTop: 6, }]} />
                  <View style={[styles.textblockbutton, { width: '15%', height: metrics.dimen_15, marginTop:metrics.dimen_5}]} />

                </View>
    
              </View>
            </SkeletonPlaceholder>
          ))
        )
      }
      nODataRender() {
        
    
        return (
          <View style={styles.noviewccontainer}>
    
           
            <Text style={styles.noblocktitle}>{strings("No_commentYet")}</Text>
            <Text style={styles.noblocksubtitle}>{strings("start_conversation")}</Text>
    
    
    
          </View>
        )
      }
 
    renderKeypadView = () => {
     
        const {  height } = this.state;

        let newStyle = {
            height
        }
       
         const profileUrl= this.props.route.params.userProfileUrl
         const imageUrl = (profileUrl === null || profileUrl === 'NA' || profileUrl === '') ? Images.userPlaceholder : { uri: profileUrl }

        return (
            <View>
                {Platform.OS === 'android' ? <View style={styles.inputMessageContainer}>
                    <View
                        style={{ width: '100%', minHeight: metrics.dimen_50,maxHeight:metrics.dimen_190, paddingHorizontal: 5,  justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center',  overflow: 'hidden' }}>

                   <Image style={{height: metrics.dimen_30, width: metrics.dimen_30, borderRadius: metrics.dimen_15,  }}  source={imageUrl} />


                        <ScrollView style={{ width: '75%', paddingHorizontal: 5, alignContent: 'center' }}>
                            <TextInput
                                ref={(input) => this.input = input}
                                pointerEvents="auto"
                                autoCorrect={false}
                                autoFocus={true}
                                placeholder={'Write a comment'}
                                placeholderTextColor={colors.app_gray}
                                value={this.state.comment}
                                keyboardType='default'
                                style={[newStyle,{textAlignVertical: 'top'}]}
                                editable={true}
                                multiline={true}
                                onChangeText={(text) => this.setState({ comment: text })}
                                onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)}
                            />
                        </ScrollView>

                        <TouchableOpacity style={{marginTop:metrics.dimen_5}}  onPress={() => {
                                this.props.AuthStore.isLogin ?
                                this.joinData()
                                : this.props.navigation.navigate('AuthStack')}}>
                    <CommentSend 
                     width={metrics.widthSize(80)}
                     height={metrics.widthSize(80)}
                   />

                </TouchableOpacity>

                    </View>
                </View> :  
                <KeyboardAvoidingView keyboardVerticalOffset={150} style={styles.inputMessageContainer} behavior='padding'>
                    <View
                        style={{ minHeight:metrics.dimen_45,maxHeight:metrics.dimen_190, width: '100%',  paddingHorizontal: metrics.dimen_5, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', overflow: 'hidden'}}>
                        <Image style={{height: metrics.dimen_30, width: metrics.dimen_30, borderRadius: metrics.dimen_15,  }}  source={imageUrl} />

                        <ScrollView style={{ width: '70%', paddingHorizontal: metrics.dimen_10, alignContent: 'center' }}>
                            <TextInput
                                ref={(input) => this.input = input}
                                autoCorrect={false}
                                autoFocus={true}
                                placeholder={"Write a comment"}
                                placeholderTextColor={colors.app_gray}
                                value={this.state.comment}
                                keyboardType='default'
                                editable={true}
                                multiline={true}
                                onChangeText={(text) => this.setState({ comment: text })}
                                 onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)}
                                style={{textAlignVertical: 'bottom'}}

                            />
                        </ScrollView>

                            <TouchableOpacity style={{marginTop:metrics.dimen_5}} onPress={()=>{this.props.AuthStore.isLogin ?this.joinData():this.props.navigation.navigate('AuthStack')}}>
                               
                            <CommentSend 
                            width={metrics.widthSize(80)}
                           height={metrics.widthSize(80)}
                        />

                            </TouchableOpacity>

                    </View>
                </KeyboardAvoidingView>}
            </View>
        )
    }

    OpenUserProfile(item)
    {
      getUserId().then(userId => {
      if(item.ownerId!=userId)
      {
       
        this.props.navigation.navigate('UserProfile',{UserData: item})
    
      }else
      {
        if(this.props.AuthStore.isLogin)
        {
          this.props.navigation.navigate('Account')
  
        }else
        {
          this.props.navigation.navigate('UserProfile',{UserData: item})
  
        }
    
      }
    })
    }
}

export default inject("HomeStore","AuthStore",)(observer(UserComment))

const styles = StyleSheet.create(
    {
        container: {
            width: '100%',
            height: '100%',
            backgroundColor: colors.white,
            flexDirection: 'column'
        },

        mainView: {
            flex: 1,
            flexDirection: 'column',
            backgroundColor: colors.white
        }, 
      
        itemdata: {
            paddingRight:metrics.dimen_12,
            fontSize: metrics.text_normal,
            lineHeight: metrics.dimen_20,
            color: '#3E3E46',
            fontFamily: metrics.Lato_Regular
        },
        itemTime: {
          
            paddingTop: metrics.dimen_7,
            fontSize: metrics.text_medium,
            color: '#3E3E46',
            fontFamily: metrics.Lato_Regular
        },
        itemDataName: {
            padding: metrics.dimen_12,
            fontSize: metrics.text_normal,
            lineHeight: metrics.dimen_20,
            color: '#3E3E46',
            textTransform:'capitalize',
            fontFamily: metrics.Lato_Bold
        },

         commentload:
        {
            flexDirection: 'column',
            elevation: metrics.dimen_5,
            marginHorizontal: metrics.dimen_15
        },
        
        
        inputMessageContainer: {
            width: "100%",
            paddingHorizontal: metrics.dimen_10,
            backgroundColor: colors.white,
            borderTopWidth: 1,
            borderTopColor: '#EBEBEB',
            position: 'absolute',
            bottom: 0
        },
        backButtonContainer: {
          marginLeft: metrics.dimen_16, 
          marginTop: Platform.OS == 'android' ? metrics.dimen_4 : 0
        },
          itemMainView: {
            flexDirection: 'row',
            paddingTop: metrics.dimen_10,
            paddingRight:metrics.dimen_10,
            height: metrics.dimen_95,
          },

          imageType: {
            marginLeft: metrics.dimen_10,
            width: metrics.dimen_44,
            height: metrics.dimen_44,
            marginTop:metrics.dimen_12,
            borderRadius:metrics.dimen_22
          },
          textContentView: {
            marginHorizontal: metrics.dimen_13,
            flexDirection: 'column',
            flex:1
          
          },
          textblockuser: {
            fontFamily: metrics.Lato_Regular,
            fontSize: metrics.text_normal,
            color: '#3E3E46',
          },
          textblockbutton: {
            fontFamily: metrics.Lato_Regular,
            fontSize: metrics.text_medium,
            marginTop: metrics.dimen_6,
            marginBottom: metrics.dimen_8,
            color: colors.app_gray
          },
          noviewccontainer:
  {
    flex: 1, width: '100%',
    height: '100%',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: metrics.dimen_100
  },

  noviewImage:
  {
    width: metrics.dimen_100,
    height: metrics.dimen_100,
    alignSelf: 'center'

  },
  noblocktitle:
  {
    color: "#3D4046",
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_large,
    textAlign: 'center',
  },
  noblocksubtitle:
  {
    color: '#7A818A',
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_normal,
    textAlign: 'center',
    marginTop:metrics.dimen_4
  },

    })