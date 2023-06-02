import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet,
    Image
 } from 'react-native';
import images from '../../Themes/Images'
import metrics from '../../Themes/Metrics';
import colors from '../../Themes/Colors';

class NotificationIconHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const unreadNotificationCount = this.props.NotificationStore.unreadNotificationCount

    return (
      <View>
        {this.props.AuthStore.isLogin && 
          <TouchableOpacity onPress={() => this.props.navigation.navigate('NotificationTab')}>
            <Image source={images.bellIcon} style={{ marginLeft: metrics.dimen_22, width: metrics.dimen_16, height: metrics.dimen_16 ,}} />
           {unreadNotificationCount > 0 &&
            <View style={styles.viewUnreadCount}>
            <Text style={styles.textUnreadCount}>
                {unreadNotificationCount}
            </Text>
        </View>}
          </TouchableOpacity>}
      </View>
    );
  }
}
const styles = StyleSheet.create({
    viewUnreadCount:{
        // marginTop:metrics.dimen_12,
         right: 0,
         position: 'absolute',
         height: metrics.dimen_5,
         width: metrics.dimen_5,
         borderRadius: 2.5,
         borderWidth:0.5,
         borderColor: colors.white,
         backgroundColor: colors.app_RedColor
     },
     textUnreadCount:{
      color: colors.white,
      fontSize: metrics.text_small,
      paddingHorizontal: 8,
      paddingVertical: 1

  }
})
export default inject( "AuthStore", "ChatStore","NotificationStore")(observer(NotificationIconHeader))

