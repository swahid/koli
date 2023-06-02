import React, { Component } from 'react';
import { View, Text, TextInput, Keyboard, TouchableWithoutFeedback,Image,TouchableOpacity} from 'react-native';
import { ProgressBar, Button} from 'react-native-paper';
import metrics from '../../Themes/Metrics';
import { commonStyles } from '../../SupportingFIles/Constants';
import { strings } from '../../Locales/i18';
import colors from '../../Themes/Colors';

import {observer, inject} from 'mobx-react';
import { KeyboardAccessoryNavigation } from 'react-native-keyboard-accessory'
import images from '../../Themes/Images';


class CreateCampaign8 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTfActive:false

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
     // this.resetStoreData()
    });
  }

  resetStoreData(){
    const store = this.props.CreateCampaignStore
    store.setCampaignData({campaignImage: '', campaignTitle: ''})
    store.setImagePath('')
    store.setEnabled(false)
  }
  render() {
    const store = this.props.CreateCampaignStore
    const {campainData,validationError} = this.props.CreateCampaignStore
    return (
        <View style={{backgroundColor: 'white', flex: 1}}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

            <View style = {{ justifyContent: 'space-between', flex: 1}}>
              <View>
                  <ProgressBar style={{...commonStyles.progressBarStyle,marginHorizontal:25}} progress={0.88} color={'rgba(22, 88, 211, 1)'} />
                  <Text style = {{...commonStyles.LatoBold_24, marginTop: metrics.dimen_28,marginHorizontal:25}}>{strings('Campaign_description_heading')}</Text>
                  <Text style = {{...commonStyles.LatoRegular_Normal, marginTop: metrics.dimen_28, color: 'rgba(62,62,70,1)',marginHorizontal:25}}>{strings('CampaignDetail')}</Text>
                  <TextInput style={{...commonStyles.multilineTextInputStyle, ...commonStyles.LatoRegular_Normal, marginTop: metrics.dimen_8,marginHorizontal:25}}
                      placeholder = {strings('Enter_Campaign_detail')}
                      placeholderTextColor = 'rgba(62,62,70,1)'
                      multiline = {true}
                      returnKeyType='done'
                      value = {campainData.campaignDetails}
                      onChangeText = {(text)=>{
                        store.setCampaignData({campaignDetails: text})
                        store.deleteValidationError('CampaignDetailError')
                    }}
                    onBlur={ () => this.setState({isTfActive:false}) }
                   onFocus={ () => this.setState({isTfActive:true}) }
                />
                {validationError.CampaignDetailError ? <Text style={{...commonStyles.errorTextStyle,marginHorizontal:25}}>{validationError.CampaignDetailError}</Text> : null}

              </View>

              {!this.state.isTfActive && <Button style={{...commonStyles.CampaignNextButtonStyle}} labelStyle = {{...commonStyles.LatoBold_14, color: 'white'}} onPress={() => {
                this.onNext()
              }}
                >{strings('Next')}
                </Button>}
            </View>
            </TouchableWithoutFeedback>
            <KeyboardAccessoryNavigation
          avoidKeyboard={true}
          androidAdjustResize
          onDone={()=>this.onNext()}
          nextHidden={true}
          previousHidden={true}
          doneButtonTitle={strings('Next')}
        />
        </View>
      );
  }
  onNext = () =>{
      if (this.props.CreateCampaignStore.campainData.campaignDetails.length == 0) {
        this.props.CreateCampaignStore.setValidationData({CampaignDetailError: strings('Enter_Campaign_Detail')})
    }else{
      this.props.navigation.navigate('CreateCampaign9')
    }
  
  }
}
export default inject("CreateCampaignStore")(observer(CreateCampaign8))

