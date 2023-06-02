import React, { Component } from 'react';
import { View, FlatList, TouchableOpacity, Image, RefreshControl, Text } from 'react-native';
import { commonStyles } from '../../../../SupportingFIles/Constants';
import { observer, inject } from 'mobx-react';
import colors from '../../../../Themes/Colors';
import images from '../../../../Themes/Images';
import CampaignListItem from '../CampaignListItem/CampaignListItem';
import CampaignListSkeleton from '../../../CommonComponents/CampaignListSkeleton';
import metrics from '../../../../Themes/Metrics';
import {styles} from '../Home'
import { strings } from '../../../../Locales/i18';


class CampaignViewAll extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount(){
      const campaignType = this.props.route.params.type
    this.props.navigation.setOptions({
        title: this.getHeaderTitle(campaignType),
        headerLeft: () => (
            <TouchableOpacity style={{ ...commonStyles.backButtonContainercampaign }}
                onPress={() => this.props.navigation.goBack()}
            >
                <Image style={{ tintColor: colors.app_black }} source={images.backImage} />
            </TouchableOpacity>
        ),
    })
   this.props.navigation.addListener('focus', () => {
    this.props.HomeStore.resetData()
    this.props.HomeStore.getAllCampaignWithPagination(campaignType)
   });
   
  }
  getHeaderTitle = (campaignType) =>{
      if(campaignType === 'paid'){
          return "Paid Campaigns"
      }
      else if(campaignType === 'sponsored'){
        return "Product Sponsor Campaigns"
    }
    else if(campaignType === 'shoutout'){
        return "Shoutout Exchange Campaigns"
    }
    else if(campaignType === 'commissionBased'){
      return "Commission Based Campaigns"
  }
  else if(campaignType === 'photoshootVideo'){
    return "Video Endorsement Campaigns"
}
else if(campaignType === 'eventsAppearence'){
  return "Event Appearence Campaigns"
}
  }
  renderTopHeader = () =>{
    const campaignType = this.props.route.params.type

    return(
   <View style={{
          justifyContent: "space-between", flexDirection: "row", paddingHorizontal: metrics.dimen_20, height: metrics.dimen_48,
          backgroundColor: 'white',
          alignContent: 'center', alignItems: 'center'
        }}>
          <TouchableOpacity style={{ width: '50%', justifyContent: 'center', alignContent: 'center', height: '100%' }}
            onPress={() => this.props.AuthStore.isLogin ?
            
              this.props.navigation.navigate('CreateCampaignForm', { type: 'Add' })

              : this.props.navigation.navigate('AuthStack')}>
            <View style={{ flexDirection: 'row', }} >
              <Image source={images.plusIcon} style={{ marginRight: metrics.dimen_2, height: metrics.dimen_14, width: metrics.dimen_14, marginTop: 2 }} />
              <Text style={[styles.headerTextStyle, { marginLeft: 10 }]}>{strings('Create_campaign')}</Text>
            </View>

          </TouchableOpacity>
          <View style={{ backgroundColor: colors.app_dividercampaign, height: metrics.dimen_30, width: 1, marginTop: metrics.dimen_4 }}></View>

          <TouchableOpacity style={{ width: '26%', justifyContent: 'center', alignItems: 'center', height: '100%' }}
            onPress={() => this.props.navigation.navigate('SortCampaign',{campaignType:campaignType})}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.headerTextStyle, { marginLeft: metrics.dimen_20 }]}>{'Sort'}</Text>
              <Image source={images.sort_new} style={{ marginLeft: metrics.dimen_8, height: metrics.dimen_15, width: metrics.dimen_12, marginTop: 2 }} />
            </View>
          </TouchableOpacity>
          <View style={{ backgroundColor: colors.app_dividercampaign, height: metrics.dimen_30, width: 1, marginTop: metrics.dimen_4 }}></View>

          <TouchableOpacity style={{ width: '26%', justifyContent: 'center', alignItems: 'center', height: '100%' }}
            onPress={() => this.props.navigation.navigate('CampaignFilter',{campaignType: campaignType})}>

            <View style={{ flexDirection: 'row' }} >
              <Text style={[styles.headerTextStyle, { marginLeft: 7 }]}>{strings('Filter')}</Text>
              <Image source={images.filter_new} style={{ marginLeft: metrics.dimen_8, height: metrics.dimen_14, width: metrics.dimen_12, alignSelf: 'center' }} />
            </View>
          </TouchableOpacity>

        </View>
    )
  }
  renderNoJobs() {
    return (
      <View style={{
        alignItems: 'center', height: '70%', justifyContent: 'center',
        marginBottom: 100
      }}>
        <Image source={images.Campaign} />
        <Text style={{ ...commonStyles.LatoBold_16, marginTop: -metrics.dimen_40 }}>{
        strings('No_Campaigns_available_matching_your_filters') }</Text>
      </View>)
  }
  render() {
    const campaignType = this.props.route.params.type

    const { 
      fetchedCampaignData, 
      isRefreshing, 
      lastFetchedCount, 
      offSetlength, 
      getAllCampaignWithPagination,
     filterData } = this.props.HomeStore

     // console.log('campaignList:',fetchedCampaignData)
      //console.log('type:',campaignType)

    return (
      <View style={{marginBottom:metrics.dimen_50}}>

         {this.renderTopHeader()}
         {fetchedCampaignData === null &&
          <CampaignListSkeleton />
        }
        {filterData !== null && 
        fetchedCampaignData !== null &&
        fetchedCampaignData.length === 0 &&
        this.renderNoJobs()}
         {fetchedCampaignData !== null && fetchedCampaignData.length > 0 && <FlatList
          // style={{ marginHorizontal: metrics.dimen_10 }}
          onScroll={this.handleScroll}
          ref={this.props.scrollRef}
          showsVerticalScrollIndicator={false}
          numColumns={1}
          data={fetchedCampaignData}
          renderItem={({ item }) => 
          <CampaignListItem item={item} 
          type={this.props.route.params.type}
          navigation={this.props.navigation}/>
        }
          keyExtractor={(item, index) => index.toString()}
          onEndReachedThreshold={100}
          onEndReached={() => {
            if (lastFetchedCount >= offSetlength) {
               getAllCampaignWithPagination(campaignType)
            }
          }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={this._onRefresh}
            />
          }
        />}
        
  
      </View>
    );
  }
}
export default inject('HomeStore','AuthStore')(observer(CampaignViewAll))

//export default CampaignViewAll;