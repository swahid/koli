import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import metrics from '../../../../Themes/Metrics';
import { strings } from '../../../../Locales/i18';
import colors from '../../../../Themes/Colors';
import { observer, inject } from 'mobx-react';
import ChatLike from '../../../../Assets/Images/chatLike';
import Heart from '../../../../Assets/Images/heart';
import Comment from '../../../../Assets/Images/comment';
import Heartselected from '../../../../Assets/Images/heartselected';
import Moment from 'moment'
import { join } from '../../../../Socket/index'
import { gettUserData,generateFirebaseCampaignlink} from '../../../../SupportingFIles/Utills';
import Share from 'react-native-share';

import { runInAction } from 'mobx';

const formatCurrency = new Intl.NumberFormat('en-US')

class LikeCommentView extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  render() {
    const { campaignData } = this.props
    console.log("campaignData", campaignData)
    console.log("this.props.HomeStore.UserLoginID", this.props.HomeStore.UserLoginID)

    const likedCampaign = campaignData&&campaignData.likes?campaignData.likes.some(el => el.ownerId === this.props.HomeStore.UserLoginID):""

    return (


      <View style={styles.containerTop}>
        <View style={styles.commentView}>
         
          <View style={styles.likeView}>
            <View style={{ flexDirection: 'column' }}>
              <TouchableOpacity
                onPress={() => this.props.AuthStore.isLogin ?
                  this.campaignLikes(campaignData)
                  : this.props.navigation.navigate('AuthStack')}>
               {likedCampaign ? <Heartselected 
               width={metrics.widthSize(55)}
               height={metrics.widthSize(55)}
               />:null}
                {!likedCampaign ? <Heart
                  width={metrics.widthSize(55)}
                  height={metrics.widthSize(55)}
                />:null}
              </TouchableOpacity>
              
              {campaignData.likes&&campaignData.likes.length>0&&<TouchableOpacity
                style={styles.likeView}
                onPress={() => {
                  this.props.navigation.navigate('CampaignLike',{campaignData:campaignData})
                }}        >
             <Text style={styles.likeText}>
                  {`${campaignData.likes ? campaignData.likes.length : ""} ${strings('likes')}`}</Text>
              </TouchableOpacity>}

              
            </View>
          </View>


          <TouchableOpacity
            style={styles.chatLikeVie}
            onPress={()=>{
              gettUserData().then(data => {
                this.props.navigation.navigate('UserComment',{campaignData:campaignData,userProfileUrl:data?data.avatarUrl:"",Userdata:data})

              })

                }}
          >
           <ChatLike
              width={metrics.widthSize(55)}
              height={metrics.widthSize(55)}
            />
          </TouchableOpacity>

        


          <TouchableOpacity
            style={styles.chatLikeVie}
            onPress={()=>{
              this.generatelinklink(campaignData)

                }}
          >
            <Comment
              width={metrics.widthSize(55)}
              height={metrics.widthSize(55)}
            />
          </TouchableOpacity>
        </View>


        <View>
          <Text style={{ ...styles.postedOnText, marginTop: metrics.dimen_14, marginBottom: metrics.dimen_8 }}>
            {`${strings('Posted_On')}: ${Moment(campaignData.createdAt).format('MMM DD, YYYY')}`}</Text>
        </View>

      </View>
    );
  }

  openchatDetailView=(campaignData)=>{

      const recerverUserData = {
        _id: parseInt(campaignData.profile.ownerId, 10),
        name: (campaignData.profile.first ? campaignData.profile.first : '') + " " + (campaignData.profile.last ? campaignData.profile.last : ''),
        avatar: campaignData.profile.avatarUrl !== null ? campaignData.profile.avatarUrl : ''
      }

      join({ userId: this.props.HomeStore.UserLoginID })
      this.props.navigation.navigate('ChatDetail', {
        receiverUserId: parseInt(campaignData.profile.ownerId, 10),
        recerverUserData: recerverUserData,
        campaignId: campaignData.id,
        title: recerverUserData.name,
        receiverUserProfile: campaignData.profile
      })

  }

  campaignLikes = (campaignData) => {
    
    const obj = {"ownerId":this.props.HomeStore.UserLoginID }
    const likedCampaign = campaignData.likes.some(el => el.ownerId === this.props.HomeStore.UserLoginID)
    this.props.HomeStore.postCampaignLike(campaignData.id)

    if (!likedCampaign){
      setTimeout(() => {
        runInAction(() => {
          campaignData.likes.push(obj)
        })
      }, 800);
    

    }
    else{
      
    
      //this.props.HomeStore.delUserLikeList(campaignData.likes[0].id)

      runInAction(() => {
        campaignData.likes=campaignData.likes.filter(el => el.ownerId !== this.props.HomeStore.UserLoginID)
      })
      console.log("campaignData.likes",campaignData.likes)
      this.props.HomeStore.delUserLikeList(campaignData.id)
    }
    

  }


  generatelinklink(campaignData){

    generateFirebaseCampaignlink(campaignData.id).then(campaignlink => {
 
     this.shareCampaignlink(campaignlink,campaignData)
       
    })   
   
  }

  shareCampaignlink= async(campaignlink,campaignData)=>{
    const shareOptions = {
      title: 'Share via',
      message: campaignData.campaignTitle,
      url: campaignlink,
      social: Share.Social.WHATSAPP
    };
    await Share.open(shareOptions)  
   }


}

export default inject("CompaignsStore", "AuthStore", "HomeStore")(observer(LikeCommentView))

const styles = StyleSheet.create({
  feesNote: {
    fontSize: metrics.dimen_12,
    fontFamily: metrics.Lato_Italic,
    color: colors.app_RedColor,
    marginTop: metrics.dimen_4
  },
  containerTop: {
    flexDirection: 'row', marginHorizontal: metrics.dimen_12, justifyContent: 'space-between'
  },
  commentView: {
    flexDirection: 'row', marginTop: metrics.dimen_14, marginBottom: metrics.dimen_8
  },
  likeView: {
    width: metrics.widthSize(120)
  },
  chatLikeVie: {
    width: metrics.widthSize(120), height: metrics.widthSize(70)
  },
  imageOfferStatus: {
    width: metrics.dimen_12,
    height: metrics.dimen_12,
    tintColor: colors.bankInfoListValue,
    marginRight: metrics.dimen_4
  },
  textOfferStatus: {
    marginVertical: metrics.dimen_8,
    fontFamily: metrics.Lato_Italic,
    fontSize: metrics.text_11,
    color: colors.bankInfoListValue
  },
  postedOnText: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_small,
    color: '#7A818A',
  },
  likeText: {
    fontFamily: metrics.Lato_SemiBold, fontSize: metrics.text_small, color: "#3D4046", marginTop: metrics.dimen_2
  }
})