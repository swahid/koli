import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Platform, SafeAreaView, ScrollView } from 'react-native';
import { observer, inject } from 'mobx-react';
import metrics from '../../../../Themes/Metrics';
import images from '../../../../Themes/Images';
import colors from '../../../../Themes/Colors';
import { strings } from '../../../../Locales/i18';
import { commonStyles } from '../../../../SupportingFIles/Constants'
import { CheckBox } from 'react-native-elements';
import { Flag } from 'react-native-country-picker-modal';

class SortApplicant extends Component {

  constructor(props) {
    super(props);
    this.state = {
      recent: 0,
      nearBy: 0,
      followerCount:0
    }
  }

  componentDidMount() {
    if(this.props.ApplicantListStore.SortBy==="")
    {
      this.setState({recent:false,nearBy:false,followerCount:false})

    }else{
      if(this.props.ApplicantListStore.SortBy==="recent")
      {
        this.setState({recent:true,nearBy:false,followerCount:false})

      }

      if(this.props.ApplicantListStore.SortBy==="nearby")
      {
        this.setState({recent:false,nearBy:true,followerCount:false})

      }

      if(this.props.ApplicantListStore.SortBy==="followerCount")
      {
        this.setState({recent:false,nearBy:false,followerCount:true})

      }


  }
}

  resetFields() {
    this.props.ApplicantListStore.setSortBy("")
    this.setState({recent:false,nearBy:false,followerCount:false})

}

  render() {


    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        {/* <Loader loading={isLoading} /> */}
        <SafeAreaView>
          <TouchableOpacity style={styles.backContainer}
            onPress={() => this.props.navigation.goBack()}
          >
            <Image source={images.FilterCross} />
          </TouchableOpacity>
        </SafeAreaView>

        <View style={{ flex: 1 }}>
          <ScrollView>
            <View style={styles.topfilterContainer}>
            <TouchableOpacity style={{ ...commonStyles.campaignViewfilter, }}>

              <Text style={{ ...commonStyles.LatoBold_22, color: colors.app_black, textTransform: 'capitalize' }}>{strings('Sort')}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{ ...commonStyles.campaignViewfilter, height:metrics.aspectRatioHeight(90),
              width:metrics.widthSize(140), }} onPress={() => this.props.CompaignsStore.Sortby!==''?this.resetFields():''}>

                <Text style={{ ...commonStyles.LatoBold_16, color: colors.app_Blue,  }}>{strings('Reset')}</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', marginTop: metrics.dimen_30 }}>
              <View >
                <Text style={{ ...commonStyles.LatoSemiBold_Normal, color: 'rgba(112, 129, 138, 1)', marginLeft: metrics.dimen_20 }}>{strings('Sort_by')}</Text>

              </View>
              <View style={{ flex: 1, marginLeft: 30, marginTop: 10 }}>
                <View style={styles.sepratertwo}></View>

              </View>

            </View>
            <View style={{ marginTop: metrics.dimen_20, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ ...commonStyles.LatoSemiBold_Normal, color: 'rgba(61, 64, 70, 1)', marginTop: metrics.dimen_7,marginLeft:metrics.dimen_20 }}>{strings('Recent')}</Text>


              <CheckBox
                checked={this.state.recent}
                textStyle={styles.radioTextStyle}
                checkedColor={colors.app_orange}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                containerStyle={{ borderWidth: 0, backgroundColor: colors.transparent, padding: 0 }}
                onPress={() => this.setState({ recent: true, nearBy: false ,followerCount:false})}
              />
            </View>

            <View style={{ marginTop: metrics.dimen_20,  flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ ...commonStyles.LatoSemiBold_Normal, color: 'rgba(61, 64, 70, 1)', marginTop: metrics.dimen_7,marginLeft:metrics.dimen_20  }}>{strings('Nearby')}</Text>

              <CheckBox
                checked={this.state.nearBy}
                textStyle={styles.radioTextStyle}
                checkedColor={colors.app_orange}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                containerStyle={{ borderWidth: 0, backgroundColor: colors.transparent, padding: 0 }}
                onPress={() => this.setState({ nearBy: true, recent: false ,followerCount:false})}
              />
            </View>

            <View style={{ marginTop: metrics.dimen_20,  flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ ...commonStyles.LatoSemiBold_Normal, color: 'rgba(61, 64, 70, 1)', marginTop: metrics.dimen_7,marginLeft:metrics.dimen_20,textTransform:'capitalize'  }}>{strings('followers_count')}</Text>

              <CheckBox
                checked={this.state.followerCount}
                textStyle={styles.radioTextStyle}
                checkedColor={colors.app_orange}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                containerStyle={{ borderWidth: 0, backgroundColor: colors.transparent, padding: 0 }}
                onPress={() => this.setState({ followerCount: true, recent: false ,nearBy:false})}
              />
            </View>

            <View style={{ marginTop: metrics.dimen_20, paddingHorizontal: metrics.dimen_20, flexDirection: 'row', justifyContent: 'space-between' }}>




            </View>



          </ScrollView>
          <TouchableOpacity style={{...styles.bottomViewStyle}}
                    onPress={() => this.Apply()}>

<Text style = {{...commonStyles.LatoBold_16, color:  'white', marginTop:Platform.OS == 'android' ? metrics.dimen_25 : metrics.dimen_18}}>
              {strings('Apply')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  Apply() {
    
    if (this.state.recent) {
      this.props.ApplicantListStore.setSortBy("recent")

    }

    if (this.state.nearBy) {
      this.props.ApplicantListStore.setSortBy("nearby")


    }  
    
    if (this.state.followerCount) {

      this.props.ApplicantListStore.setSortBy("followerCount")
      }  

      this.props.navigation.goBack()

  }
  

}

export default inject("ApplicantListStore", "CompaignsStore")(observer(SortApplicant))


const styles = StyleSheet.create({
  backgroudImage: {
    width: metrics.width,
    height: metrics.height,
  },
  topfilterContainer: {
    paddingHorizontal: metrics.dimen_20,
    flexDirection: "row",
    justifyContent: 'space-between',
    marginTop: metrics.dimen_15

  },
  countrycity: {
    paddingHorizontal: metrics.dimen_20,
    flexDirection: "row",
    justifyContent: 'space-between',
    marginTop: metrics.dimen_15
  },
  backContainer: {
    marginLeft: metrics.dimen_15,
    marginTop: Platform.OS === 'android' ? metrics.dimen_20 : 0,
    width:metrics.widthSize(132),
      aspectRatio:1,
  },
  
  sepratertwo:
  {
    borderWidth: 0.5,
    borderColor: colors.disable_gray_color,

  },
  radioTextStyle: {
    fontSize: metrics.dimen_12,
    color: colors.heading_blue,
    fontFamily: metrics.Roboto_regular
  },
  bottomViewStyle: {
    position: 'absolute', 
    left:0, 
    right: 0, 
    bottom: 0, 
    height: metrics.dimen_72, 
    backgroundColor: colors.app_Blue,
    alignItems: 'center',
},
})
