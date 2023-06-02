import React, { Component } from 'react';
import { View, Text } from 'react-native';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import metrics from '../../Themes/Metrics';

class ContentPagesSkeleton extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View>
        {[...Array(10)].map((e, i) =>
                 <SkeletonPlaceholder>

<View style={{ width: '30%', height: 10, borderRadius: 2,marginTop: 10, marginHorizontal:metrics.dimen_15}} />
<View style={{ width: '95%', height: 100, borderRadius: 2,marginTop: 10, marginHorizontal:metrics.dimen_15}} />
<View style={{ width: '30%', height: 10, borderRadius: 2,marginTop: 10, marginHorizontal:metrics.dimen_15}} />
<View style={{ width: '95%', height: 200, borderRadius: 2,marginTop: 10, marginHorizontal:metrics.dimen_15}} />
<View style={{ width: '30%', height: 10, borderRadius: 2,marginTop: 10, marginHorizontal:metrics.dimen_15}} />
<View style={{ width: '95%', height: 300, borderRadius: 2,marginTop: 10, marginHorizontal:metrics.dimen_15}} />
        </SkeletonPlaceholder> )}
      </View>
    );
  }
}

export default ContentPagesSkeleton;


