import React, { Component } from 'react';
import { StyleSheet, Image, Platform, View } from 'react-native';
import metrics from '../../Themes/Metrics';
import colors from '../../Themes/Colors';

class TabBarIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    if(this.props.userProfile)
    {
      return (
        <View style={
          [styles.imageStyle,styles.viewProfile,
         this.props.focused && {borderColor: colors.app_Blue,}
      ]}>
        <Image 
        style={
          styles.profileTabIcon
      }
        source={this.props.focused === true ? this.props.iconFilledName : this.props.iconName}/>
        </View>
    );
    }
    else
    {
      return (
        <Image style={
            [styles.imageStyle,
           // this.props.focused && styles.focusedStyle,
            this.props.userProfile && styles.profileTabIcon,
            this.props.userProfile &&  this.props.focused && {borderColor: colors.app_Blue,}
        ]}
        source={this.props.focused === true ? this.props.iconFilledName : this.props.iconName}/>
    );
    }
   
  }
}
const styles = StyleSheet.create({
    imageStyle:{
      marginTop:metrics.dimen_15,
        //paddingTop: metrics.dimen_10,
        height: Platform.OS === 'ios' ? metrics.dimen_25 : metrics.widthSize(75), 
        width: Platform.OS === 'ios' ? metrics.dimen_25 : metrics.widthSize(75)
       // tintColor: '#1D1D1D'
    },
    focusedStyle: {
        tintColor: colors.app_Blue,
    },
    viewProfile:{
      borderRadius: Platform.OS === 'ios' ? metrics.dimen_25/2 : metrics.widthSize(75)/2,
      borderColor: colors.app_black,
      borderWidth: .5,
      padding: 1,
      overflow: "hidden",
    },
    profileTabIcon:{
      borderRadius: Platform.OS === 'ios' ? metrics.dimen_24/2 : metrics.widthSize(73)/2,
      width: '100%',
      height: '100%',
      marginTop:0,
      //  overflow: "hidden",
      
    }
})
export default TabBarIcon;
