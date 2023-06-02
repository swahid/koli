import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Platform, SafeAreaView, ScrollView} from 'react-native';
import { observer, inject } from 'mobx-react';
import metrics from '../../../Themes/Metrics';
import images from '../../../Themes/Images';
import colors from '../../../Themes/Colors';
import { strings } from '../../../Locales/i18';
import Loader from '../../../SupportingFIles/Loader';
import { commonStyles } from '../../../SupportingFIles/Constants'
import RangeSlider from 'rn-range-slider';
import { NumberformatesunitUptoOneDecimal } from '../../../SupportingFIles/Utills';
import CountryPicker from 'react-native-country-picker-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

class CampaignFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Pricelow: 0,
      Pricehigh: 10000,
      show_country_modal: false,
      ageArray: [
        { minAge: 0, maxAge: 0, isSelected: false },
        { minAge: 0, maxAge: 12, isSelected: false },
        { minAge: 13, maxAge: 17, isSelected: false },
        { minAge: 18, maxAge: 24, isSelected: false },
        { minAge: 25, maxAge: 34, isSelected: false },
        { minAge: 35, maxAge: 44, isSelected: false },
        { minAge: 45, maxAge: 100, isSelected: false },
      ],

      CategoetArray: [],
      
      
      campaigntype: [
        { catName: "Any", isSelected: false },
        { catName: "Paid Campaign", isSelected: false },
        { catName: "Commission Based", isSelected: false },
        { catName: "Events Appearance", isSelected: false },
        { catName: "Photo / Video Shoot", isSelected: false },
        { catName: "Sponsored", isSelected: false },
        { catName: "Shoutout Exchange", isSelected: false },
      
      ],

    }

  }

  componentDidMount() {
   // console.log("this.props.CompaignsStore.maxAge",this.props.CompaignsStore.maxAge)
   if(this.props.CompaignsStore.CategoryData.length<=0)
   {
    this.props.CompaignsStore.getCatgoriesList()
   }
    this.props.navigation.addListener('focus', () => {
    });
   
    const ageIndex = this.state.ageArray.findIndex(x => x.maxAge === this.props.CompaignsStore.maxAge)
    if (ageIndex !== -1) {
      this.selectAgeGender(ageIndex, 'age')
    }

    const categoryArray = this.props.CompaignsStore.CategoryData.findIndex(x => x.categoryName === this.props.CompaignsStore.categoryfilter)
    if (categoryArray !== -1) {
      this.selectCategory(categoryArray)
    }

    console.warn("this.props.CompaignsStore.campaigntype",this.props.CompaignsStore.campaigntype)
    const campaigntypeArray = this.state.campaigntype.findIndex(x => x.catName === this.props.CompaignsStore.campaigntype)
    if (campaigntypeArray !== -1) {
      this.selectcampaigntype(campaigntypeArray)
    }
    this.props.CompaignsStore.setLoading(false)
  }

  resetFields() {
    this.props.CompaignsStore.setcountry('All')
    this.props.CompaignsStore.setgender('') 
    this.props.CompaignsStore.setpricerangemin(0)
    this.props.CompaignsStore.setpricerangemax(0)
    this.props.CompaignsStore.setFilterApply(false)
    this.props.CompaignsStore.setCompaigns([])
    this.props.CompaignsStore.getCampaigns()
    this.props.CompaignsStore.getCatgoriesList()
    this.props.CompaignsStore.setcategoryfilter()
    const ageIndex = this.state.ageArray.findIndex(x => x.maxAge === this.props.CompaignsStore.maxAge)
    console.log("ageIndex",ageIndex)

    if (ageIndex !== -1) {
      this.resetAgeGender(ageIndex, 'age')
    }

    
    // const categoryArray = this.state.CategoetArray.findIndex(x => x.catName === "clear")
    // console.log("categoryArray",categoryArray)
    // if (categoryArray !== -1) {
    //   this.selectCategory(categoryArray)
    // }
    this.selectAllSocialtype()
    this.resetCampaigntyptype()
  }


  selectAllSocialtype(){
    for(let index = 0; index < this.state.CategoetArray.length; index++){
      var arrNew = this.state.CategoetArray
    var newItem = arrNew[index]  
    newItem.isSelected = false
    arrNew[index] = newItem;
    this.setState({
      CategoetArray: arrNew,
    })
    this.props.CompaignsStore.setcategoryfilter("")


  
  }
}

resetCampaigntyptype(){
  for(let index = 0; index < this.state.campaigntype.length; index++){
    var arrNew = this.state.campaigntype
  var newItem = arrNew[index]  
  newItem.isSelected = false
  arrNew[index] = newItem;
  this.setState({
    CategoetArray: arrNew,
  })
  this.props.CompaignsStore.setcampaigntype("")



}
}
  render() {


    const { country, gender, isLoading, pricerangemin, pricerangemax, campaigntype,minAge,maxAge,CategoryData } = this.props.CompaignsStore

console.log("CategoryData==",CategoryData)

    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <Loader loading={isLoading} />
        
        <SafeAreaView>
          <TouchableOpacity style={styles.backContainer}
            onPress={() => this.props.navigation.goBack()}
          >
            <Image source={images.FilterCross} />
          </TouchableOpacity>
        </SafeAreaView>

        <View style={{ flex: 1 }}>
          <ScrollView scrollEnabled={true}   showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
           >
            <View style={styles.topfilterContainer}>
              <TouchableOpacity style={{ ...commonStyles.campaignViewfilter, }} >

                <Text style={{ ...commonStyles.LatoBold_22, color: colors.app_black, textTransform: 'capitalize' }}>{strings('Filters')}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{ ...commonStyles.campaignViewfilter, }} onPress={() => this.resetFields()}>

                <Text style={{ ...commonStyles.LatoBold_16, color: colors.app_Blue, }}>{strings('Reset')}</Text>
              </TouchableOpacity>
            </View>


            
              {/* <Text style={{ ...commonStyles.LatoBold_14, color: 'rgba(112, 129, 138, 1)', marginTop: metrics.dimen_20, paddingHorizontal: metrics.dimen_20, }}>{strings('By_Location')}</Text> */}
  
  
              <View style={styles.countrycity}>
                <Text style={{ ...commonStyles.LatoBold_16, color: 'rgba(114, 114, 114, 1)' }}>{strings('Country')}</Text>
  
  
  
                <View style={{ marginTop: -metrics.dimen_15, marginRight: metrics.dimen_5 }}>
  
                  {this.state.show_country_modal && <CountryPicker
                    containerButtonStyle={{ height: 0 }}
                    visible={this.state.show_country_modal}
                    onClose={() => this.setState({ show_country_modal: false })}
                    withEmoji={true}
                    withFlag={true}
                    withFilter={true}
                    withAlphaFilter={true}
                    withCallingCode={false}
                    translation={'en'}
                    filterProps={{
                      filterable: false,
                      placeholder: strings('search_country')
                    }}
                    onSelect={countryvalue => {
                      this.props.CompaignsStore.setcountry(countryvalue.name)
                    }}
                  />}
                  <View>
                    <TouchableOpacity style={{ ...commonStyles.campaignViewfilter, }} onPress={() => this.setState({ show_country_modal: true })}>
                      <Text style={{ ...commonStyles.LatoBold_16, color: colors.app_Blue, marginRight: 5 }}>{country === 'All' ? strings('Any') : country}</Text>
                      <Image style={{ position: "absolute", right: -15, tintColor: colors.app_Blue }} source={images.DropdownIcon} />
                    </TouchableOpacity>
  
                     
                    
                  </View>
                </View>
  
              </View>
            


            <View style={styles.seprater}></View>


            <View style={{ paddingHorizontal: metrics.dimen_20 }}>
              <Text style={{ ...commonStyles.LatoBold_14, color: 'rgba(112, 129, 138, 1)', marginTop: metrics.dimen_5, }}>{strings('By_priceUsd')}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center', marginTop: metrics.dimen_15 ,}} >
                <TextInput style={{ textAlign: 'left', width: '50%', backgroundColor: colors.clear, ...commonStyles.LatoRegular_Normal }}
                  placeholder={'$' + this.state.Pricelow}
                  placeholderTextColor={colors.app_gray}
                  value={"$ "+NumberformatesunitUptoOneDecimal(this.state.Pricelow)}

                />

                <View style={{width: '50%',flexDirection:'column'}}>
                <Text style={{ textAlign: 'right',  backgroundColor: colors.clear, paddingLeft: metrics.dimen_10, ...commonStyles.LatoBold_16, }}
                  placeholderTextColor={colors.app_gray}> {"Max"}</Text>
                

                
                <Text style={{ textAlign: 'right',  backgroundColor: colors.clear, paddingLeft: metrics.dimen_10, ...commonStyles.LatoRegular_Normal,marginTop:metrics.dimen_2}}
                  placeholderTextColor={colors.app_gray}
                >{"$ "+NumberformatesunitUptoOneDecimal(this.state.Pricehigh)}</Text>
                </View>
               
              </View>
              <View style={{ marginTop: -metrics.dimen_8,marginBottom:metrics.dimen_5 }}>
                <RangeSlider
                  style={{ width: '100%', height: metrics.dimen_50 }}
                  gravity={'center'}
                  min={0}
                  max={10000}
                  step={100}
                  labelStyle={'none'}                 
                  thumbBorderColor={colors.app_Blue}
                  blankColor={colors.disable_gray_color}
                  selectionColor={colors.app_Blue}
                  onValueChanged={(low, high, fromUser) => {
                    this.setState({ Pricelow: low, Pricehigh: high })
                  }} />
              </View>



            </View>


            <View style={[styles.seprater, { marginTop: metrics.dimen_5 }]}></View>

            <View>
              <Text style={{  ...commonStyles.LatoBold_16, color: 'rgba(112, 129, 138, 1)', marginTop: metrics.dimen_2,paddingHorizontal: metrics.dimen_20, }}>{strings('Category')}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: metrics.dimen_10, paddingHorizontal: metrics.dimen_20, }}>
              {this.props.CompaignsStore.CategoryData.map((item, index) => {
               var  categorylabel=item.categoryName
                return (
                  <TouchableOpacity style={[styles.itemAgeGender, item.isSelected && styles.selectedItemAgeGender]}
                    onPress={() => this.selectCategory(index)}>
                    <Text style={[styles.textItemAgeGender, item.isSelected && styles.textSelectedItemAgeGender,{textTransform:'capitalize'}]}>
                      {categorylabel}</Text>
                  </TouchableOpacity>
                )
              }
              )}
           </View>

            </View>
            <View style={[styles.seprater, { marginTop: metrics.dimen_5 }]}></View>



            <View>
              <Text style={{ ...commonStyles.LatoBold_16, color: 'rgba(112, 129, 138, 1)', marginTop: metrics.dimen_2, marginBottom: metrics.dimen_10, paddingHorizontal: metrics.dimen_20, }}>{strings('Gender')}</Text>

              <View style={{ marginTop: metrics.dimen_8, flexDirection: 'row', paddingHorizontal: metrics.dimen_20 }}>
              <TouchableOpacity style={{
                  ...commonStyles.AppButtonStyle,
                  height: metrics.dimen_40,
                  paddingHorizontal: metrics.dimen_15,
                  marginRight: metrics.dimen_15,
                  backgroundColor: gender === 'Any' ? colors.app_Blue : colors.disable_gray_color,
                  shadowColor: gender === 'Any' ? colors.app_Blue : colors.app_light_gray,
                  borderColor: gender === 'Any' ? colors.app_Blue : colors.disable_gray_color
                }}
                  onPress={() => this.onGenderClick('Any')}
                >
                  <Text style={{ ...commonStyles.LatoSemiBold_Normal, color: gender == "Any" ? 'white' : colors.app_black }}>{strings('Any')}</Text>
                </TouchableOpacity>
               
                <TouchableOpacity style={{

                  ...commonStyles.AppButtonStyle,
                  height: metrics.dimen_40,
                  paddingHorizontal: metrics.dimen_15,
                  marginRight: metrics.dimen_15,
                  backgroundColor: gender === 'male' ? colors.app_Blue : colors.disable_gray_color,
                  shadowColor: gender === 'male' ? colors.app_Blue : colors.app_light_gray,
                  borderColor: gender === 'male' ? colors.app_Blue : colors.disable_gray_color
                }}
                  onPress={() => this.onGenderClick('male')}
                >
                  <Text style={{ ...commonStyles.LatoSemiBold_Normal, color: gender == "male" ? 'white' : colors.app_black }}>{strings('Male')}</Text>
                </TouchableOpacity>


                <TouchableOpacity style={{
                  ...commonStyles.AppButtonStyle,
                  height: metrics.dimen_40,
                  paddingHorizontal: metrics.dimen_15,
                  marginRight: metrics.dimen_15,
                  // marginTop:metrics.dimen_15,

                  // width: metrics.dimen_70, 
                  backgroundColor: gender === 'female' ? colors.app_Blue : colors.disable_gray_color,
                  shadowColor: gender === 'female' ? colors.app_Blue : colors.app_light_gray,
                  borderColor: gender === 'female' ? colors.app_Blue : colors.disable_gray_color
                }}
                  onPress={() => this.onGenderClick('female')}
                >
                  <Text style={{ ...commonStyles.LatoSemiBold_Normal, color: gender == "female" ? 'white' : colors.app_black }}>{strings('Female')}</Text>
                </TouchableOpacity>


                <TouchableOpacity style={{
                  ...commonStyles.AppButtonStyle,
                  height: metrics.dimen_40,
                  paddingHorizontal: metrics.dimen_15,
                  marginRight: metrics.dimen_15,
                  // marginTop:metrics.dimen_15,
                  backgroundColor: gender === 'Others' ? colors.app_Blue : colors.disable_gray_color,
                  shadowColor: gender === 'Others' ? colors.app_Blue : colors.app_light_gray,
                  borderColor: gender === 'Others' ? colors.app_Blue : colors.disable_gray_color
                }}
                  onPress={() => this.onGenderClick('Others')}
                >
                  <Text style={{ ...commonStyles.LatoSemiBold_Normal, color: gender == "Others" ? 'white' : colors.app_black }}>{strings('Other')}</Text>
                </TouchableOpacity>

               
              </View>
            </View>
{/* No Longer needed as filter is in campaign category only */}
            {/*
            <View style={[styles.seprater, { marginTop: 20 }]}></View>
            
 <View>
              <Text style={{  ...commonStyles.LatoBold_16, color: 'rgba(112, 129, 138, 1)', marginTop: metrics.dimen_2, marginBottom: metrics.dimen_12, paddingHorizontal: metrics.dimen_20, }}>{strings('Campaign_Type')}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: metrics.dimen_10, paddingHorizontal: metrics.dimen_20 }}>

              {this.state.campaigntype.map((item, index) => {
              
              return (
                  <TouchableOpacity style={[styles.itemAgeGender, item.isSelected && styles.selectedItemAgeGender]}
                     onPress={() => this.selectcampaigntype(index)}
                    >
                    <Text style={[styles.textItemAgeGender, item.isSelected && styles.textSelectedItemAgeGender]}>
                      {item.catName}
                      </Text>
                  </TouchableOpacity>
                )
              }
              )}
           </View>
            </View> */}

            <View style={[styles.seprater, { marginTop: 20 }]}></View>
            

            <View>
              <Text style={{  ...commonStyles.LatoBold_16, color: 'rgba(112, 129, 138, 1)', marginTop: metrics.dimen_2, marginBottom: metrics.dimen_12, paddingHorizontal: metrics.dimen_20, }}>{strings('Influencer_Age')}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: metrics.dimen_10, paddingHorizontal: metrics.dimen_20,marginBottom:metrics.dimen_60 }}>

              {this.state.ageArray.map((item, index) => {

                const ageLabel = item.maxAge === 0 ? "Any" :
                  item.maxAge === 12 ? "Below 13" : item.maxAge === 100 ? "Above 44" : `${item.minAge}-${item.maxAge}`
                return (
                  <TouchableOpacity style={[styles.itemAgeGender, item.isSelected && styles.selectedItemAgeGender]}
                    onPress={() => this.selectAgeGender(index, 'age')}>
                    <Text style={[styles.textItemAgeGender, item.isSelected && styles.textSelectedItemAgeGender]}>
                      {ageLabel}</Text>
                  </TouchableOpacity>
                )
              }
              )}
           </View>
            </View>

            <View style={{height:metrics.dimen_50}}></View>
          </ScrollView>
          <TouchableOpacity style={{ ...styles.bottomViewStyle }}
            onPress={() => this.Apply(country, gender, pricerangemin, pricerangemax)}>

            <Text style={{ ...commonStyles.LatoBold_16, color: 'white', marginTop: Platform.OS == 'android' ? metrics.dimen_25 : metrics.dimen_18 }}>
              {strings('Apply')}</Text>
          </TouchableOpacity>
        </View>
     
     
      </View>
    );
  }

  Apply(gender) {
   
    this.props.CompaignsStore.setpricerangemin(this.state.Pricelow)
    this.props.CompaignsStore.setpricerangemax(this.state.Pricehigh)
    if (gender === '') {
      this.props.CompaignsStore.setFilterApply(true)
      //this.props.navigation.goBack()
      //this.props.CompaignsStore.getCampaigns()

    } else {
      this.props.CompaignsStore.setpricerangemin(this.state.Pricelow)
      this.props.CompaignsStore.setpricerangemax(this.state.Pricehigh)
      this.props.CompaignsStore.setFilterApply(true)
     // this.props.navigation.goBack()
     // this.props.CompaignsStore.getCampaigns()
    }
   this.setFilterAndGetData()
  }

  setFilterAndGetData = () =>{
    
    const {pricerangemin, 
      pricerangemax, 
      country, 
      maxAge, 
      minAge, 
      categoryfilter,
      gender } = this.props.CompaignsStore

    let filterValues = {
      campaignAmount: { between: [pricerangemin, pricerangemax] },
    }
    if(country !== "All")
    {
      filterValues.country=country
    }
    if(gender !== '')
    {
      filterValues.lookingInfluencerGender=gender               
    }
    if (maxAge !== "" &&
      minAge !== "" &&
      minAge !== 0 &&
      maxAge !== 0) {
        filterValues.minAge = minAge
        filterValues.maxAge = maxAge

    } else {
      if ( minAge === 0 
        && maxAge === 12) {
          filterValues.minAge = this.minAge
          filterValues.maxAge = this.maxAge
      }
     }
     if(categoryfilter !== "" && categoryfilter !== "Any" && categoryfilter !== null && categoryfilter !== undefined)
     {
      filterValues.campaignCategories=[categoryfilter]     
     }
     const campaignType = this.props.route.params.campaignType

     this.props.HomeStore.resetData()
     this.props.HomeStore.setFilterData(filterValues)
     this.props.HomeStore.getAllCampaignWithPagination(campaignType)

     this.props.navigation.goBack()

  }
 



// Gender Click
  onGenderClick = (gender) => {
    this.props.CompaignsStore.setgender(gender)
  }


  // Age Click
  selectAgeGender = (index, type) => {
    const store =  this.props.CompaignsStore
    
   var arr = [...this.state.ageArray]
   const updatedArr = arr.map((el) => {
    el.isSelected = false
    return el
  })
    updatedArr[index].isSelected = true
    if (type === 'age') {
      this.setState({
        ageArray: updatedArr
      })
      store.setmaxAge(updatedArr[index].maxAge)
      store.setminAge(updatedArr[index].minAge)

    }
  }
  

  resetAgeGender = (index, type) => {
    const store =  this.props.CompaignsStore
    
   var arr = [...this.state.ageArray]
   const updatedArr = arr.map((el) => {
    el.isSelected = false
    return el
  })
    updatedArr[index].isSelected = false
    if (type === 'age') {
      this.setState({
        ageArray: updatedArr
      })
      store.setmaxAge("")
      store.setminAge("")

    }
  }

  selectcampaigntype = (index) => {
    const store =  this.props.CompaignsStore
    
   var arr = [...this.state.campaigntype]
   const updatedArr = arr.map((el) => {
    el.isSelected = false
    return el
  })
    updatedArr[index].isSelected = true
   
      this.setState({
        campaigntype: updatedArr
      })
     
      
      store.setcampaigntype(updatedArr[index].catName)

    
  }

  //Category Click
  selectCategory = (index) => {


    this.props.CompaignsStore.setSelectDeselectCatgories(index)
  //   const store =  this.props.CompaignsStore
    
  //   let arr = [...this.props.CompaignsStore.CategoryData]

  //   const updatedArr = arr.map(el=>{
  //     el.isSelected = false
  //     return el
  // })
    
  //   updatedArr[index].isSelected = true
  //     // this.setState({
  //     //   CategoetArray: updatedArr
  //     // })

  //     this.props.CompaignsStore.setCategoryData(updatedArr)
  //     store.setcategoryfilter(updatedArr[index].categoryName)
    
  }
}



  

  


export default inject('CompaignsStore', 'HomeStore')(observer(CampaignFilter))


const styles = StyleSheet.create({
  // backgroudImage: {
  //   width: metrics.width,
  //   height: metrics.height,
  // },
  topfilterContainer: {
    paddingHorizontal: metrics.dimen_20,
    flexDirection: "row",
    justifyContent: 'space-between',
    marginTop: metrics.dimen_15

  },
  countrycity: {
    paddingHorizontal: metrics.dimen_20,
    flexDirection: "row",
    justifyContent: 'space-between',
    marginTop: metrics.dimen_15
  },
  backContainer: {
    marginLeft: metrics.dimen_15,
    marginTop: Platform.OS === 'android' ? metrics.dimen_20 : 0

  },
  seprater:
  {
    borderWidth: 1,
    marginTop: metrics.dimen_15,
    marginBottom: metrics.dimen_15,
    borderColor: colors.app_light_black

  },
  textInputStyle: {
    borderRadius: metrics.dimen_4,
    height: metrics.dimen_46,
    backgroundColor: colors.transparentBlack,
    color: 'white',
    paddingHorizontal: metrics.dimen_10,
    marginTop: metrics.dimen_20,
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_normal,
  },
  headerTextStyle: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_large,
    marginBottom: metrics.dimen_20,
    color: 'white'
  },
  buttonStyle: {
    borderRadius: metrics.dimen_4,
    width: '100%',
    height: metrics.dimen_46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginBottom: metrics.dimen_37,
    marginTop: metrics.dimen_30,
  },
  signUpTextStyle: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_normal,
    color: colors.app_black
  },
  normalText: {
    fontFamily: metrics.Lato_SemiBold,
    fontSize: metrics.text_medium,
    color: 'white'
  },
  errorTextStyle: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_normal,
    color: colors.app_RedColor,
    marginTop: metrics.dimen_5,
    marginBottom: metrics.dimen_5
  },
  bottomViewStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: metrics.dimen_72,
    backgroundColor: colors.app_Blue,
    alignItems: 'center',
  },
  bottomViewStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: metrics.dimen_72,
    backgroundColor: colors.app_Blue,
    alignItems: 'center',
  },
  itemAgeGender:{
    marginRight: metrics.dimen_9,borderRadius: metrics.widthSize(10),
    backgroundColor:'#e9ebee', 
     flexDirection:'row', 
     marginBottom:metrics.aspectRatioHeight(30),
  },
  selectedItemAgeGender:{
    backgroundColor:colors.app_Blue, 
    shadowColor: '#1658D3',
    shadowOffset: { width: 0, height: metrics.widthSize(10)},
    shadowOpacity: 0.4,
    shadowRadius: metrics.widthSize(10),
    elevation: 1,
  },
  textItemAgeGender:{
    marginVertical:metrics.widthSize(39), 
    marginHorizontal:metrics.widthSize(50), 
    color: '#3E3E46'
  },
  textSelectedItemAgeGender:{
    color: colors.white
  },
 
})