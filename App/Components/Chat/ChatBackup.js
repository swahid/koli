import React, { Component } from 'react';
import { View, Text, StyleSheet,Image,TouchableOpacity } from 'react-native';
import metrics from '../../Themes/Metrics';
import images from '../../Themes/Images';
import colors from '../../Themes/Colors';
import { strings } from '../../Locales/i18';
import GoogleDriveManager from '../../SupportingFIles/GoogleDrive/GoogleDriveManagerClass'
const Realm = require('realm');

class ChatBackup extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    console.log("Realm.defaultPath:",Realm.defaultPath)
  }

  render() {
    return (
      <View style={styles.container}>
          <View style={styles.backupTitleView}>
          <Image source={images.googleDrive} 
          resizeMode="contain"
          style = {styles.imageDriveIcon}/>
          <Text style = {styles.backupTitle}> {strings('Chat_Backup')} </Text>
          </View>
          <Text style = {styles.backupMessage}> {strings('Backup_Message')} </Text>
<TouchableOpacity style={styles.syncNowButton} onPress={()=>this.checkFileExistAtGoogleDrive("default.realm")}>
<Text style = {styles.syncNowTitle}> {strings('Sync_Now')} </Text>

</TouchableOpacity>
      </View>
    );
  }
  getFile = () =>{
    
    GoogleDriveManager.initializeGoogle().then(() => {
        GoogleDriveManager.createFolderDrive().then((folderId) => {
          console.log("in createFolderDrive b4")

          if(folderId !== undefined)
{
         // this.showLoader()
          GoogleDriveManager.deleteFile('96A4D7DD-2D8D-4C2B-B6C3-F869AAABA163').then(() => {
            console.log("in createFolderDrive after")

           // this.hideLoader()
          })
        }
        })
      })
  }
  signInAndUloadChatData = () =>{
    GoogleDriveManager.initializeGoogle().then(() => {
        GoogleDriveManager.createFolderDrive().then((folderId) => {
          console.log("in createFolderDrive b4")

          if(folderId !== undefined)
{
         // this.showLoader()
          GoogleDriveManager.createFileAtDrive(Realm.defaultPath, "Koli Chat Backup "+new Date().toUTCString(),folderId).then(() => {
            console.log("in createFolderDrive after")

           // this.hideLoader()
          })
        }
        })
      })
  }
  checkFileExistAtGoogleDrive = (fileName) => {

    GoogleDriveManager.initializeGoogle().then(() => {
      GoogleDriveManager.createFolderDrive().then((folderId) => {

        GoogleDriveManager.getVideoIdDrive(fileName, folderId).then((fileId) => {
          console.log("in getVideoIdDrive after: " + fileId)
          if(fileId !== undefined)
          {
            const progress = data => {
             // const percentage = ((10 * data.bytesWritten) / data.contentLength) | 0;
              const percentage = ((10 * data.bytesWritten) / data.contentLength);

              //this.setState({ progress: data.bytesWritten/data.contentLength})
              const text = `Progress ${percentage}%`;
              console.log(text)
            };
            //task = 1
            const ret = GoogleDriveManager.downloadFileAndSaveToFiles(fileId,fileName,progress)
            ret.promise.then(res => {
             // task=null
              console.log(JSON.stringify(res))
              //Alert.alert(Global.APP_NAME, AlertMessages.DOWNLOAD_COMPLETED_SUCCESSFULLY)

             // this.setState({ output: JSON.stringify(res) });
             // this.setState({ imagePath: { uri: 'file://' + downloadDest } });
        
             // jobId = -1;
            }).catch(err => {
              //task=null
              console.log(err)
              //this.showError(err)
        
             // jobId = -1;
            });
          //  this.setState({ progress: progress })
          }
          else
          {
            // this.props.navigation.setParams({
            //   showDownloadButton: true
            // });
          }
        })
      })
    })
  }
}
const styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      flex: 1,
      backgroundColor: colors.app_Blue,
    },
    backupTitleView:{
        marginTop:metrics.getHeightAspectRatio(30),
        alignSelf:'center',
        flexDirection:'row',
        justifyContent:'center',
        //backgroundColor:'red'
    },
    imageDriveIcon:{
        width:metrics.widthSize(120),
        height:metrics.getHeightAspectRatio(30),
        tintColor:colors.white
    },
    backupTitle: {
        marginHorizontal: metrics.widthSize(51),
        fontFamily: metrics.Lato_SemiBold,
        fontSize: metrics.text_normal,
        color: colors.white,
        alignSelf:'center'
      },
      backupMessage: {
        marginHorizontal: metrics.widthSize(51),
        marginTop:metrics.getHeightAspectRatio(50),
        fontFamily: metrics.Lato_Regular,
        fontSize: metrics.text_normal,
        color: colors.app_light_gray,
        alignSelf:'center',
        textAlign:'center'
      },
      syncNowButton:{
          width:'40%',
          height:metrics.getHeightAspectRatio(48),
          borderRadius: 1000,
          backgroundColor:colors.white,
          alignSelf:'center',
          marginTop:metrics.getHeightAspectRatio(50),
          justifyContent:'center'

      },
      syncNowTitle: {
        fontFamily: metrics.Lato_SemiBold,
        fontSize: metrics.text_17,
        color: colors.app_black,
        alignSelf:'center',
      },
  }
  )

export default ChatBackup;
