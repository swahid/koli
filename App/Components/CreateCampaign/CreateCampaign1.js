import React, { Component } from 'react';
import { View, Text, TextInput, TouchableWithoutFeedback, Keyboard,TouchableOpacity,Image} from 'react-native';
import { ProgressBar, Button} from 'react-native-paper';
import metrics from '../../Themes/Metrics';
import images from '../../Themes/Images';

import colors from '../../Themes/Colors';
import { commonStyles } from '../../SupportingFIles/Constants';
import { strings } from '../../Locales/i18';
import {observer, inject} from 'mobx-react';
import { KeyboardAccessoryNavigation } from 'react-native-keyboard-accessory'



class CreateCampaign1 extends Component {
  constructor(props) {
    super(props);
    this.state=({
      isTfActive:false
    })

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
    
    
    const store = this.props.CreateCampaignStore
     let type=this.props.route.params.type
    this.props.navigation.addListener('focus', () => {
     if(type==='Edit')
     {
      store.setCampaignData({campaigntype: type})
      store.setCampaignData({campaignid: this.props.route.params.campaignid})
      store.setJobPosted(false)
      console.log('store.pricePerInstaStory:',store.pricePerInstaStory)

      
    }else
     {
      store.setCampaignData({campaigntype: type})

      this.resetStoreData()
     }
    });
  }

  resetStoreData(){
    const store = this.props.CreateCampaignStore
    
    store.setCampaignData({pricePerInstaStory: ''})
    store.setCampaignData({storyDate: ''})
    store.setHashTag('')
    store.setCampaignData({hashtags: []})
    store.setCampaignData({shipping: ''})
    store.setCampaignData({campaignImage: '', campaignTitle: '',imagegallery: []})
    store.setCampaignData({lookingInfluencerGender: 'Any'})
    store.setCampaignData({campaignDetails:''})
    store.setCampaignData({followercountcampaign:''})
    store.setCampaignData({campaignCategories:[]})
    store.setImagePath('')
    store.setEnabled(false)
    store.setJobPosted(false)
  }
  // componentWillMount(){
  //  // this.props.CreateCampaignStore.setCampaignData({pricePerInstaStory: ''})

  // }

  render() {
    const store = this.props.CreateCampaignStore
    const {campainData,validationError} = this.props.CreateCampaignStore
    return (
      <View style={{backgroundColor: 'white', flex: 1}}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style = {{marginHorizontal: metrics.dimen_27, justifyContent: 'space-between', flex: 1}}>
            <View>
                <ProgressBar style={{...commonStyles.progressBarStyle}} progress={0.11} color={'rgba(22, 88, 211, 1)'} />
                <Text style = {{...commonStyles.LatoBold_24, marginTop: metrics.dimen_28}}>{strings('CreateCampaignPriceTitle')}</Text>
                <Text style = {{...commonStyles.LatoRegular_Normal, marginTop: metrics.dimen_8}}>{strings('CreateCampaignDesc')}</Text>
                <Text style = {{...commonStyles.LatoRegular_Normal, marginTop: metrics.dimen_24, color: 'rgba(62,62,70,1)'}}>{strings('Enter_Amount')}</Text>
                <View style = {{...commonStyles.campaignViewStyle, marginTop: metrics.dimen_8}}>
                    <Text style={{...commonStyles.LatoSemiBold_Normal, color: colors.app_Blue, marginLeft: metrics.dimen_14}}>$</Text>
                    <TextInput style={{width: '85%', height: metrics.dimen_46, backgroundColor: colors.clear, paddingLeft: metrics.dimen_10, ...commonStyles.LatoRegular_Normal}}
                        placeholder = {'$ 0.00'}
                        keyboardType='decimal-pad'
                        maxLength={5}
                        placeholderTextColor = {'rgba(192, 196, 204, 1)'}
                        value = {campainData.pricePerInstaStory}
                        onChangeText = {(text)=>{
                            let price = text
                            // price = price.replace(/[^0-9]/ig, '')
                            store.setCampaignData({pricePerInstaStory: price})
                            store.deleteValidationError('priceError')
                        }}
                        onBlur={ () => this.setState({isTfActive:false}) }
                     onFocus={ () => this.setState({isTfActive:true}) }
                  />
                </View>
                {validationError.priceError ? <Text style={{...commonStyles.errorTextStyle}}>{validationError.priceError}</Text> : null}

            </View>
          </View>
          </TouchableWithoutFeedback>
          {!this.state.isTfActive && <Button style={{...commonStyles.CampaignNextButtonStyle}} labelStyle = {{...commonStyles.LatoBold_14, color: 'white'}}
             onPress={() => this.onNext()
                }
                >
                    {strings('Next')}
                </Button>}
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
    console.log('this.props.CreateCampaignStore.campainData:',this.props.CreateCampaignStore.campainData)
    if (this.props.CreateCampaignStore.campainData.pricePerInstaStory.length == 0) {
      this.props.CreateCampaignStore.setValidationData({priceError: strings('Enter_Price')})
  }else{
      this.props.navigation.navigate('CreateCampaign2')
  }
  
  }
}

export default inject("CreateCampaignStore")(observer(CreateCampaign1))

