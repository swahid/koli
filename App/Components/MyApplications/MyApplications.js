
import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar, Image, TouchableOpacity, RefreshControl,BackHandler,Platform} from 'react-native';
import {observer, inject} from 'mobx-react';
import metrics from '../../Themes/Metrics';
import images from '../../Themes/Images';
import colors from '../../Themes/Colors';
import { strings } from '../../Locales/i18';
import Loader from '../../SupportingFIles/Loader';
import ReadMore from 'react-native-read-more-text';
import {Button} from 'react-native-paper';
import { commonStyles } from '../../SupportingFIles/Constants';
import Slideshow from '../../SupportingFIles/Slideshow';
import  'intl';
import 'intl/locale-data/jsonp/en-US'
import Moment from 'moment'
import CampaignListSkeleton from '../CommonComponents/CampaignListSkeleton'
import {  NumberformatesunitUptoOneDecimal,convertCurrencybyCode,generateFirebaseCampaignlink,gettUserData } from '../../SupportingFIles/Utills';
import ShareCampaign from '../../Assets/Images/comment';
import Share from 'react-native-share';
import ChatLike from '../../Assets/Images/chatLike';
import Heart from '../../Assets/Images/heart';
import { SearchBar } from 'react-native-elements';
var context=null
const formatCurrency = new Intl.NumberFormat('en-US')


class MyApplications extends Component {
  constructor(props) {
    super(props);
    this.backButtonClick = this.backButtonClick.bind(this);
    this.state = {
      searchvisible:false,
      data:[],
    };
    context=this
  }


  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backButtonClick);
  }

  componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress', this.backButtonClick);
  }

  backButtonClick(){
    // if(this.props.navigation && this.props.navigation.goBack){
    //    this.props.navigation.navigate('Influencer');
    //   return true;
    // }
    // return false;
  }

  componentDidMount(){
    const store = this.props.CompaignsStore
    // this.props.navigation.addListener('focus', () => {
      store.setupdatedsearch('')
      store.getUserAppliedCampaignsList()
      this.setState({data: store.myApplicationsList })
    // });
    this.props.navigation.setOptions({headerRight: () => (
        <View style={{marginRight: metrics.dimen_20, flexDirection: 'row'}}>         
        {store.myApplicationsList.length !== 0&& <TouchableOpacity onPress={()=>context.SearchOnOf()}>
          <Image source={images.search} />
          </TouchableOpacity>}
        </View>
      ) })

  }

  SearchOnOf()
  {
    this.setState({searchvisible: this.state.searchvisible===false?true:false})
  }
  
  generatelinklink(item){
   console.log("campaignData",item)
    generateFirebaseCampaignlink(item.campaignId).then(campaignlink => {
 
     this.shareCampaignlink(campaignlink,item)
       
    })   
   
  }

  shareCampaignlink= async(campaignlink,item)=>{
    const shareOptions = {
      title: 'Share via',
      message: item.campaigns.campaignTitle,
      url: campaignlink,
      social: Share.Social.WHATSAPP
    };
    await Share.open(shareOptions)  
   }
  UpdateSerch = search => {
    const store = this.props.CompaignsStore
    store.setupdatedsearch(search)
    const newData = store.myApplicationsList.filter(item => {   
      console.log('item in UpdateSerch:',JSON.stringify(item) )   
      if(item.campaigns !== undefined)
      {
        const itemData = `${item.campaigns.campaignTitle.toUpperCase()}   
        ${item.campaigns.campaignTitle.toUpperCase()} ${item.campaigns.campaignTitle.toUpperCase()}`;
         const textData = search.toUpperCase();    
         return itemData.indexOf(textData) > -1;   
      }
       
    });
    console.log('UpdateSerch data:',JSON.stringify(newData) )   
    
    this.setState({ data: newData });  
  
  
  };
  render() {

    const {updatedsearch, isLoading, isRefreshing, myApplicationsList} = this.props.CompaignsStore
    var filteredApplications = myApplicationsList.filter(
        el => el.campaigns !== undefined && el.campaigns.campaignGallery.length>0
      )
      if (updatedsearch)
      {

        filteredApplications = this.state.data.filter(
          el => el.campaigns !== undefined
        )
        console.log("filteredApplications:",JSON.stringify(filteredApplications) )

      }
      console.log("filteredApplications:",JSON.stringify(filteredApplications) )
    this.props.navigation.setOptions({headerRight: () => (
      <View style={{marginRight: metrics.dimen_20, flexDirection: 'row'}}>         
      {myApplicationsList.length !== 0&& <TouchableOpacity onPress={()=>context.SearchOnOf()}>
        <Image source={images.search} />
        </TouchableOpacity>}
                 
        {/* <TouchableOpacity onPress={()=>this.props.navigation.navigate('CreateCampaign1',{type:'Add'})}>
          <Image source={images.plusIcon} style = {{marginLeft: metrics.dimen_22}}/>
          </TouchableOpacity> */}
          
      </View>
    ) })
    return (
      <View style = {{flex: 1, backgroundColor: 'white'}}>
        <StatusBar barStyle="dark-content"/>
        {/* <Loader loading={isLoading}/> */}
       {this.state.searchvisible&& <View style={{marginLeft:metrics.dimen_5, width: '96%', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white,marginTop:5}}>
          <SearchBar lightTheme
            platform='default'
            placeholder={strings('Search')}
            inputStyle={{ fontFamily: metrics.Lato_Regular, fontSize: metrics.text_normal }}
            onChangeText={(text) => this.UpdateSerch(text)}
             value={updatedsearch}
            containerStyle={{
              width: '96%', backgroundColor: colors.white,
              borderBottomColor: 'transparent', borderTopColor: 'transparent',marginTop:-metrics.dimen_5, marginLeft: -15, marginRight: -15
            }}
            inputContainerStyle={{ backgroundColor: colors.app_light_gray, shadowColor: colors.shadow_color, borderRadius: 20 }}
            onClear={() => {
              this.UpdateSerch('')
            this.setState({data:myApplicationsList})
            }}
            onEndEditing={() => {


            }}
          />

        </View>}

        {!isLoading && myApplicationsList.length === 0 ? this.renderNoJobs()  :null}


        <FlatList
          style={{
            // marginHorizontal: metrics.dimen_10,
            marginTop:metrics.dimen_10}}
          showsVerticalScrollIndicator = {false}
          numColumns={1}
          data={(filteredApplications)}
          renderItem = {({item}) => this.renderCompaign(item)}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
                refreshing={isRefreshing}
                onRefresh={this._onRefresh}
            />
          }
          // ListHeaderComponent={this.renderHeader}
        />
         {isLoading && 
        <CampaignListSkeleton/>
       }
      </View>
    );
  }
  _onRefresh = () => {
    this.props.CompaignsStore.setMyCampaignRefreshing(true)
    this.props.CompaignsStore.getUserAppliedCampaignsList()
  }
  renderNoJobs(){
    return(
    <View style = {{alignItems: 'center', height: '80%', justifyContent: 'center'}}>
      <Image source ={images.Campaign}/>
      <Text style = {{...commonStyles.LatoBold_16, marginTop: -metrics.dimen_40}}>{strings('No_Campaign')}</Text>
      <Button 
        style={{...commonStyles.NextButtonStyle, marginTop: metrics.dimen_25, borderRadius: metrics.dimen_22, paddingVertical: metrics.dimen_2}} 
        labelStyle = {{...commonStyles.LatoSemiBold_Normal, color: 'white', paddingBottom: metrics.dimen_2}} 
        onPress={() => this.props.navigation.navigate('Home')
      }
        Type = "contained"
        uppercase = {false}
         >
           {strings('Browse_Applications')}
        </Button>

    </View>)
  }
  renderHeader = () =>{
    return(<Text style = {styles.headerTextStyle}>{strings('Compaign')}</Text>)
  }
  renderCompaign = (item) => {
    const campaignData = item.campaigns
     let campaignImage = images.tagBlue
    console.log('item:',item)
    // 0 - No action taken
// 1 - Pending
// 2 - Accepted
// 3 - Declined

    const offerStatus = item.offerStatus !== undefined ? item.offerStatus : 0
  if (offerStatus === 1) {
      campaignImage = images.tagYellow
    } else if (offerStatus === 2) {
      campaignImage = images.tagGreen
    }else if (offerStatus === 3) {
      campaignImage = images.inactiveRibbon
    }
   

    return(
      <View style={styles.cellContainer}>

      <TouchableOpacity onPress={() => this.props.navigation.navigate('MYCampaignDetails', {data: campaignData, isFromMyApplications:true,id:item.id, applicantData: item} )}
      >
     <View>
      <Slideshow
          onPress={() => this.props.navigation.navigate('MYCampaignDetails', {data: campaignData, isFromMyApplications:true, id:item.id, applicantData: item} )}
         //  height={metrics.width - metrics.dimen_48}
          width={metrics.width}
          dataSource={ campaignData.campaignGallery !== undefined ? campaignData.campaignGallery : [images.userPlaceholder]}
          indicatorColor={colors.white}
          indicatorSelectedColor={colors.indicaterselected}
          arrowSize={0}
          titleStyle={{ marginTop: 50, color: 'red' }}
          containerStyle={styles.imageContainer } />
    
    
     

      <View style = {{marginLeft: metrics.dimen_13}}>
      <View style={{flexDirection:'row',justifyContent:'space-between'}}>
      <Text style={styles.postedOnText}>
              {`${strings('Posted_On')}: ${Moment(item.createdAt).format('MMM DD, YYYY')}`}</Text>
         

              <TouchableOpacity
            style={{marginTop:metrics.dimen_12,marginRight:metrics.dimen_12 }}
            onPress={()=>{
              this.generatelinklink(item)

                }}
          >
          <ShareCampaign
          
              width={metrics.widthSize(55)}
              height={metrics.widthSize(55)}
            /></TouchableOpacity>
          </View>
      
      <Text style = {{...styles.boldText, fontSize: metrics.text_16, marginBottom: metrics.dimen_8}}>{campaignData.campaignTitle}</Text>
      
      <View style={{flexDirection:"row",marginVertical:metrics.dimen_2}}>
       {item.campaigns.likes&&item.campaigns.likes.length>0?
       <TouchableOpacity style={{flexDirection:'row'}} onPress={()=>{ this.openUserLike(item.campaigns)}}>  
               
                <Heart
                  width={metrics.widthSize(50)}
                  height={metrics.widthSize(50)}
                />
               
         <Text style = {{marginLeft:metrics.dimen_8, marginRight:metrics.dimen_15, fontFamily:metrics.Lato_Regular, fontSize: metrics.text_11,  marginTop:Platform.OS === 'android' ?metrics.dimen_2:metrics.dimen_1  ,color:"#7A818A"}}>{item.campaigns.likes.length+" likes"}</Text>
         </TouchableOpacity> :null} 
     
      {item.campaigns.comments&&item.campaigns.comments.length>0?  
      
      <TouchableOpacity onPress={()=>{ this.openUserCommentBox(item.campaigns)}}> 
      <View style={{flexDirection:'row'}}>
      <ChatLike
              width={metrics.widthSize(50)}
              height={metrics.widthSize(50)}
            />

     <Text style = {{marginLeft:metrics.dimen_8, marginRight:metrics.dimen_15, fontFamily:metrics.Lato_Regular, fontSize: metrics.text_11,  marginTop:Platform.OS === 'android' ?metrics.dimen_2:metrics.dimen_1 ,color:"#7A818A"}}>{item.campaigns.comments.length+" comments"}</Text>
       </View></TouchableOpacity>:null} 

           </View>
      <ReadMore
          numberOfLines={2}
          renderTruncatedFooter={this._renderTruncatedFooter}
          renderRevealedFooter={this._renderRevealedFooter}
          // onReady={this._handleTextReady}
          >
          <Text style = {{...styles.mediumText, marginTop: metrics.dimen_8}}>{campaignData.campaignDetails}</Text>
      </ReadMore>
      <View style = {{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',marginTop: metrics.dimen_8, marginBottom: metrics.dimen_10}}>
     
<View style={{backgroundColor:campaignData.campaignType === "shoutout" ? '#58DC72' : campaignData.campaignType === "paid" ? colors.app_Blue : "#FFC107", 
            paddingHorizontal:metrics.dimen_13, 
            height: metrics.dimen_25, 
            borderRadius: metrics.dimen_13, 
            justifyContent:'center'}}>
           
            
            
            {campaignData.campaignType === "shoutout"&& <Text style={{ fontFamily: metrics.Lato_SemiBold,fontSize: metrics.text_13, color: colors.white }}>
            {"Shoutout Exchange"}
            </Text>}
            {campaignData.campaignType === "paid"&& <Text style={{ fontFamily: metrics.Lato_SemiBold,fontSize: metrics.text_13, color: colors.white }}>
            {`Paid: ${convertCurrencybyCode(campaignData.campaignAmountCurrency) + formatCurrency.format(campaignData.campaignAmount)}`}
            </Text>}

            {campaignData.campaignType === "sponsored"&& <Text style={{ fontFamily: metrics.Lato_SemiBold,fontSize: metrics.text_13, color: colors.white }}>
            {`Product Sponsor: ${convertCurrencybyCode(campaignData.campaignAmountCurrency) + formatCurrency.format(campaignData.campaignAmount)}`}             
            </Text>}

            
            
            {campaignData.campaignType === "commissionBased"&& <Text style={{ fontFamily: metrics.Lato_SemiBold,fontSize: metrics.text_13, color: colors.white }}>
            {`Commission Based: ${formatCurrency.format(campaignData.campaignAmount)+" "+"%"}`}             
            </Text>}

            {campaignData.campaignType === "eventsAppearence"&& <Text style={{ fontFamily: metrics.Lato_SemiBold,fontSize: metrics.text_13, color: colors.white }}>
            {`Events Appearance: ${convertCurrencybyCode(campaignData.campaignAmountCurrency) + formatCurrency.format(campaignData.campaignAmount)}`}             
            </Text>}
            {campaignData.campaignType === "photoshootVideo"&& <Text style={{ fontFamily: metrics.Lato_SemiBold,fontSize: metrics.text_13, color: colors.white }}>
            {`Photo / Video Shoot: ${convertCurrencybyCode(campaignData.campaignAmountCurrency) +  formatCurrency.format(campaignData.campaignAmount)}`}             
            </Text>}
            
            
            
          


            </View>
        {/* <Text style = {{...styles.boldText, color: 'rgba(22, 88, 211, 1)'}}>
          {campaignData.campaignAmountCurrency + " " + formatCurrency.format(campaignData.campaignAmount)}
          </Text> */}

        {/* <View style = {{alignItems: 'center', marginRight: -metrics.dimen_3, height:25, justifyContent:'center'}}>
          { campaignData.campaignType !== "shoutout" && <Image source = {campaignImage} style={{position:'absolute', width:'100%',height:'100%'}} resizeMode="stretch"/>}
         
          {campaignData.campaignType === "paid" &&
          <View style = {styles.tagViewStyle} >
            <Image source = {
              item.offerStatus === 2 ? images.jobAwarded : 
              item.offerStatus === 3 ? images.cautionIcon :images.timerIcon
              } 
              style= {{marginLeft: metrics.dimen_10,marginTop:-metrics.dimen_1}} />
            <Text style = {{...styles.tagTextStyle}}>
              {this.getStatusForCampaignOffer(item)}
             
              </Text>
          </View>}
        </View> */}
        {/* <View style = {{alignItems: 'center', marginRight: -metrics.dimen_1}}>
          <Image source = {campaignImage} />
          <TouchableOpacity style = {styles.tagViewStyle} disabled = {campaignStatus != 2 ? true : false}
            onPress={()=>this.props.navigation.navigate('ApplicantList', {JobData: item})}
          >
            <Image source = {campaignStatus == 3 ? images.jobAwarded : campaignStatus == 0 ? images.cautionIcon :images.timerIcon} style= {{marginLeft: metrics.dimen_2}} />
            <Text style = {{...styles.tagTextStyle}}>{campaignStatus == 1 ? strings('Awaiting_Approval') : campaignStatus == 2 ? item.remarks.length + " " + (item.remarks.length > 1 ? strings('Applications_Received') : strings('Application_Received')) : campaignStatus == 3 ? strings('Awarded') : strings('Inactive') }</Text>
            {campaignStatus != 3 && campaignStatus != 0 ? <Image source = {images.rightArrow} />: <Image style = {{marginLeft: metrics.dimen_10}}/>}

          </TouchableOpacity>
        </View> */}
      </View>
      </View></View> 
      
      {/* {campaignData.campaignType === 'paid' && this.renderOfferStatusView(item)} */}
      {campaignData.campaignType !== "commissionBased"&&campaignData.campaignType !== "shoutout"&&campaignData.campaignType !== "sponsored" && this.renderOfferStatusView(item)}

    </TouchableOpacity></View> 

    )
  }
  renderOfferStatusView = (item) => {
    return (
      <View style={styles.offerStatusView}>
        <Image
          style={styles.imageOfferStatus}
          source={images.jobAwarded}></Image>
        <Text style={styles.textOfferStatus}>
          {this.getStatusForCampaignOffer(item)}
        </Text>
      </View>
    )
  }
  getStatusForCampaignOffer = (item) =>{
    if (item.offerStatus === 0){
      return strings('Applied')
    } 
    else if (item.offerStatus === 1){
      return strings('Offer_Received')
    } 
    else if (item.offerStatus === 2){
      if(item.isPayment === 1 && item.isPaymentReleased === 0)
      {
        return strings('Payment_Added')
      }
      else if(item.isPayment === 1 && item.isPaymentReleased === 1)
      {
        return strings('Payment_Released')
      }
      if(item.isMarkAsDone===0)
      {
        return strings('Offer_Accepted')

      }else{
        return strings('Job_completed')
      }
    } 
    else if (item.offerStatus === 3){
      return strings('Offer_Declined')
    } 
  }
  _renderTruncatedFooter = (handlePress) => {
    return (
      <Text style={{...styles.normalText, marginTop: metrics.dimen_5, color: 'rgba(22, 88, 211, 1)'}} onPress={handlePress}>
        {strings('ReadMore')}
      </Text>
    );
  }
 
  _renderRevealedFooter = (handlePress) => {
    return (
      <Text style={{...styles.normalText, marginTop: metrics.dimen_5, color: 'rgba(22, 88, 211, 1)'}} onPress={handlePress}>
        {strings('ShowLess')}
      </Text>
    );
  }

  openUserCommentBox(item)
  {
    gettUserData().then(data => {
      this.props.navigation.navigate('UserComment',{campaignData:item,userProfileUrl:data?data.avatarUrl:"",Userdata:data})
  })   
}

openUserLike(item)
  {

    this.props.navigation.navigate('CampaignLike',{campaignData:item})
  }
}

export default inject("CompaignsStore")(observer(MyApplications))

const styles = StyleSheet.create({
    headerTextStyle:{
      fontFamily: metrics.Lato_Bold,
      fontSize: metrics.text_xxxl,
      marginBottom: metrics.dimen_20,
      color: 'rgba(61, 64, 70, 1)',
    },
    normalText:{
      fontFamily: metrics.Lato_Regular,
      fontSize: metrics.text_normal,
      color: colors.app_black,
    },
    mediumText:{
      fontFamily: metrics.Lato_Regular,
      fontSize: metrics.text_medium,
      color: 'rgba(97, 97, 100, 1)',
    },
    boldText:{
      fontFamily: metrics.Lato_Bold,
      fontSize: metrics.text_normal,
      color: 'rgba(61, 64, 70, 1)',
    },
    imageContainer:{
      width: metrics.width,
     height: metrics.width
    },
    cellContainer:{
      shadowColor: 'lightgray',
      shadowOffset: { width: 0, height: metrics.dimen_3 },
      shadowOpacity: 0.3,
      shadowRadius: metrics.dimen_4,
      flex: 1,
      marginBottom: metrics.dimen_20,
      backgroundColor: 'white',
      // margin: metrics.dimen_4,
      elevation: metrics.dimen_6
    },
    tagTextStyle:{
      fontFamily: metrics.Lato_Regular,
      fontSize: metrics.text_small,
      color: 'white',
      marginTop: -metrics.dimen_2,
      marginHorizontal: metrics.dimen_5,

    },
    tagViewStyle:{
      //position: 'absolute',
     // top: metrics.dimen_5,
      flexDirection: 'row',
      alignItems: 'center',
      //justifyContent: 'space-around',
      width: '95%',
      marginRight: metrics.dimen_3,
    },
    postedOnText: {
      fontFamily: metrics.Lato_Regular,
      fontSize: metrics.text_small,
      color: '#7A818A',
      marginTop: metrics.dimen_14, 
      marginBottom: metrics.dimen_8
    },
    offerStatusView:{
      position:'absolute', 
      left: metrics.dimen_10, 
      right: metrics.dimen_10, 
      top:metrics.dimen_10, 
      backgroundColor: colors.white,
      borderRadius: metrics.dimen_5,
      shadowColor: colors.app_black,
      shadowOffset: { width: 0, height: metrics.dimen_3 },
      shadowOpacity: 0.16,
      shadowRadius: metrics.dimen_5,
      alignItems:'center',
      justifyContent:'center',
      flexDirection:'row'
    },
    imageOfferStatus:{
      width: metrics.dimen_12,
      height: metrics.dimen_12,
      tintColor: colors.bankInfoListValue,
      marginRight: metrics.dimen_4
    },
    textOfferStatus:{
      marginVertical: metrics.dimen_8, 
      fontFamily: metrics.Lato_Italic,
      fontSize: metrics.text_11,
      color: colors.bankInfoListValue}
  
  })
