
import React, { Component } from 'react';
import { View, Text, Modal, TextInput,TouchableWithoutFeedback, Image, StyleSheet, TouchableHighlight } from 'react-native';
import { strings } from '../../../../Locales/i18';
import {  Button } from 'react-native-paper';
import { commonStyles } from '../../../../SupportingFIles/Constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {observer, inject} from 'mobx-react';
import { showAlert } from '../../../../SupportingFIles/Utills';
import Loader from '../../../../SupportingFIles/Loader';
import FastImage from 'react-native-fast-image'
import images from '../../../../Themes/Images';
import metrics from '../../../../Themes/Metrics';
import colors from '../../../../Themes/Colors';
import { ifIphoneX } from 'react-native-iphone-x-helper'

class RaiseDispute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disputeMessage: ''
    };
  }

  render() {
    const {isLoading} = this.props.CompaignsStore
    const {selectedUser, RaiseDisputePopupStatus, setRaiseDisputePopupStatus} = this.props.CompaignsStore

    return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={RaiseDisputePopupStatus}
        >
                  <Loader loading={isLoading}/>

 <TouchableWithoutFeedback onPress={() => {
           this.setState({disputeMessage:''})
           setRaiseDisputePopupStatus(false)
          }}>
            <View style={makeOfferStyles.backgroundTouchableView} />
          </TouchableWithoutFeedback>
          <KeyboardAwareScrollView scrollEnabled={false}>
          <TouchableWithoutFeedback 
           underlayColor="rgba(0,0,0,0)"
          onPress={() => {
                    this.setState({disputeMessage:''})
                    setRaiseDisputePopupStatus(false)
        }}>
          <View style={makeOfferStyles.centeredView}
          onStartShouldSetResponder={() =>
            {
            this.setState({disputeMessage:''})

            setRaiseDisputePopupStatus(false)}
            }
          onPress={() => {
            this.setState({disputeMessage:''})
            setRaiseDisputePopupStatus(false)
        }}
          >

            <View style={makeOfferStyles.modalView}>
              <Text style={makeOfferStyles.titleMarkAsComplete}>{"Raise Dispute"}</Text>
              {/* {selectedUser !== '' && this.renderUserListView(selectedUser)} */}

              <View>
        <TextInput style={[makeOfferStyles.multilineTextInputStyle,

makeOfferStyles.textInputRaiseDispute
        ]}
        placeholder={strings('Please_provide_dispute_reason')}
        multiline={true}
        autoCapitalize="none"
        autoCorrect={false}
        autoCompleteType="off"
        value={this.state.disputeMessage}
        onChangeText={(text) =>this.setState({disputeMessage:text})}
        />

        </View>

              <Button 
          style={makeOfferStyles.buttonSubmit} 
          labelStyle = {{...commonStyles.LatoBold_14, color: colors.white}}
             onPress={() => 
              this.actionOnSubmit()
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
 
  actionOnSubmit = () => {
    const store = this.props.CompaignsStore
    const disputeMessage = this.state.disputeMessage
    const {selectedUser,  setRaiseDisputePopupStatus} = this.props.CompaignsStore

    if(disputeMessage === '')
    {
     showAlert(strings('please_enter_dispute_message'))
    }
    else
    {
      setRaiseDisputePopupStatus(false)
      setTimeout(() => {
       //submit Api call

        this.setState({disputeMessage:''})
       
      }, 100);
    
    }
  }
  
}

export default inject("CompaignsStore")(observer(RaiseDispute))

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
    marginTop:metrics.dimen_20,
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
  backgroundTouchableView:{
    position: 'absolute',
    top: 0,
    bottom: 0, 
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)'
},
centeredView: {
  height:metrics.height,
 width:'100%',
  justifyContent: 'flex-end',
  // position: 'absolute',
  //  bottom: 0,

 // backgroundColor:'red'
},
multilineTextInputStyle:{
  backgroundColor: colors.app_light_gray,
  borderColor: colors.app_light_gray,
  borderWidth: metrics.dimen_4,
  borderRadius: metrics.dimen_4,
  height: metrics.dimen_100,
  textAlignVertical: 'top',
  fontFamily: metrics.LatoSemiBold_Normal,
  color: colors.app_gray
},
textInputRaiseDispute: {
  height: metrics.dimen_100,
  marginTop:metrics.dimen_10,
  marginBottom:metrics.dimen_10,
  backgroundColor: colors.app_light_gray,
  
},

})
