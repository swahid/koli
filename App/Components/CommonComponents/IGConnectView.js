import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import images from '../../Themes/Images';
import colors from '../../Themes/Colors';
import metrics from '../../Themes/Metrics';
import { color } from 'react-native-reanimated';
import ConnectIG from '.././../Assets/Images/ConnectIG'
import CrossGrey from '.././../Assets/Images/CrossGrey'
import { strings } from '../../Locales/i18';
class IGConnectView extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={styles.containerView}>
          <TouchableOpacity style={styles.connectView}
          onPress={()=> this.props.navigation.navigate('ProfileStackScreen')}>
              <ConnectIG styles={styles.instagramIcon}/>
              <Text style={styles.textConnect}>Connect</Text>
          </TouchableOpacity>
        <Text style={styles.textConnectToInsta}>{strings('Connect_your_insta_account')}</Text>
        <TouchableOpacity style={styles.crossContainer} 
         onPress={this.props.removeIgConnectView}>
            <CrossGrey style={styles.imageCross}/>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
    containerView:{
        width:"100%",
        alignSelf: 'center',
        flexDirection:"row",
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: "#F2F7FF",
        borderRadius: metrics.dimen_5,
        marginVertical: metrics.dimen_9
    },
    connectView:{
        marginVertical: metrics.dimen_10,
        paddingHorizontal: metrics.dimen_8,
        paddingVertical: metrics.dimen_9,
        backgroundColor: colors.white,
        borderRadius: metrics.dimen_5,
        flexDirection: 'row'
    },
    instagramIcon: {
        width: metrics.dimen_15,
        height: metrics.dimen_15
    },
    textConnect: {
        marginLeft: metrics.dimen_6,
        fontFamily: metrics.Lato_SemiBold,
        fontSize: metrics.text_13,
        color: colors.bankInfoListValue,
        marginTop: -metrics.dimen_1

    },
    textConnectToInsta: {
        marginLeft: metrics.dimen_9,
        width:'65%',
        fontFamily: metrics.Lato_Regular,
        fontSize: metrics.text_12,
        color: colors.app_Blue,
        fontWeight: "100",
       
    },
    crossContainer:{
        position: 'absolute',
        top: 0,
        right: 0,
        width: metrics.dimen_48,
        height: metrics.dimen_48,
       // backgroundColor: 'red',
    },
    imageCross:{
        position: 'absolute',
        top: metrics.dimen_9,
        right: metrics.dimen_9,
    }


    

})

export default IGConnectView;
