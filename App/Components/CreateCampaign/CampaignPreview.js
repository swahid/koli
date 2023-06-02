import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert,Image,TouchableOpacity} from 'react-native';
import { commonStyles } from '../../SupportingFIles/Constants';
import colors from '../../Themes/Colors';
import metrics from '../../Themes/Metrics';
import { strings } from '../../Locales/i18';
import {observer, inject} from 'mobx-react';
import { Button} from 'react-native-paper';
import Loader from '../../SupportingFIles/Loader';
import  'intl';
import 'intl/locale-data/jsonp/en-US'
import images from '../../Themes/Images';

const formatCurrency = new Intl.NumberFormat('en-US')




class CampaignPreview extends Component {
  constructor(props) {
    super(props);
    
  }

  componentDidMount(){
    const campaignStatus = this.props.CreateCampaignStore.campainData.campaignStatus
    console.log("campaignStatus:",campaignStatus===1)
    this.props.navigation.setOptions({ 
       
      headerLeft: () => (
        <TouchableOpacity style={{...commonStyles.backButtonContainercampaign}}
            onPress={()=>this.props.navigation.goBack()}
        >
            <Image style={{tintColor:colors.app_black}} source = {images.backImage} />
        </TouchableOpacity>
      ),
    }
      )
   
  }
  render() {
    const store = this.props.CreateCampaignStore
    const {campainData, isLoading, jobPosted} = store
    console.log("campainData.campaignCategories:",campainData.campaignCategories)
    const catNames = campainData.campaignCategories.map(function(item) {
      if(item.categoryName !== undefined)
      {
        return item.categoryName.charAt(0).toUpperCase() + item.categoryName.slice(1);
      }
      else
      {
        return item.charAt(0).toUpperCase() + item.slice(1);
      }
    });
    const countryNameArray = campainData.countryArr.map(function(item) {
      return item.name
    });
   // console.log("campainData.price:",campainData.pricePerInstaStory)
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
            <Loader loading={isLoading}/>
          <ScrollView showsVerticalScrollIndicator = {false}>
          <View style = {{marginHorizontal: metrics.dimen_27}}>
          <Text style={{...commonStyles.LatoBold_24, marginTop: metrics.dimen_15}}>{campainData.campaignTitle}</Text>
          <View style = {{...styles.campaignViewStyle, borderColor: colors.clear, padding: metrics.dimen_10, marginTop: metrics.dimen_12,flexDirection:'row'}}>
                <Text style={{...commonStyles.LatoRegular_Medium, color: 'rgba(114, 114, 114, 1)'}}>{strings('Colaboration_request_message')}</Text>
          </View>
            {/* Update 31-Aug-2020 
            Create Campaign : Preview Screen  KOLI commission text to be hide for now */}
          {/* <View style = {{ marginTop: metrics.dimen_12, flexDirection:'row'}}>
                
                <View style={{...commonStyles.FeesButton}} ><Text style={{...commonStyles.LatoBold_14, color: 'white',paddingHorizontal:metrics.dimen_10 }}>{strings('Fees')}</Text>
                      </View>
                
                <Text style={{...commonStyles.LatoRegular_Medium,marginLeft:metrics.dimen_5,marginTop:metrics.dimen_5, color: 'rgba(114, 114, 114, 1)'}}>{strings('KOLI_Fees')}</Text>
          </View> */}
         {(campainData.campaignType === "paid" || campainData.campaignType === "sponsored"||campainData.campaignType === "eventsAppearence"||campainData.campaignType === "photoshootVideo"  ) && <View style = {{marginTop: metrics.dimen_16}}>
                <Text style={{...commonStyles.LatoRegular_Medium, color: 'rgba(114, 114, 114, 1)'}}>
                  {campainData.campaignType === "paid" ? strings('Price_per_story') :  strings('Value') }
                  </Text>
                <Text style={{...commonStyles.LatoBold_14, color: 'rgba(114, 114, 114, 1)', marginTop: metrics.dimen_8}}>{"$"+  formatCurrency.format( campainData.pricePerInstaStory)}</Text>
                <View style = {styles.lineStyle}/>
          </View>}
          <View style = {{marginTop: metrics.dimen_16}}>
                <Text style={{...commonStyles.LatoRegular_Medium, color: 'rgba(114, 114, 114, 1)'}}>{strings('Influencer_gender')}</Text>
                <Text style={{...commonStyles.LatoBold_14, color: 'rgba(114, 114, 114, 1)', marginTop: metrics.dimen_8,textTransform:'capitalize'}}>{campainData.lookingInfluencerGender}</Text>
                <View style = {styles.lineStyle}/>
          </View>
          {/* <View style = {{marginTop: metrics.dimen_16}}>
                <Text style={{...commonStyles.LatoRegular_Medium, color: 'rgba(114, 114, 114, 1)'}}>{strings('Creators_Location')}</Text>
                <Text style={{...commonStyles.LatoBold_14, color: 'rgba(114, 114, 114, 1)', marginTop: metrics.dimen_8}}>{campainData.country == "All" ? "All Country": campainData.country}</Text>
                <View style = {styles.lineStyle}/>
          </View>
          <View style = {{marginTop: metrics.dimen_16}}>
                <Text style={{...commonStyles.LatoRegular_Medium, color: 'rgba(114, 114, 114, 1)'}}>{strings('Post_Required_By')}</Text>
                <Text style={{...commonStyles.LatoBold_14, color: 'rgba(114, 114, 114, 1)', marginTop: metrics.dimen_8}}>{campainData.storyDate}</Text>
                <View style = {styles.lineStyle}/>
          </View> */}
         
          <View style = {{marginTop: metrics.dimen_16}}>
                <Text style={{...commonStyles.LatoRegular_Medium, color: 'rgba(114, 114, 114, 1)'}}>{strings('Details')}</Text>
                <ScrollView style={{ maxHeight: metrics.aspectRatioHeight(330),marginTop: metrics.dimen_8,}}>       

                <Text style={{...commonStyles.LatoBold_14, color: 'rgba(114, 114, 114, 1)'}}>
                  {campainData.campaignDetails.trim()}
                  </Text>
                  </ScrollView>

                <View style = {styles.lineStyle}/>
          </View>
          <View style = {{marginTop: metrics.dimen_16}}>
                <Text style={{...commonStyles.LatoRegular_Medium, color: 'rgba(114, 114, 114, 1)'}}>{strings('Category')}</Text>
                <Text style={{...commonStyles.LatoBold_14, color: 'rgba(114, 114, 114, 1)', marginTop: metrics.dimen_8}}>{catNames.join(", ")}</Text>
                <View style = {styles.lineStyle}/>
          </View>
          <View style = {{marginTop: metrics.dimen_16}}>
                <Text style={{...commonStyles.LatoRegular_Medium, color: 'rgba(114, 114, 114, 1)'}}>{strings('Post_Required_By')}</Text>
                <Text style={{...commonStyles.LatoBold_14, color: 'rgba(114, 114, 114, 1)', marginTop: metrics.dimen_8}}>{campainData.storyDate}</Text>
                <View style = {styles.lineStyle}/>
          </View>
          {countryNameArray.length>0&&  <View style = {{marginTop: metrics.dimen_16}}>
                <Text style={{...commonStyles.LatoRegular_Medium, color: 'rgba(114, 114, 114, 1)'}}>{strings('Country')}</Text>
                <Text style={{...commonStyles.LatoBold_14, color: 'rgba(114, 114, 114, 1)', marginTop: metrics.dimen_8}}>{countryNameArray.join(", ")}</Text>
                <View style = {styles.lineStyle}/>
          </View>}
    {/* {campainData.shipping!==''?<View style = {{marginTop: metrics.dimen_16}}>
                <Text style={{...commonStyles.LatoRegular_Medium, color: 'rgba(114, 114, 114, 1)'}}>{strings('Product_Shipped')}</Text>
                <Text style={{...commonStyles.LatoBold_14, color: 'rgba(114, 114, 114, 1)', marginTop: metrics.dimen_8}}>{campainData.shipping}</Text>
                <View style = {styles.lineStyle}/>
          </View>:null} */}
          {/* <View style = {{marginTop: metrics.dimen_16}}>
                <Text style={{...commonStyles.LatoRegular_Medium, color: 'rgba(114, 114, 114, 1)'}}>{strings('Website_Product_Swipe-up Link')}</Text>
                <Text style={{...commonStyles.LatoBold_14, color: 'rgba(114, 114, 114, 1)', marginTop: metrics.dimen_8}}>{campainData.productSwipeLink}</Text>
                <View style = {styles.lineStyle}/>
          </View> */}
        {campainData.hashtags.length>0&&  <View style = {{marginTop: metrics.dimen_16}}>
                <Text style={{...commonStyles.LatoRegular_Medium, color: 'rgba(114, 114, 114, 1)'}}>{strings('Hashtag')}</Text>
                <Text style={{...commonStyles.LatoBold_14, color: 'rgba(114, 114, 114, 1)', marginTop: metrics.dimen_8}}>{campainData.hashtags.toString()}</Text>
                <View style = {styles.lineStyle}/>
          </View>}

          {campainData.followercountcampaign>0?<View style = {{marginTop: metrics.dimen_16}}>
                <Text style={{...commonStyles.LatoRegular_Medium, color: 'rgba(114, 114, 114, 1)'}}>{strings('minimum_followers')}</Text>
                <Text style={{...commonStyles.LatoBold_14, color: 'rgba(114, 114, 114, 1)', marginTop: metrics.dimen_8}}>{formatCurrency.format(campainData.followercountcampaign)}</Text>
                <View style = {styles.lineStyle}/>
          </View>:null}
          </View>
          <View style = {{height: metrics.dimen_150}}></View>
          </ScrollView>
          <View style = {{position: 'absolute',bottom: metrics.dimen_37, alignSelf: 'center'}}>
          {campainData.campaigntype==='Add'&&  <Button 
              style={{...commonStyles.NextButtonStyle}} 
              labelStyle = {{...commonStyles.LatoBold_14, color: 'white'}} 
              onPress={() => {
                Alert.alert(
                    strings('Post_Campaign'),
                    strings('Post_Campaign_Alert'),
                    [
                        {text: strings('Cancel'), onPress: () => console.log('No Pressed')},
                        {text: strings('Post'), onPress: () => {
                            this.props.CreateCampaignStore.postCampaign()

                        },style: 'destructive'},
                    ],
                    { cancelable: true }
                  );
              }}
              uppercase = {false}
              >
                  {strings('Post_Campaign')}
                </Button>}

                {campainData.campaigntype==='Edit'&& <Button 
              style={{...commonStyles.NextButtonStyle}} 
              labelStyle = {{...commonStyles.LatoBold_14, color: 'white'}} 
              onPress={() => {
                Alert.alert(
                    strings('Update_Campaign'),
                    strings('Update_Campaign_Alert'),
                    [
                        {text: strings('Cancel'), onPress: () => console.log('No Pressed')},
                        {text: strings('Post'), onPress: () => {
                            this.props.CreateCampaignStore.updateCampaign()

                        },style: 'destructive'},
                    ],
                    { cancelable: true }
                  );
              }}
              uppercase = {false}
              >
                  {strings('Update_Campaign')}
                </Button>}
          </View>
          {jobPosted ? campainData.campaigntype==='Add'?this.showSuccessPopup():this.showSuccessUpdatePopup(): null}
      </View>
    );
  }
  showSuccessPopup =() => {
    this.props.CompaignsStore.setRefreshNewContent(true)
      setTimeout(() => {
        Alert.alert(
            strings('Campaign_Submitted'),
            strings('Post_Success_Message'),
            [
                {text: strings('Okay'), onPress: () => 
                // this.props.navigation.reset({
                //   index: 0,
                //   routes: [{name: 'MyCompaign'}],
                // })
                this.props.navigation.navigate('MyCompaign')
              }
            ],
            { cancelable: false }
          );
      }, 500);
  }

  showSuccessUpdatePopup =() => {
    const campaignStatus = this.props.CreateCampaignStore.campainData.campaignStatus
    console.log("campaignStatus:",campaignStatus === 1)
    this.props.CompaignsStore.setRefreshNewContent(true)
    const successMessage = campaignStatus === 1 ? strings('update_Success_Message') : strings('update_campaign_Success_Message')
      setTimeout(() => {
        Alert.alert(
            strings('Campaign_updated'),
            successMessage,
            [
                {text: strings('Okay'), onPress: () => 
                // this.props.navigation.reset({
                //   index: 0,
                //   routes: [{name: 'MyCompaign'}],
                // })
                this.props.navigation.navigate('MyCompaign')
              }
            ],
            { cancelable: false }
          );
      }, 500);
  }
}
export default inject("CreateCampaignStore","CompaignsStore")(observer(CampaignPreview))

const styles = StyleSheet.create({
    lineStyle:{
        backgroundColor: 'rgba(210,210, 210, 1)',
        height: metrics.dimen_1,
        marginTop: metrics.dimen_14,
        width: '100%'
    },
    campaignViewStyle:{
        backgroundColor: 'rgba(248, 248, 248, 1)',
        borderColor: 'rgba(227, 227, 227, 1)',
        borderWidth: metrics.dimen_1,
        borderRadius: metrics.dimen_4,
        alignItems: 'center', 
        flexDirection: 'row'
      }
})