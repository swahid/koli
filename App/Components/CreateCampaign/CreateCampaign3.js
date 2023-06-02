import React, { Component } from 'react';
import { View, Text, TouchableOpacity,Image} from 'react-native';
import { ProgressBar, Button} from 'react-native-paper';
import metrics from '../../Themes/Metrics';
import colors from '../../Themes/Colors';
import { commonStyles } from '../../SupportingFIles/Constants';
import { strings } from '../../Locales/i18';
import {observer, inject} from 'mobx-react';
import images from '../../Themes/Images';


class CreateCampaign3 extends Component {
  constructor(props) {
    super(props);

  }

    componentDidMount(){
      this.props.navigation.setOptions({ 
         
        headerLeft: () => (
          <TouchableOpacity style={{...commonStyles.backButtonContainercampaign}}
              onPress={()=>this.props.navigation.goBack()}
          >
              <Image style={{tintColor:colors.app_Blue}} source = {images.backImage} />
          </TouchableOpacity>
        ),
      }
        )
    this.props.navigation.addListener('focus', () => {
      this.resetStoreData()
    });
  }

  resetStoreData(){
    const store = this.props.CreateCampaignStore
    if(store.campainData.campaigntype==='Add')
    {
      store.setCampaignData({country: 'All', city: "All"})

    }
  }

  render() {
    const {campainData} = this.props.CreateCampaignStore
    return (
        <View style={{backgroundColor: 'white', flex: 1}}>
            <View style = {{marginHorizontal: metrics.dimen_27, justifyContent: 'space-between', flex: 1}}>
              <View>
                  <ProgressBar style={{...commonStyles.progressBarStyle}} progress={0.33} color={'rgba(22, 88, 211, 1)'} />
                  <Text style = {{...commonStyles.LatoBold_24, marginTop: metrics.dimen_28}}>{strings('influencer_Gender')}</Text>
                  <Text style = {{...commonStyles.LatoRegular_Normal, marginTop: metrics.dimen_28, color: 'rgba(62,62,70,1)'}}>{strings('Gender')}</Text>
                  <View style = {{marginTop: metrics.dimen_8, flexDirection: 'column',flex:1}}>
                  <TouchableOpacity style={{
                  ...commonStyles.AppButtonStyle, 
                  height: metrics.dimen_50, 
                  paddingHorizontal: metrics.dimen_15,
                 marginTop:metrics.dimen_10,
                 backgroundColor: campainData.lookingInfluencerGender == 'male' ? colors.app_Blue : colors.app_light_gray, 
              shadowColor: campainData.lookingInfluencerGender == 'male' ?colors.app_Blue : colors.app_light_gray ,
              borderColor: campainData.lookingInfluencerGender == 'male' ?colors.app_Blue : colors.app_light_black
              }}
              onPress = {()=>this.onGenderClick('male')}
              >
              <Text style={{...commonStyles.LatoSemiBold_Normal, color: campainData.lookingInfluencerGender == "male" ? 'white' : colors.app_black}}>{strings('Male')}</Text>
            </TouchableOpacity>
                    
                    
                    {/* <Button style={{...commonStyles.otherButtonStyle, flex: 1/4, backgroundColor: campainData.lookingInfluencerGender == 'male' ? colors.app_Blue : 'rgba(248, 248, 248, 1)'}} 
                        labelStyle = {{...commonStyles.LatoSemiBold_Normal, color: campainData.lookingInfluencerGender == 'male' ? 'white' : colors.app_gray}} 
                        onPress={() => this.onGenderClick('male')}
                        Type = 'contained'
                        uppercase = {false}
                        color =  {campainData.lookingInfluencerGender == 'male' ? colors.app_Blue : 'rgba(248, 248, 248, 1)'}

                    >
                        {strings('Male')}
                    </Button> */}


            <TouchableOpacity style={{
              ...commonStyles.AppButtonStyle, 
              height: metrics.dimen_50, 
              paddingHorizontal: metrics.dimen_15,
              marginTop:metrics.dimen_15,
              // width: metrics.dimen_70, 
              backgroundColor: campainData.lookingInfluencerGender == 'female' ? colors.app_Blue : colors.app_light_gray, 
              shadowColor: campainData.lookingInfluencerGender == 'female' ? colors.app_Blue : colors.app_light_gray,
              borderColor: campainData.lookingInfluencerGender == 'female' ?colors.app_Blue : colors.app_light_black
              }}
              onPress = {()=>this.onGenderClick('female')}
              >
              <Text style={{...commonStyles.LatoSemiBold_Normal, color: campainData.lookingInfluencerGender == "female" ? 'white' : colors.app_black}}>{strings('Female')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{
              ...commonStyles.AppButtonStyle, 
              height: metrics.dimen_50, 
              paddingHorizontal: metrics.dimen_15,
              marginTop:metrics.dimen_15,
              backgroundColor: campainData.lookingInfluencerGender == 'Other' ? colors.app_Blue : colors.app_light_gray, 
              shadowColor: campainData.lookingInfluencerGender == 'Other' ? colors.app_Blue : colors.app_light_gray,
              borderColor: campainData.lookingInfluencerGender == 'Other' ?colors.app_Blue : colors.app_light_black
              }}
              onPress = {()=>this.onGenderClick('Other')}
              >
              <Text style={{...commonStyles.LatoSemiBold_Normal, color: campainData.lookingInfluencerGender == "Other" ? 'white' : colors.app_black}}>{strings('Other')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{
              ...commonStyles.AppButtonStyle, 
              height: metrics.dimen_50, 
              paddingHorizontal: metrics.dimen_15,
              marginTop:metrics.dimen_15,
              backgroundColor: campainData.lookingInfluencerGender == 'Any' ? colors.app_Blue : colors.app_light_gray, 
              shadowColor: campainData.lookingInfluencerGender == 'Any' ? colors.app_Blue : colors.app_light_gray,
              borderColor: campainData.lookingInfluencerGender == 'Any' ?colors.app_Blue : colors.app_light_black
              }}
              onPress = {()=>this.onGenderClick('Any')}
              >
              <Text style={{...commonStyles.LatoSemiBold_Normal, color: campainData.lookingInfluencerGender == "Any" ? 'white' : colors.app_black}}>{strings('Any')}</Text>
            </TouchableOpacity>


                    {/* <Button style={{...commonStyles.otherButtonStyle,flex: 1/4, backgroundColor: campainData.lookingInfluencerGender == 'female' ? colors.app_Blue : 'rgba(248, 248, 248, 1)'}} 
                        labelStyle = {{...commonStyles.LatoSemiBold_Normal, color: campainData.lookingInfluencerGender == 'female' ? 'white' : colors.app_gray}} 
                        onPress={() => this.onGenderClick('female')}
                        Type = 'contained'
                        uppercase = {false}
                        color =  {campainData.lookingInfluencerGender == 'female' ? colors.app_Blue : 'rgba(248, 248, 248, 1)'}

                    >
                        {strings('Female')}
                    </Button> */}




                    {/* <Button style={{...commonStyles.otherButtonStyle, flex: 1/4, backgroundColor: campainData.lookingInfluencerGender == 'both' ? colors.app_Blue : 'rgba(248, 248, 248, 1)'}} 
                        labelStyle = {{...commonStyles.LatoSemiBold_Normal, color: campainData.lookingInfluencerGender == 'both' ? 'white' : colors.app_gray}} 
                        onPress={() => this.onGenderClick('both')}
                        Type = 'contained'
                        uppercase = {false}
                        color =  {campainData.lookingInfluencerGender == 'both' ? colors.app_Blue : 'rgba(248, 248, 248, 1)'}

                    >
                        {strings('Both')}
                    </Button> */}
                  </View>
             


              </View>
              <Button style={{...commonStyles.NextButtonStyle}} labelStyle = {{...commonStyles.LatoBold_14, color: 'white'}} onPress={() => this.props.navigation.navigate('CreateCampaign4')}>{strings('Next')}</Button>
            </View>
        </View>
      );
  }
  onGenderClick = (gender) =>{
    this.props.CreateCampaignStore.setCampaignData({lookingInfluencerGender: gender})
  }
}

export default inject("CreateCampaignStore")(observer(CreateCampaign3))

