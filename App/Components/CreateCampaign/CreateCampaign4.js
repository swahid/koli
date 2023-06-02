import React, { Component } from 'react';
import { View, Text, TouchableOpacity,Image} from 'react-native';
import { ProgressBar, Button} from 'react-native-paper';
import metrics from '../../Themes/Metrics';
import colors from '../../Themes/Colors';
import { commonStyles } from '../../SupportingFIles/Constants';
import { strings } from '../../Locales/i18';
import {observer, inject} from 'mobx-react';
import CountryPicker from 'react-native-country-picker-modal';
import images from '../../Themes/Images';
import CampaignAddCategory from './CampaignAddCategory';



class CreateCampaign4 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_country_modal: false
    };
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
  
}
 

  render() {
    const store = this.props.CreateCampaignStore
    return (
        <View style={{backgroundColor: 'white', flex: 1}}>
                
            <View style = {{marginHorizontal: metrics.dimen_27, justifyContent: 'space-between', flex: 1}}>
              {this.state.show_country_modal && <CountryPicker
                    containerButtonStyle={{ height: 0}}
                    visible={this.state.show_country_modal}
                    onClose={() => this.setState({ show_country_modal: false })}
                    withEmoji={true}
                    withFlag={true}
                    withFilter={true}
                    withAlphaFilter={true}
                    withCallingCode = {false}
                    translation={'en'}
                    filterProps={{
                      filterable:false,
                      placeholder: strings('search_country')
                    }}
                    onSelect={country => {
                      this.props.CreateCampaignStore.setCampaignData({country: country.name,countryCode:country.cca2})
                    }}
              />}
              <View>
                  <ProgressBar style={{...commonStyles.progressBarStyle}} progress={0.44} color={'rgba(22, 88, 211, 1)'} />
                  <Text style = {{...commonStyles.LatoBold_24, marginTop: metrics.dimen_28}}>{strings('Influencer_Location')}</Text>
                  <Text style = {{...commonStyles.LatoRegular_Normal, marginTop: metrics.dimen_28, color: 'rgba(62,62,70,1)'}}>{strings('Countries')}</Text>
                  <TouchableOpacity style = {{...commonStyles.campaignViewStyle, marginTop: metrics.dimen_8}} onPress={()=>this.setState({show_country_modal: true})}>
                    <Text style={{...commonStyles.LatoSemiBold_Normal, color: colors.app_gray, marginLeft: metrics.dimen_14}}>{store.campainData.country === 'All' ? strings('All_Countries') : store.campainData.country}</Text>
                  </TouchableOpacity>
                  {/* <Text style = {{...commonStyles.LatoRegular_Normal, marginTop: metrics.dimen_15, color: 'rgba(62,62,70,1)'}}>{strings('Cities')}</Text>
                  <View style = {{...commonStyles.campaignViewStyle, marginTop: metrics.dimen_8}}>
                    <Text style={{...commonStyles.LatoSemiBold_Normal, color: colors.app_gray, marginLeft: metrics.dimen_14}}>{strings('All_Cities')}</Text>
                  </View> */}
              </View>
              <Button style={{...commonStyles.NextButtonStyle}} 
              labelStyle = {{...commonStyles.LatoBold_14, color: 'white'}} 
              onPress={() => this.props.navigation.navigate('CampaignAddCategory')}>
                {strings('Next')}</Button>
            </View>
        </View>
      );
  }
}
export default inject("CreateCampaignStore")(observer(CreateCampaign4))

