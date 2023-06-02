import React, { Component } from 'react';
import { View, Text, TextInput, TouchableWithoutFeedback, Keyboard, Linking,Image,TouchableOpacity} from 'react-native';
import { ProgressBar, Button} from 'react-native-paper';
import metrics from '../../Themes/Metrics';
import colors from '../../Themes/Colors';
import { commonStyles } from '../../SupportingFIles/Constants';
import { strings } from '../../Locales/i18';
import {observer, inject} from 'mobx-react';
import images from '../../Themes/Images';


class CreateCampaign6 extends Component {
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
    store.setCampaignData({tags: [], hashtags: []})
  }

  render() {
    const store = this.props.CreateCampaignStore
    const {campainData,validationError} = this.props.CreateCampaignStore
    return (
        <View style={{backgroundColor: 'white', flex: 1}}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style = {{marginHorizontal: metrics.dimen_27, justifyContent: 'space-between', flex: 1}}>
              <View>
                  <ProgressBar style={{...commonStyles.progressBarStyle}} progress={0.66} color={'rgba(22, 88, 211, 1)'} />
                  <Text style = {{...commonStyles.LatoBold_24, marginTop: metrics.dimen_28}}>{strings('WebSiteUrl_Inst')}</Text>
                  <Text style = {{...commonStyles.LatoRegular_Normal, marginTop: metrics.dimen_28, color: 'rgba(62,62,70,1)'}}>{strings('WebSite_Product_Url')}</Text>
                  <View style = {{...commonStyles.campaignViewStyle, marginTop: metrics.dimen_8}}>
                      <TextInput style={{width: '85%', height: metrics.dimen_46, backgroundColor: colors.clear, paddingLeft: metrics.dimen_10, ...commonStyles.LatoRegular_Normal}}
                        placeholder = 'https://'
                        placeholderTextColor = 'rgba(192, 196, 204, 1)'
                        value = {campainData.productSwipeLink}
                        autoCorrect = {false}
                        onChangeText = {(text)=>{
                            store.setCampaignData({productSwipeLink: text})
                            store.deleteValidationError('productUrlError')

                        }}
                    />
                  </View>
                  {validationError.productUrlError ? <Text style={{...commonStyles.errorTextStyle}}>{validationError.productUrlError}</Text> : null}

              </View>

              <Button style={{...commonStyles.NextButtonStyle}} labelStyle = {{...commonStyles.LatoBold_14, color: 'white'}} onPress={() => {
                let link = store.campainData.productSwipeLink
                if (store.campainData.productSwipeLink.length == 0) {
                  store.setValidationData({productUrlError: strings('Enter_Product_url')})
                }else{
                  if (!link.toLowerCase().startsWith('https', 0) || !link.toLowerCase().startsWith('www', 0) || !link.toLowerCase().startsWith('http', 0)) {
                    link = 'https://' + link
                    store.setCampaignData({productSwipeLink: link})
                  }
                  if (Linking.canOpenURL(link)) {
                    this.props.navigation.navigate('CreateCampaign7')
                  }else{
                    store.setValidationData({productUrlError: strings('Enter_Product_url')})
                  }
                }
                }}>{strings('Next')}
                </Button>
            </View>
            </TouchableWithoutFeedback>
        </View>
      );
  }
}
export default inject("CreateCampaignStore")(observer(CreateCampaign6))

