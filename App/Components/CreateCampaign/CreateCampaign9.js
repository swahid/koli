import React, { Component } from 'react';
import { View, Text, TextInput, Image, TouchableWithoutFeedback, Keyboard, TouchableOpacity, FlatList } from 'react-native';
import { ProgressBar, Button } from 'react-native-paper';
import metrics from '../../Themes/Metrics';
import colors from '../../Themes/Colors';
import { commonStyles } from '../../SupportingFIles/Constants';
import { strings } from '../../Locales/i18';
import images from '../../Themes/Images';
import { observer, inject } from 'mobx-react';
import MyImagePicker from '../MyImagePicker'
import { uploadFile } from '../../API/Campaign/ApiCampaign';
import Loader from '../../SupportingFIles/Loader';
import { showAlert } from '../../SupportingFIles/Utills';
import { Media_Base_URL } from '../../API/Campaign/ApiCampaign';
import { ScrollView } from 'react-native-gesture-handler';
import { uploadImage } from '../../API/Campaign/ApiCampaign';
import Config from "react-native-config";


class CreateCampaign9 extends Component {
  constructor(props) {
    super(props);
    let gallery = []
    const { campainData } = this.props.CreateCampaignStore    
    if (campainData.imagegallery) {
      gallery = campainData.imagegallery.map(item => {
          let obj = {}
          obj['name'] = item
          obj['value'] = 'updated'
          return obj
      })
    }
    this.state = {
      gallery: [{ name: 'empty', value: '' }, ...gallery],

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
   
  }

  render() {

    const store = this.props.CreateCampaignStore
    if(this.props.CreateCampaignStore.campainData.campaigntype=='Edit')
    {
      store.setEnabled(true)

    }
    const { campainData, uploadingImage, enabled } = this.props.CreateCampaignStore
    // if (store.campainData.campaignTitle.length > 0 && this.state.gallery.length > 1) {
    //   store.setEnabled(true)
    // }else{
    //   store.setEnabled(false)

    // }
    

    return (
      <View style={{ backgroundColor: 'white', flex: 1 }}>
        <MyImagePicker ref={ref => this.sheet = ref} 
        width={metrics.width} 
        height={metrics.width}
        isMultiple={true} />
        <Loader loading={uploadingImage} />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

          <View style={{ justifyContent: 'space-between', flex: 1 }}>
            <ScrollView>
            <View>
              <ProgressBar style={{ ...commonStyles.progressBarStyle }} progress={1} color={'rgba(22, 88, 211, 1)'} />
              <Text style={{ ...commonStyles.LatoBold_24, marginTop: metrics.dimen_28, marginHorizontal: metrics.dimen_27 }}>{strings('Provide_Campaign_title')}</Text>
              <Text style={{ ...commonStyles.LatoSemiBold_Normal, marginTop: metrics.dimen_24, color: colors.app_gray, marginHorizontal: metrics.dimen_27 }}>{strings('Campaign_Title')}</Text>
              <View style={{ ...commonStyles.campaignViewStyle, marginTop: metrics.dimen_8, marginHorizontal: metrics.dimen_27 }}>
                <TextInput style={{ width: '100%', height: metrics.dimen_46, backgroundColor: colors.clear, paddingLeft: metrics.dimen_10, ...commonStyles.LatoRegular_Normal }}
                  placeholder={strings('Enter_Campaign_Title')}
                  placeholderTextColor='rgba(62,62,70,1)'
                  value={campainData.campaignTitle}
                  onChangeText={(text) => {
                    console.warn('text',text)
                    store.setCampaignData({ campaignTitle: text })
                    if (store.campainData.campaignTitle.length > 0 && this.state.gallery.length > 1) {
                      store.setEnabled(true)
                    }else{
                      store.setEnabled(false)

                    }
                  }}
                />
              </View>
              <Text style={{ ...commonStyles.LatoBold_24, marginTop: metrics.dimen_45, marginHorizontal: metrics.dimen_27 }}>{strings('Provide_Campaign_image')}</Text>
              <FlatList
                style={{ marginLeft: metrics.dimen_30,marginBottom:metrics.dimen_20 }}
                numColumns={2}
                keyboardShouldPersistTaps={'handled'}
                data={this.state.gallery}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => this.renderGallery(item)}
              />

            </View></ScrollView>

            <Button
              style={{ ...commonStyles.NextButtonStyle, marginHorizontal: metrics.dimen_27, backgroundColor: enabled ? colors.app_Blue : 'rgba(192, 196, 204, 0.6)', shadowOpacity: enabled ? 0.5 : 0 }}
              labelStyle={{ ...commonStyles.LatoBold_14, color: 'white' }}
              onPress={() => this.setuserdataandredirect()
                }
              uppercase={true}
              disabled={!enabled}
            >
              {strings('Preview')}
            </Button>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
  setuserdataandredirect()
  {
    const store = this.props.CreateCampaignStore

    let campaignImage=[]
    this.state.gallery.map(item => {

      if (item.name != 'empty')
      {
        if(item.value==='updated')
        {
         return campaignImage.splice(0, 0, item.name)

        }else
        {
          return campaignImage.splice(0, 0, Media_Base_URL+item.value)

        }

      }
  })
  store.setCampaignData({ campaignImage })
  this.props.navigation.navigate('CampaignPreview')
  }
  showImagePicker = () => {
    Keyboard.dismiss()
    setTimeout(() => {
      const store = this.props.CreateCampaignStore
      this.sheet.openSheet().then(image => {
        const stamp = Math.floor(Date.now() * 1000)
        var intArray = new Uint32Array(1);
        const randomNumber = Math.floor(crypto.getRandomValues(intArray));
        const picName = stamp.toString() + randomNumber.toString() + '.png'
        let file = {
          uri: image.path,
          name: picName,
          type: image.mime
        }
        this.props.CreateCampaignStore.setImageUplaoding(true)
        uploadFile('campaigns', file).then(res => {
          store.setImageUplaoding(false)
          if (res) {
            store.setImagePath(image.path)

            let photos = this.state.gallery
            let imagePicked = { name: image.path, value: picName }
            photos.push(imagePicked)
            this.setState({ gallery: photos })

            if (store.campainData.campaignTitle.length > 0 && this.state.gallery.length > 1) {
              store.setEnabled(true)
            }
          } else {

            showAlert('', strings('SomethingWentWrong'))
          }
        })

      })
    }, 700);
  }

  showImagePickerMultipleImages = () => {
    Keyboard.dismiss()
    setTimeout(() => {
      const store = this.props.CreateCampaignStore

      this.sheet.openSheet().then(images => {

        console.log('images:',Array.isArray(images))
       store.setImageUplaoding(true)

       if(Array.isArray(images))
       {
        images.map(async (item, index) => {
          this.uploadAndShowImage(item, index, images)
          })
       }
       else
       {
        this.uploadAndShowImage(images, 0, [images])
       }
        

    }).catch(error => {

        this.setState({ isLoading: false })
    })
    }, 700);
}
uploadAndShowImage = async(item,index, images) =>{
  const store = this.props.CreateCampaignStore

  const stamp = Math.floor(Date.now() * 1000)
          var intArray = new Uint32Array(1);
          const randomNumber = Math.floor(crypto.getRandomValues(intArray));
          const picName = stamp.toString() + randomNumber.toString() + '.png'
          let file = {
            uri: item.path,
            name: picName,
            type: item.mime
          }
          this.props.CreateCampaignStore.setImageUplaoding(true)

          //Upload image to server using API

          const param = {base64ImageData:item.data, folderPath: 'campaigns',bucketName:Config.BUCKET}

          uploadImage(param).then(response => {
          
            console.log('uploadImage response:',response)

          
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

            if (index === images.length - 1)
              store.setImageUplaoding(false)
}

  renderGallery = (item) => {
    return (
      <TouchableOpacity
        onPress={() => this.showImagePickerMultipleImages('gallery', item)}>
        <View style={{ ...commonStyles.cellStyle }}>
          <View style={{ ...commonStyles.cellSubViewStyle }}>
            {item.name == "empty" ?
              <Image source={images.UploadImage} />
              : <Image style={{ ...commonStyles.imageContainerStyle }}
                source={{ uri: item.name }}></Image>}
            {(item.name != "empty") ? this.renderCancelButton('gallery', item) : null}
          </View>
        </View>
      </TouchableOpacity>
    )
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

    let { gallery } = this.state

    let array = [...gallery];
    let index = array.indexOf(data)
    if (index !== -1) {
      array.splice(index, 1);
      gallery = array
      this.setState({ gallery: gallery },
        () => {
          this.setEnableDisable();
      });
    }
    else
    {
      this.setEnableDisable()
    }
    console.log('in onRemovePhoto:',this.state.gallery)
  }
  setEnableDisable = () =>{
    const store = this.props.CreateCampaignStore

    if (store.campainData.campaignTitle.length > 0 && this.state.gallery.length > 1) {
      store.setEnabled(true)
    }else
    {
      store.setEnabled(false)

    }
  }
}
export default inject("CreateCampaignStore")(observer(CreateCampaign9))
