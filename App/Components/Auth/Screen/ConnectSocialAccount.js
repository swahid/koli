import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';
import { inject, observer } from 'mobx-react';
import images from '../../../Themes/Images';
import metrics from '../../../Themes/Metrics';

class ConnectSocialAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {

    this.props.navigation.addListener('focus', () => {
      this.props.navigation.setOptions({
      
        
        headerLeft: () => (
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Image style={styles.backButtonContainer} source={images.backImage} />
          </TouchableOpacity>
        )
      })
    });

  }
  render() {
    return (
      <View style={{alignItems:'center',justifyContent:'center'}}>
        <Text> Hi, Zhi Ruo </Text>
        <Text> Please connect to a social account. Then IG posts will start appearing in your profile. These are not necessary if you do not want to be linked now. </Text>
<TouchableOpacity style={{backgroundColor:'#DD2A7B',width:"90%", height:50, borderRadius:10, alignItems:'center', justifyContent:"center"}}>
<Text style={{color:'white'}}> Instagram </Text>

</TouchableOpacity>
<TouchableOpacity style={{backgroundColor:'#2174EE',width:"90%", height:50, borderRadius:10, alignItems:'center', justifyContent:"center",marginTop:15}}>
<Text style={{color:'white'}}> Facebook </Text>

</TouchableOpacity>
      </View>
    );
  }
}

export default inject('UserProfileStore', "AuthStore")(observer(ConnectSocialAccount))


const styles = StyleSheet.create({
  
  backButtonContainer: {
    marginLeft: metrics.dimen_16,
    marginTop: Platform.OS == 'android' ? metrics.dimen_2 : 3
  },
  
}
)
