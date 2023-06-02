import React, { Component } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import images from '../../Themes/Images';
import metrics from '../../Themes/Metrics';
class DrawerIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
        <TouchableOpacity style={{ marginLeft: metrics.dimen_20 }} 
        onPress={() => this.props.navigation.openDrawer()}
        >
        <Image source={images.drawerIcon} />
    </TouchableOpacity>
    );
  }
}

export default DrawerIcon;
