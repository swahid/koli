import React, { Component } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Image,ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import colors from '../../../Themes/Colors';
import images from '../../../Themes/Images';
import metrics from '../../../Themes/Metrics';
import Config from "react-native-config";
const PAYMENT_URL = Config.PAYMENT_URL

const ActivityIndicatorElement = () => {
  //making a view to show to while loading the webpage
  return (
    <ActivityIndicator
       color={colors.app_Blue}
       size="large"
       style={{flex: 1,
        justifyContent: 'flex-start'}}
    />
  );
}
class PayPalWebview extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount(){
    this.props.navigation.setOptions({
       headerLeft: () => (
         <TouchableOpacity style={{ marginLeft: metrics.dimen_15 }} onPress={() => this.props.navigation.goBack()}>
           <Image source={images.backImage} />
         </TouchableOpacity>
       )
     })
  }
  onMessage=(event)=>{
    console.log('Hello');  //got no any response
    console.log(event.nativeEvent.data );

   console.log(JSON.parse(event.nativeEvent.data) );
   const messageData = JSON.parse(event.nativeEvent.data)
   //this.props.onClosePaymentPopup()
   this.props.navigation.goBack()
   setTimeout(() => {
  //  if(messageData.data !== undefined && messageData.data.status === 'COMPLETED'){
    if(messageData.data !== undefined && messageData.status === 1 && messageData.error === false){

      this.props.route.params.responseCallback('success')
     }
     else
     {
      this.props.route.params.responseCallback('failure')
     }
    }, 500)

  //  console.log(event.nativeEvent.data);
  }
  
  render() {
    
    const PayPalHTML = require('./test.html');
    const {ownerId,amount,campaignId,applicantOwnerId,onClosePaymentPopup } = this.props.route.params
    const paymentUrl = `${PAYMENT_URL}?ownerId=${ownerId}&amount=${amount}&campaignId=${campaignId}&applicantOwnerId=${applicantOwnerId}`
    console.log('paymentUrl:',paymentUrl)
    //const pUrl = 'http://staging-backend.koliapp.com/campaign-payment-webview?ownerId=10296&amount=10&campaignId=1267&applicantOwnerId=2591'
    return (
      
       <View style={{flex:1, backgroundColor:colors.white}}>
         {/* <TouchableOpacity  style={{alignSelf:'flex-end',marginTop:20 }} onPress={()=> onClosePaymentPopup()}>
         <Image source={images.CrossSearch} 
         style={{ width:30, height:30, marginRight:20, tintColor:'black' }} />
         </TouchableOpacity> */}
         <Text style={{fontFamily: metrics.Lato_Italic, 
          fontSize: metrics.text_14, 
          color: colors.app_RedColor,
          alignSelf: 'center',marginTop:20  }}>
            Please don't go back or close this screen.</Text>
         <SafeAreaView style={{flex:1}}>
        <WebView 
        style={{marginTop:20}}
        source={{ uri: paymentUrl }}
        onMessage={this.onMessage} 
        renderLoading={ActivityIndicatorElement}
        //Want to show the view or not
        startInLoadingState={true}
        />
        </SafeAreaView>
       </View>
    );
  }
}

export default PayPalWebview;
