import React, { Component } from 'react';
import { View, Text,  Image,  TouchableOpacity} from 'react-native';
import images from '../../Themes/Images';
import { ProgressBar, Button} from 'react-native-paper';
import metrics from '../../Themes/Metrics';
import colors from '../../Themes/Colors';

import { commonStyles } from '../../SupportingFIles/Constants';
import { strings } from '../../Locales/i18';
import {observer, inject} from 'mobx-react';
import DateTimePickerComp from '../DateTimePickerComp';
import Moment from 'moment'


class CreateCampaign2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    this.props.navigation.addListener('focus', () => {
      this.resetStoreData()
    });
  }

  resetStoreData(){
    const store = this.props.CreateCampaignStore
    //store.setCampaignData({lookingInfluencerGender: 'both'})
  }

  render() {
    const store = this.props.CreateCampaignStore
    const {validationError} = this.props.CreateCampaignStore
    return (
        <View style={{backgroundColor: 'white', flex: 1}}>
             <DateTimePickerComp
                isDateTimePickerVisible={store.showDatePicker}
                handleDatePicked={this.handleDatePicked}
                hideDateTimePicker={this.hideDateTimePicker}
                mode="date" minimumDate={new Date()}
            />
            <View style = {{marginHorizontal: metrics.dimen_27, justifyContent: 'space-between', flex: 1}}>
              <View>
                  <ProgressBar style={{...commonStyles.progressBarStyle}} progress={0.22} color={'rgba(22, 88, 211, 1)'} />
                  <Text style = {{...commonStyles.LatoBold_24, marginTop: metrics.dimen_28}}>{strings('StoyPostedDate')}</Text>
                  <Text style = {{...commonStyles.LatoRegular_Normal, marginTop: metrics.dimen_24, color: 'rgba(62,62,70,1)'}}>{strings('Date')}</Text>
                  <TouchableOpacity onPress = {()=>{store.setShowDatePicker(true)}}>
                  <View style = {{...commonStyles.campaignViewStyle, marginTop: metrics.dimen_8, justifyContent: 'space-between',}}>
                    <Text style={{...commonStyles.LatoSemiBold_Normal, color: 'rgba(62,62,70,1)', marginLeft: metrics.dimen_14}}>{store.campainData.storyDate.length > 0 ? store.campainData.storyDate  : strings('Select_Date')}</Text>
                    <Image source={images.CalendarIcon} style={{marginRight: metrics.dimen_10}}/>
                  </View>
                  {validationError.dateError ? <Text style={{...commonStyles.errorTextStyle}}>{validationError.dateError}</Text> : null}

                  </TouchableOpacity>
              </View>

              <Button style={{...commonStyles.NextButtonStyle}} labelStyle = {{...commonStyles.LatoBold_14, color: 'white'}} onPress={() => {
                  if (this.props.CreateCampaignStore.campainData.storyDate.length == 0) {
                    this.props.CreateCampaignStore.setValidationData({dateError: strings('Select_date')})
                }else{
                    this.props.navigation.navigate('CreateCampaign3')
                }
                }}>{strings('Next')}</Button>
            </View>
        </View>
      );
  }

  hideDateTimePicker = () => {
    this.props.CreateCampaignStore.setShowDatePicker(false)
  };

  handleDatePicked = date => {
    this.hideDateTimePicker();
    this.props.CreateCampaignStore.setCampaignData({storyDate: Moment(date).format('DD/MM/YYYY'), endStoryPostDate: Moment(date).format('YYYY-MM-DD')})
    this.props.CreateCampaignStore.deleteValidationError('dateError')
  };
}
export default inject("CreateCampaignStore")(observer(CreateCampaign2))

