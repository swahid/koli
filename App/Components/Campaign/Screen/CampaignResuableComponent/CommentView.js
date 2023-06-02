import React, { Component } from 'react';
import { View, Text, StyleSheet,Image,TouchableOpacity,Alert } from 'react-native';
import metrics from '../../../../Themes/Metrics';
import { strings } from '../../../../Locales/i18';
import colors from '../../../../Themes/Colors';
import { commonStyles } from '../../../../SupportingFIles/Constants';
import images from '../../../../Themes/Images';
import { observer, inject } from 'mobx-react';
import ChatLike from '../../../../Assets/Images/chatLike';
import Heart from '../../../../Assets/Images/heart';
import Comment from '../../../../Assets/Images/comment';
import Heartselected from '../../../../Assets/Images/heartselected';
import Moment from 'moment'
const formatCurrency = new Intl.NumberFormat('en-US')

class CommentView extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
 

  render() {
      const {campaignData,type} = this.props  
      console.log("campaignData",campaignData)
    return (
        <View style={styles.containerTop}>
        <View style={styles.commentView}> 
        
        <View style={styles.likeView}>
      

      <View style={{flexDirection:'column'}}> 
      {/* <Heart 
        width={metrics.widthSize(55)}
        height={metrics.widthSize(55)}
        /> */}
        <TouchableOpacity
       
       onPress={()=> this.campaignLikes(campaignData,type)}
        >
        <Heartselected 
        width={metrics.widthSize(55)}
        height={metrics.widthSize(55)}
        />
 </TouchableOpacity>
     <TouchableOpacity
       style={styles.likeView}
       onPress={() => {
        this.props.navigation.navigate('CampaignLike')
    }}        >
        <Text style={styles.likeText}>
        {`${campaignData.likes?campaignData.likes.length:""} ${strings('likes')}`}</Text>
        </TouchableOpacity>
        </View>
        </View>   
       
        


        <TouchableOpacity 
        style={styles.chalikeVie}

        >
        <ChatLike 
        width={metrics.widthSize(55)}
        height={metrics.widthSize(55)}
        />
        </TouchableOpacity>
      
     
        <TouchableOpacity
        style={styles.chalikeVie}
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

  campaignLikes=(campaignData,type)=>
  {
    this.props.HomeStore.postCampaignLike(campaignData.id,type)

  }

 
}

export default inject("CompaignsStore", "AuthStore", "HomeStore")(observer(CommentView))

const styles = StyleSheet.create({
  feesNote:{
    fontSize:metrics.dimen_12, 
    fontFamily:metrics.Lato_Italic,
    color:colors.app_RedColor,
    marginTop:metrics.dimen_4
  },
  containerTop:{
    flexDirection:'row',marginHorizontal:metrics.dimen_12,justifyContent:'space-between'
  },
  commentView:{
    flexDirection:'row',marginTop: metrics.dimen_14, marginBottom: metrics.dimen_8
  },
  likeView:{
    width:metrics.widthSize(120)
  },
  chalikeVie:{
    width:metrics.widthSize(120),height:metrics.widthSize(70)
  },
  imageOfferStatus:{
    width: metrics.dimen_12,
    height: metrics.dimen_12,
    tintColor: colors.bankInfoListValue,
    marginRight: metrics.dimen_4
  },
  textOfferStatus:{
    marginVertical: metrics.dimen_8, 
    fontFamily: metrics.Lato_Italic,
    fontSize: metrics.text_11,
    color: colors.bankInfoListValue},
    postedOnText: {
      fontFamily: metrics.Lato_Regular,
      fontSize: metrics.text_small,
      color: '#7A818A',
    },
    likeText:{
      fontFamily:metrics.Lato_SemiBold,fontSize:metrics.text_small,color:"#3D4046",marginTop:metrics.dimen_2 
    }
})