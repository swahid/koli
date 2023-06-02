
import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar, Image, TouchableOpacity, RefreshControl,Platform} from 'react-native';
import {observer, inject} from 'mobx-react';
import metrics from '../../../Themes/Metrics';
import images from '../../../Themes/Images';
import colors from '../../../Themes/Colors';
import { strings } from '../../../Locales/i18';
import Loader from '../../../SupportingFIles/Loader';
import ReadMore from 'react-native-read-more-text';
import {Button} from 'react-native-paper';
import { commonStyles } from '../../../SupportingFIles/Constants';
import Slideshow from '../../../SupportingFIles/Slideshow';
import  'intl';
import 'intl/locale-data/jsonp/en-US'
import Moment from 'moment'
import CampaignListSkeleton from '../../CommonComponents/CampaignListSkeleton'
import { SearchBar } from 'react-native-elements';
var context=null
const formatCurrency = new Intl.NumberFormat('en-US')
 import { convertCurrencybyCode ,gettUserData,generateFirebaseCampaignlink} from '../../../SupportingFIles/Utills';
 import ChatLike from '../../../Assets/Images/chatLike';
import Heart from '../../../Assets/Images/heart';
import ShareCampaign from '../../../Assets/Images/comment';
import Share from 'react-native-share';

// const numberFormat = (value) =>
// new Intl.NumberFormat().format(value);
  

class MyCompaign extends Component {
  constructor(props) {
    super(props);
    this.backButtonClick = this.backButtonClick.bind(this);

    this.state = {
      searchvisible:false,
      data:'',
    };
    context=this
  }


  componentWillMount() {
   // BackHandler.addEventListener('hardwareBackPress', this.backButtonClick);
  }

  componentWillUnmount(){
  //  BackHandler.removeEventListener('hardwareBackPress', this.backButtonClick);
  }

  backButtonClick(){
    if(this.props.navigation && this.props.navigation.goBack){
       this.props.navigation.navigate('Influencer');
      return true;
    }
    return false;
  }

  componentDidMount(){
    const store = this.props.CompaignsStore
    store.setRefreshNewContent(true)
    this.props.navigation.addListener('focus', () => {
      store.setupdatedsearch('')
      if(store.refreshNewContent){
        store.getMyCampaigns()
      }
      this.setState({data:store.myCompaignsList})
      this.props.navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity style={{...commonStyles.backButtonContainercampaign}}
              onPress={()=>this.props.navigation.goBack()}
          >
              <Image style={{tintColor:colors.app_black}} source = {images.backImage} />
          </TouchableOpacity>
        ),
        headerRight: () => (
        <View style={{marginRight: metrics.dimen_20, flexDirection: 'row'}}>         
        {store.myCompaignsList.length !== 0&& <TouchableOpacity onPress={()=>context.SearchOnOf()}>
          <Image source={images.search} />
          </TouchableOpacity>}
                   
          <TouchableOpacity onPress={()=>
            //this.props.navigation.navigate('CreateCampaign1',{type:'Add'})
            this.props.navigation.navigate('CreateCampaignForm',{type:'Add'})

            }>
            <Image source={images.plusIcon} style = {{marginLeft: metrics.dimen_22}}/>
            </TouchableOpacity>
            
        </View>
      ) })
    });

  }

  SearchOnOf()
  {
    this.setState({searchvisible: this.state.searchvisible===false?true:false})
  }

  UpdateSerch = search => {
    const store = this.props.CompaignsStore
    store.setupdatedsearch(search)
    let newData = store.myCompaignsList.filter(item => {      
      const itemData = `${item.campaignTitle.toUpperCase()}   
      ${item.campaignTitle.toUpperCase()} ${item.campaignTitle.toUpperCase()}`;
       const textData = search.toUpperCase();    
       return itemData.indexOf(textData) > -1;    
    });

    newData = newData.filter(e=>{
      console.log(e)
      if(e.cancelledByBrand==1 && e.cancelledByInfluencer==1){

      }else{
        return e
      }
    })
    console.log(newData)
    this.setState({ data: newData });  
  
  
  };
  render() {

    const {updatedsearch,myCompaignsList, isLoading, isRefreshingMyCampaign, isFetchedData} = this.props.CompaignsStore
    this.props.navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity style={{...commonStyles.backButtonContainercampaign}}
            onPress={()=>this.props.navigation.goBack()}
        >
            <Image style={{tintColor:colors.app_black}} source = {images.backImage} />
        </TouchableOpacity>
      ),
      headerRight: () => (
      <View style={{marginRight: metrics.dimen_20, flexDirection: 'row'}}>         
      {myCompaignsList.length !== 0&& <TouchableOpacity onPress={()=>context.SearchOnOf()}>
        <Image source={images.search} />
        </TouchableOpacity>}
                 
        <TouchableOpacity onPress={()=>
          //this.props.navigation.navigate('CreateCampaign1',{type:'Add'})
          this.props.navigation.navigate('CreateCampaignForm',{type:'Add'})

          }>
          <Image source={images.plusIcon} style = {{marginLeft: metrics.dimen_22}}/>
          </TouchableOpacity>
          
      </View>
    ) })
    let dataSource = []
    if(myCompaignsList.length>0){
       dataSource = myCompaignsList.filter(e=>{
        console.log(';;',e)
        if(e.cancelledByInfluencer==1 && e.cancelledByBrand==1){

        }else{
          return e
        }
      })
    }

    console.log("myCompaignsList",JSON.stringify(dataSource))
    return (
      <View style = {{flex: 1, backgroundColor: 'white'}}>
        <StatusBar barStyle="dark-content"/>
        {/* <Loader loading={isLoading}/> */}
        {isLoading && 
        <CampaignListSkeleton/>
       }
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
            this.setState({data:myCompaignsList})
            }}
            onEndEditing={() => {


            }}
          />

        </View>}

        {isFetchedData && !isLoading && myCompaignsList.length === 0 ? this.renderNoJobs()  :null}


        {!isLoading && dataSource.length > 0 && <FlatList
          style={{
            // marginHorizontal: metrics.dimen_20,
            marginTop:metrics.dimen_10}}
          showsVerticalScrollIndicator = {false}
          numColumns={1}
          data={updatedsearch?this.state.data:dataSource}
          renderItem = {({item}) => this.renderCompaign(item)}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
                refreshing={isRefreshingMyCampaign}
                onRefresh={this._onRefresh}
            />
          }
          // ListHeaderComponent={this.renderHeader}
        />}

             </View>
    );
  }
  _onRefresh = () => {
    this.props.CompaignsStore.setMyCampaignRefreshing(true)
    this.props.CompaignsStore.getMyCampaigns()
  }
  renderNoJobs(){
    return(
    <View style = {{alignItems: 'center', height: '80%', justifyContent: 'center'}}>
      <Image source ={images.Campaign}/>
      <Text style = {{...commonStyles.LatoBold_16, marginTop: -metrics.dimen_40}}>{strings('No_Campaign')}</Text>
      <Button 
        style={{...commonStyles.NextButtonStyle, marginTop: metrics.dimen_25, borderRadius: metrics.dimen_22, paddingVertical: metrics.dimen_2}} 
        labelStyle = {{...commonStyles.LatoSemiBold_Normal, color: 'white', paddingBottom: metrics.dimen_2}} 
        onPress={() => 
        //this.props.navigation.navigate('CreateCampaign1',{type:'Add'})
          this.props.navigation.navigate('CreateCampaignForm',{type:'Add'})

        }
        Type = "contained"
        uppercase = {false}
         >
           {strings('CreateNew')}
        </Button>

    </View>)
  }
  generatelinklink(campaignData){

    generateFirebaseCampaignlink(campaignData.id).then(campaignlink => {
 
     this.shareCampaignlink(campaignlink,campaignData)
       
    })   
   
  }

  shareCampaignlink= async(campaignlink,campaignData)=>{
    const shareOptions = {
      title: 'Share via',
      message: campaignData.campaignTitle,
      url: campaignlink,
      social: Share.Social.WHATSAPP
    };
    await Share.open(shareOptions)  
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
  
  renderHeader = () =>{
    return(<Text style = {styles.headerTextStyle}>{strings('Compaign')}</Text>)
  }
  renderCompaign = (item) => {
    let campaignImage = images.tagBlue
    if (item.campaignStatus === 0) {
      campaignImage = images.inactiveRibbon
    }else if (item.campaignStatus === 1) {
      campaignImage = images.tagYellow
    } else if (item.campaignStatus === 2) {
      campaignImage = images.tagBlue
    }else if (item.campaignStatus === 3) {
      campaignImage = images.tagGreen
    }
   

    return(
      <View style={styles.cellContainer}>

      <TouchableOpacity onPress={() => this.props.navigation.navigate('MYCampaignDetails', {data: item} )}
      >
     <View>
      <Slideshow
          onPress={() => this.props.navigation.navigate('MYCampaignDetails', {data: item} )}
          // height={metrics.width - metrics.dimen_48}
          width={metrics.width}
          dataSource={item.campaignGallery}
          indicatorColor={colors.white}
          indicatorSelectedColor={colors.indicaterselected}
          arrowSize={0}
          titleStyle={{ marginTop: 50, color: 'red' }}
          containerStyle={styles.imageContainer } />
    
    
     

      <View style = {{marginLeft: metrics.dimen_13}}>
        <View style = {{marginRight: metrics.dimen_13}}>

          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
          <Text style={styles.postedOnText}>
              {`${strings('Posted_On')}: ${Moment(item.createdAt).format('MMM DD, YYYY')}`}</Text>
         

              <TouchableOpacity
            style={{marginTop:metrics.dimen_12,marginRight:metrics.dimen_3}}
            onPress={()=>{
              this.generatelinklink(item)

                }}
          >
          <ShareCampaign
          
              width={metrics.widthSize(55)}
              height={metrics.widthSize(55)}
            /></TouchableOpacity>
          </View>
    
      <Text style = {{...styles.boldText, fontSize: metrics.text_16, marginBottom: metrics.dimen_5,color:"#3D4046"}}>{item.campaignTitle}</Text>
      
      <View style={{flexDirection:"row", marginBottom:(item.comments.length>0||item.likes.length>0)?metrics.dimen_6:metrics.dimen_2}}>
       {item.likes&&item.likes.length>0?
       <TouchableOpacity style={{flexDirection:'row',marginTop:metrics.dimen_2}} onPress={()=>{ this.openUserLike(item)}}>  
               
                <Heart
                  width={metrics.widthSize(50)}
                  height={metrics.widthSize(50)}
                />
               
         <Text style = {{marginLeft:metrics.dimen_8, marginRight:metrics.dimen_15, fontFamily:metrics.Lato_Regular, fontSize: metrics.text_11,color:"#7A818A",marginTop:Platform.OS === 'android' ?metrics.dimen_2:metrics.dimen_1 }}>{item.likes.length+" likes"}</Text>
         </TouchableOpacity> :null} 
     
      {item.comments&&item.comments.length>0?  
      
      <TouchableOpacity onPress={()=>{ this.openUserCommentBox(item)}}> 
      <View style={{flexDirection:'row',marginTop: metrics.dimen_2}}>
      <ChatLike
              width={metrics.widthSize(50)}
              height={metrics.widthSize(50)}
            />

     <Text style = {{marginLeft:metrics.dimen_8, marginRight:metrics.dimen_15, fontFamily:metrics.Lato_Regular, fontSize: metrics.text_11,marginTop:Platform.OS === 'android' ?metrics.dimen_2:metrics.dimen_1 ,color:"#7A818A"}}>{item.comments.length+" comments"}</Text>
       </View>
       </TouchableOpacity>:null} 

           </View>
      
      <ReadMore
          numberOfLines={2}
          renderTruncatedFooter={this._renderTruncatedFooter}
          renderRevealedFooter={this._renderRevealedFooter}
          // onReady={this._handleTextReady}
          >
          <Text style = {{...styles.mediumText, }}>{item.campaignDetails}</Text>
      </ReadMore>
      </View>
      <View style = {styles.viewPriceApplicantsList}>
      {/* {item.campaignType === "paid" && <Text style={{ ...styles.boldText, color: 'rgba(22, 88, 211, 1)' }}>
              {item.campaignAmountCurrency + " " + formatCurrency.format(item.campaignAmount)}
            </Text>} */}

        <View style={{backgroundColor:item.campaignType === "shoutout" ? '#58DC72' : item.campaignType === "paid" ? colors.app_Blue : "#FFC107", 
            paddingHorizontal:metrics.dimen_13, 
            height: metrics.dimen_25, 
            borderRadius: metrics.dimen_13, 
            justifyContent:'center'}}>

          {item.campaignType === "shoutout"&& <Text style={{ fontFamily: metrics.Lato_SemiBold,fontSize: metrics.text_13, color: colors.white }}>
            {"Shoutout Exchange"}
            </Text>}
            {item.campaignType === "paid"&& <Text style={{ fontFamily: metrics.Lato_SemiBold,fontSize: metrics.text_13, color: colors.white }}>
            {`Paid: ${convertCurrencybyCode(item.campaignAmountCurrency) + formatCurrency.format(item.campaignAmount)}`}
            </Text>}

            {item.campaignType === "sponsored"&& <Text style={{ fontFamily: metrics.Lato_SemiBold,fontSize: metrics.text_13, color: colors.white }}>
            {`Product Sponsor: ${convertCurrencybyCode(item.campaignAmountCurrency) + formatCurrency.format(item.campaignAmount)}`}             
            </Text>}

            
            
            {item.campaignType === "commissionBased"&& <Text style={{ fontFamily: metrics.Lato_SemiBold,fontSize: metrics.text_13, color: colors.white }}>
            {`Commission Based: ${formatCurrency.format(item.campaignAmount)+" "+"%"}`}             
            </Text>}

            {item.campaignType === "eventsAppearence"&& <Text style={{ fontFamily: metrics.Lato_SemiBold,fontSize: metrics.text_13, color: colors.white }}>
            {`Events Appearance: ${convertCurrencybyCode(item.campaignAmountCurrency) + formatCurrency.format(item.campaignAmount)}`}             
            </Text>}
            {item.campaignType === "photoshootVideo"&& <Text style={{ fontFamily: metrics.Lato_SemiBold,fontSize: metrics.text_13, color: colors.white }}>
            {`Photo / Video Shoot: ${convertCurrencybyCode(item.campaignAmountCurrency) +  formatCurrency.format(item.campaignAmount)}`}             
            </Text>}

            {/* <Text style={{ fontFamily: metrics.Lato_SemiBold,fontSize: metrics.text_13, color: colors.white }}>
            {item.campaignType === "shoutout" ? 
            "Shoutout Exchange": 
            item.campaignType!=="paid"? 
            `Sponsored: ${convertCurrencybyCode(item.campaignAmountCurrency) + " " + formatCurrency.format(item.campaignAmount)}` 
            
            : `Paid: ${convertCurrencybyCode(item.campaignAmountCurrency) + " " + formatCurrency.format(item.campaignAmount)}`}
            </Text> */}
            </View>
        {/* <Text style = {{...styles.boldText, color: 'rgba(22, 88, 211, 1)'}}>
          {item.campaignAmountCurrency + " " + formatCurrency.format(item.campaignAmount)}
          </Text> */}
        <View style = {{alignItems: 'center',  height:25, justifyContent:'center' ,marginRight:metrics.dimen_10}}>
          {/* <Image source = {campaignImage} style={{position:'absolute', width:'100%',height:'100%'}} resizeMode="stretch"/> */}
          <TouchableOpacity style = {styles.tagViewStyle} disabled = {item.campaignStatus !== 2 ? true : false}
            onPress={()=>this.props.navigation.navigate('ApplicantList', {JobData: item})}
          >
            <Image source = {item.campaignStatus === 3 ? images.jobAwarded : item.campaignStatus === 0 ? images.cautionIcon :images.timerIcon} style= {{marginLeft: metrics.dimen_10,marginTop:-metrics.dimen_1}} />
            <Text style = {{...styles.tagTextStyle}}>
              {item.campaignStatus === 1 ? strings('Awaiting_Approval') 
              : item.campaignStatus === 2 ? item.remarks.length > 0 ? item.remarks.filter(el=>el.remarkStatus === 1).length + " " + strings('Applications_Received') 
              : strings('New_Listing') : item.campaignStatus === 3 ? strings('Awarded') : strings('Inactive') }</Text>
            {/* {item.campaignStatus !== 3 && item.campaignStatus !== 0 ? <Image source = {images.rightArrow }style = {{marginTop:-metrics.dimen_2,marginRight: metrics.dimen_5}} />: <Image style = {{marginLeft: metrics.dimen_10,marginTop:-metrics.dimen_3}}/>} */}

          </TouchableOpacity>
        </View>
      </View>
      </View></View> 
    </TouchableOpacity></View> 

    )
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
}

export default inject("CompaignsStore")(observer(MyCompaign))

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
      color: '#7A818A',
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
    viewPriceApplicantsList: {
      alignItems:'flex-start',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: metrics.dimen_8, 
      marginBottom: metrics.dimen_10
    }
  
  })
