import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import { observer, inject } from 'mobx-react';

import metrics from '../../Themes/Metrics';
import colors from '../../Themes/Colors';

class ChatTabBarIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
      const unreadNotificationCount = this.props.NotificationStore.unreadNotificationCount
    return (
        < View style={styles.viewMain}>
        <Image  source={this.props.focused === true ? this.props.iconFilledName : this.props.iconName}
       style={styles.imageIcon}
         />
         {unreadNotificationCount > 0 && 
        <View style={styles.viewUnreadCount}>
            <Text style={styles.textUnreadCount}>
                {unreadNotificationCount}
            </Text>
        </View>}

    </View >
    );
  }
}
const styles = StyleSheet.create({

    viewMain:{ 
        flexDirection: 'column' },
    imageIcon:{
        marginTop:metrics.dimen_15,
        height: Platform.OS === 'ios' ? metrics.dimen_25 : metrics.widthSize(75), 
        width: Platform.OS === 'ios' ? metrics.dimen_25 : metrics.widthSize(75),
        //borderRadius: Platform.OS === 'ios' ? metrics.dimen_25/2 : metrics.widthSize(75)/2,
        overflow: "hidden",
    },
    viewUnreadCount:{
        marginTop:metrics.dimen_12,
        left: metrics.dimen_12,
        position: 'absolute',
       // height: metrics.dimen_15,
        borderRadius: metrics.dimen_7,
        borderColor: colors.white,
        backgroundColor: colors.app_RedColor
    },
    textUnreadCount:{
        color: colors.white,
        fontSize: metrics.text_small,
       // alignSelf: 'center',
       // justifyContent: 'center',
        paddingHorizontal: 8,
        paddingVertical: 1

    }
})
export default inject("CompaignsStore", "AuthStore", "ChatStore", "NotificationStore")(observer(ChatTabBarIcon))

// export default ChatTabBarIcon;
