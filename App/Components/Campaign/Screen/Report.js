import React, { Component } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Image, TextInput, Keyboard} from 'react-native';
import images from '../../../Themes/Images';
import metrics from '../../../Themes/Metrics';
import Loader from '../../../SupportingFIles/Loader';
import { commonStyles } from '../../../SupportingFIles/Constants';
import colors from '../../../Themes/Colors';
import { strings } from '../../../Locales/i18';
import {observer, inject} from 'mobx-react';
import { uploadImage } from '../../../API/Campaign/ApiCampaign';
import Config from "react-native-config";
import MyImagePicker from '../../MyImagePicker'




class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reportImage: { name: 'empty', value: '' },
    };
  }

  render() {
    const {isLoading, campaignReportd, report} = this.props.CompaignsStore
    const campaignData = this.props.campaignData
    return (
        <Modal 
        animationType = {"slide"} 
        visible={this.props.show} 
        presentationStyle = "formSheet"
      >
                  <Loader loading={isLoading}/>
                  <MyImagePicker ref={ref => this.sheet = ref} width={metrics.width} height={metrics.width} />
        <View style={styles.modalBackground}>
            <View style = {{justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', width: '100%'}}>
                
            </View>
            <TouchableOpacity style = {styles.backButton} onPress={this.props.onClose}>
                <Image source = {images.BackArrow}/>
            </TouchableOpacity>
            <Text style={{...commonStyles.LatoBold_16, ...styles.titleStyle}}>{this.props.title}</Text>

            <Text style = {{...commonStyles.LatoRegular_Normal, color: 'rgba(114, 114, 114, 1)', marginTop: metrics.dimen_50, marginHorizontal: metrics.dimen_20}}>{strings('Abuse_Instruction')}</Text>
            <Text style = {{...commonStyles.LatoSemiBold_Normal, marginHorizontal: metrics.dimen_20, marginTop: metrics.dimen_20, color: colors.app_black}}>{strings('Comment')}</Text>
            <TextInput style={{...styles.textInputStyle,height:metrics.dimen_90}}
                placeholder = {strings('Enter_Comment')}
                placeholderTextColor = "rgba(192,196,204,1)"
                multiline = {true}

                value = {report}
                onChangeText={(text)=>this.props.CompaignsStore.setReport(text)}
            />
                        <Text style = {{...commonStyles.LatoSemiBold_Normal, marginHorizontal: metrics.dimen_20, marginTop: 0, color: colors.app_black}}>{strings('Image_optional')}</Text>

{this.renderGallery()}
            <TouchableOpacity style = {{...commonStyles.NextButtonStyle, height: metrics.dimen_46, margin: metrics.dimen_20, justifyContent: 'center'}}
                onPress={()=>{
                    let param = null
                    if (this.props.fromUserReport) {
                      param = {  
                        "reportedownerId": campaignData.ownerId,
                        "reportPicUrl":this.state.reportImage.value

                    }
                    }else{
                      param = {  
                        "campaignId": campaignData.id,
                        "reportedownerId": campaignData.ownerId,
                        "reportPicUrl":this.state.reportImage.value
                      }
                    }
                    this.props.CompaignsStore.reportCampaign(param)
                }}
            >
                <Text style={{...commonStyles.LatoBold_14, color: 'white', alignSelf: 'center', textTransform: 'uppercase'}}>{strings('Report')}</Text>
            </TouchableOpacity>
        </View>
        {campaignReportd && this.closeModelView()}
      </Modal>
    );
  }

  closeModelView(){
    this.props.CompaignsStore.setReport('')
    this.props.CompaignsStore.setCampaignReported(false)
    this.props.onClose()
  }
  renderGallery = () => {
    const reportImage = this.state.reportImage
    return (
      <TouchableOpacity style={{marginLeft: metrics.dimen_20,}}
        onPress={() => this.showImagePicker()}>
        <View style={{ ...commonStyles.squareCellStyle,marginRight: 0, marginTop:0 }}>
          <View style={{ ...commonStyles.squareCellSubViewStyle }}>
            {reportImage.name === "empty" ?
              <Image source={images.UploadImage} style={{width:"30%", height:"30%"}}/>
              : <Image style={{ ...commonStyles.squareImageContainerStyle }}
                source={{ uri: reportImage.name }}></Image>}
            {(reportImage.name !== "empty") ? this.renderCancelButton('gallery', reportImage) : null}
          </View>
        </View>
      </TouchableOpacity>
    )
  }
  showImagePicker = () => {
    Keyboard.dismiss()
      setTimeout(() => {
        const store = this.props.CompaignsStore
        this.sheet.openSheet().then(image=>{
          console.log("uploadImage data image =", image)
          store.setLoading(true)
  
  
             //Upload image to server using API
  
          const param = {base64ImageData:image.data, folderPath: 'users', bucketName:Config.BUCKET}
  
          uploadImage(param).then(response => {
            store.setLoading(false)
            console.log('uploadImage response:',response)
            let imagePicked = { name: image.path, value: response.data.path }
            this.setState({reportImage:imagePicked})
          //  store.setReportImageUrl(response.data.path)
          
        }).catch(error => {
          store.setLoading(false)
            console.log("uploadImage data response =", error)
        })
    
           
        })
      }, 700);
    } 
    renderCancelButton = (id, data) => {
      let cancelBtn = (
        <TouchableOpacity style={{ ...commonStyles.cancelButtonMainViewStyle }} onPress={() => this.onRemovePhoto(id, data)}>
          <View style={{ ...commonStyles.cancelButtonStyle }}>
            <Text style={{ fontSize: 10, fontWeight: '500', color: colors.white }}>X</Text>
          </View>
        </TouchableOpacity>
      )
      return cancelBtn
    }
    onRemovePhoto = () => {
        this.setState({  reportImage: { name: 'empty', value: '' }})
    }
}
export default inject("CompaignsStore")(observer(Report))


const styles = StyleSheet.create({
    modalBackground: {
        flex: 1
      },
      backButton: {
        marginLeft: metrics.dimen_20,
        marginTop: metrics.dimen_20,
      },
      titleStyle: {
          position: 'absolute',
          top: metrics.dimen_50,
          alignSelf: 'center',
          color: colors.app_black
        },
        textInputStyle:{
            borderRadius: metrics.dimen_4,
            height: metrics.dimen_46,
            backgroundColor: 'rgba(248,248,248,1)',
            paddingHorizontal: metrics.dimen_10,
            marginVertical: metrics.dimen_10,
            marginHorizontal: metrics.dimen_20,
            borderWidth: metrics.dimen_1,
            borderColor: 'rgba(227,227,227,1)',
            textAlignVertical: "top"
          },
  });
