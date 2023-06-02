import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  FlatList
} from 'react-native';
import { observer, inject } from 'mobx-react';
import metrics from '../../../Themes/Metrics';
import { Button } from 'react-native-paper';
import { commonStyles } from '../../../SupportingFIles/Constants';
import { strings } from '../../../Locales/i18';
import { gettUserData } from '../../../SupportingFIles/Utills';
import colors from '../../../Themes/Colors';
import Loader from '../../../SupportingFIles/Loader';
import images from '../../../Themes/Images';
import MyImagePicker from '../../MyImagePicker'
import { uploadImage } from '../../../API/Campaign/ApiCampaign';
import Config from "react-native-config";


class Help extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedSubject: {},
      reportImage: [{ name: 'empty', value: '' }],

    };
  }
  componentDidMount() {
    const store = this.props.HelpStore
    const Autstore = this.props.AuthStore
    store.setlogintype(this.props.AuthStore.isLogin==false?false:true)
    if(this.props.AuthStore.isLogin==false)
    {
      store.setname('')
      this.props.HelpStore.setemail('')
    }else
    {
      store.setname(Autstore.firstName + " " + Autstore.lastName)
      gettUserData().then(data => {
        this.props.HelpStore.setemail(data.email)
      })
    }
   
    this.props.navigation.addListener('focus', () => {
      this.props.HelpStore.deleteAllValidationError()
    });
    const param = { where: { status: "active" }, order: "subject ASC" }

    store.getSubjectList(param)


    this.props.navigation.setOptions({

   
    })
  }
  render() {
    const store = this.props.HelpStore
    const {name,email, title, message, validationError, isLoading, selectedSubject } = store
    const subjectTitle = selectedSubject.subject !== undefined ? selectedSubject.subject : strings('Select_Subject')
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

        <ScrollView style={styles.Container}>
          <Loader loading={isLoading} />
          <MyImagePicker ref={ref => this.sheet = ref}
            iscroppingEnabled={true}
            isMultiple={true}
            maxFiles={5}
            width={metrics.width} height={metrics.width} />
          <View style={{
            marginBottom: metrics.dimen_5, marginHorizontal: metrics.dimen_27,
          }}>


{this.props.AuthStore.isLogin==false?<Text style={{ ...commonStyles.LatoSemiBold_Normal, marginTop: metrics.dimen_24, color: colors.app_gray, }}>{strings('Your_full_name')}</Text>:null}
         {this.props.AuthStore.isLogin==false&& 
         <View style={{ ...commonStyles.campaignViewStyle, marginTop: metrics.dimen_8, }}>
            <TextInput style={{ width: '100%', height: metrics.dimen_46, backgroundColor: colors.clear, paddingLeft: metrics.dimen_10, ...commonStyles.LatoRegular_Normal, color: '#3E3E46' }}
                placeholder={strings('Enter_fullname')}
                placeholderTextColor='#B2B2B5'
                value={name}
                onChangeText={(text) => {
                  store.setname(text)

                }}
              />

            </View>}
            {this.props.AuthStore.isLogin==false? validationError.nameError ? <Text style={styles.errorTextStyletopview}>{validationError.nameError}</Text> : null:null}


            {this.props.AuthStore.isLogin==false?<Text style={{ ...commonStyles.LatoSemiBold_Normal, marginTop: metrics.dimen_24, color: colors.app_gray, }}>{strings('your_email_address')}</Text>:null}
            {this.props.AuthStore.isLogin==false&&<View style={{ ...commonStyles.campaignViewStyle, marginTop: metrics.dimen_8, }}>
              <TextInput style={{ width: '100%', height: metrics.dimen_46, backgroundColor: colors.clear, paddingLeft: metrics.dimen_10, ...commonStyles.LatoRegular_Normal, color: '#3E3E46' }}
                placeholder={strings('enter_email_address')}
                placeholderTextColor='#B2B2B5'
                value={email}
                onChangeText={(text) => {
                  store.setemail(text)

                }}
              />
            </View>}
             {this.props.AuthStore.isLogin==false?validationError.emailError ? <Text style={styles.errorTextStyletopview}>{validationError.emailError}</Text> : null:null}


            <Text style={{ ...commonStyles.LatoSemiBold_Normal, marginTop: metrics.dimen_24, color: colors.app_gray, }}>{strings('Subject')}</Text>
            <View style={{ ...commonStyles.campaignViewStyle, marginTop: metrics.dimen_5, marginBottom: metrics.dimen_10 }}>
              <TouchableOpacity
                style={{ width: '100%', height: metrics.dimen_46, backgroundColor: colors.clear, paddingLeft: metrics.dimen_10, ...commonStyles.LatoRegular_Normal, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}
                onPress={() => this.props.navigation.navigate("HelpSelectSubject")}>
                <Text style={styles.subjectTitle}>{subjectTitle}</Text>
                <Image source={images.rightArrowIcon}
                  resizeMode="contain"
                  style={styles.imageStyle} />
              </TouchableOpacity>
            </View>
            {validationError.subjectError ? <Text style={styles.errorTextStyle}>{validationError.subjectError}</Text> : null}

            {store.selectedSubject.id === 0 && <View style={{ ...commonStyles.campaignViewStyle, marginTop: metrics.dimen_8, marginBottom: metrics.dimen_5 }}>

              <TextInput style={{ width: '100%', height: metrics.dimen_46, backgroundColor: colors.clear, paddingLeft: metrics.dimen_10, ...commonStyles.LatoRegular_Normal, color: '#3E3E46' }}
                placeholder={strings('Enter_Subject')}
                placeholderTextColor='#B2B2B5'
                value={title}
                onChangeText={(text) => {
                  store.settitle(text)

                }}
              />

            </View>}
            {store.selectedSubject.id === 0 && validationError.firstNameError ? <Text style={styles.errorTextStyle}>{validationError.firstNameError}</Text> : null}

            <Text style={{ ...commonStyles.LatoRegular_Normal, marginTop: 15, color: 'rgba(62,62,70,1)' }}>{strings('Description_Text')}</Text>
            <TextInput style={{ ...commonStyles.multilineTextInputStyle, ...commonStyles.LatoRegular_Normal, marginTop: metrics.dimen_8, marginBottom: 5, color: "#3E3E46" }}
              placeholder={strings('Description_Text')}
              placeholderTextColor="#B2B2B5"
              multiline={true}
              returnKeyType="default"
              value={message}
              onChangeText={(text) => {
                store.setmessage(text)

              }}

            />
            {validationError.lastNameError ? <Text style={styles.errorTextStyle}>{validationError.lastNameError}</Text> : null}

            <Text style={{ ...commonStyles.LatoRegular_Normal, marginTop: metrics.aspectRatioHeight(20), color: 'rgba(62,62,70,1)' }}>{strings('Image_optional')}</Text>
            <FlatList
              style={{ marginBottom: metrics.dimen_20, marginRight: -metrics.dimen_20, }}
              numColumns={3}
              keyboardShouldPersistTaps={'handled'}
              data={this.state.reportImage}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => this.renderGallery(item)}
            />
            {/* {this.renderGallery()} */}
          </View>

          <Button style={{ ...commonStyles.submitButtonStyle }} labelStyle={{ ...commonStyles.LatoBold_14, color: 'white' }} onPress={() => {
            Keyboard.dismiss()
            this.props.HelpStore.setNavigation(this.props.navigation)
            this.props.HelpStore.onhelp()



          }}
          >{strings('Submit')}
          </Button>
          <View style={{height:metrics.dimen_40}}></View>
        </ScrollView>
      </TouchableWithoutFeedback>
    );
  }
  // renderGallery = (item) => {
  //   return (
  //     <TouchableOpacity style={{ marginLeft: metrics.dimen_10, }}
  //       onPress={() => this.showImagePickerMultipleImages()}>
  //       <View style={{ ...commonStyles.squareCellStyle, marginRight: 0, }}>
  //         <View style={{ ...commonStyles.squareCellSubViewStyle }}>
  //           {item.name === "empty" ?
  //             <Image source={images.UploadImage} style={{ width: "30%", height: "30%" }} />
  //             : <Image style={{ ...commonStyles.squareImageContainerStyle }}
  //               source={{ uri: item.name }}></Image>}
  //           {(item.name !== "empty") ? this.renderCancelButton('gallery', item) : null}
  //         </View>
  //       </View>
  //     </TouchableOpacity>
  //   )
  // }
  renderGallery = (item) => {
    return (
      <TouchableOpacity
        // style={{marginLeft: metrics.dimen_10,}}
        onPress={() => this.showImagePicker()}>
        <View style={{ ...commonStyles.squareCellStyle, marginRight: 10, marginTop: 0 }}>
          <View style={{ ...commonStyles.squareCellSubViewStyle }}>
            {item.name === "empty" ?
              <Image source={images.UploadImage} style={{ width: "30%", height: "30%" }} />
              : <Image style={{ ...commonStyles.squareImageContainerStyle }}
                source={{ uri: item.name }}></Image>}
            {(item.name !== "empty") ? this.renderCancelButton('gallery', item) : null}
          </View>
        </View>
      </TouchableOpacity>
    )
  }


  showImagePicker = () => {
    Keyboard.dismiss()
    //  setTimeout(() => {
    const store = this.props.HelpStore
    this.sheet.openSheet().then(imagesPicked => {

      console.log('imagesPicked:', Array.isArray(imagesPicked))
      store.setLoading(true)
      if (Array.isArray(imagesPicked)) {
        imagesPicked.map(async (item, index) => {
          this.uploadAndShowImage(item, index, imagesPicked)
        })
      }
      else {
        this.uploadAndShowImage(imagesPicked, 0, [imagesPicked])
      }


      //  console.log("uploadImage data image =", image)
      // store.setLoading(true)


      //Upload image to server using API

      //   const param = {base64ImageData:image.data, folderPath: 'users', bucketName:Config.BUCKET}

      //   uploadImage(param).then(response => {
      //     store.setLoading(false)
      //     console.log('uploadImage response:',response)
      //     let imagePicked = { name: image.path, value: response.data.path }
      //     this.setState({reportImage:imagePicked})
      //     store.setReportImageUrl(response.data.path)

      // }).catch(error => {
      //   store.setLoading(false)
      //     console.log("uploadImage data response =", error)
      // })


    })
    // }, 700);
  }
  uploadAndShowImage = (item, index, imagesArr) => {
    const store = this.props.HelpStore
    //Upload image to server using API

    const param = { base64ImageData: item.data, folderPath: 'users', bucketName: Config.BUCKET }

    uploadImage(param).then(response => {

      console.log('uploadImage response:', response)
      let photos = this.state.reportImage
      let imagePicked = { name: item.path, value: response.data.path }
      // photos.push(imagePicked)
      photos.splice(1, 0, imagePicked)
      this.setState({ reportImage: photos })

      if (index === imagesArr.length - 1) {
        const filteredArray = this.state.reportImage.filter(el => el.value !== "")
        const imagesUrlArray = filteredArray.map(el => el.value)
        // console.log('imagesUrlArray:',imagesUrlArray)
        this.setState({ isLoading: false })
        store.setLoading(false)
        store.setReportImageUrl(imagesUrlArray.toString())
      }


    }).catch(error => {

      console.log("uploadImage data response =", error)
    })

    //Upload image using s3
    // let val = await uploadFile('campaigns', file)

    // if (val) {

    //     let photos = this.state.gallery
    //     let imagePicked = { name: item.path, value: picName }
    //     photos.push(imagePicked)
    //     this.setState({ gallery: photos })
    //     if (store.campainData.campaignTitle.length > 0 && this.state.gallery.length > 1) {
    //       store.setEnabled(true)
    //     }
    // }



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
  onRemovePhoto = (id, data) => {

    let { reportImage } = this.state

    let array = [...reportImage];
    let index = array.indexOf(data)
    if (index !== -1) {
      array.splice(index, 1);
      reportImage = array
      this.setState({ reportImage: reportImage },
        () => {
          const filteredArray = this.state.reportImage.filter(el => el.value !== "")
          const imagesUrlArray = filteredArray.map(el => el.value)
          this.props.HelpStore.setReportImageUrl(imagesUrlArray.toString())
          //this.setEnableDisable();
        });
    }

  }
  // onRemovePhoto = () => {
  //   this.props.HelpStore.setReportImageUrl('')
  //     this.setState({  reportImage: { name: 'empty', value: '' }})
  // }
}
export default inject("HelpStore", "AuthStore")(observer(Help))

const styles = StyleSheet.create({
  Container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: colors.white
  },
  errorTextStyle: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_normal,
    color: colors.app_RedColor,
    marginTop: -metrics.dimen_5,
    marginBottom: metrics.dimen_5
  },

  errorTextStyletopview:{
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_normal,
    color: colors.app_RedColor,
  },
  // backButtonContainer: {
  //   marginLeft: metrics.dimen_16, 
  //   marginTop: Platform.OS == 'android' ? metrics.dimen_6 : 3
  // },
  subjectTitle: {
    //marginVertical:metrics.aspectRatioHeight(48),
    //marginHorizontal:metrics.widthSize(51),
    fontFamily: metrics.Lato_SemiBold,
    fontSize: metrics.text_normal,
    color: '#3E3E46',
  },
  imageStyle: {
    height: metrics.getHeightAspectRatio(22),
    width: metrics.widthSize(40),
    alignSelf: 'center',
    marginRight: metrics.widthSize(42),
    tintColor: '#3E3E46'
  }
})
