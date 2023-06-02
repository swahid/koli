import React, { Component } from 'react';
import { View, Text, StyleSheet,Image,TouchableOpacity,Alert } from 'react-native';
import metrics from '../../../../Themes/Metrics';
import { strings } from '../../../../Locales/i18';
import colors from '../../../../Themes/Colors';
import { commonStyles } from '../../../../SupportingFIles/Constants';
import images from '../../../../Themes/Images';
import { observer, inject } from 'mobx-react';
const formatCurrency = new Intl.NumberFormat('en-US')

class CampaignOfferStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
 

  render() {
      const {appliedRemarkData,} = this.props  
      console.log("appliedRemarkData====",appliedRemarkData)
   console.log("       ", appliedRemarkData.counterBy ,appliedRemarkData.ownerId)
    return (
    <View style={{flexDirection:'column',  borderStyle:'dashed',borderColor:"#C8D5F1", borderRadius:metrics.dimen_5,borderWidth:1,backgroundColor:"#F5F8FE",marginTop:metrics.dimen_20}}>
 
  

       {appliedRemarkData.offerStatus <=1? parseInt(appliedRemarkData.ownerId,10) === parseInt(appliedRemarkData.counterBy,10)?this.sentOfferStatus(appliedRemarkData):this.receivedOfferStatus(appliedRemarkData):null}

       {/* {appliedRemarkData.offerStatus === 1? this.receivedOfferStatus(appliedRemarkData):null} */}
       {appliedRemarkData.offerStatus === 2?this.jobAwardedStatus(appliedRemarkData):null}
      
     
    </View>
    );
  }

  sentOfferStatus=(appliedRemarkData)=>
  {
  return (
    <View>
 <View style = {{borderTopLeftRadius:metrics.dimen_5, borderBottomRightRadius:metrics.dimen_6 , color: 'rgba(112, 129, 138, 1)', backgroundColor:colors.app_Blue,justifyContent:'center',alignItems:'center',padding:metrics.dimen_5,width:'31%' }}>
    <Text style={{fontFamily:metrics.Lato_Regular,color:colors.white,textTransform:"uppercase"}} >
            {strings('sent_offers')}</Text>
    </View>
   <View style = {{justifyContent:'center',alignItems:'center',marginTop:metrics.dimen_10}}>
   <Text style={{fontFamily:metrics.Lato_Bold,color:colors.app_Blue,fontSize:metrics.text_24}} >
            {"$"+formatCurrency.format(appliedRemarkData.offerAmount)}</Text>
  </View>
  <View style={{justifyContent:'center',alignItems:'center',flexDirection:'row',marginTop:metrics.dimen_12,marginBottom:metrics.dimen_10}}>
        <Image
          style={styles.imageOfferStatus}
          source={images.jobAwarded}></Image>
        <Text style={styles.textOfferStatus}>
         {"Awaiting for the brand to accept this offer."}
        </Text>
      </View>
      </View>    
  )}


  receivedOfferStatus=(appliedRemarkData)=>
  {
    return (
    <View>

  <View style = {{borderTopLeftRadius:metrics.dimen_5, borderBottomRightRadius:metrics.dimen_6 , color: 'rgba(112, 129, 138, 1)', backgroundColor:colors.app_Blue,justifyContent:'center',alignItems:'center',padding:metrics.dimen_5,width:'40%' }}>
    <Text style={{fontFamily:metrics.Lato_Regular,color:colors.white,textTransform:"uppercase"}} >
            {strings('received_offer')}</Text>
    </View>
         
   <View style = {{justifyContent:'center',alignItems:'center',marginTop:metrics.dimen_10}}>
   <Text style={{fontFamily:metrics.Lato_Bold,color:colors.app_Blue,fontSize:metrics.text_24}} >
            {"$"+formatCurrency.format(appliedRemarkData.offerAmount)}</Text>
  </View>
      <View style={{ flexDirection: 'row', alignItems:'center',justifyContent:'center',marginBottom:metrics.dimen_12,marginTop:metrics.dimen_15 }}>
                  <TouchableOpacity style={{marginRight:metrics.dimen_6, width: "45%", height: metrics.dimen_30,borderWidth:metrics.dimen_1,borderColor:"#78B757", borderRadius: metrics.dimen_15, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => this.accectDeclineOffer(2,appliedRemarkData)}>
                    <Text style={{ color: "#78B757", fontFamily: metrics.Lato_SemiBold, fontSize: metrics.text_medium }}>{strings('Accept')}</Text>

                  </TouchableOpacity>
                  <TouchableOpacity style={{marginLeft:metrics.dimen_5, width: "45%", height: metrics.dimen_30,borderWidth:metrics.dimen_1,borderColor:"#EFAC56", borderRadius: metrics.dimen_15, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => this.accectDeclineOffer(3,appliedRemarkData)}>
                    <Text style={{ color: '#EFAC56', fontFamily: metrics.Lato_SemiBold, fontSize: metrics.text_medium }}>{strings('Decline')}</Text>

                  </TouchableOpacity>
                </View>
</View>

    )}


    jobAwardedStatus=(appliedRemarkData)=>
    {
    return (
      <View>
   <View style = {{borderTopLeftRadius:metrics.dimen_5, borderBottomRightRadius:metrics.dimen_6 , color: 'rgba(112, 129, 138, 1)', backgroundColor:colors.app_Blue,justifyContent:'center',alignItems:'center',padding:metrics.dimen_5,width:'38%' }}>
      <Text style={{fontFamily:metrics.Lato_Regular,color:colors.white,textTransform:"uppercase"}} >
              {appliedRemarkData.isMarkAsDone===0? strings('Job_awarded'):strings('Job_completed')}</Text>
      </View>
     <View style = {{justifyContent:'center',alignItems:'center',marginTop:metrics.dimen_10}}>
     <Text style={{fontFamily:metrics.Lato_Bold,color:colors.app_Blue,fontSize:metrics.text_24}} >
              {"$"+formatCurrency.format(appliedRemarkData.offerAmount)}</Text>
    </View>
    {appliedRemarkData.isMarkAsDone===0? 
    <View style={{justifyContent:'center',alignItems:'center',flexDirection:'row',marginTop:metrics.dimen_12,marginBottom:metrics.dimen_10}}>
          <Image
            style={styles.imageOfferStatus}
            source={images.jobAwarded}></Image>
          <Text style={styles.textOfferStatus}>
           {"Job is Ongoing, Earn a good amount by completing this job. "}
          </Text>
        </View>:<View style={{height:metrics.dimen_25}} />}
        </View>    
    )}
 
    accectDeclineOffer = (status,appliedRemarkData) => {
      //   offerStatus 
      // 0 - No action taken
      // 1 - Pending
      // 2 - Accepted
      // 3 - Declined
      const applicantData = appliedRemarkData
  
      const store = this.props.CompaignsStore
      Alert.alert(
        strings('OFFER'),
        strings('Are_you_sure_want_to_submit_your_response'),
        [
          {
            text: strings('Cancel'),
            onPress: () => console.log('cancel offer'),
            style: "cancel"
          },
          {
            text: strings('Yes'), onPress: () => {
  
              
                store.acceptDeclineOffer(applicantData.id, status, applicantData.ownerId)
                
                status===2? this.props.statusUpdate():this.props.statusUpdateDelete()
              //  const applicantDataToChange = JSON.parse(JSON.stringify(this.state.applicantData))
              //  applicantDataToChange.offerStatus = status
              //  this.setState({offerResponded: true,applicantData:applicantDataToChange})
            
  
              
            }
          }
        ],
        { cancelable: false }
      );
  
    }
  continueOffer()
  {
    this.props.hideCounterOfferPopup()
  }
}

export default inject("CompaignsStore", "AuthStore", "CreateCampaignStore")(observer(CampaignOfferStatus))

const styles = StyleSheet.create({
  feesNote:{
    fontSize:metrics.dimen_12, 
    fontFamily:metrics.Lato_Italic,
    color:colors.app_RedColor,
    marginTop:metrics.dimen_4
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
    color: colors.bankInfoListValue}
})