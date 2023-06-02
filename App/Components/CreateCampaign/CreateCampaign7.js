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


class CreateCampaign7 extends Component {
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
    const store = this.props.CreateCampaignStore
    store.setCampaignData({campaignDetails: ''})
  }

  render() {
    const store = this.props.CreateCampaignStore
    const {hashTag} = this.props.CreateCampaignStore
    return (
        <View style={{backgroundColor: 'white', flex: 1}}>
             {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}> */}
            <View style = {{marginHorizontal: metrics.dimen_27, flex: 1}}>
              <ScrollView showsVerticalScrollIndicator = {false}>
                  <ProgressBar style={{...commonStyles.progressBarStyle}} progress={0.66} color={'rgba(22, 88, 211, 1)'} />
                  <Text style = {{...commonStyles.LatoBold_24, marginTop: metrics.dimen_28}}>{strings('Tag_Inst')}</Text>
               
                  {/* <Text style = {{...commonStyles.LatoRegular_Normal, marginTop: metrics.dimen_28, color: 'rgba(62,62,70,1)'}}>{strings('Add')}</Text>
                  <View style = {{...commonStyles.campaignViewStyle, marginTop: metrics.dimen_8}}>
                    <TextInput style={{width: '85%', height: metrics.dimen_46, backgroundColor: colors.clear, paddingLeft: metrics.dimen_10, ...commonStyles.LatoRegular_Normal}}
                        placeholder = {strings('eg_user')}
                        placeholderTextColor = {'rgba(192, 196, 204, 1)'}
                        value = {user}
                        onChangeText = {(text)=>store.setUser(text)}
                        autoCorrect = {false}
                        autoCapitalize = 'none'

                    />
                    <Text 
                        style={{...commonStyles.LatoSemiBold_Normal, color: colors.app_Blue, paddingHorizontal: metrics.dimen_15}}
                        onPress = {this.onAddTags}
                    >
                        {strings('Add')}
                        </Text>

                  </View>  */}
                  <View style = {{flexDirection: 'row', flexWrap: 'wrap', marginVertical:metrics.dimen_10}}>
                    {store.campainData.tags.map((item, index) =>{
                        return(
                            <Chip
                            style = {{marginRight: metrics.dimen_10, marginBottom: metrics.dimen_10}}
                            onClose = {()=>this.onRemoveTags(index)}
                            textStyle = {{...commonStyles.LatoRegular_Medium, color: colors.app_Blue}}
                            accessibilityLabel = {index+''}
                            >
                                {item}
                            </Chip>)
                        }
                    )}
                    </View>
                  <Text style = {{...commonStyles.LatoRegular_Normal, marginTop: metrics.dimen_15, color: 'rgba(62,62,70,1)'}}>{strings('Hashtag')}</Text>
                  <View style = {{...commonStyles.campaignViewStyle, marginTop: metrics.dimen_8}}>
                    <TextInput style={{width: '85%', height: metrics.dimen_46, backgroundColor: colors.clear, paddingLeft: metrics.dimen_10, ...commonStyles.LatoRegular_Normal}}
                        placeholder = {strings('Hashtag')}
                        placeholderTextColor = {'rgba(192, 196, 204, 1)'}
                        value = {hashTag}
                        returnKeyType='done'
                        onChangeText = {(text)=>store.setHashTag(text)}
                        autoCorrect = {false}
                        autoCapitalize = 'none'
                        onBlur={ () => setTimeout(() => {this.setState({isTfActive: false})}, 100)

                      }
               onFocus={ () => this.setState({isTfActive:true}) }


                    />
                    <Text 
                        style={{...commonStyles.LatoSemiBold_Normal, color: colors.app_Blue, paddingHorizontal: metrics.dimen_15}}
                        onPress = {this.onHashTags}
                    >
                        {strings('Add')}
                    </Text>
                    
                  </View>
                  <View style = {{flexDirection: 'row', flexWrap: 'wrap', marginVertical:metrics.dimen_10}}>
                    {store.campainData.hashtags.map((item,index )=>{
                        return(
                            <Chip 
                                style = {{marginRight: metrics.dimen_10, marginBottom: metrics.dimen_10}}
                                onClose = {()=>this.onRemoveHashTags(index)}
                                textStyle = {{...commonStyles.LatoRegular_Medium, color: colors.app_Blue}}
                                accessibilityLabel = {index+''}

                            >
                                {item.toUpperCase()}
                            </Chip>)
                        }
                    )}
                </View>
              </ScrollView>
              <View style = {{height: '20%'}}>
              {!this.state.isTfActive && <View style = {{position: 'absolute', bottom: metrics.dimen_35, left: 0, right: 0}}>
                <Button style={{...commonStyles.NextButtonStyle, marginBottom: 0}} labelStyle = {{...commonStyles.LatoBold_14, color: 'white'}} onPress={() => this.props.navigation.navigate('CreateCampaign10')}>{strings('Next')}</Button>
                <Button 
                style={{marginTop: metrics.dimen_20}} labelStyle = {{...commonStyles.LatoBold_14, color: 'rgba(175, 182, 197, 1)'}} 
                onPress={() => this.props.navigation.navigate('CreateCampaign10')}
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
          onDone={()=>this.props.navigation.navigate('CreateCampaign10')}
          nextHidden={true}
          previousHidden={true}
          doneButtonTitle={strings('Next')}
        />
            {/* </TouchableWithoutFeedback> */}
        </View>
      );
  }
  onAddTags = () =>{
    const store = this.props.CreateCampaignStore
      if (store.user.length > 0) {
        if (store.user.startsWith('@', 0)) {
          store.setCampaignData({tags: [...store.campainData.tags, store.user]})
        }else{
          store.setCampaignData({tags: [...store.campainData.tags, "@" + store.user]})
        }
        store.setUser({user: ''})
      }
  }
  onHashTags = () =>{
        const store = this.props.CreateCampaignStore
        if (store.hashTag.length > 0) {
          if (store.hashTag.startsWith('#', 0)) {
            store.setCampaignData({hashtags: [...store.campainData.hashtags, store.hashTag]})
          }else{
            store.setCampaignData({hashtags: [...store.campainData.hashtags, "#"+store.hashTag]})
          }
        store.setHashTag({hashTag: ''})
        }
    }
    onRemoveHashTags = (sender) =>{
        const store = this.props.CreateCampaignStore
        store.removeHashTagFromIndex(sender)

    } 
    onRemoveTags = (sender) =>{
        const store = this.props.CreateCampaignStore
        store.removeTagFromIndex(sender)
    }  

}
export default inject("CreateCampaignStore")(observer(CreateCampaign7))

