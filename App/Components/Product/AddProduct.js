import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    SafeAreaView,
    Keyboard,
    TouchableWithoutFeedback,
    TextInput,
    FlatList,
    Alert
} from 'react-native';
import { inject, observer } from 'mobx-react';
import metrics from '../../Themes/Metrics';
import images from '../../Themes/Images';
import { commonStyles } from '../../SupportingFIles/Constants';
import colors from '../../Themes/Colors';
import { getUserId, formatDate } from '../../SupportingFIles/Utills';
import ReadMore from 'react-native-read-more-text';
import { getAllNotifications, updateNotifications } from '../../API/Notification/APINotification';
import Loader from '../../SupportingFIles/Loader';
import { strings } from '../../Locales/i18';
import MyImagePicker from '../MyImagePicker'
import { Button } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { uploadImage } from '../../API/Campaign/ApiCampaign';
import Config from "react-native-config";
import CountryPicker from 'react-native-country-picker-modal';

import styles from './styles'
class AddProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gallery: [{ name: 'empty', value: '' }],
            isSubmit:false,
            productCountries: [],
        };
    }
    componentDidMount() {
        this.props.navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity style={{ ...commonStyles.backButtonContainer }}
                    onPress={() => this.props.navigation.goBack()}
                >
                    <Image source={images.backImage} />
                </TouchableOpacity>
            ),
        }
        )
    }
    render() {
        const { isLoading, productData, categoriesArray, productAdded } = this.props.ProductStore
        const store = this.props.ProductStore
        const selectedCategories = productData.productCategories.filter(item => {
            return item.isSelected
        })
        return (
            <SafeAreaView style={styles.containerStyle}>
                <Loader loading={isLoading} />
                <MyImagePicker
                    ref={(ref) => { this.sheet = ref }}
                    iscroppingEnabled={true}
                    width={metrics.width}
                    height={metrics.width}
                    isMultiple={true} />
                    {this.state.show_country_modal && <CountryPicker
                    containerButtonStyle={{ height: 0}}
                    visible={this.state.show_country_modal}
                    onClose={() => this.setState({ show_country_modal: false })}
                    withEmoji={true}
                    withFlag={true}
                    withFilter={true}
                    withAlphaFilter={true}
                    withCallingCode = {false}
                    translation={'en'}
                    filterProps={{
                      filterable:false,
                      placeholder: strings('search_country')
                    }}
                    onSelect={selectedCountry => {this.setState(prevState => ({
                        productCountries: [...prevState.productCountries, selectedCountry]
                      }))
                      
                    }}
              />}
                <KeyboardAwareScrollView style={styles.keybaordAwerScrollView}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                        <View style={styles.contentView}>
                            <View>

                                <Text style={[styles.textFieldTitle, { marginTop: Platform.OS === 'ios' ? 0 : 20 }]}>{strings('Product_Title')}</Text>
                                <View style={styles.campaignViewStyle}>
                                    <TextInput style={[styles.inputTextFieldStyle, { width: '100%', height: metrics.dimen_46, backgroundColor: colors.clear, paddingLeft: metrics.dimen_10 }]}
                                        placeholder={strings('Product_Title')}
                                        maxLength={75}
                                        placeholderTextColor="rgba(62,62,70,0.5)"
                                        value={productData.productTitle}
                                        onChangeText={(text) => {
                                            store.setProductData({ productTitle: text })
                                        }}
                                    />
                                </View>
                                {this.state.isSubmit && store.productData.productTitle.length === 0 &&
                                    <Text style={styles.errorTextStyle}>{strings('Enter_Product_Title')}</Text>}


                                <Text style={[styles.textFieldTitle, { marginTop: metrics.dimen_30 }]}>{strings('Product_Description')}</Text>
                                <TextInput style={styles.multilineTextInputStyle}
                                    placeholder={strings('Product_Description')}
                                    placeholderTextColor='rgba(62,62,70,0.5)'
                                    multiline={true}
                                    maxLength={1000}
                                    returnKeyType="done"
                                    
                                       value = {productData.productDescription}
                                    onChangeText={(text) => {
                                        store.setProductData({productDescription: text})
                                    }}
                                />
                                {this.state.isSubmit && store.productData.productDescription.length === 0 &&
                                    <Text style={styles.errorTextStyle}>{strings('Enter_Product_Description')}</Text>}


                                <Text style={styles.textFieldTitle}>{strings('Category')}</Text>
                                <TouchableOpacity style={styles.campaignViewStyle}
            onPress={()=>this.props.navigation.navigate('CampaignAddCategory',{isFromAdd:true, isFromProduct:true})}>
            <TextInput style={[styles.inputTextFieldStyle, { width: '100%', height: metrics.dimen_46, backgroundColor: colors.clear, paddingLeft: metrics.dimen_10 }]}
                                        placeholder={strings('Select_Category')}
                                        placeholderTextColor="rgba(62,62,70,1.0)"
                                        editable={false}
                                        pointerEvents="none"
                                    />
                                    <Image style={styles.imageArrow}
                                        source={images.rightArrowIcon}
                                        resizeMode="contain"
                                    ></Image>
                                </TouchableOpacity>
                                <View style = {{flexDirection: 'row', flexWrap: 'wrap', marginTop:metrics.dimen_10,marginHorizontal: metrics.dimen_27,}}>
                    {selectedCategories.map((item, index) =>{
                        return(
                            <TouchableOpacity style={styles.textCategoryContainer} 
                            onPress={()=>this.selectDeselectCategories(item,index)}>
                                <Text style={styles.textCategory}>{item.categoryName}</Text>
                                <Image style={styles.imageCross} 
                                source={images.cross} 
                               ></Image>
                                </TouchableOpacity>
                            )
                        }
                    )}
                    </View>
                    {this.state.isSubmit && selectedCategories.length === 0 &&
                                    <Text style={styles.errorTextStyle}>{strings('Select_Product_Category')}</Text>}

                    <Text style={styles.textFieldTitle}>{strings('Countries_Deliverable')}</Text>
                                <TouchableOpacity style={styles.campaignViewStyle}
            onPress={()=>this.setState({show_country_modal:true})}>
            <TextInput style={[styles.inputTextFieldStyle, { width: '100%', height: metrics.dimen_46, backgroundColor: colors.clear, paddingLeft: metrics.dimen_10 }]}
                                        placeholder={strings('Select_country')}
                                        placeholderTextColor="rgba(62,62,70,1.0)"
                                        editable={false}
                                        pointerEvents="none"
                                    />
                                    <Image style={styles.imageArrow}
                                        source={images.rightArrowIcon}
                                        resizeMode="contain"
                                    ></Image>
                                </TouchableOpacity>
                                <View style = {{flexDirection: 'row', flexWrap: 'wrap', marginTop:metrics.dimen_10,marginHorizontal: metrics.dimen_27,}}>
                    {this.state.productCountries.map((item, index) =>{
                        return(
                            <TouchableOpacity style={styles.textCategoryContainer} 
                            onPress={()=>this.removeCountru(item, index)}>
                                <Text style={styles.textCategory}>{item.name}</Text>
                                <Image style={styles.imageCross} 
                                source={images.cross} 
                               ></Image>
                                </TouchableOpacity>
                            )
                        }
                    )}
                    </View>


                    {this.state.isSubmit && this.state.productCountries.length === 0 &&
                                    <Text style={styles.errorTextStyle}>{strings('Country_error')}</Text>}
                   

                                <Text style={[styles.textFieldTitle, { marginTop: metrics.dimen_10 }]}>{strings('Product_Amount')}</Text>
                                <View style={styles.campaignViewStyle}>
                                    <Text style={[styles.inputTextFieldStyle, { color: colors.app_Blue, marginLeft: metrics.dimen_14 }]}>{strings('USD')}</Text>
                                    <TextInput style={[styles.inputTextFieldStyle, { width: '100%', height: metrics.dimen_46, backgroundColor: colors.clear, paddingLeft: metrics.dimen_5 }]}
                                        placeholder={'$ 0.00'}
                                        keyboardType="decimal-pad"
                                        maxLength={5}
                                        placeholderTextColor={'rgba(62,62,70,0.5)'}
                                        value = {productData.productAmount}
                                        onChangeText={(text) => {
                                            store.setProductData({productAmount: text})

                                        }}
                                    />
                                </View>
                                {this.state.isSubmit && store.productData.productAmount.length === 0 &&
                                    <Text style={styles.errorTextStyle}>{strings('Enter_Product_Amount')}</Text>}


                                <Text style={[styles.textFieldTitle, { marginTop: metrics.dimen_30 }]}>{`${strings('Product_Discount')} (%)`}</Text>
                                <View style={styles.campaignViewStyle}>
                                    <TextInput style={[styles.inputTextFieldStyle, { width: '100%', height: metrics.dimen_46, backgroundColor: colors.clear, paddingLeft: metrics.dimen_10 }]}
                                        placeholder={strings('Discount_Example')}
                                        placeholderTextColor="rgba(62,62,70,0.5)"
                                        keyboardType="decimal-pad"
                                        maxLength={5}
                                        value={productData.productDiscount}
                                        onChangeText={(text) => {
                                            store.setProductData({productDiscount: text})
                                        }}
                                    />
                                </View>


                                <Text style={[styles.textFieldTitle, { marginTop: metrics.dimen_30 }]}>{`${strings('Commission')} (%)`}</Text>
                                <View style={styles.campaignViewStyle}>
                                    <TextInput style={[styles.inputTextFieldStyle, { width: '100%', height: metrics.dimen_46, backgroundColor: colors.clear, paddingLeft: metrics.dimen_10 }]}
                                        placeholder={strings('Discount_Example')}
                                        placeholderTextColor="rgba(62,62,70,0.5)"
                                        keyboardType="decimal-pad"
                                        maxLength={5}
                                        value={productData.productCommission}
                                        onChangeText={(text) => {
                                            store.setProductData({productCommission: text})

                                        }}
                                    />
                                </View>
                                {this.state.isSubmit && store.productData.productCommission.length === 0 &&
                                    <Text style={styles.errorTextStyle}>{strings('Enter_Product_Commission')}</Text>}


                                <Text style={[styles.textFieldTitle, { marginTop: metrics.dimen_30 }]}>{strings('How_many_Stocks')}</Text>
                                <View style={styles.campaignViewStyle}>
                                    <TextInput style={[styles.inputTextFieldStyle, { width: '100%', height: metrics.dimen_46, backgroundColor: colors.clear, paddingLeft: metrics.dimen_10 }]}
                                        placeholder={strings('How_many_Stocks')}
                                        placeholderTextColor="rgba(62,62,70,0.5)"
                                        value={productData.stockCount}
                                        keyboardType="number-pad"
                                        maxLength={5}
                                        onChangeText={(text) => {
                                            store.setProductData({stockCount: text})
                                        }}
                                    />
                                </View>
                                {this.state.isSubmit && store.productData.stockCount.length  === 0 &&
                                    <Text style={styles.errorTextStyle}>{strings('Enter_Product_Stock')}</Text>}


                                <Text style={styles.textFieldTitle}>{strings('Images')}</Text>
                                <FlatList
                                    style={{ marginBottom: metrics.dimen_20, marginLeft: metrics.dimen_14 }}
                                    numColumns={3}
                                    keyboardShouldPersistTaps={'handled'}
                                    data={this.state.gallery}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => this.renderGallery(item)}
                                />

                            </View>

                        </View>
                    </TouchableWithoutFeedback>

                </KeyboardAwareScrollView>
                <Button
                    style={[styles.buttonSubmit]}
                    labelStyle={{ ...commonStyles.LatoBold_14, color: 'white' }}
                    onPress={() => this.onSubmit()
                    }

                >
                    {strings('Submit')}
                </Button>
                {productAdded  && this.showSuccessPopup()}

            </SafeAreaView>
        );
    }
    removeCountru(item,index) {
        console.log("product country:", this.state.productCountries)
        var array = [...this.state.productCountries]; // make a separate copy of the array
        if (index !== -1) {
          array.splice(index, 1);
          this.setState({productCountries: array});
        }
      }
    renderGallery = (item) => {
        return (
            <TouchableOpacity style={{ marginLeft: metrics.dimen_10, }}
                onPress={() => this.showImagePickerMultipleImages()}>
                <View style={{ ...commonStyles.squareCellStyle, marginRight: 0, marginTop: 10 }}>
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
    showImagePickerMultipleImages = () => {
        Keyboard.dismiss()
         const store = this.props.ProductStore

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


        }).catch(error => {

            store.setLoading(false)
        })
    }
    showSuccessPopup =() => {

        setTimeout(() => {
          Alert.alert(
              strings('Product_Added'),
              strings('Post_Success_Message_products'),
              [
                  {text: strings('Okay'), onPress: () => 
                  // this.props.navigation.reset({
                  //   index: 0,
                  //   routes: [{name: 'MyCompaign'}],
                  // })
                  {
                    this.props.ProductStore.resetProduct()
                    this.props.navigation.goBack()
                  }
              
                }
              ],
              { cancelable: false }
            );
        }, 500);
    }
    selectDeselectCategories = (item, index) =>{
        const store = this.props.ProductStore
        const indexOfItem = store.categoriesArray.findIndex(obj => obj.categoryName === item.categoryName);
        console.log("indexOfItem:",index)
        var catsList = JSON.stringify(store.productData.productCategories);
        catsList = JSON.parse(catsList)
        console.log('catsList:',catsList)
        catsList[index].isSelected=false
        const selectedCats = catsList.filter(itemCat => {
            return itemCat.isSelected
        })
         console.log('selectedCats:',selectedCats)
        store.setSelectedCatgoriesList(selectedCats)
       // store.setSelectDeselectCatgories(index)      
      }
      uploadAndShowImage = (item,index, imagesArr) =>{
        const store = this.props.ProductStore
        
        store.setLoading(true)
      
                const param = {base64ImageData:item.data, folderPath: 'campaigns',bucketName:Config.BUCKET}
      
                uploadImage(param).then(response => {
                
                  console.log('uploadImage response:',response)
                  let photos = this.state.gallery
                      let imagePicked = { name: item.path, value: response.data.path }
                      //photos.push(imagePicked)
                      photos.splice(1, 0, imagePicked)
                      this.setState({ gallery: photos })
                      if (index === imagesArr.length - 1)
                      {
                        store.setLoading(false)
                      }
      
                
              }).catch(error => {
                
                  console.log("uploadImage data response =", error)
              })
                                    
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
               // this.setEnableDisable();
            });
          }
          else
          {
            //this.setEnableDisable()
          }
          console.log('in onRemovePhoto:',this.state.gallery)
        }
    onSubmit() {
        this.setState({isSubmit:true})
        const store = this.props.ProductStore
        
        const selectedCategories = store.productData.productCategories.filter(item => {
            return item.isSelected
        })

        const selectedPorductCountries = this.state.productCountries.map(obj => obj.cca2)

        store.setProductData({ productCountry: selectedPorductCountries })
        //console.log("selectedPorductCountries:",selectedPorductCountries)


            let productGallery = []
            this.state.gallery.map(item => {

                if (item.name !== 'empty') {
                   // productGallery.splice(0, 0, item.value)
                    return productGallery.push(item.value)


                }
            })
            if(store.productTitle !== "" && store.productDescription !== ""
                && store.productAmount !== "" && store.productCommission !== ""
                && store.stockCount !== "" && selectedCategories.length>0
                && productGallery.length>0)
                {
                    store.setProductData({ productGallery })
                    store.addProduct()
                }
           
           // this.props.navigation.navigate('CampaignPreview')
    }
}
export default inject("ProductStore", "AuthStore")(observer(AddProduct))

