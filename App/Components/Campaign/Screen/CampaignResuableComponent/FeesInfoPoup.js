import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import metrics from '../../../../Themes/Metrics';
import  campaignStyles  from '../../../CreateCampaign/CreateCampaignFrom/styles'
import { strings } from '../../../../Locales/i18';
import colors from '../../../../Themes/Colors';
import { commonStyles } from '../../../../SupportingFIles/Constants';

class FeesInfoPoup extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  renderFeesValues = (title, value) =>{

    return (
      <View style={{marginTop:metrics.dimen_8, flexDirection:'row', justifyContent: 'space-between'}}>
     
      <Text style={{fontFamily: metrics.Lato_Regular, color: 'rgba(62, 62, 70, 1)', fontSize: metrics.text_15}}>
        {title}
        </Text>
      <Text style={{fontFamily: metrics.Lato_Bold, color: 'rgba(62, 62, 70, 1)', fontSize: metrics.text_15}}>
        {value}
      </Text>

    </View>
    )
  }

  render() {
      const {applicantData, koliCommission, payPalFees, campaignData} = this.props
      console.log("applicantData:",JSON.stringify(applicantData))
      console.log("koliCommission:",JSON.stringify(koliCommission))
      console.log("payPalFees:",JSON.stringify(payPalFees))
      console.log("campaignData:",JSON.stringify(campaignData))

      const campaignFees = campaignData !== undefined ? campaignData.campaignAmount : applicantData.offerAmount
      const koliFees = (applicantData !== undefined && applicantData.koliplatformfee !== null) 
      ? applicantData.koliplatformfee 
      : koliCommission
      const userPaypalFees = (applicantData !== undefined && applicantData.paypalfee !== null) 
      ? applicantData.paypalfee 
      : payPalFees
      const influencerAmount = campaignFees-koliFees-userPaypalFees
    return (
        <View style={{flex: 1,}}>
          <View style={{width:'100%', height:1, backgroundColor:'#ECECEC', marginTop:metrics.dimen_20}}/>
          <Text style = {{...commonStyles.LatoBold_12, color: 'rgba(112, 129, 138, 1)', marginTop: metrics.dimen_20}}>
            {strings('fees_and_tax')}</Text>
            <Text style={[
        campaignStyles.textPopupTitle,
          styles.feesNote]}>{strings('approx_price')}</Text>
                    
          {this.renderFeesValues(strings('Campaign_Fee'),`$${parseFloat(campaignFees).toFixed(2)}`)}
          {this.renderFeesValues(strings('koli_commission'),`$${parseFloat(koliFees).toFixed(2)}`)}
          {this.renderFeesValues(strings('paypal_fees'),`$${parseFloat(userPaypalFees).toFixed(2)}`)}
          {this.renderFeesValues(strings('Influencer_Get'),`$${parseFloat(influencerAmount).toFixed(2)}`)}

      
     
    </View>
    );
  }
}

export default FeesInfoPoup;
const styles = StyleSheet.create({
  feesNote:{
    fontSize:metrics.dimen_12, 
    fontFamily:metrics.Lato_Italic,
    color:colors.app_RedColor,
    marginTop:metrics.dimen_4
  }

})