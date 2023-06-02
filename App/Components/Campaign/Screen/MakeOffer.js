
import React, { Component } from 'react';
import { View, Text, Modal, TextInput,TouchableWithoutFeedback, Image, StyleSheet, TouchableHighlight } from 'react-native';
import styles from './MarkAsComplete/styles';
import { strings } from '../../../Locales/i18';
import {  Button } from 'react-native-paper';
import { commonStyles } from '../../../SupportingFIles/Constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {observer, inject} from 'mobx-react';
import { showAlert } from '../../../SupportingFIles/Utills';
import Loader from '../../../SupportingFIles/Loader';
import FastImage from 'react-native-fast-image'
import images from '../../../Themes/Images';
import metrics from '../../../Themes/Metrics';
import colors from '../../../Themes/Colors';
import { Numberformatesunit } from '../../../SupportingFIles/Utills';
import { ifIphoneX } from 'react-native-iphone-x-helper'

class MakeOffer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: ''
    };
  }

  render() {
    const {isLoading} = this.props.CompaignsStore
    const {selectedUser, showMakeOfferPopup, setMakeOfferPopupStatus} = this.props.ApplicantListStore

    return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showMakeOfferPopup}
        >
                  <Loader loading={isLoading}/>

 <TouchableWithoutFeedback onPress={() => {
           this.setState({amount:''})
              setMakeOfferPopupStatus(false)
          }}>
            <View style={styles.backgroundTouchableView} />
          </TouchableWithoutFeedback>
          <KeyboardAwareScrollView scrollEnabled={false}>
          <TouchableWithoutFeedback 
           underlayColor="rgba(0,0,0,0)"
          onPress={() => {
                    this.setState({amount:''})
            setMakeOfferPopupStatus(false)
        }}>
          <View style={styles.centeredView}
          onStartShouldSetResponder={() =>
            {
            this.setState({amount:''})

             setMakeOfferPopupStatus(false)}
            }
          onPress={() => {
            this.setState({amount:''})
            setMakeOfferPopupStatus(false)
        }}
          >

            <View style={makeOfferStyles.modalView}>
              <Text style={makeOfferStyles.titleMarkAsComplete}>{strings('MAKE_OFFER')}</Text>
              {selectedUser !== '' && this.renderUserListView(selectedUser)}
              <View style={makeOfferStyles.viewAmount}>
                        <Text style={makeOfferStyles.textName}>{strings('Enter_offered_amount')}</Text>
                        <View style={makeOfferStyles.viewAmountField}>
                            <Text style={makeOfferStyles.textdollar}>$</Text>
                            <TextInput style={makeOfferStyles.textInputAmount}
                            value={this.state.amount}

                                //keyboardType="decimal-pad"
                                keyboardType={"decimal-pad"}

                                onChangeText={this.decimalTextChange}
                                //onChangeText={(text) =>this.onChangeTextInput(text)}

                            ></TextInput>

                        </View>

                    </View>
              <Button 
          style={makeOfferStyles.buttonSubmit} 
          labelStyle = {{...commonStyles.LatoBold_14, color: colors.white}}
             onPress={() => 
              this.actionOnSubmit()
             // this.props.CompaignsStore.markCampaignAsCompleted(this.props.id)
                }
                >
                    {strings('Submit')}
                </Button>
            </View>

          </View>
          </TouchableWithoutFeedback>

          </KeyboardAwareScrollView>
        </Modal>
    );
  }
  decimalTextChange = (amount) => {
    let newText = '';
    let numbers = '0123456789.';
    var editedText = amount

    for (var i = 0; i < amount.length; i++) {
        if (numbers.indexOf(amount[i]) > -1) {
            newText = newText + amount[i];
            if (amount[i] === ".") {
                numbers = '0123456789'
            }
        }
        else {
            editedText = amount.slice(0, -1)
            //this.setState({ amount: editedText });

            // your call back function
            // alert("please enter numbers only");
        }
    }
    this.setState({ amount: editedText });


}
  actionOnSubmit = () => {
    const store = this.props.CompaignsStore
    const offerAmount = this.state.amount.replace(/\s/g, '');
    const {selectedUser, setReloadApplicantsList, setMakeOfferPopupStatus} = this.props.ApplicantListStore

    if(offerAmount === '')
    {
     showAlert(strings('Please_enter_offer_amount'))
    }else if(offerAmount<1)
    {
      showAlert("Minimum offer amount should be $1")
    }
    else
    {
      setMakeOfferPopupStatus(false)
      setTimeout(() => {
        store.makeOfferCampaign(selectedUser.id, this.state.amount, selectedUser.ownerId, this.props.ApplicantListStore.setMakeOfferPopupStatus)
        this.setState({amount:''})
        setReloadApplicantsList(true, selectedUser.campaignId)
      }, 1000);
    
    }
  }
  renderUserListView = (item) =>{
    const urlPic = item.profile.avatarUrl
    const imageUrl = (urlPic == null || urlPic === "NA" || urlPic === "") ? images.userPlaceholder : { uri: urlPic }
    const userName = item.profile.username.replace("@", "")

    return (
      <View style={makeOfferStyles.viewContainerApplicantsList}>

      <FastImage
        style={{ width: metrics.dimen_60, height: metrics.dimen_60, borderRadius: metrics.dimen_30 }}
        source={imageUrl}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', marginBottom: metrics.dimen_6, justifyContent: 'space-between' }}>
          <View style={{ marginLeft: metrics.dimen_12, width: '90%', }}>
            <Text style={{ ...commonStyles.LatoSemiBold_Normal, color: colors.app_gray }}
              numberOfLines={1}
              onPress={() => this.props.navigation.navigate('UserProfile', { UserData: item.profile })}
            >{(item.profile.first ? item.profile.first : '') + " " + (item.profile.last ? item.profile.last : '')}</Text>
            <Text style={{ ...commonStyles.LatoSemiBold_Small, color: 'rgba(122, 129, 138, 1)', marginTop: metrics.dimen_3, }}>@{userName}</Text>

            {item.profile.followers > 0 &&
              <View style={makeOfferStyles.viewInstaFollowers}>
                <Image style={{
                  width: metrics.dimen_12,
                  height: metrics.dimen_12,
                }} source={images.instaLineIcon}></Image>
                <Text style={makeOfferStyles.textFollowerCount}>
                  {Numberformatesunit(item.profile.followers)}
                </Text>
                <Text style={makeOfferStyles.textFollower}>
                  {strings('Followers')}
                </Text>
              </View>}
          </View>
        </View>

      </View>
    </View>
    )
  }
}

export default inject("CompaignsStore","ApplicantListStore")(observer(MakeOffer))

const makeOfferStyles = StyleSheet.create({
  
  viewInstaFollowers: {
    flexDirection: 'row',
    marginTop: metrics.dimen_5,
    //alignItems:'center',
  },
  textFollowerCount: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_medium,
    color: colors.text_black,
    marginLeft: metrics.dimen_5,
    alignSelf: 'flex-end',
  },
  textFollower: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_11,
    color: colors.text_grey,
    marginLeft: metrics.dimen_5,
    alignSelf: 'flex-end'
  },
  textName:{
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_medium,
    color: colors.app_black,
  },
 
  viewContainerApplicantsList :{
    //marginTop: metrics.dimen_14,
    flexDirection:'row',
    marginBottom: metrics.dimen_14,
  },
  modalView: {
     width:'100%',
     borderTopLeftRadius:metrics.dimen_30,
     borderTopRightRadius:metrics.dimen_30,
     paddingHorizontal: metrics.dimen_18,
     backgroundColor: colors.white,
     ...ifIphoneX({
       paddingBottom: metrics.dimen_30
   }, {
       paddingBottom: metrics.dimen_30
   })
  },
  titleMarkAsComplete:{
    fontSize:metrics.getFontSize(18),
    //color: colors.app_Blue, 
    marginVertical: metrics.aspectRatioHeight(60), 
    fontFamily: metrics.Lato_Bold,
    alignSelf:'center',
    textTransform: 'capitalize'
  },
  viewAmount: {
    borderRadius: 8,
   // zIndex: -3,
    paddingBottom: metrics.getHeightAspectRatio(14),
  },
  viewAmountField: {
    backgroundColor: '#F8F8F8',
    borderRadius: 5,
    marginTop: metrics.getHeightAspectRatio(8),
    width: '100%',
    alignItems:'center',
    height: metrics.getHeightAspectRatio(46),
    flexDirection:'row',
  },
  textdollar: {
    color: '#C0C4CC',
    borderRadius: 5,
    marginLeft: metrics.widthSize(39),
  },
  buttonSubmit:{
    marginBottom: metrics.aspectRatioHeight(40), 
    height: metrics.aspectRatioHeight(138), 
    backgroundColor: colors.app_Blue, 
    shadowColor: colors.app_Blue,
    shadowOpacity: 0.5,
    shadowOffset: {width: 2, height: 2},
    borderRadius: metrics.dimen_4,
    //position:'absolute',
    width:'100%',
    alignSelf:'center',
    justifyContent:'center',
  },
  textInputAmount: {
    marginLeft: metrics.widthSize(20),
    marginRight: metrics.widthSize(20),
    flex:1,
    fontFamily: metrics.Lato_SemiBold,
    fontSize: metrics.text_normal,
    color: colors.text_black,
    //backgroundColor: 'white',
    height: '100%'
  },

})
