import React, { Component } from 'react';
import { View, 
    Text, 
    StyleSheet, 
    FlatList, 
    TouchableOpacity, Image, Platform, RefreshControl, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { inject, observer } from 'mobx-react';
import metrics from '../../../Themes/Metrics';
import colors from '../../../Themes/Colors';
import { strings } from '../../../Locales/i18'
import Loader from '../../../SupportingFIles/Loader';
import { SearchBar } from 'react-native-elements';
import images from '../../../Themes/Images';
import ReadMore from 'react-native-read-more-text';
import Slideshow from '../../../SupportingFIles/Slideshow';
import { convertCurrencybyCode ,getCampaignSearchData,setCampaignSearchData} from '../../../SupportingFIles/Utills';
import  campaignStyles  from '../../CreateCampaign/CreateCampaignFrom/styles'
import RBSheet from "react-native-raw-bottom-sheet";
import CommentView from './CampaignResuableComponent/LikeCommentView'


import Moment from 'moment'
import FeesInfoPoup from './CampaignResuableComponent/FeesInfoPoup';
const formatCurrency = new Intl.NumberFormat('en-US')
import { logSearch } from '../../../API/Analytics/Firebase';



class CampaignSearch extends Component {
  constructor(props) {
    super(props);
     this.state = {
      CampaignSearch:[],
      selectedItem:null,
    };

  }
  componentDidMount() {
    this.props.navigation.setOptions({ 
    headerLeft: () => (
      <TouchableOpacity style={styles.backButtonContainer}
          onPress={()=>this.props.navigation.goBack()}
      >
          <Image source = {images.backImage} />
      </TouchableOpacity>
    ),
  }
    )
    const store = this.props.CompaignsStore
    this.updateSearch('')
    this.searchBar.focus(); 
    store.setSearchedCampaigns([])
    store.setRefreshing(false)
    store.setLoading(false)

   

    getCampaignSearchData().then(CampaignSearchData => {
      this.setState({CampaignSearch:CampaignSearchData})
     
    })
   

  }

  // sortByPriceDesc() {
  //   this.setState(prevState => {
  //     this.state.products.sort((a, b) => (b.price - a.price))
  // });
  // }

  updateSearch = search => {
    const store = this.props.CompaignsStore
    store.setupdatedsearch(search)
    
    
  };

  render() {
    const store = this.props.CompaignsStore
    const { updatedsearch, isLoading, isRefreshing,searchedCampaigns } = this.props.CompaignsStore
    console.log("~~~~~~~~~~~~~~~~~~~~~~~> isLoading",isLoading)
    const selectedItem = this.state.selectedItem

    return (
        <TouchableWithoutFeedback 
        onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1, backgroundColor:'rgba(248, 248, 248, 1)' }}>
        <Loader loading={store.isLoading} />
        <View style={styles.seprater}></View>

        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white, padding: 10 }}>
          <SearchBar lightTheme
            platform="default"
            placeholder={strings('search_campaign')}
            inputStyle={{ fontFamily: metrics.Lato_Regular, fontSize: metrics.text_normal }}
            onChangeText={(text) => this.updateSearch(text)}
            ref={(input) => { this.searchBar = input; }}
            value={updatedsearch}
            returnKeyType="search"
            containerStyle={{
              width: '100%', backgroundColor: colors.white,
              borderBottomColor: 'transparent', borderTopColor: 'transparent',marginTop:-metrics.dimen_5, marginLeft: -15, marginRight: -15
            }}
            inputContainerStyle={{ backgroundColor: colors.app_light_gray, shadowColor: colors.shadow_color, borderRadius: 20 }}
            onClear={() => {
                this.updateSearch('')
                store.setSearchedCampaigns([])
            }}
              onEndEditing={() => {
                  if(updatedsearch !== "")
                  {
                    store.getSearchCampaigns()
                    this.UpdateSearchData(updatedsearch)
                    logSearch(updatedsearch)
                  }
              }}
          />

        </View>

        <RBSheet
        ref={ref => {
          this.bottomSheet = ref;
      }}
      height={200}

        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          container: {
            borderTopLeftRadius:20,
            borderTopRightRadius:20

          },
          draggableIcon: {
            backgroundColor: "#000"
          }
        }}
      >
        {/* <FeesInfoPoup
          koliCommission={this.state.koliCommission}
          payPalFees={this.state.payPalFees}
        /> */}
        {/* <View style={{paddingHorizontal:metrics.dimen_27, flex: 1,}}>
            <Text style={[campaignStyles.textPopupTitle,
              {alignSelf:'center', fontSize:metrics.dimen_15, textDecorationLine: 'underline', marginTop:10}]}>
              {'Fees and Tax Details Included'}</Text>

          <View style={{marginTop:20,marginVertical:10, flexDirection:'row'}}>
            <Text style={campaignStyles.textPopupTitle}>KOLI Commission : </Text>
            <Text style={[campaignStyles.textPopupDescription,{marginTop:0}]}>
            {selectedItem !== null ? `USD ${this.state.koliCommission}` : ''}
              </Text>
          </View>
          <View style={{marginVertical:10, flexDirection:'row'}}>
            <Text style={campaignStyles.textPopupTitle}>{'Paypal Fees : '}</Text>
            <Text style={[campaignStyles.textPopupDescription,{marginTop:0}]}>
            {selectedItem !== null ?  `USD ${this.state.payPalFees}` : ''}
              </Text>
          </View>
        </View> */}
      </RBSheet>
        {isLoading===false&&searchedCampaigns.length<=0&&this.state.CampaignSearch.length>0? <View style={{flexDirection:"row", height:metrics.dimen_40,justifyContent:"space-between",alignContent:'center',alignItems:'center',backgroundColor:'rgba(248, 248, 248, 1)',marginHorizontal:metrics.dimen_20}}>
        <Text style={{ alignSelf:'center', fontFamily:metrics.Roboto_Regular,color:colors.app_gray}}>{strings("Recent_search")}</Text>
        <TouchableOpacity onPress={() =>this.deleteAllItem()}>
        <Text style={{ alignSelf:'center', fontFamily:metrics.Roboto_Regular,color:colors.app_Blue}}>{"Clear History"}</Text>
        </TouchableOpacity>
        </View>:null}
        {searchedCampaigns.length<=0? <View style={{ width:"100%",marginBottom:metrics.dimen_150}}>
        
     <FlatList          
                showsVerticalScrollIndicator={false}
                numColumns={1}  
                data={this.state.CampaignSearch.sort((a, b) => b.id-(a.id))}
                renderItem={({ item ,index}) => this.renderRecentSearch(item,index)}
                keyExtractor={(item, index) => index.toString()}
              
              />

             
      </View>:null}
      


     {searchedCampaigns.length>0 &&<FlatList
         // style={{ marginHorizontal: metrics.dimen_10 }}
          showsVerticalScrollIndicator={false}
          numColumns={1}
          data={searchedCampaigns}
          renderItem={({ item }) => this.renderCompaign(item)}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={this._onRefresh}
            />
          }
        />}
        {searchedCampaigns.length === 0&&this.state.CampaignSearch.length===0 && this.NODataRender()}

      </View>
      </TouchableWithoutFeedback>

    );
  }

  renderRecentSearch = (item,index) => {
   
    return (
      <View style={{backgroundColor:'rgba(241, 241, 241, 1)'}} >
       
        <View style={{ marginHorizontal:metrics.dimen_7,  marginVertical:metrics.dimen_15, flexDirection: 'row'}}>
        <View style = {{ justifyContent:'flex-start',flexDirection:"row", width:"90%"}}>
        <TouchableOpacity style={{ flexDirection:"row",width:"90%"}} onPress={() => this.searchcampaignfromRecentSearchData(item)}
          >
        <Image source = {images.search_history} style={{marginLeft:metrics.dimen_12, height:metrics.dimen_18,width:metrics.dimen_18}}/>
        <Text style={{fontFamily:metrics.Roboto_Regular,alignItems:"center",color:colors.app_gray,marginLeft:metrics.dimen_20}}>{item.name}</Text> 
        </TouchableOpacity> 
       </View> 
       <View style = {{width:"10%"}}>
         <TouchableOpacity style={{with:"40"}} 
         onPress={() =>
          this.deleteItemByName(item.name)
        }
         >
       <Image source = {images.cross} style={{height:metrics.dimen_18,width:metrics.dimen_18 ,tintColor:'rgba(187, 192, 200, 1)'}}/>
       </TouchableOpacity>
       </View>   
        </View>
        <View style={{borderColor: 'rgba(227,227,227,1)',borderBottomWidth: 1,marginHorizontal:metrics.dimen_30}}/>
      </View>
    )
  }

  // Recent Searches Start
  
  searchcampaignfromRecentSearchData(item)
  {
    const store = this.props.CompaignsStore
    this.updateSearch(item.name)
    store.getSearchCampaigns()

  }
  deleteItemByName (name) {
    const filteredData = this.state.CampaignSearch.filter(item => item.name.toLowerCase()!== name.toLowerCase());
    this.setState({ CampaignSearch: filteredData });
    setCampaignSearchData(filteredData)
  }
  deleteAllItem () {
    this.setState({ CampaignSearch: [] });
    setCampaignSearchData([])
  }
  UpdateSearchData(search){
    let CampaignSearchdata= this.state.CampaignSearch
    CampaignSearchdata = CampaignSearchdata.filter(obj => (obj.name.toLowerCase()!==search.toLowerCase()))
    CampaignSearchdata.push({id:CampaignSearchdata.length+1, name:search });
    console.log("CampaignSearchdata",CampaignSearchdata)
    this.setState({CampaignSearch:CampaignSearchdata})
    setCampaignSearchData(CampaignSearchdata)    
}
 // Recent Searches End
   
  renderCompaign = (item) => {
    const campaignGallery = item.campaignGallery
    let campaignImage = images.tagBlue
    console.log('data===', item)

   

    // data.endStoryPostDate>=
    // data.endStoryPostDate>=currentdate
    return (
      <View style={styles.cellContainer}>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('CampaignDetails', { data: item })
          }
        >
          <Slideshow
            onPress={() => this.props.navigation.navigate('CampaignDetails', { data: item })}
            //height={metrics.width}
            width={metrics.width}
            dataSource={campaignGallery}
            indicatorColor={colors.white}
            indicatorSelectedColor={colors.indicaterselected}
            arrowSize={0}
            titleStyle={{ marginTop: 50, color: 'red' }}
            containerStyle={styles.imageContainer} />
          <CommentView 
            campaignData={item} 
            navigation={this.props.navigation}/>
 {/* <View style={{ position: 'absolute', top: metrics.dimen_10, right: metrics.dimen_8, backgroundColor: item.endStoryPostDate >= currentdate ? colors.app_green : colors.app_red, borderRadius: metrics.dimen_2 }} >
            <Text style={{ fontFamily: metrics.Lato_Bold, fontSize: metrics.text_small, paddingLeft: metrics.dimen_5, paddingRight: metrics.dimen_4, paddingTop: metrics.dimen_2, paddingBottom: metrics.dimen_2, color: colors.white }}>{item.endStoryPostDate >= currentdate ? strings('Open') : strings('Expired')}</Text>
          </View> */}
          <View style={{ marginHorizontal: metrics.dimen_13 }}>

{/* <Text style={{ ...styles.postedOnText, marginTop: metrics.dimen_14, marginBottom: metrics.dimen_8 }}>
  {`${strings('Posted_On')}: ${Moment(item.createdAt).format('MMM DD, YYYY')}`}</Text> */}
<Text style={{ ...styles.boldText, fontSize: metrics.text_16, marginBottom: metrics.dimen_8 }}>{item.campaignTitle}</Text>
<ReadMore
  numberOfLines={2}
  renderTruncatedFooter={this._renderTruncatedFooter}
  renderRevealedFooter={this._renderRevealedFooter}
// onReady={this._handleTextReady}
>
  <Text style={{ ...styles.mediumText, marginTop: metrics.dimen_8 }}>{item.campaignDetails}</Text>
</ReadMore>
{/* <Text style = {{...styles.boldText,fontSize: metrics.getFontSize(14), color: 'rgba(22, 88, 211, 1)', marginTop: metrics.dimen_8, marginBottom: metrics.dimen_10}}>{item.campaignAmountCurrency + " " +formatCurrency.format(item.campaignAmount)}</Text> */}
</View>
<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: metrics.dimen_8, marginBottom: metrics.dimen_10, marginLeft: metrics.dimen_13 }}>
{/* {item.campaignType === "paid" && <Text style={{ ...styles.boldText, color: 'rgba(22, 88, 211, 1)' }}>
  {item.campaignAmountCurrency + " " + formatCurrency.format(item.campaignAmount)}
</Text>} */}

{/* {item.campaignType !== "paid" && */}
<View style={{flexDirection:'row'}}>
<View style={{
  backgroundColor: item.campaignType === "shoutout" ? '#58DC72' : item.campaignType === "paid" ? colors.app_Blue : "#FFC107",
  paddingHorizontal: metrics.dimen_13,
  height: metrics.dimen_25,
  borderRadius: metrics.dimen_13,
  justifyContent: 'center'
}}>
  {/* <Text style={{ fontFamily: metrics.Lato_SemiBold, fontSize: metrics.text_13, color: colors.white }}>
    {item.campaignType === "shoutout" ?
      `Shoutout Exchange` :
      item.campaignType !== "paid" ?
        `Sponsored`
        : `Paid: ${convertCurrencybyCode(item.campaignAmountCurrency) + " " + formatCurrency.format(item.campaignAmount)}`}
  </Text> */}

{item.campaignType === "shoutout"&& <Text style={{ fontFamily: metrics.Lato_SemiBold,fontSize: metrics.text_13, color: colors.white }}>
{"Shoutout Exchange"}
</Text>}
{item.campaignType === "paid"&& <Text style={{ fontFamily: metrics.Lato_SemiBold,fontSize: metrics.text_13, color: colors.white }}>
{`Paid: ${convertCurrencybyCode(item.campaignAmountCurrency) + formatCurrency.format(item.campaignAmount)}`}
</Text>}

{item.campaignType === "sponsored"&& <Text style={{ fontFamily: metrics.Lato_SemiBold,fontSize: metrics.text_13, color: colors.white }}>
{`Sponsored`}             
</Text>}

{item.campaignType === "commissionBased"&& <Text style={{ fontFamily: metrics.Lato_SemiBold,fontSize: metrics.text_13, color: colors.white }}>
{`Commission Based`}             
</Text>}

{item.campaignType === "eventsAppearence"&& <Text style={{ fontFamily: metrics.Lato_SemiBold,fontSize: metrics.text_13, color: colors.white }}>
{`Events Appearance`}             
</Text>}
{item.campaignType === "photoshootVideo"&& <Text style={{ fontFamily: metrics.Lato_SemiBold,fontSize: metrics.text_13, color: colors.white }}>
{`Photo / Video Shoot`}             
</Text>}
</View>
{/* } */}
{/* {item.campaignType === "paid" && 
  <TouchableOpacity style={{flexDirection:'row', alignItems:'center', alignSelf:'center'}}
  onPress={() => {
    this.setState({selectedItem:item},()=>{
      this.getFeesData(item)
    })
    }}
      >
    <Text style={[campaignStyles.textFieldTitle, { marginRight:5, marginTop:0, marginLeft:10 }]}>Info</Text>
<Image style={{alignSelf:'center', width:15, height:15, tintColor: colors.app_Blue}}
        source={images.infoIcon}
        resizeMode="contain"
      ></Image>
</TouchableOpacity>} */}
</View>

<View style={{ alignItems: 'center', marginRight: -metrics.dimen_4, height: 25, justifyContent: 'center' }}>
  {/* <Image source={campaignImage} style={{ position: 'absolute', width: '100%', height: '100%' }} resizeMode="stretch" /> */}
  {/* <View style = {styles.tagViewStyle} disabled = {item.campaignStatus !== 2 ? true : false}
onPress={()=>this.props.navigation.navigate('ApplicantList', {JobData: item})}
> */}
  {item.campaignType === "shoutout" &&
    <Text style={[styles.tagTextStyle, { marginRight: metrics.dimen_15 }]}>
      {this.returnShoutoutContent(item)}
    </Text>
  }

  {item.campaignType !== "shoutout" &&
    <Text style={[styles.tagTextStyle, { marginRight: metrics.dimen_15 }]}>
      {item.remarks.length > 0 ? `${item.remarks.filter(el=>el.remarkStatus === 1).length} ${strings('Applications')}` : `${strings('New_Listing')}`}
    </Text>}

  {/* </View> */}
</View>


{/* <View 
style={{ marginRight: -metrics.dimen_3 }}>
  <Image source={campaignImage} style={styles.imageRibbon}
  resizeMode="contain"
  />
  <View style={styles.tagViewStyle} disabled={item.campaignStatus !== 2 ? true : false}
  // onPress={()=>this.props.navigation.navigate('ApplicantList', {JobData: item})}
  >

    <Text style={[Platform.OS == 'android' ? styles.tagTextStyle : styles.tagTextStyleios]}>{strings('InfluencerIntrested') + ` (${item.remarks.length})`}</Text>
  </View>
</View> */}
</View>

        </TouchableOpacity>
      </View>
    )
  }

  returnShoutoutContent = (item) =>{

    if(item.remarks.length>0)
    {
      return `${this.props.CompaignsStore.campaignByRemarklist.length} ${strings('Applications')}` 
    }
   else 
    {
      return `${strings('New_Listing')}` 
    }
    

  //   if(item.profile !== undefined && item.profile.followers>0 && item.remarks.length>0)
  //   {
  //     return `${NumberformatesunitUptoOneDecimal(item.profile.followers)} Followers | ${this.props.CompaignsStore.campaignByRemarklist.length} ${strings('Applications')}` 
  //   }
  //  else if(item.profile !== undefined && item.profile.followers>0 && item.remarks.length===0)
  //   {
  //     return `${NumberformatesunitUptoOneDecimal(item.profile.followers)} Followers | ${strings('New_Listing')}` 
  //   }
  //   else if(item.profile === undefined && item.remarks.length>0)
  //   {
  //     return `${this.props.CompaignsStore.campaignByRemarklist.length} ${strings('Applications')}` 
  //   }
  }
  _renderTruncatedFooter = (handlePress) => {
    return (
      <Text style={{ ...styles.normalText, marginTop: metrics.dimen_5, color: 'rgba(22, 88, 211, 1)' }} onPress={handlePress}>
        {strings('ReadMore')}
      </Text>
    );
  }

  _renderRevealedFooter = (handlePress) => {
    return (
      <Text style={{ ...styles.normalText, marginTop: metrics.dimen_5, color: 'rgba(22, 88, 211, 1)' }} onPress={handlePress}>
        {strings('ShowLess')}
      </Text>
    );
  }
  NODataRender() {
    const store = this.props.CompaignsStore

    if (store.isRefreshing)
    {
      return null
    }

    return (
        <View style={{
            flex: 1, width: '100%', height: '100%',  justifyContent: 'center',
            flexDirection: 'column', alignItems: 'center',
            marginBottom:metrics.dimen_100
        }}>

           {/* <Text style={{ color: colors.gray, fontFamily: metrics.Roboto_Regular, fontSize: metrics.text_normal, textAlign: 'center',  }}>{store.updateSearch}</Text> */}
            <Image source={images.SearchResultNo} style={{ width: metrics.dimen_200, height: metrics.dimen_200, alignSelf: 'center' }} />



        </View>
    )
}
getFeesData = (campaignData) =>{
  const campaignStore = this.props.CompaignsStore
  const feesData = campaignStore.feesAndTransactionData

  const offerAmount = parseFloat(campaignData.campaignAmount)
       const paymentFees = (offerAmount * parseFloat(feesData.paypalPercentFee))/100
       const payoutFees = (offerAmount * parseFloat(feesData.paypalReleaseFee))/100
       const total = paymentFees+payoutFees+feesData.paypalFixedFee
       const koliCom = (offerAmount * parseFloat(feesData.koliPlateformFee))/100 
       this.setState({payPalFees:total.toFixed(2), koliCommission: koliCom.toFixed(2)},()=>{
         this.bottomSheet.open()
       })  
 }
}
export default inject("CompaignsStore", "AuthStore", "ChatStore")(observer(CampaignSearch))


const styles = StyleSheet.create({
  title:
  {
    fontSize: metrics.text_normal,
    color: colors.gray,
    fontFamily: metrics.Lato_SemiBold,
    textTransform: 'capitalize',
  },
  seprater:
  {
    borderWidth: 0.5,
    borderColor: colors.disable_gray_color,

  },
  backButtonContainer: {
    marginLeft: metrics.dimen_16, 
    marginTop: Platform.OS === 'android' ? metrics.dimen_10 : 5
  },
  normalText: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_normal,
    color: colors.app_black,
  },
  mediumText: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.getFontSize(12),
    color: 'rgba(97, 97, 100, 1)',
  },
  boldText: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_normal,
    color: 'rgba(61, 64, 70, 1)',
  },
  imageContainer: {
    width: metrics.width,
   height: metrics.width
  },
  cellContainer: {
    shadowColor: 'lightgray',
    shadowOffset: { width: 0, height: metrics.dimen_3 },
    shadowOpacity: 0.3,
    shadowRadius: metrics.dimen_4,
    flex: 1,
    marginBottom: metrics.dimen_20,
    backgroundColor: 'white',
   // margin: metrics.dimen_4,
    elevation: metrics.dimen_6,
  },
  tagTextStyle:{
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_13,
    color: '#7A818A',
    marginTop: -metrics.dimen_2,
    marginHorizontal: metrics.dimen_10,

  },
  postedOnText: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_small,
    color: '#7A818A',
  },
})
