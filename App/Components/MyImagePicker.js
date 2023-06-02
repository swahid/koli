import React from 'react'
import { Text, View, TouchableOpacity, StyleSheet, Platform } from 'react-native'
import RBSheet from "react-native-raw-bottom-sheet";
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../Themes/Colors';
import Metrics from '../Themes/Metrics';
import ImagePicker from 'react-native-image-crop-picker'
import { strings } from '../Locales/i18';
import metrics from '../Themes/Metrics';



export default class MyImagePicker extends React.Component {


    componentWillUnmount = () => {

        // ImagePicker.clean().then(() => {


        // }).catch(err => err)
    }

    resultCallback = (resolve, reject) => {

        this.resolve = resolve
    }


    openSheet = () => {

        this.bottomSheet && this.bottomSheet.open()
        return new Promise(this.resultCallback)
    }

    openCamera = () => {
        ImagePicker.openCamera({
            cropping: this.props.iscroppingEnabled,
            mediaType: 'photo',
            includeBase64:true,
            disableCropperColorSetters:true,
            maxFiles: this.props.maxFiles ? this.props.maxFiles : 100,
            // width: this.props.width,
            // height: this.props.height,
            compressImageQuality: 0.3,

        }).then(images => {
            this.resolve(images)
        }).catch(err => {console.log('error in clicking camera',images) })
    }

    openGallery = () => {
        if(Platform.OS === 'android')
        {
            ImagePicker.openPicker({
                compressImageMaxWidth: 1000,
                compressImageMaxHeight: 1000,
                multiple: this.props.isMultiple !== undefined ? this.props.isMultiple : false,
                maxFiles: this.props.maxFiles ? this.props.maxFiles : 100,
                cropping: this.props.iscroppingEnabled,
                mediaType: 'photo',
                includeBase64:true,
              }).then(async images => {
                console.log("result:",images)

                if(!Array.isArray(images))
                {
                    console.log("result:",images)
                    this.resolve(images)

                }
                else
                {
                    const result = [];
                    var slicedArray = images
                    if(this.props.maxFiles)
                    {
                        slicedArray=slicedArray.slice(0,this.props.maxFiles)
                    }
              
                    for (const image of slicedArray) {
                      result.push(
                        await ImagePicker.openCropper({
                          path: image.path,
                          width: 1000,
                          height: 1000,
                          maxFiles: this.props.maxFiles ? this.props.maxFiles : 100,
                          disableCropperColorSetters:true,
                          includeBase64:true,
                          waitAnimationEnd: true,
                          compressImageQuality: 1.0,                  
                          cropperToolbarTitle: 'Crop image area'
                        })
                      );
                    }
                    console.log("result:",result)
                    this.resolve(result)
                }
               
    
                 //return result;
              });
        }
        else
        {
ImagePicker.openPicker({
            multiple: this.props.isMultiple !== undefined ? this.props.isMultiple : false,
            maxFiles: this.props.maxFiles ? this.props.maxFiles : 100,
            cropping: this.props.iscroppingEnabled,
            mediaType: 'photo',
            includeBase64:true,
            // width: this.props.width,
            // height: this.props.height,
            compressImageQuality: 0.8,

        }).then(images => {
            if(this.props.iscroppingEnabled) {
                this.openCropper(images,0,[])
            }
            else
            {
                this.resolve(images)
            }
        }).catch()
        }
      
    }
    openCropper = (images, currentIndex,tempArray) =>{
        console.log(tempArray)
        if(images.length>currentIndex)
        {
            ImagePicker.openCropper({
                path: images[currentIndex].path,
                width: 500,
                height: 500,
                disableCropperColorSetters:true,
                includeBase64:true,
                waitAnimationEnd: true,
                compressImageQuality: 1.0,                  
                cropperToolbarTitle: 'Crop image area'
              })
              .then(image => {
                
                if(image.path) {
                    tempArray.push(image)

                 this.openCropper(images,currentIndex+1,tempArray)

                }                  
                
              }).catch(() => console.log('erorr with image cropper after then'))
        }
        else
        {
            this.resolve(tempArray)
        }

       
    }

    render() {

        return (

            <RBSheet
                ref={ref => {
                    this.bottomSheet = ref;
                }}
                height={Platform.OS === 'ios' ? 
                metrics.getHeightAspectRatio(180) : 
                metrics.getHeightAspectRatio(200)}
                /* animationType={'slide'}
                customStyles={{
                    wrapper: { backgroundColor:Colors.transparent }
                }} */
                duration={170}>

                <View style={styles.listContainer}>
                    <Text style={styles.listTitle}>{strings('Select_Image')}</Text>

                    <TouchableOpacity
                        style={styles.listButton}
                        onPress={() => {
                            this.bottomSheet.close()
                            setTimeout(this.openCamera, 220)
                        }}>
                        <Icon name={'camera'} color={Colors.app_gray} size={26} />
                        <Text style={styles.listLabel}>{strings('Take_Photo')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.listButton}
                        onPress={() => {
                            this.bottomSheet.close()
                            setTimeout(this.openGallery, 220)
                        }}>
                        <Icon name={'photo'} color={Colors.app_gray} size={26} />
                        <Text style={styles.listLabel}>{strings('choose_from_library')}</Text>
                    </TouchableOpacity>

                </View>

            </RBSheet>
        )
    }
}


const styles = StyleSheet.create({

    listContainer: {
        flex: 1,
        padding: 25,
        backgroundColor: Colors.app_lightBlue
    },
    listTitle: {
        fontSize: metrics.text_16,
        marginBottom: 20,
        fontFamily: metrics.Lato_Bold,
        color: Colors.app_blue
    },
    listButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10
    },
    listIcon: {
        fontSize: 26,
        color: Colors.app_blue,
        width: 60
    },
    listLabel: {
        marginHorizontal: 10,
        fontSize: metrics.text_17,
        fontFamily: Metrics.Lato_Regular,
        color: Colors.app_blue
    },
})