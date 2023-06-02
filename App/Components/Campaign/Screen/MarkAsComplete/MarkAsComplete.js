import React, { Component } from 'react';
import { View, Text, Modal, TextInput,TouchableWithoutFeedback, Platform } from 'react-native';
import styles from './styles';
import { strings } from '../../../../Locales/i18';
import {  Button } from 'react-native-paper';
import { commonStyles } from '../../../../SupportingFIles/Constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {observer, inject} from 'mobx-react';
import { showAlert, validateUrl, showFlashBanner, showToast } from '../../../../SupportingFIles/Utills';
import Loader from '../../../../SupportingFIles/Loader';

class MarkAsComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {isLoading} = this.props.CompaignsStore

    return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.props.CompaignsStore.showMarkAsDonePopup}
        >
                  <Loader loading={isLoading}/>

 <TouchableWithoutFeedback onPress={() => {
              this.props.CompaignsStore.setMarkAsDonPopupStatus(false)
          }}>
            <View style={styles.backgroundTouchableView} />
          </TouchableWithoutFeedback>
          <KeyboardAwareScrollView scrollEnabled={false}>
          <View style={styles.centeredView}
          onStartShouldSetResponder={() => this.props.CompaignsStore.setMarkAsDonPopupStatus(false)}
        //   onPress={() => {
        //     this.props.CompaignsStore.setMarkAsDonPopupStatus(false)
        // }}
          >

            <View style={styles.modalView}>
              <Text style={styles.titleMarkAsComplete}>Mark as Completed</Text>

              <Text style={styles.textFieldTitle}>
                    {`${strings('Task_Url')} *`}
                  </Text>
                  <View style={styles.containerViewStyle}>
                  <TextInput style={styles.inputTextFieldStyle}
                    placeholder={strings('Enter_Task_Url')}
                    placeholderTextColor="rgba(62,62,70,0.5)"
                    returnKeyType="done"
                    autoCapitalize="none"
                   // value={campainData.campaignTitle}
                   onChangeText = {(text)=>{
                    this.props.CompaignsStore.setTaskUrl(text)
                }}
                  />
                  </View>


                  <Text style={styles.textFieldTitleRemark}>
                    {`${strings('Remark')} `}
                  </Text>

              <TextInput style={styles.textIinputMarkAsCompleted}
              keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
                      placeholder = {strings('Enter_Remark')}
                      placeholderTextColor = "rgba(62,62,70,0.5)"
                      multiline = {true}
                      returnKeyType="done"
                      onChangeText = {(text)=>{
                        this.props.CompaignsStore.setMarkAsDoneText(text)
                    }}
                    onBlur={ () => this.setState({isTfActive:false}) }
                   onFocus={ () => this.setState({isTfActive:true}) }
                />
                
                
              <Button 
          style={styles.buttonSubmit} 
          labelStyle = {{...commonStyles.LatoBold_14, color: 'white'}}
             onPress={() => 
              this.actionOnSubmit()
             // this.props.CompaignsStore.markCampaignAsCompleted(this.props.id)
                }
                >
                    {strings('Submit')}
                </Button>
            </View>

          </View>
          </KeyboardAwareScrollView>
        </Modal>
    );
  }
  actionOnSubmit = () => {
    const store = this.props.CompaignsStore
    const suggestionText = store.markAsDoneText.replace(/\s/g, '');
    const doneUrl = store.taskUrl.replace(/\s/g, '');
    console.log('suggestionText:',suggestionText)

    if(doneUrl === "" )
    {
      showToast(strings('Please_add_task_url'))

      //showAlert(strings('Please_any_suggestion_for_campaign_owner'))
    }
    else if (suggestionText === ''&& doneUrl !== '')
    {
      showToast(strings('Please_any_suggestion_for_campaign_owner'))

     // Toast.show(strings('Please_add_task_url'));

     // showFlashBanner("", strings('Please_add_task_url'))
    }
    else if (doneUrl !== "" && !validateUrl(doneUrl))
    {
      showToast(strings('Please_add_valid_url'))

     // showFlashBanner("", strings('Please_add_valid_url'))
    }
    else
    {
    this.props.CompaignsStore.markCampaignAsCompleted(this.props.id,this.props)
      this.props.hideMarkAsCompletedButton()
    }


  }
}
export default inject("CompaignsStore")(observer(MarkAsComplete))
