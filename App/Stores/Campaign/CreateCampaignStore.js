import { action, observable, decorate } from 'mobx';
import { getUserId, showAlert } from '../../SupportingFIles/Utills';
import { postCampaign, getCampaigndatabyid, doCampaignsupdate, getCampaignCategories } from '../../API/Campaign/ApiCampaign';
import { strings } from '../../Locales/i18';
import Moment from 'moment'



class CreateCampaignStore {
    constructor(rootStore) {
        this.rootStore = rootStore
    }

    campainData = {
        ownerId: '',
        pricePerInstaStory: '',
        storyDate:'',
        lookingInfluencerGender: 'Any',
        country: 'All',
        countryCode: 'NA',
        city: 'All',
        shipping: '',
        productSwipeLink: '',
        tags: [],
        hashtags: [],
        campaignDetails: '',
        campaignTitle: '',
        campaignImage: '',
        endStoryPostDate: '',
        imagegallery: [],
        campaigntype: '',
        campaignid: '',
        followercountcampaign:'',
        campaignCategories:[],
        campaignStatus:'',
        minAge: '',
        maxAge: '',
        campaignType: 'paid',
        countryArr: [],
        socialMediaTags:[],
        minMaxAge: [],
        commisionbase:0

    }
    validationError = {}
    showDatePicker = false
    showImagePicker = false
    user = ""
    hashTag = ''
    imagePath = ''
    uploadingImage = false
    enabled = false
    isLoading = false
    jobPosted = false
    categoriesArray = []
    navigation = ''
    categoriesLoading = false
    socialmediaTagsforupdate=""
    ageforupdate=""

   
    resetCategoryArray = ()=>{
        this.categoriesArray = []
    }

    setCategoriesLoading = (loading) =>{
        this.categoriesLoading=loading

    }
    setNavigation = (navigation) => {
        this.navigation = navigation
    }
    setfollowercountcampaign = (followercountcampaign) => {
        this.followercountcampaign = followercountcampaign
    }
    setCountry = (country) => {
        this.country = country
    }

    setcountryCode = (countryCode) => {
        this.countryCode = countryCode
    }  
    setImageUplaoding = (uploading) => {
        this.uploadingImage = uploading
    }
    setImagePath = (path) => {
        this.imagePath = path
    }
    setShowDatePicker = (show) => {
        this.showDatePicker = show
    }
    setShowImagePicker = (show) => {
        this.showImagePicker = show
    }
    setUser = (value) => {
        this.user = value
    }
    setHashTag = (value) => {
        this.hashTag = value
    }
    setCampaignData = (data) => {
        this.campainData = { ...this.campainData, ...data }
    }

    setimagegallery = (imagegallery) => {
        this.imagegallery = imagegallery
    }

    setcampaigntype = (campaigntype) => {
        this.campaigntype = campaigntype
    }
    setcampaignid = (campaignid) => {
        this.campaignid = campaignid
    }

    setValidationData = (data) => {
        this.validationError = { ...this.validationError, ...data }
    }

    setsocialMediaTags = (socialMediaTags) => {
        this.socialMediaTags = socialMediaTags
    }
    setsocialmediaTagsforupdate=(socialmediaTagsforupdate)=>
    {
        this.socialmediaTagsforupdate=socialmediaTagsforupdate
    }

    setageforupdate=(ageforupdate)=>
    {
        this.ageforupdate=ageforupdate
    }

    
    setminMaxAge=(minMaxAge) =>{
        this.minMaxAge=minMaxAge
    }
    deleteValidationError = (param) => {
        switch (param) {
            case 'priceError':
                delete this.validationError.priceError
                break;
            case 'dateError':
                delete this.validationError.dateError
                break;
            case 'shippingError':
                delete this.validationError.shippingError
                break;
            case 'productUrlError':
                delete this.validationError.productUrlError
                break;
            case 'CampaignDetailError':
                delete this.validationError.CampaignDetailError
                break;
            case 'categoryError':
                delete this.validationError.categoryError
                break;
            case 'countryError':
                delete this.validationError.countryError
                break;
            default:
                break;
        }
    }
    removeTagFromIndex = (index) => {
        this.campainData.tags.splice(index, 1)
        this.setCampaignData({ tags: this.campainData.tags })
    }
    removeHashTagFromIndex = (index) => {
        this.campainData.hashtags.splice(index, 1)
        this.setCampaignData({ tags: this.campainData.tags })
    }

    removesocialMediaTagsFromIndex = (index) => {
        this.campainData.socialMediaTags.splice(index, 1)
        this.setCampaignData({ socialMediaTags: this.campainData.socialMediaTags })
    }
    setEnabled = (enable) => {
        this.enabled = enable
    }
    setLoading = (loading) => {
        this.isLoading = loading
    }
    setJobPosted = (posted) => {
        this.jobPosted = posted
         const catsArray = this.categoriesArray.slice()
        const updatedArr = catsArray.map((el) => {
      el.isSelected=false
      return el
    })
    this.setCatgoriesList(updatedArr)
    }
    getCountryCodeStr = () =>{
        const countryCodeArray = this.campainData.countryArr.map(function(item) {
            return item.cca2
          }); 
          return countryCodeArray.toString()
    }
    getCountryNameStr = () =>{
        const countryNameArray = this.campainData.countryArr.map(function(item) {
            return item.name
          });  
          return countryNameArray.toString()
    }

    getsocialMediaTagsNameStr = () =>{
        const socialMediaTags = this.campainData.socialMediaTags.map(function(item) {
          
            return item.type

           
          });  
          
            return socialMediaTags.toString()

           
    }
    postCampaign = () => {
        this.setLoading(true)
        const catNamesArray = this.campainData.campaignCategories.map(function(item) {
            return item.categoryName;
          });
        const countryCodeArray = this.campainData.countryArr.map(function(item) {
            return item.cca2
          });  
          const countryNameArray = this.campainData.countryArr.map(function(item) {
            return item.name
          });  
        getUserId().then(userId => {
            const param = {
                ownerId: userId,
                endStoryPostDate: this.campainData.endStoryPostDate,
                tags: this.campainData.tags.toString(),
                hashtags: this.campainData.hashtags.toString(),
                campaignAmountCurrency: 'USD',
                shipping: this.campainData.shipping == "Yes" ? true : false,
                campaignAmount: this.campainData.pricePerInstaStory,
                campaignImage: this.campainData.campaignImage[0],
                campaignGallery: this.campainData.campaignImage,
                campaignDetails: this.campainData.campaignDetails.trim(),
                campaignTitle: this.campainData.campaignTitle.trim(),
                lookingInfluencerGender: this.campainData.lookingInfluencerGender,
                //country: this.campainData.country,
                country: this.getCountryNameStr(),
                minimumFollowers:this.campainData.followercountcampaign === "Any" ? "" : this.campainData.followercountcampaign,
                countryCode: this.getCountryCodeStr(),
               // countryCode: this.campainData.country==='All'?"NA":this.campainData.countryCode,
                productUrl: "NA",
                campaignCategories:catNamesArray,
                minAge: this.campainData.minAge,
                maxAge: this.campainData.maxAge,
                minMaxAge:this.campainData.minMaxAge,
                campaignType: this.campainData.campaignType,
                socialMediaTags:this.getsocialMediaTagsNameStr(),
                commission:this.campainData.commisionbase
            }
            console.log('postCampaign param:',param)
            postCampaign(param).then(response => {
                this.setLoading(false)
                const { status } = response
                // console.log("campain data request param =", response)

                if (status == 200) {
                    this.setJobPosted(true)
                } else {
                    showAlert('', strings('SomethingWentWrong'))
                }
                console.log("campain data response =", response)
            }).catch(error => {
                this.setLoading(false)
                console.log("campain data response =", error)
            })
        })
    }

    updateCampaign = () => {
        this.setLoading(true)
        const selectedCategories = this.categoriesArray.filter(item => {
            return item.isSelected
        })
        const catNamesArray = selectedCategories.map(function(item) {
            return item.categoryName;
          });
        getUserId().then(userId => {
            const param = {
                ownerId: userId,
                endStoryPostDate: this.campainData.endStoryPostDate,
                tags: this.campainData.tags.toString(),
                hashtags: this.campainData.hashtags.toString(),
                campaignAmountCurrency: 'USD',
                shipping: this.campainData.shipping == "Yes" ? true : false,
                campaignAmount: this.campainData.pricePerInstaStory,
                campaignImage: this.campainData.campaignImage[0],
                campaignGallery: this.campainData.campaignImage,
                campaignDetails: this.campainData.campaignDetails.trim(),
                campaignTitle: this.campainData.campaignTitle.trim(),
                lookingInfluencerGender: this.campainData.lookingInfluencerGender,
                //country: this.campainData.country,
                minimumFollowers:this.campainData.followercountcampaign === "Any" ? "" : this.campainData.followercountcampaign,
                //countryCode: this.campainData.country==='All'?"NA":this.campainData.countryCode,
                productUrl: "NA",
                campaignCategories:catNamesArray,
                minAge: this.campainData.minAge,
                maxAge: this.campainData.maxAge,
                minMaxAge:this.campainData.minMaxAge,
                campaignType: this.campainData.campaignType,
                country: this.getCountryNameStr(),
                countryCode: this.getCountryCodeStr(),
                socialMediaTags:this.getsocialMediaTagsNameStr(),
                commission:this.campainData.commisionbase


            }
            console.log('postCampaign param:',param)
            doCampaignsupdate(param, this.campainData.campaignid).then(response => {
                this.setLoading(false)
                const { status } = response
                console.log('postCampaign response:',response)

                if (status == 200) {
                    this.setJobPosted(true)
                } else {
                    showAlert('', strings('SomethingWentWrong'))
                }
                console.log("campain data response =", response)
            }).catch(error => {
                this.setLoading(false)
                console.log("campain data response =", error)
            })
        })
    }


    getCampaigndatabyid = (campaignid) => {
        this.setLoading(true)
        getCampaigndatabyid(campaignid).then(response => {
            const { status, data } = response
            if (status === 200) {
                console.log('getCampaigndatabyid:',data)
                this.setLoading(false)
                let campaignamount = (data.campaignAmount).toString()
                this.setCampaignData({ pricePerInstaStory: campaignamount })
               this.setCampaignData({ storyDate: Moment(data.endStoryPostDate).format('DD/MM/YYYY'), endStoryPostDate: Moment(data.endStoryPostDate).format('YYYY-MM-DD') })
                this.setCampaignData({ lookingInfluencerGender: data.lookingInfluencerGender=='both'?'Any':data.lookingInfluencerGender })
                this.setCampaignData({ country: data.country })
                this.setCampaignData({ countryCode: data.countryCode })

                this.setCampaignData({ shipping: data.shipping == false ? 'No' : 'Yes' })
                if (data.hashtags) {
                    var hashtagsArray = data.hashtags.split(',');

                }
                this.setCampaignData({ hashtags: data.hashtags ? hashtagsArray : [] })
                this.setCampaignData({ campaignDetails: data.campaignDetails })
                this.setCampaignData({ campaignTitle: data.campaignTitle })
                this.setCampaignData({ imagegallery: data.campaignGallery })

                this.setCampaignData({ imagegallery: data.campaignGallery })
                this.setCampaignData({followercountcampaign:data.minimumFollowers})
                this.setCampaignData({ campaignCategories: data.campaignCategories })
                this.setCampaignData({ campaignStatus: data.campaignStatus })
                this.setCampaignData({ campaignType: data.campaignType })
                this.setsocialmediaTagsforupdate(data.socialMediaTags?data.socialMediaTags:"")
                this.setCampaignData({ minAge: data.minAge?data.minAge:"" })
                this.setCampaignData({ maxAge: data.maxAge?data.maxAge:"" })
                this.setCampaignData({minMaxAge:data.minMaxAge?data.minMaxAge:""})
                let commission = (data.commission?data.commission:"")
                this.setCampaignData({commisionbase:commission})
                this.navigation.navigate('CreateCampaignForm',{type:'Edit',campaignid:campaignid})
                // minimumFollowers:this.campainData.followercountcampaign,
                if(this.categoriesArray.length>0)
                { console.log('categoriesArray:',this.categoriesArray)
                const catsArray = this.categoriesArray.slice()
                    var selectedCats = catsArray.map((item,index) => {
                        console.log('categoryList:',data.campaignCategories.includes(item.categoryName))
    
                        if(data.campaignCategories.indexOf(item.categoryName) > -1)
                        {
                           // item.isSelected=true
                                                    return this.setSelectDeselectCatgories(index)
                        }
                        // else
                        // {
                        //    // item.isSelected=false
                        // }
                      //return item
                  })
                 // this.setCatgoriesList(selectedCats)
                }
                else
                {
                    this.getCatgoriesList()
                }
                

            }
        }).catch(error => {
            this.setLoading(false)
            console.log("campain data  =", error)
        })

    }
    getCatgoriesList = (param) => {
        this.setCategoriesLoading(true)
        getCampaignCategories(param)
            .then(response => {
                this.setCategoriesLoading(false)
                if(response.status === 200)
                {
                    let categoryList = response.data.map(el=>{
                        el.isSelected = false
                        return el
                    })
                    categoryList.push({categoryName:'Any'})
                   
                    console.log("this.campainData.campaignCategories:", this.campainData.campaignCategories)
                    var selectedCats = categoryList.map(item => {
                        console.log('categoryList:',this.campainData.campaignCategories.includes(item.categoryName))

                        if(this.campainData.campaignCategories.indexOf(item.categoryName) > -1)
                        {
                            item.isSelected=true
                        }
                      return item
                  })
                  console.log('selectedCats:',selectedCats)
          
                   selectedCats = selectedCats.filter(item => {
                      return item.isSelected
                  })
                  console.log('selectedCats:',selectedCats)
                  this.setSelectedCatgoriesList(selectedCats)
                  this.setCatgoriesList(categoryList)


                }

            })
            .catch(error => {
                this.setCategoriesLoading(false)
            })
    }
    setCatgoriesList = (data) => {

        this.categoriesArray = data.sort((a, b) => a.categoryName.localeCompare(b.categoryName))

    }
    setSelectDeselectCatgories = (cattype,index) => {
        if(cattype=='Any'){
            console.log("Any")
            console.log(this.categoriesArray)
            this.categoriesArray = this.categoriesArray.map((e,x)=>{
                if(e.categoryName=='Any'){
                    e.isSelected=!e.isSelected
                }else{
                    e.isSelected=false
                }
                return e
            })
        }else{
            console.log("Individual")
            this.categoriesArray = this.categoriesArray.map((e,x)=>{
                if(e.categoryName=='Any'){
                    e.isSelected=false
                }
                return e
            })
            this.categoriesArray[index].isSelected = !this.categoriesArray[index].isSelected
           
        }
    }
    setSelectedCatgoriesList = (data) => {
        this.campainData.campaignCategories=data
        this.deleteValidationError('categoryError')

    }
    
}

decorate(CreateCampaignStore, {
    campainData: observable,
    showDatePicker: observable,
    showImagePicker: observable,
    validationError: observable,
    user: observable,
    hashTag: observable,
    imagePath: observable,
    uploadingImage: observable,
    enabled: observable,
    isLoading: observable,
    jobPosted: observable,
    imagegallery: observable,
    campaigntype: observable,
    campaignid: observable,
    campaignTitle:observable,
    countryCode:observable,
    followercountcampaign:observable,
    categoriesArray:observable,
    campaignCategories:observable,
    campaignStatus:observable,
    minAge: observable,
    maxAge: observable,
    navigation: observable,
    categoriesLoading: observable,
    socialMediaTags:observable,
    socialmediaTagsforupdate:observable,
    minMaxAge:observable,
    ageforupdate:observable,

    setNavigation: action,
    setCampaignData: action,
    setShowDatePicker: action,
    setShowImagePicker: action,
    setValidationData: action,
    deleteValidationError: action,
    setUser: action,
    setHashTag: action,
    removeHashTagFromIndex: action,
    removeTagFromIndex: action,
    setImagePath: action,
    setImageUplaoding: action,
    setEnabled: action,
    setLoading: action,
    postCampaign: action,
    setJobPosted: action,
    setCountry: action,
    setcountryCode:action,
    setcampaigntype: action,
    setcampaignid: action,
    setcampaignTitle:action,
    setfollowercountcampaign:action,
    setCatgoriesList:action,
    getCatgoriesList:action,
    setSelectDeselectCatgories:action,
    setSelectedCatgoriesList:action,
    setCategoriesLoading:action,
    resetCategoryArray:action,
    setsocialMediaTags:action,
    removesocialMediaTagsFromIndex:action,
    setsocialmediaTagsforupdate:action,
    setminMaxAge:action,
    setageforupdate:action

});
export default CreateCampaignStore;