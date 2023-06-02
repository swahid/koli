
import React, { Component } from 'react';
import { View, Text, Modal, TextInput,TouchableWithoutFeedback, Image, StyleSheet, TouchableHighlight } from 'react-native';
import { strings } from '../../../../Locales/i18';
import {  Button } from 'react-native-paper';
import { commonStyles } from '../../../../SupportingFIles/Constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {observer, inject} from 'mobx-react';
import { showAlert } from '../../../../SupportingFIles/Utills';
import Loader from '../../../../SupportingFIles/Loader';
import metrics from '../../../../Themes/Metrics';
import colors from '../../../../Themes/Colors';
import { Numberformatesunit } from '../../../../SupportingFIles/Utills';
import { ifIphoneX } from 'react-native-iphone-x-helper'

class CounterOffer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: ''
    };
  }

  render() {
    const {isLoading} = this.props.CompaignsStore
    const {appliedRemarkData, counterOfferPopupStatus, setcounterOfferPopupStatus} = this.props.CompaignsStore

    return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={counterOfferPopupStatus}
        >
                  <Loader loading={isLoading}/>

 <TouchableWithoutFeedback onPress={() => {
           this.setState({amount:''})
           setcounterOfferPopupStatus(false)
          }}>
            <View style={makeOfferStyles.backgroundTouchableView} />
          </TouchableWithoutFeedback>
          <KeyboardAwareScrollView scrollEnabled={false}>
          <TouchableWithoutFeedback 
           underlayColor="rgba(0,0,0,0)"
          onPress={() => {
                    this.setState({amount:''})
                    setcounterOfferPopupStatus(false)
        }}>
          <View style={makeOfferStyles.centeredView}
          onStartShouldSetResponder={() =>
            {
            this.setState({amount:''})

            setcounterOfferPopupStatus(false)}
            }
          onPress={() => {
            this.setState({amount:''})
            setcounterOfferPopupStatus(false)
        }}
          >

            <View style={makeOfferStyles.modalView}>
              <Text style={makeOfferStyles.titleMarkAsComplete}>{strings("counter_offer")}</Text>
              {/* {selectedUser !== '' && this.renderUserListView(selectedUser)} */}
              <View style={makeOfferStyles.viewAmount}>
                        <Text style={makeOfferStyles.textName}>{strings('enter_offer_amount')}</Text>
                        <View style={makeOfferStyles.viewAmountField}>
                            <Text style={makeOfferStyles.textdollar}>$</Text>
                            <TextInput style={makeOfferStyles.textInputAmount}
                            value={this.state.amount}
                            keyboardType={"decimal-pad"}
                            onChangeText={this.decimalTextChange}
                            ></TextInput>

                        </View>

                    </View>
              <Button 
          style={makeOfferStyles.buttonSubmit} 
          labelStyle = {{...commonStyles.LatoBold_14, color: colors.white}}
             onPress={() => 
              this.actionOnSubmit(appliedRemarkData)
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
 
  actionOnSubmit = (appliedRemarkData) => {
    const amount = this.state.amount
    const { setcounterOfferPopupStatus,setcounterAmount} = this.props.CompaignsStore
      setcounterAmount(amount)
    if(amount === '')
    {
     showAlert(strings('Please_enter_offer_amount'))
    }
    else
    {
      setcounterOfferPopupStatus(false)
      setTimeout(() => {
      //Api call
     this.props.CompaignsStore.counterOfferJobUpdate(appliedRemarkData.id,amount)
        this.setState({amount:''})
       
      }, 100);
      this.props.counterOfferStatusUpdate()
    }
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
  
}

export default inject("CompaignsStore")(observer(CounterOffer))

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

})
