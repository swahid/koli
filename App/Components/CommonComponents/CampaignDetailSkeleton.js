import React, { Component } from 'react';
import { View, Text } from 'react-native';
import colors from '../../Themes/Colors';
import metrics from '../../Themes/Metrics';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

class CampaignDetailSkeleton extends Component {
  constructor(props) {
    super(props);
    this.state = {
        campaignCategoriesArray:[1,2,3,4,3,5,6,66,6]
    };
  }

  render() {
    return (
      <View>
        <SkeletonPlaceholder>
          <View style={{ flexDirection: "column", marginBottom:30 }}>
            <View style={{ width: '100%', height: metrics.width,  marginBottom:15 }} />
            <View style={{ marginLeft: 20 }}>
            <View style={{ width: '20%', height: 10, borderRadius: 2}} />
              <View style={{ width: '95%', height: 20, borderRadius: 4,marginTop: 15, }} />
              <View style={{ width: '20%', height: 20, borderRadius: 2,marginTop: 15, }} />
              <View style={{ width: '15%', height: 10, borderRadius: 2,marginTop: 15, }} />

              <View style={{ width: '95%', height: 80, borderRadius: 8,marginTop: 6, }} />

              <View style={{ width: '15%', height: 10, borderRadius: 2,marginTop: 15, }} />
              <SkeletonPlaceholder.Item flexDirection={'row'} flexWrap={'wrap'}>
          {/* <SkeletonPlaceholder.Item width={120} height={20} borderRadius={4}  marginTop={10}/> */}
          {[...Array(8)].map((e, i) => <SkeletonPlaceholder.Item
            marginTop={ metrics.dimen_6}
            marginRight={ metrics.dimen_6}

            width={90}
            height={30}
            borderRadius={4}
          />)}
          
        </SkeletonPlaceholder.Item>

        <View style={{ width: '15%', height: 10, borderRadius: 2,marginTop: 15, }} />
        <View style={{ width: '20%', height: 20, borderRadius: 2,marginTop: 6, }} />

        <View style={{ width: '15%', height: 10, borderRadius: 2,marginTop: 15, }} />
        <View style={{ width: '20%', height: 20, borderRadius: 2,marginTop: 6, }} />

            </View>
          </View>
        </SkeletonPlaceholder>
      </View>
    );
  }
}

export default CampaignDetailSkeleton;
