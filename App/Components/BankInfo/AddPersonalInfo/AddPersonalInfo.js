import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    SafeAreaView,
    TouchableWithoutFeedback,
    Keyboard,
    TextInput,
    Modal
} from 'react-native';
import styles from './styles'
import images from '../../../Themes/Images';
import { strings } from '../../../Locales/i18';
import { commonStyles } from '../../../SupportingFIles/Constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import colors from '../../../Themes/Colors';
import { observer, inject } from 'mobx-react';
import { Button } from 'react-native-paper';
import Loader from '../../../SupportingFIles/Loader';
import moment from 'moment';
import stripe from 'tipsi-stripe'
import { showAlert, showFlashBanner } from '../../../SupportingFIles/Utills';
import metrics from '../../../Themes/Metrics';
import CountryPicker from 'react-native-country-picker-modal';
import DateTimePickerComp from '../../DateTimePickerComp';
import Moment from 'moment'

class AddPersonalInfo extends Component {
    constructor(props) {
        super(props);

        const bankData = this.props.route.params.bankData
        console.log('bankData:', bankData)


        this.state = {
            isSubmit: false,
            dob:'',
            date: '',
            month: '',
            year: '',
            country: '',
            city:'',
            addressLine1: '',
            addressLine2: '',
            postalCode: '',
            state:'',
            idNumber:'',   
            show_country_modal: false,
            showDatePicker: false,

        };
    }
    componentDidMount() {
        this.props.navigation.setOptions({
            title:  strings('Personal_Info'),
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
    updatecountry(country)
    {
        console.log(country)
      this.setState({country})
    }
   
      handleDatePicked = date => {
          console.log('date:',date)
          console.log('age: ' + this.getAge(date));
          if(this.getAge(date)<13)
          {
            showFlashBanner("","User must be atleast 13 years old to add bank details.")
          }
          else
          {
              this.setState({
                  date: Moment(date).format('DD'),
                  month: Moment(date).format('MM'),
                  year: Moment(date).format('YYYY'),
                  dob: Moment(date).format('DD/MM/YYYY'),
                  showDatePicker: false
              })
          }

         
              
        //this.props.CreateCampaignStore.setCampaignData({storyDate: Moment(date).format('DD/MM/YYYY'), endStoryPostDate: Moment(date).format('YYYY-MM-DD')})
      };
        getAge = (dateString)=>{
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
      hideDateTimePicker = () => {
        this.setState({ showDatePicker: false })
      };
    render() {
        const store = this.props.SettingsStore

        return (
            <SafeAreaView style={styles.mainContainer}>
                <Loader loading={store.isLoading} />
                <DateTimePickerComp
                isDateTimePickerVisible={this.state.showDatePicker}
                maximumDate={new Date()}
                handleDatePicked={this.handleDatePicked}
                hideDateTimePicker={this.hideDateTimePicker}
                onCancel={() => this.setState({ showDatePicker: false })}
                mode="date" 
            />
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
                <KeyboardAwareScrollView >
                    <TouchableWithoutFeedback
                        onPress={Keyboard.dismiss}
                        accessible={false}>
                        <View style={styles.viewForm}>

                            {/* DOB */}
                            {/* <Text style={[styles.textFieldTitle, { marginTop: 0 }]}>{strings('DOB')}
                            <Text style={{ color: colors.app_RedColor }}> *</Text>
                            </Text>
                            
                            <View style={{flexDirection:'row'}}>
                            <View style={[styles.campaignViewStyle,styles.dobSytle]}>
                                <TextInput style={[styles.inputTextFieldStyle,{textAlign:"center"}]}
                                    placeholder={strings('Day')}
                                    keyboardType='number-pad'
                                    maxLength={2}
                                    placeholderTextColor={colors.bankInfoTextPlacholder}
                                    value={this.state.date}
                                    onChangeText={(text) => {
                                        this.setState({ date: text })
                                    }}
                                />
                             

                            </View>
                            <View style={[styles.campaignViewStyle,styles.dobSytle]}>
                                <TextInput style={[styles.inputTextFieldStyle,{textAlign:"center"}]}
                                    placeholder={strings('Month')}
                                    keyboardType='number-pad'
                                    maxLength={2}
                                    placeholderTextColor={colors.bankInfoTextPlacholder}
                                    value={this.state.month}
                                    onChangeText={(text) => {
                                        this.setState({ month: text })
                                    }}
                                />

                            </View>
                            <View style={[styles.campaignViewStyle,styles.dobSytle]}>
                                <TextInput style={[styles.inputTextFieldStyle,{textAlign:"center"}]}
                                    placeholder={strings('Year')}
                                    keyboardType='number-pad'
                                    maxLength={4}
                                    placeholderTextColor={colors.bankInfoTextPlacholder}
                                    value={this.state.year}
                                    onChangeText={(text) => {
                                        this.setState({ year: text })
                                      
                                    }}
                                />
                            </View>
                            
                            </View>
                            {this.state.isSubmit && (this.state.date === '' || this.state.month === '' || this.state.year.length < 4) &&
                                    <Text style={styles.errorTextStyle}>{strings('DOB_Error')}</Text>} */}


                                <Text style={styles.textNotice}>{strings('Error_Add_Bank')}</Text>


                             {/* DOB */}
                             <Text style={[styles.textFieldTitle, {marginTop:0}]}>{strings('DOB')}
                            <Text style={{ color: colors.app_RedColor }}> *</Text>
                            </Text>
                            <TouchableOpacity style={styles.campaignViewStyle} onPress={()=>this.setState({showDatePicker:true})}>
                                <TextInput style={[styles.inputTextFieldStyle,{width:"90%"}]}
                                    placeholder={strings('DOB')}
                                    editable={false}
                                    //value={campainData.campaignTitle}
                                    pointerEvents="none"
                                    maxLength={30}
                                    placeholderTextColor="rgba(62,62,70,1.0)"
                                    value={this.state.dob}
                                  //  onFocus={() => this.setState({show_country_modal:true})}
                                    // onChangeText={(text) => {
                                    //     this.setState({ country: text })
                                    // }}
                                />
                                 <Image style={styles.imageCalendar}
                source={images.CalendarIcon}
                resizeMode="contain"
                ></Image>
                            </TouchableOpacity>
                            {this.state.isSubmit && (this.state.dob === '') &&
                                    <Text style={styles.errorTextStyle}>{strings('DOB_Error')}</Text>}     

                            {/* Country */}
                            <Text style={styles.textFieldTitle}>{strings('Country')}
                            <Text style={{ color: colors.app_RedColor }}> *</Text>
                            </Text>
                            <TouchableOpacity style={styles.campaignViewStyle} onPress={()=>this.setState({show_country_modal:true})}>
                                <TextInput style={[styles.inputTextFieldStyle,{width:"90%"}]}
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

 {/* State */}
 <Text style={styles.textFieldTitle}>{strings('State')} 
                            <Text style={{ color: colors.app_RedColor }}> *</Text>
                            </Text>
                            <View style={styles.campaignViewStyle}>
                                <TextInput style={styles.inputTextFieldStyle}
                                    placeholder={strings('State')}
                                    placeholderTextColor={colors.bankInfoTextPlacholder}
                                    value={this.state.state}
                                    onChangeText={(text) => {
                                        this.setState({ state: text })
                                    }}
                                />
                               
                            </View>
                            {this.state.isSubmit && this.state.state === '' &&
                                    <Text style={styles.errorTextStyle}>{strings('State_error')}</Text>}


                            {/* City */}
                            <Text style={styles.textFieldTitle}>{strings('City')}
                            <Text style={{ color: colors.app_RedColor }}> *</Text>
                            </Text>
                            <View style={styles.campaignViewStyle}>
                                <TextInput style={styles.inputTextFieldStyle}
                                    placeholder={strings('City')}
                                    maxLength={20}
                                    placeholderTextColor={colors.bankInfoTextPlacholder}
                                    value={this.state.city}
                                    onChangeText={(text) => {
                                        this.setState({ city: text })
                                    }}
                                />
                            </View>
                            {this.state.isSubmit && this.state.city === '' &&
                                    <Text style={styles.errorTextStyle}>{strings('City_error')}</Text>}

                            {/* Address Line 1 */}
                            <Text style={styles.textFieldTitle}>{strings('Address1')}
                            <Text style={{ color: colors.app_RedColor }}> *</Text>
                            </Text>
                            <View style={styles.campaignViewStyle}>
                                <TextInput style={styles.inputTextFieldStyle}
                                    placeholder={strings('Address1')}
                                    placeholderTextColor={colors.bankInfoTextPlacholder}
                                    value={this.state.addressLine1}
                                    onChangeText={(text) => {
                                        this.setState({ addressLine1: text })
                                    }}
                                />
                            </View>
                            {this.state.isSubmit && this.state.addressLine1 === '' &&
                                    <Text style={styles.errorTextStyle}>{strings('Address_Line_2')}</Text>}
                                    
                            {/* Address Line 2 */}
                            <Text style={styles.textFieldTitle}>{strings('Address2')}
                            <Text style={{ color: colors.app_RedColor }}> *</Text></Text>
                            <View style={styles.campaignViewStyle}>
                                <TextInput style={styles.inputTextFieldStyle}
                                    placeholder={strings('Address2')}
                                    placeholderTextColor={colors.bankInfoTextPlacholder}
                                    value={this.state.addressLine2}
                                    onChangeText={(text) => {
                                        this.setState({ addressLine2: text })
                                    }}
                                />
                            </View>
                            {this.state.isSubmit && this.state.addressLine2 === '' &&
                                    <Text style={styles.errorTextStyle}>{strings('Address_Line_2')}</Text>}

                            {/* Postal Number */}
                            <Text style={styles.textFieldTitle}>{strings('Postal')}
                            <Text style={{ color: colors.app_RedColor }}> *</Text>
                            </Text>
                            <View style={styles.campaignViewStyle}>
                                <TextInput style={styles.inputTextFieldStyle}
                                    //keyboardType="number-pad"
                                    placeholder={strings('Postal')}
                                    placeholderTextColor={colors.bankInfoTextPlacholder}
                                    value={this.state.postalCode}
                                    onChangeText={(text) => {
                                        this.setState({ postalCode: text })
                                    }}
                                />
                            </View>
                            {this.state.isSubmit && this.state.postalCode === '' &&
                                    <Text style={styles.errorTextStyle}>{strings('Postal_error')}</Text>}

                             {/* ID Number */}
                             <Text style={styles.textFieldTitle}>{strings('Id_Number')} 
                            <Text style={{ color: colors.app_RedColor }}> *</Text>
                            </Text>
                            <View style={styles.campaignViewStyle}>
                                <TextInput style={styles.inputTextFieldStyle}
                                    placeholder={strings('Id_Number')}
                                    placeholderTextColor={colors.bankInfoTextPlacholder}
                                    value={this.state.idNumber}
                                    onChangeText={(text) => {
                                        this.setState({ idNumber: text })
                                    }}
                                />
                                
                            </View>
                            {this.state.isSubmit && this.state.idNumber === '' &&
                                    <Text style={styles.errorTextStyle}>{strings('Id_number_error')}</Text>}
                        </View>

                    </TouchableWithoutFeedback>
                    <Button
                        style={[styles.buttonSubmit,
                        { backgroundColor: colors.app_Blue }]}
                        labelStyle={{ ...commonStyles.LatoBold_14, color: 'white' }}
                        onPress={() => this.onAddBankAccount()
                        }
                    >
                        {strings('Next')}
                    </Button>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        );
    }
    onAddBankAccount = async() => {
        const store = this.props.SettingsStore
        store.setNavigation(this.props.navigation)
        this.setState({ isSubmit: true })
        const { dob ,date, month, year, country, city, postalCode, addressLine2, addressLine1, idNumber, state  } = this.state
        if (dob !== '' && date !== '' && month !== '' && year !== '' && country !== '' && city !== '' &&
        postalCode !== '' && addressLine2 !== '' && addressLine1 !== '' && idNumber !== '' && state !== '') {
            const params = {
                date: date,
                month: month,
                year: year,
                country: country,
                city: city,
                postalCode: postalCode,
                addressLine2: addressLine2,
                addressLine1: addressLine1,
                idNumber: idNumber,
                state: state,

            }
           // console.log('country:',country)
        //    if(country.name === "Singapore")
           // {
                this.props.navigation.navigate('AddBankDetails', {
                    personalInfo: params,
                    bankData: null
                  })
            // }
            // else
            // {
            //     showFlashBanner(strings('Error_Add_Bank'))
            // }
            
        }
    }
}
export default inject('SettingsStore', 'AuthStore', "CompaignsStore")(observer(AddPersonalInfo))

