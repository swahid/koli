import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Platform,Alert } from 'react-native';
import { inject, observer } from 'mobx-react';
import metrics from '../../../Themes/Metrics';
import colors from '../../../Themes/Colors';
import { strings } from '../../../Locales/i18'
import images from '../../../Themes/Images';
import { Avatar } from 'react-native-paper'
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { SearchBar } from 'react-native-elements';

import { getUserId } from '../../../SupportingFIles/Utills';
import FastImage from 'react-native-fast-image';



class CampaignLike   extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchvisible: false,
      updatedsearch:"",
      isLoadingFirstTime: true,
      initialArr : Array.from({length: 11}, () => Math.floor(Math.random() * 15))

    };

  }

  SearchOnOf() {
  console.log("click")
    this.setState({ searchvisible: this.state.searchvisible === false ? true : false })
  }
  handleSearch = text => {

    const formattedQuery = text.toLowerCase()

    this.setState({updatedsearch:text})
       var filterdata = this.props.HomeStore.CampaignLikeList.filter(obj => obj.profile.first.toLowerCase().includes(formattedQuery) || obj.profile.last.toLowerCase().includes(formattedQuery))
       this.props.HomeStore.setlikeUserFilterList(filterdata)
     
  }
  
  
  componentDidMount() {
    const store = this.props.HomeStore
    store.getLikeByCampaign(this.props.route.params.campaignData.id)

    
    
    this.props.navigation.addListener('focus', () => {
      
    this.props.navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity style={styles.backButtonContainer}
          onPress={() => this.props.navigation.goBack()}
        >
          <Image source={images.backImage} />
        </TouchableOpacity>
      ),

      headerRight: () => (
        <View style={{ marginRight: metrics.dimen_15, flexDirection: 'row', }}>
         {store.CampaignLikeList.length !== 0&& <TouchableOpacity onPress={() => this.SearchOnOf()} >
            <Image source={images.search} />
          </TouchableOpacity>}
        </View>
      ),
    }
    )
  });
  
  }



  render() {
    const store = this.props.HomeStore
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
       
        {store.isLoadingLikelist===true?this.renderPlaceHolderView():null}

      {this.state.searchvisible===true? <View styles={{ flex: 1, marginHorizontal: metrics.dimen_10,marginTop:metrics.dimen_10 }}>
          <SearchBar
            lightTheme
            fontSize={metrics.dimen_12}
            fontFamily={metrics.Lato_Regular}
            placeholder={strings("Search")}
            onChangeText={(text) => this.handleSearch(text)}
             value={this.state.updatedsearch}
            containerStyle={{
              alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent',
              borderWidth: 0,
              borderTopWidth: 0,
              borderBottomWidth: 0,
            }}
            inputContainerStyle={{backgroundColor: colors.app_light_gray, shadowColor: colors.shadow_color, borderRadius: 20,  }}
            // icon={() => <Icon name={'camera'} color={Colors.app_gray} size={26} />
            // }
            onClear={() => {
              this.setState({updatedsearch:""})
              this.props.HomeStore.setlikeUserFilterList(this.props.HomeStore.CampaignLikeList)
            //this.setState({data:myCompaignsList})
            }}
          />
        </View>:null}

     
        <FlatList
          style={styles.FlatList}
          data={store.likeUserFilterList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => this.renderLikeUserItem(item,index)}
          keyExtractor={(item, index) => index.toString()}
       
        /> 

      </View>
    );
  }
  renderLikeUserItem = (item,index) => {
    let firstName = item.profile.first ? item.profile.first : ''
    let lastName = item.profile.last ? item.profile.last : ''

    const urlPic = item.profile.avatarUrl
    const imageUrl = (urlPic === null || urlPic === 'NA' || urlPic === '') ? images.userPlaceholder : { uri: urlPic }
    return (

      <View style={{ flexDirection: 'column' }}
      >
        <View style={styles.ListMainView}>
        <TouchableOpacity style={styles.imageViewContainer} onPress={()=>this.OpenUserProfile(item.profile)}>
          {/* <View style={styles.imageViewContainer}> */}
          <FastImage 
           source={imageUrl}
           size={55}
                fallback
                defaultSource={images.userPlaceholder}
                style={{height:metrics.dimen_54,width:metrics.dimen_54,borderRadius:metrics.dimen_27}}
                />

          
            {/* <Avatar.Image
              source={imageUrl}
              size={55}
            />   */}
          {/* </View> */}
          </TouchableOpacity>


          <View style={styles.datamainViewContainer}>
          <TouchableOpacity  onPress={()=>this.OpenUserProfile(item.profile)}>

            <Text numberOfLines={1} style={[styles.title]}>{firstName + " " + lastName}</Text>
            <Text numberOfLines={1} style={[styles.subtitle]}>{item.profile.username ? "@" + item.profile.username : ""}</Text></TouchableOpacity>
          </View>
          {/* this.props.HomeStore.UserLoginID */}
          {parseInt(this.props.HomeStore.UserLoginID,10)!==parseInt(item.ownerId,10)?this.userFolloAndFollowing(item,index):<View style={{width:metrics.dimen_96}}></View>}
          
         


            
          

        </View>
        <View style={[styles.seprater]}></View>
      </View>
    )
  }

  userFolloAndFollowing=(item,index)=>
  {
  return (
  
    item.isFollowed===false? <View 
      style={styles.buttonclick}>
             <TouchableOpacity style={styles.touchablestyle}
               onPress={() => this.props.AuthStore.isLogin?this.showFollowAlert(item.ownerId,'1',index): this.props.navigation.navigate('AuthStack') }>
               <Text style={styles.followunfollowtext}>{strings("Follow")}</Text>
             </TouchableOpacity></View>:
              <View style={styles.buttonfollowing} >
               <Text style={styles.followingText}>{strings("Following")}</Text>
               </View>
  
  )}

  showFollowAlert = (followUserId,type,index) => {
    
     this.props.UserProfileStore.userFollow(followUserId, type)
     let likeuserList=this.props.HomeStore.likeUserFilterList
     console.log("index==",index)
   var arr = [...likeuserList]
   console.log("arr",arr)
   arr[index].isFollowed = true

    this.props.HomeStore.setCampaignLikeList(arr)
    this.props.HomeStore.setlikeUserFilterList(arr)

    
    setTimeout(() => {
      this.props.HomeStore.getUserFollowesList()
  
    }, 1000);
  }

  renderPlaceHolderView = () => {
    return (
      this.state.initialArr.map(obj => (
        <SkeletonPlaceholder>


          {/* <View
            style={[styles.sectionHeader, { height: 15, width: '20%', marginTop:10 }]}
          /> */}
          <View style={[styles.itemMainView, {paddingTop: metrics.dimen_5}]}>

            <View style={styles.imageType} />
            <View style={styles.textContentView}>
              <View style={[styles.textblockuser, { width: '95%', height: 50, borderRadius: 4, marginTop: 6, }]} />
              <View style={[styles.textblockbutton, { width: '20%', height: 10, }]} />
              {/* <View
                style={[styles.borderBottomLine, { width: metrics.width, marginLeft: -metrics.dimen_100 }]}
              /> */}
            </View>

          </View>
        </SkeletonPlaceholder>
      ))
    )
  }
  

  OpenUserProfile(item)
  {
    getUserId().then(userId => {
     
    if( parseInt(item.ownerId, 10) !== parseInt(userId, 10) )
    {
     
      this.props.navigation.navigate('UserProfile',{UserData: item})
  
    }else
    {
      if(this.props.AuthStore.isLogin)
      {
        this.props.navigation.navigate('Account')

      }else
      {
        this.props.navigation.navigate('UserProfile',{UserData: item})

      }
  
    }
  })
  }

 

}
export default inject('UserProfileStore', "AuthStore","HomeStore")(observer(CampaignLike))


const styles = StyleSheet.create({
  FlatList: {
    flex: 1,    
    marginTop:metrics.dimen_16

  },

  ListMainView: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    height: metrics.getW(50),
    marginLeft: metrics.dimen_2,
    marginRight: metrics.dimen_5,
    backgroundColor: colors.white,

  },
  imageViewContainer: {

    height: metrics.getW(60),
    overflow: 'hidden',
    width: '20%',
  },
  datamainViewContainer: {
   // height: metrics.getW(70),
    alignSelf:'center',
    //overflow: 'hidden',
     width: '46%',
    // width: '74%',

  },
  title:
  {
    fontSize: metrics.text_medium,
    color: "#363636",
    fontFamily: metrics.Lato_Bold,
    textTransform: 'capitalize',
  },
  subtitle:
  {
    fontSize: metrics.text_medium,
    fontFamily: metrics.Lato_Regular,
    color: "#7A818A",

  },
  seprater:
  {
    // borderWidth: 0.5,
    // borderColor: colors.disable_gray_color,
marginVertical:metrics.dimen_15

  },
  backButtonContainer: {
    marginLeft: metrics.dimen_16, 
    marginTop: Platform.OS == 'android' ? metrics.dimen_4 : 0
  },

  noviewccontainer:
  {
    flex: 1, width: '100%',
    height: '100%',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: metrics.dimen_100
  },

  noviewImage:
  {
    width: metrics.dimen_100,
    height: metrics.dimen_100,
    alignSelf: 'center'

  },
  noblocktitle:
  {
    color: colors.gray,
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_16,
    textAlign: 'center',
  },
  noblocksubtitle:
  {
    color: colors.gray,
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_normal,
    textAlign: 'center',
    marginTop:metrics.dimen_2
  },
  crossImage:
  {
    width: metrics.dimen_20,
    height: metrics.dimen_20
  },

  buttonclick:
  {
    width: metrics.dimen_96, 
    height: metrics.dimen_35, 
    justifyContent: 'center', 
    alignContent: 'center', 
    marginTop:metrics.dimen_6,
    marginRight: metrics.dimen_5,
    borderRadius: 5,
    backgroundColor: '#4E8BFE',
    alignItems: 'center',
  },

  buttonfollowing:
  {
    width: metrics.dimen_96, 
    height: metrics.dimen_35, 
    justifyContent: 'center', 
    alignContent: 'center', 
    marginTop:metrics.dimen_6,
    marginRight: metrics.dimen_5,
    borderRadius: 5,
    borderWidth:1,
    borderColor:"#E9E9E9",
   
    alignItems: 'center',
  },
  userImage: {
    marginLeft: metrics.dimen_12,
    marginVertical: metrics.dimen_13,
    marginRight: metrics.dimen_18,
    height: metrics.dimen_50,
    width: metrics.dimen_50,
    borderRadius: metrics.dimen_25,

},

itemMainView: {
  flexDirection: 'row',
  paddingTop: metrics.dimen_10,
  paddingRight:metrics.dimen_10,
  height: metrics.getH(75),
},
imageType: {
  marginLeft: metrics.dimen_10,
  width: metrics.dimen_44,
  height: metrics.dimen_44,
  marginTop:metrics.dimen_12,
  borderRadius:metrics.dimen_22
},
textContentView: {
  marginHorizontal: metrics.dimen_13,
  flexDirection: 'column',
  flex:1

},
textblockuser: {
  fontFamily: metrics.Lato_Regular,
  fontSize: metrics.text_normal,
  color: '#3E3E46',
},
textblockbutton: {
  fontFamily: metrics.Lato_Regular,
  fontSize: metrics.text_medium,
  marginTop: metrics.dimen_6,
  marginBottom: metrics.dimen_8,
  color: colors.app_gray
},
followunfollowtext: {
  fontFamily: metrics.Lato_SemiBold,
  fontSize: metrics.text_medium,
  color: colors.white,
},
followingText:{
  fontFamily: metrics.Lato_SemiBold,
  fontSize: metrics.text_medium,
  color: "#3E3E46",
  
}
})