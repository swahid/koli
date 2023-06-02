import { Alert } from 'react-native'
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import GDrive from 'react-native-google-drive-api-wrapper';
import RNFS from "react-native-fs"
import { strings } from '../../Locales/i18';

//API Token to be used for Drive APIs.
let apiToken = null
// Demo method to understand easier https://developers.google.com/drive/v3/reference/files/list
//const downloadHeaderPath = `${RNFS.ExternalDirectoryPath}/MyVideos_${random}.mp4` // see more path directory https://github.com/itinance/react-native-fs#api
const DriveScopes = {

  //Full, permissive scope to access all of a user's files, excluding the Application Data folder.	
  FullDriveAccess: 'https://www.googleapis.com/auth/drive',

  // Allows read and write access to the Drive Activity API.	
  DriveActivity: 'https://www.googleapis.com/auth/drive.activity',

  /*Allows read-write access to file metadata (excluding downloadUrl and contentHints.thumbnail), 
  but does not allow any access to read, download, write or upload file content. Does not support file creation, trashing or deletion. 
 Also does not allow changing folders or sharing in order to prevent access escalation.*/
  DriveMetaData: 'https://www.googleapis.com/auth/drive.metadata'

};


/**
* Set api token
*/
function setApiToken(token) {
  //console.warn(token)
  apiToken = token
}

class GoogleDriveManager {

  state = {
    data: null,
    messageImage: undefined,
    isLoading: false,
    uploadingDownloading: false,
    downloadedDriveVideoObj: undefined,
    //Need to save database
    rootFolderId: undefined,
    driveUploadedVideoID: undefined
  }

  /*
  Initialize Google SignIn, it will present a popup to Sign In with google in the app. 
  Upon success will return a token*/
  initializeGoogle = async () => {
    await GoogleSignin.configure({
      scopes: [DriveScopes.FullDriveAccess],
      shouldFetchBasicProfile: true,
    });

    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens()
      this.apiToken = tokens.accessToken
      console.log('tokens:', tokens.accessToken)

      console.log('userInfo:', JSON.stringify(userInfo))
      this.setState({ userInfo, apiToken: tokens.accessToken });
      // this.createFolderDrive()

      //set api token
      setApiToken(tokens.accessToken)
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log('user cancelled the login flow')
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        console.log(' operation (e.g. sign in) is in progress already')
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.log('play services not available or outdated:' + JSON.stringify(error))

      } else {
        if (error !== undefined) {
          // some other error happened
          console.log('some other error happened:' + JSON.stringify(error))
        }


      }
    }

  }

//Method used for creating folder on drive
  createFolderDrive = async () => {
    console.log('apiToken:' + this.apiToken)

    if (this.apiToken != null && this.apiToken !== undefined) {
      GDrive.setAccessToken(this.apiToken);
      GDrive.init();
      if (GDrive.isInitialized()) {
        return GDrive.files.safeCreateFolder({
          name: strings('KOLI_CHAT_DB'),
          parents: ["root"]
        })
          .then((response) => {
            console.log('createFolderDrive:' + JSON.stringify(response))
            this.rootFolderId = response
            return response

          }).
          catch((message) => {
            console.log('createFolderDrive error:' + JSON.stringify(message))
            return null
          })
      } else {
        Alert.alert(strings('TOKEN_NOT_FOUND'))
      }
    }

  }


 // Method used for creating/uploading file in folder

  createFileAtDrive = async (fileUrl, fileName, folderId) => {

    console.log('folderId:', folderId)
    if (this.apiToken !== null && this.apiToken !== undefined) {
      GDrive.setAccessToken(this.apiToken);
      GDrive.init();
      return Promise.all([
        RNFS.readFile(fileUrl, 'base64')
          .then((result => {
            return GDrive.files.createFileMultipart(
              result,
              "text/plain",//"video/mp4", image/jpg
              {
                parents: [folderId], //or any path
                name: fileName
              },
              true)//make it true because you are passing base64 string otherwise the uploaded file will be not supported
              .then((response) => {
                console.log('finalUploadImageVideoDrive:' + JSON.stringify(response))
              })
              .catch((message) => {
                // this.setState({
                //   uploadingDownloading: false
                // })
                console.warn(message)
              })
          }))])
    } else {
      Alert.alert('Token not found for upload video on google drive!!')
    }
  }
  
  downloadFileAndSaveToFiles = (fileId,videoName,progress) =>{

    console.log('downloadFileAndSaveToFiles videoName:'+videoName)

    
    const progressDivider = 1;

    console.log(RNFS.DocumentDirectoryPath)
    const downloadDest = RNFS.DocumentDirectoryPath + `/${videoName}`
    console.log(downloadDest)
    const downloadOptions = { toFile: downloadDest, progress, progressDivider }
    GDrive.setAccessToken(this.apiToken);
    GDrive.init();
    const queryParams = { alt: "media" };
   return GDrive.files.download(fileId, downloadOptions, queryParams)
     
  }
  getFile = (fileId) =>{
    const queryParams = {  };
    return GDrive.files.get(fileId,queryParams).then((response) => {
  console.log('GDrive getFile:' + JSON.stringify(response))
  return response
})
.catch((message) => {
  // this.setState({
  //   uploadingDownloading: false
  // })
  console.warn(message)
})
  }
  deleteFile = (fileId) =>{
    return GDrive.files.delete(fileId).then((response) => {
  console.log('GDrive deleteFile:' + JSON.stringify(response))
  return response
})
.catch((message) => {
  // this.setState({
  //   uploadingDownloading: false
  // })
  console.warn(message)
})
  }
  getVideoIdDrive = async(name, parent) => {
    console.warn('parent,name ' + parent+" "+name)
    GDrive.setAccessToken(this.apiToken);
    GDrive.init();
   return GDrive.files.getId(name, [parent], "text/plain", false)
      .then((response) => {
        console.log('getId:'+JSON.stringify(response))
        // this.setState({
        //   driveUploadedVideoID: response
        // })
        return response
      }).
      catch((message) => {
        console.warn('videoIDDrive catch' + JSON.stringify(message))
        return null
      })
  }
}
const GoogleDriveManagerClass = new GoogleDriveManager();
export default GoogleDriveManagerClass;

