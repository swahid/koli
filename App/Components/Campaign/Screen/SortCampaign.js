import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Platform, SafeAreaView, ScrollView } from 'react-native';
import { observer, inject } from 'mobx-react';
import metrics from '../../../Themes/Metrics';
import images from '../../../Themes/Images';
import colors from '../../../Themes/Colors';
import { strings } from '../../../Locales/i18';
import { commonStyles } from '../../../SupportingFIles/Constants'
import { CheckBox } from 'react-native-elements';
import { Flag } from 'react-native-country-picker-modal';

class SortInfluencer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      lowthigh: 0,
      hightlow: 0


    }

  }

  componentDidMount() {


    this.props.navigation.addListener('focus', () => {
      const {Sortby  } = this.props.CompaignsStore
      if(Sortby==='')
      {
        this.setState({recent:0,mostApplied:0})
      }else
      {
        this.setState({recent:Sortby===1?1:0,mostApplied:Sortby===2?1:0})

      }

    });


  }

  resetFields() {
    this.setState({mostApplied:false, recent: false})
    this.props.CompaignsStore.setcountry('All')
    this.props.CompaignsStore.setgender('')
    this.props.CompaignsStore.setSortApply(false)
    this.props.CompaignsStore.setpricerangemin(0)
    this.props.CompaignsStore.setpricerangemax(0)
    this.props.CompaignsStore.setFilterApply(false)
    this.props.CompaignsStore.setCompaigns([])
    this.props.CompaignsStore.getCampaigns()
    this.props.CompaignsStore.setSortby(1)
    this.props.HomeStore.resetData()
    this.props.HomeStore.getAllCampaignWithPagination(this.props.route.params.campaignType)




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
                onPress={() => this.setState({ recent: true, mostApplied: false })}
              />
            </View>

            <View style={{ marginTop: metrics.dimen_20,  flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ ...commonStyles.LatoSemiBold_Normal, color: 'rgba(61, 64, 70, 1)', marginTop: metrics.dimen_7,marginLeft:metrics.dimen_20  }}>{strings('Most_Applied')}</Text>

              <CheckBox
                checked={this.state.mostApplied}
                textStyle={styles.radioTextStyle}
                checkedColor={colors.app_orange}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                containerStyle={{ borderWidth: 0, backgroundColor: colors.transparent, padding: 0 }}
                onPress={() => this.setState({ mostApplied: true, recent: false })}
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
      this.props.CompaignsStore.setSortby(1)
      //this.resetFields()
      this.props.HomeStore.getMostAppliedRecentCampaigns(this.props.route.params.campaignType)   
     this.props.CompaignsStore.setSortApply(true)
    }

    if (this.state.mostApplied) {
      this.props.CompaignsStore.setSortby(2)
      this.props.HomeStore.getMostAppliedCampaignsList(this.props.route.params.campaignType)   
      this.props.CompaignsStore.setSortApply(true)

    }     
      this.props.navigation.goBack()

  }
  


}

export default inject('CompaignsStore',"HomeStore")(observer(SortInfluencer))


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
  // seprater:
  // {
  //   borderWidth: 1,
  //   marginTop: metrics.dimen_15,
  //   marginBottom: metrics.dimen_15,
  //   borderColor: colors.app_light_black

  // },
  // textInputStyle: {
  //   borderRadius: metrics.dimen_4,
  //   height: metrics.dimen_46,
  //   backgroundColor: colors.transparentBlack,
  //   color: 'white',
  //   paddingHorizontal: metrics.dimen_10,
  //   marginTop: metrics.dimen_20,
  //   fontFamily: metrics.Lato_Regular,
  //   fontSize: metrics.text_normal,
  // },
  // headerTextStyle: {
  //   fontFamily: metrics.Lato_Bold,
  //   fontSize: metrics.text_large,
  //   marginBottom: metrics.dimen_20,
  //   color: 'white'
  // },
  // buttonStyle: {
  //   borderRadius: metrics.dimen_4,
  //   width: '100%',
  //   height: metrics.dimen_46,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   backgroundColor: 'white',
  //   marginBottom: metrics.dimen_37,
  //   marginTop: metrics.dimen_30,
  // },
  // signUpTextStyle: {
  //   fontFamily: metrics.Lato_Bold,
  //   fontSize: metrics.text_normal,
  //   color: colors.app_black
  // },
  // normalText: {
  //   fontFamily: metrics.Lato_SemiBold,
  //   fontSize: metrics.text_medium,
  //   color: 'white'
  // },
  // errorTextStyle: {
  //   fontFamily: metrics.Lato_Regular,
  //   fontSize: metrics.text_normal,
  //   color: colors.app_RedColor,
  //   marginTop: metrics.dimen_5,
  //   marginBottom: metrics.dimen_5
  // },
  // bottomViewStyle: {
  //   position: 'absolute',
  //   left: 0,
  //   right: 0,
  //   bottom: 0,
  //   height: metrics.dimen_72,
  //   backgroundColor: colors.app_Blue,
  //   alignItems: 'center',
  // },
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
