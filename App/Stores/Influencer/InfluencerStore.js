import {action, observable, decorate, remove} from 'mobx';
import {Alert} from 'react-native';

import {getAllInfluencer} from '../../API/Profile/User/ApiInfluencer';
import {gettUserData} from '../../SupportingFIles/Utills';

class InfluencerStore {
    constructor(rootStore) {
        this.rootStore = rootStore
    }
    isLoading = false
    InfluencerList = []
    TempInfluencerList = []
    selectedCountry = ""
    selectedCountryCode=""
    selectedState = ""
    userExist = false
    hasNextPage = 0
    end_curser = false
    offSetlength = 50
    Sortby='3'
    fetchingNextPageData = false
    userLatitute = ''
    userLongitude = ''
    refreshing = false
    showInfluencerSortPopup = false
    actionType = ""

  setUserLocation = (userLatitute, longitude) => {
    this.userLatitute = userLatitute;
    this.userLongitude = longitude;
  };
  setActionType = (type) => {
    this.actionType = type;
  };
  setShowInfluencerPopup = (showPopup) => {
    this.showInfluencerSortPopup = showPopup;
  };
  setSortby = (Sortby) => {
 
    this.Sortby = Sortby;
  };
  setEndCurser = (end_curser) => {
    this.end_curser = end_curser;
  };

    // setActionType = (type)=>{
    //     this.actionType = type
    // }
    // setShowInfluencerPopup = (showPopup) =>{
    //     this.showInfluencerSortPopup = showPopup
    // }
    // setSortby = (Sortby) => {
    //     this.Sortby = Sortby
    // }
    // setEndCurser = (end_curser) => {
    //     this.end_curser = end_curser
    // }
    setCountry = (val)=>{
        console.log(val)
        this.selectedCountry = val.label
        this.selectedCountryCode=val.countryCode
        
        // if(this.TempInfluencerList.length>0){
        //     let tempArr = []
        //     this.TempInfluencerList.map(e=>{
        //         if(e.country==country){
        //            tempArr.push(e)
        //         }
        //     },[])
        //     console.log('tempArr',tempArr)
        //     this.InfluencerList = tempArr
        // }
    }
    setState= (state)=>{
        this.selectedState = state
    }
    setInfluencerList = (InfluencerList) => {
        this.InfluencerList = InfluencerList
        this.TempInfluencerList = InfluencerList
    }

    setisLoading = (loading) => {
        this.isLoading = loading
        this.refreshing = loading
    }
    setIsRefreshing = (refreshing) =>{
        this.refreshing = refreshing
    }
    setFetchingData = (fetching) => {
        this.fetchingNextPageData = fetching
    }

  checkValidUrl = (url) => {
    //define some image formats
    var types = ['jpg', 'jpeg', 'tiff', 'png', 'gif', 'bmp'];

    //split the url into parts that has dots before them
    var parts = url.split('.');

    //get the last part
    var extension = parts[parts.length - 1];

    //check if the extension matches list
    if (types.indexOf(extension) !== -1) {
      return true;
    }
  };

  checkUrlMatches = (url) => {
    let url1 = new RegExp('//koli-media');

    if (url1.test(url)) {
      return true;
    } else {
      return false;
    }
    
  };

  getInfluencerList = () => {
    try {
      this.setisLoading(true);
      console.log('URL SORT BYYYY', this.Sortby);
      getAllInfluencer(
        this.hasNextPage,
        this.Sortby,
        this.userLatitute,
        this.userLongitude,
        this.selectedCountry,
        this.selectedState
      ).then((response) => {
        this.setisLoading(false);
        console.log('response.data.message.length', response);
        if (Array.isArray(response.data) == true) {
          let obj = {data: {message: response.data}};
          console.log(obj);
          let check =
            obj.data.message &&
            obj.data.message.filter((it, index) => {
              console.log(it);
              // let cc = it.avatarUrl ? this.checkValidUrl(it.avatarUrl) :undefined
              // let url1 = new RegExp("//koli-media")
              let removeItem = this.checkUrlMatches(it.avatarUrl);
              console.log('includes', removeItem, index);
              // if(cc==undefined){
              //     obj.data.message.splice(index,1)
              // }
              // else
              if (removeItem == true) {
                // obj.data.message.splice(index,1)
                return it;
              }
            });
          console.log('ccccc', check);
          if (this.Sortby >= 3 && check.length > 0) {
            gettUserData().then((data) => {
              console.log('data===---', data);
              if (data !== null) {
                const influencerlistdata = check.filter(
                  (el) => el.ownerId !== data.ownerId,
                );
                //    if( data.avatarUrl!==""||data.avatarUrl!==null){
                //    influencerlistdata.splice(0, 0,{"avatarUrl": data.avatarUrl,"ownerId": data.ownerId} )
                //    }
                // influencerlistdata = obj.data.message.map((it,ix)=>{
                //        if(it.ownerId==data.ownerId){
                //            influencerlistdata.splice(index,1)
                //        }
                //    })
                console.log('list', influencerlistdata);
                this.setInfluencerList(
                  removeDuplicates(influencerlistdata, 'avatarUrl'),
                );
              } else {
                console.log('message', check);
                this.setInfluencerList(removeDuplicates(check, 'avatarUrl'));
              }
            });
          } else {
            console.log('elseCheck', check);
            this.setInfluencerList(removeDuplicates(check, 'avatarUrl'));
          }
          // this.setInfluencerList(response.data.message)
        
          if (obj.data.message.length === this.offSetlength) {
            this.hasNextPage = this.hasNextPage + obj.data.message.length;
          }
        } else if (
          response.data.message &&
          Array.isArray(response.data.message)
        ) {
          let check =
            response.data.message &&
            response.data.message.filter((it, index) => {
              // let cc = this.checkValidUrl(it.avatarUrl)
              //    let url1 = new RegExp("//koli-media")
              let removeItem = this.checkUrlMatches(it.avatarUrl);
              console.log('includes', removeItem, index);

              // if(cc==undefined){
              //     response.data.message.splice(index,1)
              // }
              if (removeItem == true) {
                // obj.data.message.splice(index,1)
                return it;
              }
              // return it
            });
          console.log(check);
          if (this.Sortby === 3 && check.length > 0) {
            gettUserData().then((data) => {
              if (data !== null) {
                const influencerlistdata = check.filter(
                  (el) => el.ownerId !== data.ownerId,
                );
                influencerlistdata.splice(0, 0, {
                  avatarUrl: data.avatarUrl,
                  ownerId: data.ownerId,
                });
                this.setInfluencerList(
                  removeDuplicates(influencerlistdata, 'avatarUrl'),
                );
              } else {
                this.setInfluencerList(removeDuplicates(check, 'avatarUrl'));
              }
            });
          } else {
            this.setInfluencerList(removeDuplicates(check, 'avatarUrl'));
          }
          // this.setInfluencerList(response.data.message)
          if (response.data.message.length === this.offSetlength) {
            this.hasNextPage = this.hasNextPage + response.data.message.length;
          }
        }
      });
    } catch (error) {
      console.log('error',error);
    }
  };


  getInfluencerNextPage = () => {
    this.setisLoading(false);
    this.setFetchingData(true);
    console.log('getAllInfluencer offset:', this.hasNextPage);

    getAllInfluencer(
      this.hasNextPage,
      this.Sortby,
      this.userLatitute,
      this.userLongitude,
      this.selectedCountryCode,
      this.selectedState
    ).then((response) => {
      let list = [];
      console.log('ressssssss', response);
      if (Array.isArray(response.data) == true) {
        if (response.data.length === this.offSetlength) {
          this.hasNextPage = this.hasNextPage + 1;

          list = response.data
            ? [...this.InfluencerList, ...response.data]
            : this.InfluencerList;
         
        } else {
          list = response.data
            ? [...this.InfluencerList, ...response.data]
            : this.InfluencerList;
        
          this.setEndCurser(true);
        }
      } else {
        if (response.data.message.length === this.offSetlength) {
          this.hasNextPage = this.hasNextPage + 1;

          list = response.data.message
            ? [...this.InfluencerList, ...response.data.message]
            : this.InfluencerList;
          
        } else {
          list = response.data.message
            ? [...this.InfluencerList, ...response.data.message]
            : this.InfluencerList;
          
          this.setEndCurser(true);
        }
      }

      this.hasNextPage = list.length;
      // list = list.filter((it, index) => {
      //   console.log(it);
      //   let removeItem = this.checkUrlMatches(it.avatarUrl);
       
      //   if (removeItem == true) {
      //     return it;
      //   }
      // });
      this.setInfluencerList(removeDuplicates(list, 'avatarUrl'));
      this.setFetchingData(false);
    });
  };

}
const removeDuplicates = (arr, prop) =>
  arr.reduce((accumulator, currentValue) => {
    if (!accumulator.find((obj) => obj[prop] === currentValue[prop])) {
      accumulator.push(currentValue);
    }
    return accumulator;
  }, []);

decorate(InfluencerStore, {
    InfluencerList: observable,
    // TempInfluencerList:observable,
    isLoading: observable,
    Sortby:observable,
    fetchingNextPageData:observable,
    userLatitute:observable,
    userLongitude:observable,
    refreshing: observable,
    showInfluencerSortPopup: observable,
    selectedCountry:observable,
    selectedState:observable,
    selectedCountryCode:observable,
    setInfluencerList: action,
    setisLoading: action,
    getInfluencerList: action,
    setHasNextPage: action,
    setEndCurser: action,
    setSortby:action,
    setFetchingData:action,
    setUserLocation:action,
    setIsRefreshing: action,
    setShowInfluencerPopup: action,
    setActionType: action,
    setCountry:action,
    setState:action

  
});
export default InfluencerStore;
