import React, { Component } from 'react';
import { View, Text, Image, SafeAreaView,StyleSheet } from 'react-native';
import metrics from '../Themes/Metrics';
import images from '../Themes/Images';
import { strings } from '../Locales/i18';
import { commonStyles } from '../SupportingFIles/Constants';
import colors from '../Themes/Colors';

export default class GiveAway extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style = {{ backgroundColor:colors.white}}>
        <Text style = {styles.headerTextStyle}>{strings('Giveaway')}</Text>

        {this.renderNoGiveAway()}
      </View>
    );
  }
  renderNoGiveAway(){
    return(
    <SafeAreaView style = {{alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', width: '100%', height: '96%'}}>
      <Image source ={images.Groupgiveaway} style={{marginTop: -metrics.dimen_40}}/>
      {/* <Text style = {{...commonStyles.LatoBold_16, marginTop: -metrics.dimen_40, marginHorizontal: metrics.dimen_20}}>{strings('GiveAway_MarketPlace')}</Text> */}
      <Text style = {{...commonStyles.LatoRegular_Medium, marginHorizontal: metrics.dimen_20, marginTop: metrics.dimen_12, textAlign: 'center'}}>{strings('giveaway_Message')}</Text>
      <View style={{...commonStyles.commingsoon}} >
         <Text style={{...commonStyles.LatoBold_12, color: 'white',paddingHorizontal:metrics.dimen_10 }}>{strings('Coming_Soon')}</Text>
    </View>


    </SafeAreaView>)
  }
}
const styles = StyleSheet.create({
  headerTextStyle:{
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_xxxl,
    marginLeft: metrics.dimen_20,
    
    color: 'rgba(61, 64, 70, 1)',
  }
})