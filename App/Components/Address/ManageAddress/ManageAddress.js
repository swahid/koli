import React, { Component } from 'react';
import { View, Text, TouchableOpacity,SafeAreaView, TextInput, Image, Alert } from 'react-native';
import styles from './Styles'
import { inject, observer } from 'mobx-react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import HeaderBackComponent from '../../CommonComponents/HeaderBackComponent'
import FormTextField from '../../CommonComponents/FormTextField'
import CountryPicker from 'react-native-country-picker-modal';
import { strings } from '../../../Locales/i18';
import colors from '../../../Themes/Colors';
import images from '../../../Themes/Images';
import { commonStyles } from '../../../SupportingFIles/Constants';
import Loader from '../../../SupportingFIles/Loader';
import metrics from '../../../Themes/Metrics';

class ManageAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
        isSubmit:false,
        firstName:'',
        show_country_modal: false,
        fullName: '',
        buildingName: '',
        area: "",
        state: "",
        city: "",
        pincode: 0,
        isDefault: 0,
        country: "",
        phone: 0,
    };
  }
  componentDidMount() {
    this.props.navigation.setOptions({
        headerLeft: () => (
            <HeaderBackComponent navigation={this.props.navigation}/>
        ),
    }
    )
}
updatecountry(country)
{
    console.log(country)
    this.props.AddressStore.setAddressData({country:country.name})
  this.setState({country})
}
  render() {
    const store = this.props.AddressStore
    const { isLoading, addressData, addressAdded } = this.props.AddressStore

    return (
        <SafeAreaView style={{backgroundColor:'white', flex:1}}>
                <Loader loading={isLoading} />

      {/* <DismissKeyboard > */}
        <View style={styles.contentView}>
        <KeyboardAwareScrollView >
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
                    onSelect={selectedCountry => {this.updatecountry(selectedCountry)
                      
                    }}
              />}
       <FormTextField title={strings('Full_Name')}
       styleTitle={{marginTop:10}}
       placeholder={strings('Full_Name')}
       onChange={(text)=>store.setAddressData({fullName:text})}
        isSubmit={this.state.isSubmit}
         fieldData={addressData.fullName} 
         errorText={strings('Error_Full_Name')}/>

          <FormTextField title={strings('Phone_Number')}
       placeholder={strings('Phone_Number')}
       onChange={(text)=>store.setAddressData({phone:text})}
        isSubmit={this.state.isSubmit}
         fieldData={addressData.phone} 
         fieldKeyboardType={'phone-pad'}
         
         errorText={strings('Enter_Phone_Number')}/>

         <FormTextField title={strings('House_No')}
       placeholder={strings('House_No')}
       onChange={(text)=>store.setAddressData({buildingName:text})}
        isSubmit={this.state.isSubmit}
         fieldData={addressData.buildingName} 
         errorText={strings('Enter_House_No')}/>

<FormTextField title={strings('Road_colony')}
       placeholder={strings('Road_colony')}
       onChange={(text)=>store.setAddressData({area:text})}
        isSubmit={this.state.isSubmit}
         fieldData={addressData.area} 
         errorText={strings('Enter_Road_colony')}/>



 {/* Country */}
 <Text style={styles.textFieldTitle}>{strings('Country')}
                            <Text style={{ color: colors.app_RedColor }}> *</Text>
                            </Text>
                            <TouchableOpacity style={styles.campaignViewStyle} onPress={()=>this.setState({show_country_modal:true})}>
                                <TextInput style={[styles.inputTextFieldStyle,{width:"80%"}]}
                                    placeholder={strings('Country')}
                                    editable={false}
                                    //value={campainData.campaignTitle}
                                    pointerEvents="none"
                                    maxLength={30}
                                    placeholderTextColor="rgba(62,62,70,1.0)"
                                    value={this.state.country.name}
                                  //  onFocus={() => this.setState({show_country_modal:true})}
                                    // onChangeText={(text) => {
                                    //     this.setState({ country: text })
                                    // }}
                                />
                                 <Image style={styles.imageArrow}
                source={images.rightArrowIcon}
                resizeMode="contain"
                ></Image>
                            </TouchableOpacity>
                            {this.state.isSubmit && this.state.country === '' &&
                                    <Text style={styles.errorTextStyle}>{strings('Country_error')}</Text>}

<FormTextField title={strings('State')}
       placeholder={strings('State')}
       onChange={(text)=>store.setAddressData({state:text})}
        isSubmit={this.state.isSubmit}
         fieldData={addressData.state} 
         errorText={strings('State_error')}/>

<FormTextField title={strings('City')}
       placeholder={strings('City')}
       onChange={(text)=>store.setAddressData({city:text})}
        isSubmit={this.state.isSubmit}
         fieldData={addressData.city} 
         errorText={strings('City_error')}/>



<FormTextField title={strings('Pincode')}
       placeholder={strings('Pincode')}
       onChange={(text)=>store.setAddressData({pincode:text})}
        isSubmit={this.state.isSubmit}
         fieldData={addressData.pincode} 
         errorText={strings('Pincode_error')}/>

         <TouchableOpacity style={{marginTop: metrics.dimen_22, flexDirection: 'row', }}
          onPress={()=>store.setAddressData({isDefault:store.addressData.isDefault === 0 ? 1 : 0})}>
           <View style={{borderRadius:3, borderColor: '#E3E3E3', height: 18, width: 18, borderWidth: 1,marginLeft:  metrics.dimen_27, alignItems:'center', justifyContent:'center'}}>
           {store.addressData.isDefault === 1 ? <Image style={{width:12, height:12}}
 source={images.tick}
 resizeMode="contain"
 ></Image>: null}
             
           </View>
           <Text style={{  
        fontFamily: metrics.Lato_SemiBold,
        fontSize: metrics.getFontSize(14),
        color: colors.bankInfoListValue,
        marginHorizontal: metrics.dimen_8}}>Set as default address</Text>

         </TouchableOpacity>
                </KeyboardAwareScrollView >

                 </View>
                 
      {/* </DismissKeyboard> */}
      <TouchableOpacity style={{...styles.bottomViewStyle}}
      onPress={() => this.onSubmit()}>

<Text style = {[commonStyles.LatoBold_16, styles.submitButton]}>
          {strings('Save_Address')}</Text>
      </TouchableOpacity>
      {addressAdded  && this.showSuccessPopup()}

                      </SafeAreaView>

    );
  }
  onSubmit() {
    const store = this.props.AddressStore
    if(this.state.isSubmit 
      && store.fullName !== "" 
    && store.buildingName !== ""
    && store.area !== ""
    && store.state !== ""
    && store.city !== ""
    && store.pincode !== 0
    && store.country !== ""
    && store.phone !== 0
    ) 
    {
        store.addAddress()

    }
    else
    {
        this.setState({isSubmit:true})

    }
    
        // if(store.productTitle !== "" && store.productDescription !== ""
        //     && store.productAmount !== "" && store.productCommission !== ""
        //     && store.stockCount !== "" && selectedCategories.length>0
        //     && productGallery.length>0)
        //     {
        //         store.setProductData({ productGallery })
        //         store.addProduct()
        //     }
       
       // this.props.navigation.navigate('CampaignPreview')
}
showSuccessPopup = () => {

  setTimeout(() => {
    Alert.alert(
        '',
        strings('Post_Success_Message_address'),
        [
            {text: strings('Okay'), onPress: () => 
            // this.props.navigation.reset({
            //   index: 0,
            //   routes: [{name: 'MyCompaign'}],
            // })
            {
              this.props.AddressStore.resetAddress()
              this.props.navigation.goBack()
            }
        
          }
        ],
        { cancelable: false }
      );
  }, 500);
}
}
export default inject("AddressStore", "AuthStore")(observer(ManageAddress))

