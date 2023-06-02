import React, { Component } from 'react';
import { View, Text, TextInput, ScrollView,Image,TouchableOpacity} from 'react-native';
import { ProgressBar, Button, Chip} from 'react-native-paper';
import metrics from '../../Themes/Metrics';
import colors from '../../Themes/Colors';
import { commonStyles } from '../../SupportingFIles/Constants';
import { strings } from '../../Locales/i18';
import {observer, inject} from 'mobx-react';
import { KeyboardAccessoryNavigation } from 'react-native-keyboard-accessory'
import images from '../../Themes/Images';
import 'intl';
import 'intl/locale-data/jsonp/en-US'
const formatCurrency = new Intl.NumberFormat('en-US')


class CreateCampaign10 extends Component {
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
   //   this.resetStoreData()
    });
  }

  resetStoreData(){
    
  }

  render() {
    const store = this.props.CreateCampaignStore
    const {campainData} = this.props.CreateCampaignStore
    return (
        <View style={{backgroundColor: 'white', flex: 1}}>
            <View style = {{marginHorizontal: metrics.dimen_27, flex: 1}}>
              <ScrollView showsVerticalScrollIndicator = {false}>
                  <ProgressBar style={{...commonStyles.progressBarStyle}} progress={0.77} color={'rgba(22, 88, 211, 1)'} />
                  <Text style = {{...commonStyles.LatoBold_24, marginTop: metrics.dimen_28}}>{strings('What_should_be_minimumfollowerscount')}</Text>
                  <Text style = {{...commonStyles.LatoRegular_Normal, marginTop: metrics.dimen_24, color: 'rgba(62,62,70,1)'}}>{strings('Enter_Follower_count')}</Text>
                <View style = {{...commonStyles.campaignViewStyle, marginTop: metrics.dimen_8}}>
                    <TextInput style={{width: '85%', height: metrics.dimen_46, backgroundColor: colors.clear, paddingLeft: metrics.dimen_10, ...commonStyles.LatoRegular_Normal}}
                        placeholder = {strings('Example')}
                        keyboardType='number-pad'
                        maxLength={20}
                        placeholderTextColor = {'rgba(192, 196, 204, 1)'}
                        value = {campainData.followercountcampaign?formatCurrency.format(campainData.followercountcampaign):''}
                        onChangeText = {(text)=>{
                            let price = text
                            price = price.replace(/[^0-9]/ig, '')
                            store.setCampaignData({followercountcampaign: price})
                        }}

                        onBlur={ () => setTimeout(() => {this.setState({isTfActive: false})}, 100)

                    }
             onFocus={ () => this.setState({isTfActive:true}) }
                  />
                </View>
                
                  
              </ScrollView>
              <View style = {{height: '20%'}}>
              {!this.state.isTfActive && <View style = {{position: 'absolute', bottom: metrics.dimen_35, left: 0, right: 0}}>
                <Button style={{...commonStyles.NextButtonStyle, marginBottom: 0}} labelStyle = {{...commonStyles.LatoBold_14, color: 'white'}} onPress={() => this.props.navigation.navigate('CreateCampaign8')}>{strings('Next')}</Button>
                <Button 
                style={{marginTop: metrics.dimen_20}} labelStyle = {{...commonStyles.LatoBold_14, color: 'rgba(175, 182, 197, 1)'}} 
                onPress={() => this.props.navigation.navigate('CreateCampaign8')}
                color = 'white'
                >
                  {strings('Skip')}
                </Button>
              </View>}
              </View>
            </View>
            <KeyboardAccessoryNavigation
          avoidKeyboard={true}
          androidAdjustResize
          onDone={()=>this.props.navigation.navigate('CreateCampaign8')}
          nextHidden={true}
          previousHidden={true}
          doneButtonTitle={strings('Next')}
        />
            {/* </TouchableWithoutFeedback> */}
        </View>
      );
  }
  

}
export default inject("CreateCampaignStore")(observer(CreateCampaign10))

