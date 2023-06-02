import React, { Component } from 'react';
import { View, Text } from 'react-native';
import colors from '../../Themes/Colors';
import metrics from '../../Themes/Metrics';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

class CampaignListSkeleton extends Component {
  constructor(props) {
    super(props);
    this.state = {
        initialArr : [
            {
              id: 1,
              color: colors.app_Blue,
              text: "Loading..."
            },
            {
              id: 2,
              color: "red",
              text: "Loading..."
            },
          ]
    };
  }

  render() {
    return (
      <View>
       {this.state.initialArr.map(obj =>(
          <SkeletonPlaceholder>
          <View style={{ flexDirection: "column", marginBottom:30 }}>
            <View style={{ width: '100%', height: metrics.width, }} />
            <View style={{ marginLeft: 20 }}>
            <View style={{ width: '20%', height: 10, borderRadius: 2,marginTop: 6, }} />
              <View style={{ width: '95%', height: 20, borderRadius: 4,marginTop: 6, }} />
              <View style={{ width: '95%', height: 40, borderRadius: 8,marginTop: 6, }} />

              <View
                style={{ marginTop: 6, width: 80, height: 20, borderRadius: 4 }}
              />
            </View>
          </View>
        </SkeletonPlaceholder>
        ))}
      </View>
    );
  }
}

export default CampaignListSkeleton;
