import { Platform ,Alert} from 'react-native';
import { action, observable, decorate, } from 'mobx';
import {
    getCampaigns,
    getMyCampaigns,
    getJobStatus,
    reportCampaign,
    applyForCampaign,
    doCampaignsupdate,
    getMostAppliedCampaigns,
    getMostappliedrecent,
    doupdatedeviceinfo,
    getMyApplications,
    getStripeData,
    initiateInflencerPayment,
    markCampaignCompleted,
    delUserfromRemarkList,
    getCampaignDetailsdata,
    getCampaignCategories,
    getremarkDetails,
    cancelCampFromBothInfluenerBrand,
} from '../../API/Campaign/ApiCampaign';
import { registerStripeAccount, updateUserProfile, getAppVersions, } from '../../API/Profile/User/ApiProfile';

import { getUserId, 
    showAlert, 
    getAccessToken, 
    setUserData, 
    showFlashBanner,
    setFeesAndCommission
 } from '../../SupportingFIles/Utills';

import { strings } from '../../Locales/i18';
import moment from 'moment'
import DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';
import stripe from 'tipsi-stripe'
// import CryptoJS from "react-native-crypto-js";
import { showToast } from '../../SupportingFIles/Utills';
import Config from "react-native-config";
import { act } from 'react-native-testing-library';
var CryptoJS = require("crypto-js");


class CompaignsStore {
    constructor(rootStore) {
        this.rootStore = rootStore
    }

    isLoading = true
    campaignStatusLoading = true
    applyCampaignLoading = false
    appliedForCampaign = false
    compaignsList = []
    myApplicationsList = []
    mergecampaignlist = []
    myCompaignsList = []
    isRefreshing = false
    isRefreshingMyCampaign = false
    jobAwarded = null
    showReport = false
    campaignReportd = false
    report = ''
    campaignRemark = ''
    jobStatus = null
    updatecampaign = null
    // filter
    FilterApply = false
    SortApply = false
    country = 'All'
    city = ''
    gender = ''
    pricerangemin = 0
    pricerangemax = 0
    agegroup = ''
    updatedsearch = ''
    Sortby = 1
    campaigntype = ''
    stripePublishableKey = ''
    stripeSecretKey = ''
    navigation = null
    isSwipeViewActive = false
    markAsDoneText = ''
    taskUrl= ''
    showMarkAsDonePopup = false
    isAppUpdate = false
    isFetchedData = false
    searchedCampaigns = []
    campaignDataById = null
    lastFetchedCount = 0
    end_curser = false
    offSetlength = 100
    skip = 0
   refreshNewContent = true
    campaignAppliedRemarkId = ''
    sortcompaignsList = []
    campaignByRemarklist=[]
    minAge= ''
    maxAge= ''
    categoryfilter= ''
    showMessageUpdateVersion=false
    campaignDetailData=[]
    feesAndTransactionData = ""

    CategoryData=[]
    categoriesArray = []
    MyBidFee=''
    RaiseDisputePopupStatus=false
    counterOfferPopupStatus=false
    appliedRemarkData=[]
    counterAmount=""
    isPayment = ""
    isPaymentReleased=""

    setCampaignDataById = (campaign) => {
        this.campaignDataById = campaign
    }
    setSearchedCampaigns = (campaigns) => {
        this.searchedCampaigns = campaigns
    }
    setMarkAsDoneText = (text) => {
        this.markAsDoneText = text
    }
    setTaskUrl = (text) => {
        this.taskUrl = text
    }
    setMarkAsDonPopupStatus = (status) => {
        this.showMarkAsDonePopup = status
        this.setMarkAsDoneText('')
        this.setTaskUrl('')
    }
    setNavigation = (navigation) => {
        this.navigation = navigation
    }
    setSortby = (Sortby) => {
        this.Sortby = Sortby
    }

    setcampaigntype = (campaigntype) => {
        this.campaigntype = campaigntype
    }
    setCampaignStatus = (status) => {
        this.jobStatus = status
    }

    // setupdatecampaign = (updatecampaign) => {
    //     this.updatecampaign = updatecampaign
    // }

    setmergecampaignlist = (mergecampaignlist) => {
        this.mergecampaignlist = mergecampaignlist
    }


    setCampaignRemark = (remark) => {
        this.campaignRemark = remark
    }
    setCampaignApplied = (applied) => {
        this.appliedForCampaign = applied
    }
    setApplyCampaign = (loading) => {
        this.applyCampaignLoading = loading
    }
    setReport = (text) => {
        this.report = text
    }
    setMyCampaignRefreshing = (refreshing) => {
        this.isRefreshingMyCampaign = refreshing
    }
    setRefreshing = (refreshing) => {
        // this.setCompaigns([])
        // this.setSortApply(false)
        // this.setFilterApply(false)

        this.isRefreshing = refreshing

    }
    setCompaigns = (data) => {

        this.compaignsList = data


        // if (this.FilterApply === true || this.SortApply === true) {
        //     this.sortcompaignsList = data
        // } else {
        //     this.compaignsList = data

        // }

        this.setSkip(this.compaignsList.length)

        //this.compaignsList = data
    }
    setMyCompaigns = (data) => {
        this.myCompaignsList = data
        this.isFetchedData = true
    }
    setMyApplications = (data) => {
        // [...this.compaignsList, ...data]
        this.myApplicationsList = data
    }
    setLoading = (loading) => {
        this.isLoading = loading
        this.setRefreshNewContent(false)
    }
    setCampaignStatusLoading = (loading) => {
        this.campaignStatusLoading = loading
    }
    setJobAwarded = (awarded) => {
        this.jobAwarded = awarded
    }
    setShowReport = (show) => {
        this.showReport = show
    }
    setCampaignReported = (reported) => {
        this.campaignReportd = reported
    }

    setcountry = (country) => {
        this.country = country
    }
    setcity = (city) => {
        this.city = city
    }
    setgender = (gender) => {
        this.gender = gender
    }

    setpricerangemin = (pricerangemin) => {
        this.pricerangemin = pricerangemin
    }
    setpricerangemax = (pricerangemax) => {
        this.pricerangemax = pricerangemax
    }

    setagegroup = (agegroup) => {
        this.agegroup = agegroup
    }
    setFilterApply = (FilterApply) => {
        this.FilterApply = FilterApply
    }

    setSortApply = (SortApply) => {
        this.SortApply = SortApply
    }

    setupdatedsearch = (updatedsearch) => {
        this.updatedsearch = updatedsearch
        this.setSearchedCampaigns([])
    }
    setSwipeViewActive = (active) => {
        this.isSwipeViewActive = active
    }
    setShowForceUpdatePopup = (isAppUpdate) => {
        this.isAppUpdate = isAppUpdate
    }
    setSkip = (skipValue) => {
        this.skip = skipValue
    }
    setLastFetchedCount = (count) => {
        this.lastFetchedCount = count
    }

    setcampaignAppliedRemarkId = (campaignAppliedRemarkId) => {
        this.campaignAppliedRemarkId = campaignAppliedRemarkId

    }
    setRefreshNewContent=(refresh)=>
    {
        this.refreshNewContent=refresh

    }
    setcampaignByRemarklist=(campaignByRemarklist)=>
    {
        this.campaignByRemarklist=campaignByRemarklist

    }

    setminAge=(minAge)=>
    {
        this.minAge=minAge

    }
    setmaxAge=(maxAge)=>
    {
        this.maxAge=maxAge

    }

    setcategoryfilter=(categoryfilter)=>
    {
        this.categoryfilter=categoryfilter
    }

    setshowMessageUpdateVersion=(showMessageUpdateVersion)=>
    {
        this.showMessageUpdateVersion=showMessageUpdateVersion
    }

    setcampaignDetailData=(campaignDetailData)=>
    {
        this.campaignDetailData=campaignDetailData
    }
    setFeesAndTransactionData = (feesData) => {
        this.feesAndTransactionData = feesData
    }

    setCategoryData=(CategoryData)=>
    {
        this.CategoryData=CategoryData
    }
    setMyBidFee=(MyBidFee)=>
    {
        this.MyBidFee=MyBidFee
    }
    setappliedRemarkData=(appliedRemarkData)=>
    {
        this.appliedRemarkData=appliedRemarkData
    }
    


    setRaiseDisputePopupStatus = (RaiseDisputePopupStatus) => {
        this.RaiseDisputePopupStatus = RaiseDisputePopupStatus
    }
    setcounterOfferPopupStatus=(counterOfferPopupStatus)=>{
        this.counterOfferPopupStatus=counterOfferPopupStatus
    }

    setcounterAmount=(counterAmount) =>
    {
        this.counterAmount=counterAmount
    }
    setisPayment=(isPayment)=>
    {
        this.isPayment=isPayment
    }
    setisPaymentReleased=(isPaymentReleased)=>
    {
        this.isPaymentReleased=isPaymentReleased
    }
  
    getCampaigns = () => {
        if (!this.isRefreshing) {
            this.setLoading(true)
        }
        var currentdatetoday = new Date();
        var currentdate = moment(currentdatetoday).format('YYYY-MM-DD');
     


     filterWhere={
        campaignAmount: { between: [this.pricerangemin, this.pricerangemax] },
        campaignStatus: { gt: 1 },
        endStoryPostDate: { gte: currentdate },
        isDisabled: 0
     }



     Filterconditionexpire = {
         
        campaignAmount: { between: [this.pricerangemin, this.pricerangemax] },
        campaignStatus: { gt: 1 },
        endStoryPostDate: { lt: currentdate },
        isDisabled: 0
         }

         if(this.country!=="All")
         {
            filterWhere.country=this.country
            Filterconditionexpire.country=this.country
         }

    if(this.gender !== '')
     {
        filterWhere.lookingInfluencerGender=this.gender
        Filterconditionexpire.lookingInfluencerGender=this.gender
                
     }
     if(this.campaigntype !== ''||this.campaigntype !== 'Any')
     {

        console.log("this.campaigntype==",this.campaigntype )
        if(this.campaigntype==="Paid Campaign")
        {
           filterWhere.campaignType="paid"
           Filterconditionexpire.campaignType="paid"
        }
         if(this.campaigntype==="Shoutout Exchange")
         {
            filterWhere.campaignType="shoutout"
            Filterconditionexpire.campaignType="shoutout"
         }
         if(this.campaigntype==="Sponsored")
         {
            filterWhere.campaignType="sponsored"
            Filterconditionexpire.campaignType="sponsored"
         }
         if(this.campaigntype==="Commission Based")
         {
            filterWhere.campaignType="commissionBased"
            Filterconditionexpire.campaignType="commissionBased"
         }
         if(this.campaigntype==="Events Appearance")
         {
            filterWhere.campaignType="eventsAppearence"
            Filterconditionexpire.campaignType="eventsAppearence"
         }
         if(this.campaigntype==="Photo / Video Shoot")
         {
            filterWhere.campaignType="photoshootVideo"
            Filterconditionexpire.campaignType="photoshootVideo"
         }
         
       
                
     }

     
     if(this.maxAge !== ""&&this.minAge!==""&&this.minAge!==0&&this.maxAge !== 0)
     {
        filterWhere.minAge=this.minAge
        filterWhere.maxAge=this.maxAge
        Filterconditionexpire.minAge=this.minAge
        Filterconditionexpire.maxAge=this.maxAge
          
     }else{
         if(this.minAge===0&&this.maxAge === 12)
         {
            filterWhere.minAge=this.minAge
            filterWhere.maxAge=this.maxAge
            Filterconditionexpire.minAge=this.minAge
            Filterconditionexpire.maxAge=this.maxAge
         }

     }
   
     if(this.categoryfilter!==""&&this.categoryfilter!=="Any")
     {
        filterWhere.campaignCategories=[this.categoryfilter] 
         
     }


        getUserId().then(userId => {
            let condition = ''
            let conditionexpire = ''
         if (this.FilterApply) {
            
            condition = {
            include: ["remarks", "profile"],
                //limit: this.offSetlength,
                //skip:this.skip,
                where: filterWhere,
                order: ["featurePosition ASC", "updatedAt DESC"],
                    }
            conditionexpire = {
            include: ["remarks", "profile"],
            where: Filterconditionexpire,
            order: ["featurePosition ASC", "updatedAt DESC"],
            }



            // if (this.FilterApply) {
            //     if (this.gender === '') {



            //         if (this.country === 'All') {
            //             condition = {
            //                 include: ["remarks", "profile"],
            //                 //limit: this.offSetlength,
            //                 //skip:this.skip,
            //                 where: filterWhere,
            //                 order: ["featurePosition ASC", "updatedAt DESC"],
            //             }
            //             conditionexpire = {
            //                 include: ["remarks", "profile"],
            //                 where: {
            //                     campaignAmount: { between: [this.pricerangemin, this.pricerangemax] },
            //                     campaignStatus: { gt: 1 },
            //                     endStoryPostDate: { lt: currentdate },
            //                     isDisabled: 0
            //                 },
            //                 order: ["featurePosition ASC", "updatedAt DESC"],
            //             }

            //         } else {
            //             condition = {
            //                 include: ["remarks", "profile"],
            //                 //limit: this.offSetlength,
            //                 //skip:this.skip,
            //                 where: {
            //                     campaignAmount: { between: [this.pricerangemin, this.pricerangemax] },
            //                     campaignStatus: { gt: 1 },
            //                     endStoryPostDate: { gte: currentdate },
            //                      country: this.country, 
            //                      isDisabled: 0
            //                 },
            //                 order: ["featurePosition ASC", "updatedAt DESC"],
            //             }
            //             conditionexpire = {
            //                 include: ["remarks", "profile"],
            //                 where: {
            //                     campaignAmount: { between: [this.pricerangemin, this.pricerangemax] },
            //                     campaignStatus: { gt: 1 },
            //                     endStoryPostDate: { lt: currentdate },
            //                     country: this.country, isDisabled: 0
            //                 },
            //                 order: ["featurePosition ASC", "updatedAt DESC"],
            //             }

            //         }

            //     } else {
            //         if (this.country === 'All') {
            //             condition = {
            //                 include: ["remarks", "profile"],
            //                 //limit: this.offSetlength,
            //                 //skip:this.skip,
            //                 where: {
            //                     campaignAmount: { between: [this.pricerangemin, this.pricerangemax] },
            //                     campaignStatus: { gt: 1 },
            //                     endStoryPostDate: { gte: currentdate },
            //                     country: this.country, 
            //                     lookingInfluencerGender: this.gender, 
            //                     isDisabled: 0
            //                 },
            //                 order: ["featurePosition ASC", "id DESC"],
            //             }
            //             conditionexpire = {
            //                 include: ["remarks"],
            //                 where: {
            //                     campaignAmount: { between: [this.pricerangemin, this.pricerangemax] },
            //                     campaignStatus: { gt: 1 },
            //                     // endStoryPostDate: { lt: currentdate }, 
            //                     lookingInfluencerGender: this.gender, isDisabled: 0
            //                 },
            //                 order: ["featurePosition ASC", "updatedAt DESC"],
            //             }

            //         } else {
            //             condition = {
            //                 include: ["remarks", "profile"],
            //                 //limit: this.offSetlength,
            //                 //skip:this.skip,
            //                 where: {
            //                     campaignAmount: { between: [this.pricerangemin, this.pricerangemax] },
            //                     campaignStatus: { gt: 1 },
            //                     endStoryPostDate: { gte: currentdate },
            //                      country: this.country, 
            //                     lookingInfluencerGender: this.gender, 
            //                     isDisabled: 0
            //                 }, order: ["featurePosition ASC", "updatedAt DESC"],
            //             }
            //             conditionexpire = {
            //                 include: ["remarks", "profile"],
            //                 where: {
            //                     campaignAmount: { between: [this.pricerangemin, this.pricerangemax] },
            //                     campaignStatus: { gt: 1 },
            //                     // endStoryPostDate: { lt: currentdate }, 
            //                     // country: this.country, 
            //                     lookingInfluencerGender: this.gender, isDisabled: 0
            //                 },
            //                 order: ["featurePosition ASC", "updatedAt DESC"],
            //             }

            //         }

            //     }





                
            } else {

                if (this.updatedsearch === '') {


                    condition = {
                        include: ["remarks", "profile"], where: {
                            campaignStatus: { gt: 1 },
                            endStoryPostDate: { gte: currentdate },
                            isDisabled: 0,
                            user_id:userId
                        }, order: ["featurePosition ASC", "updatedAt DESC"],
                        limit: 20,
                        skip:this.skip,
                    }
                    conditionexpire = {
                        include: ["remarks"], where: {
                            campaignStatus: { gt: 1 },
                            // endStoryPostDate: { lt: currentdate }, 
                            isDisabled: 0
                        }, order: ["isFeatured ASC", "updatedAt DESC"],
                    }


                } else {

                    condition = {
                        include: ["remarks", "profile","likes"], order: ["featurePosition DESC"], where: {
                            campaignTitle: { like: '%' + this.updatedsearch + '%' }, campaignStatus: { gt: 1 },
                            endStoryPostDate: { gte: currentdate },
                            isDisabled: 0,
                            limit: this.offSetlength,
                            skip: this.skip,
                            
                        }
                    }
                    conditionexpire = {
                        include: ["remarks", "profile"], where: {
                            campaignTitle: { like: '%' + this.updatedsearch + '%' }, campaignStatus: { gt: 1 },
                            // endStoryPostDate: { lt: currentdate }, 
                            isDisabled: 0
                        }, order: ["featurePosition ASC", "updatedAt DESC"],
                    }



                }

            }

            getCampaigns(condition).then(response => {
               
                console.log('condition:Matchcountry==1', condition)

               
                const { status, data } = response
                console.log('response:', response.data)
                if (this.isRefreshing) {
                    this.setRefreshing(false)
                } else {
                    this.setLoading(false)
                }
                if (status === 200) {

                    // const filteredData = data.sort((a,b) =>  b.isFeatured- a.isFeatured)
                    // console.log('filteredData:',filteredData)
                    if (this.updatedsearch !== '') {
                        this.setSearchedCampaigns(data)
                    }
                    else {
                        this.setLastFetchedCount(data.length)

                        if(this.FilterApply===true||this.SortApply===true)
                        {
                            this.setCompaigns([])
                        }
                           let list = []
                            list =  [...this.compaignsList, ...data] 

                        this.setCompaigns(list)
                    }
                    this.getAndCheckAppVersion()
                    // this.getexpiredcampaignlist(conditionexpire)
                }

            })
                .catch(error => {
                    if (this.isRefreshing) {
                        this.setRefreshing(false)
                    } else {
                        this.setLoading(false)
                    }
                    // console.log('error in fetching campaign list', error)
                })



        })
    }
    getCampaignsByCampaignId = (campaignId) => {
        if (!this.isRefreshing) {
            this.setLoading(true)
        }
        let condition = ''
        condition = {
            where: {
                id: campaignId,
            },
        }
        this.setCampaignDataById(null)

        getCampaigns(condition).then(response => {
            console.log('getCampaign:', response)
            console.log('condition:', condition)

            if (this.isRefreshing) {
                this.setRefreshing(false)
            } else {
                this.setLoading(false)
            }
            const { status, data } = response
            console.log('response:', response)
            if (status === 200) {
                this.setCampaignDataById(data)
            }

        })
            .catch(error => {
                if (this.isRefreshing) {
                    this.setRefreshing(false)
                } else {
                    this.setLoading(false)
                }
            })



    }
    getSearchCampaigns = () => {
        if (!this.isRefreshing) {
            this.setLoading(true)
        }
        let condition = ''
        var currentdatetoday = new Date();
        var currentdate = moment(currentdatetoday).format('YYYY-MM-DD');
        condition = {
            include: ["remarks", "profile",'likes'],
            //limit: this.offSetlength,
            //skip:this.skip,
            where: {
                campaignTitle: { like: '%' + this.updatedsearch + '%' },
                campaignStatus: { gt: 1 },
                endStoryPostDate: { gte: currentdate },
                isDisabled: 0
            },
            order: ["featurePosition ASC", "updatedAt DESC"],
        }
        // condition = {
        //     include: ["remarks", "profile"], order: ["isFeatured DESC"], where: {
        //         campaignTitle: { like: '%' + this.updatedsearch + '%' }, campaignStatus: { gt: 1 },
        //         // endStoryPostDate: { gte: currentdate }, 
        //         isDisabled: 0
        //     }
        // }


        getCampaigns(condition).then(response => {
            console.log('getSearchCampaigns:', response)
            console.log('condition:', condition)

            if (this.isRefreshing) {
                this.setRefreshing(false)
            } else {
                this.setLoading(false)
            }
            const { status, data } = response
            console.log('response:', response)
            if (status === 200) {


                if (this.updatedsearch !== '') {
                    this.setSearchedCampaigns(data)
                }
                else {
                    this.setSearchedCampaigns([])
                }
            }

        })
            .catch(error => {
                if (this.isRefreshing) {
                    this.setRefreshing(false)
                } else {
                    this.setLoading(false)
                }
                // console.log('error in fetching campaign list', error)
            })

    }
    getexpiredcampaignlist(conditionexpire) {

        let list = []

        getCampaigns(conditionexpire).then(response => {
            // console.warn('error in fetching campaign list')
            console.log('getexpiredcampaignlist:', response)
            console.log('condition:', conditionexpire)
            const { status, data } = response
            if (status === 200) {
                if (this.campaigntype === "All") {
                    list = [...this.compaignsList, ...response.data]
                    console.log('getexpiredcampaignlist ist:', list)

                    this.setCompaigns(list)
                }

            }

        })
            .catch(error => {

                // console.log('error in fetching campaign list', error)
            })
    }



    getMyCampaigns = () => {
        // let condition = {"where": {"ownerId":525}}
        getUserId().then(userId => {
            // let param = {ownerId: userId}
            if (!this.isRefreshingMyCampaign) {
                this.setLoading(true)
            }
            getMyCampaigns(userId).then(response => {
                console.warn('campaign api response =', response.data)
                this.setLoading(false)
                if (this.isRefreshingMyCampaign) {
                    this.setMyCampaignRefreshing(false)
                } else {
                    this.setLoading(false)
                }
                const { status, data } = response
                if (status === 200 && !data.error) {
                    this.setMyCompaigns(data.data)
                }

            })
                .catch(error => {
                    if (this.isRefreshingMyCampaign) {
                        this.setRefreshing(false)
                    } else {
                        this.setLoading(false)
                    }
                    // console.log('error in fetching campaign list =', error)
                })
        })
    }
    getMostAppliedCampaignsList = (campaignType) => {
        if (!this.isRefreshing) {
            this.setLoading(true)
        }
        const param = {where:{campaignType: campaignType}}

        getUserId().then(userId => {
            getMostAppliedCampaigns(param).then(response => {
          console.log("response==1",response.data)

                if (this.isRefreshing) {
                    this.setRefreshing(false)
                } else {
                    this.setLoading(false)
                }
                const { status, data } = response
                if (status === 200) {
                    this.setCompaigns(data.data)
                }

            })
                .catch(error => {
                    if (this.isRefreshing) {
                        this.setRefreshing(false)
                    } else {
                        this.setLoading(false)
                    }
                })
        })
    }

    getMostappliedrecentList = (campaignType) => {  

        const param = {where:{campaignType: campaignType}}
        getUserId().then(userId => {
            getMostappliedrecent(param).then(response => {
                console.log("response==2",response.data)
                if (this.isRefreshing) {
                    this.setRefreshing(false)
                } else {
                    this.setLoading(false)
                }
                const { status, data } = response
                if (status === 200) {
                    console.log('response', response)
                    this.setCompaigns(data.data)
                }

            })
                .catch(error => {
                    if (this.isRefreshing) {
                        this.setRefreshing(false)
                    } else {
                        this.setLoading(false)
                    }
                    // console.log('error in fetching campaign list =', error)
                })
        })
    }
    getCampaignStatus = (campaignId) => {
        this.setCampaignStatusLoading(true)
        getUserId().then(userId => {
            const param = { where: { campaignId: campaignId, ownerId: userId } }
            getJobStatus(param).then(response => {
                this.setCampaignStatusLoading(false)
                const { status, data } = response
                if (status === 200 && data.length > 0) {
                    
                    let count = data.length-1
                    console.log("data===",data[count])
                    let remarkStatus = data[count].remarkStatus===true?1:data[count].remarkStatus
                    let remarkid = data[count].id
                    let jobAwarded = data[count].isAwarded
                    this.setJobAwarded(jobAwarded === 0 ? false : true)
                    this.setCampaignStatus(remarkStatus)
                    this.setcampaignAppliedRemarkId(remarkid)
                    this.setappliedRemarkData(data[count])
                    this.setisPayment(data[count].isPayment)
                    this.setisPaymentReleased(data[count].isPaymentReleased)
                } else {
                    this.setJobAwarded(false)
                    this.setCampaignStatus(null)
                    this.setcampaignAppliedRemarkId("")
                    this.setisPayment("")
                    this.setisPaymentReleased("")

                }
            }).catch(error => {
                this.setCampaignStatusLoading(false)
            })
        })
    }
    reportCampaign = (param) => {
        if (this.report == "") {
            showAlert('', strings('Enter_Comment'))

            return
        }
        this.setLoading(true)
        getUserId().then(userId => {

            const newParam = { ...param, ...{ ownerId: userId, reportText: this.report } }
            reportCampaign(newParam).then(response => {
                this.setLoading(false)
                const { status } = response
                if (status === 200) {
                    this.setCampaignReported(true)
                    showAlert('', strings('ReportedSuccessfully'))
                } else {
                    showAlert('', strings('SomethingWentWrong'))
                }
            }).catch(error => {
                this.setLoading(false)
            })
        })
    }
    applyForCampaign = (campaignID) => {
        this.setApplyCampaign(true)
        var encodedRemarkText = this.campaignRemark.toString().replace(/%/g, '~~pct~~');       // ~~pct~~ <-made up replacement
        encodedRemarkText = encodeURI(encodedRemarkText);
        getUserId().then(userId => {
            applyForCampaign({ ownerId: userId,campaignId: campaignID, 
                 remarkText: encodedRemarkText, 
        offerAmount:this.MyBidFee,isCounter:1,counterBy:userId,lastOfferAmount:this.MyBidFee
        //offerAmount:this.MyBidFee,isCounter:1,counterBy:userId,lastOfferAmount:this.MyBidFee
             }).then(response => {
                this.setApplyCampaign(false)
                const { status } = response
                console.log('job api response =', response)
                if (status === 200) {
                    this.setCampaignApplied(true)
                    //this.onRegisterStripeAccount(userId)
                    this.showSuccessAlert(campaignID)
                    this.getCampaignStatus(campaignID)
        this.setCampaignReported(false)
        this.setReport('')
        this.setCampaignStatus(null)
        this.setJobAwarded(null)
        this.geApplicantcountbaseoncampaign(campaignID)
        this.getCampaigns()
        this.setCampaignApplied(false)
                } else {
                    showAlert('', strings('SomethingWentWrong'))
                }
            }).catch(error => {
                this.setApplyCampaign(false)
            })
        })
    
}

    showSuccessAlert = (campaignID) => {   
           setTimeout(() => {
          Alert.alert(
            strings('Successfully'),
            strings('CampaignApplied'),
            [
              { text: strings('Ok'), onPress: () => { this.goBackscreen(campaignID) } },
            ],
            { cancelable: false }
          );
        }, 200);
      }
      goBackscreen(campaignID) {
        // this.getCampaignStatus(campaignID)
        // this.setCampaignReported(false)
        // this.setReport('')
        // this.setCampaignStatus(null)
        // this.setJobAwarded(null)
        // this.geApplicantcountbaseoncampaign(campaignID)
        // this.getCampaigns()
        // this.setCampaignApplied(false)
      }
    


    onRegisterStripeAccount = (userid, countryCode, id, offerStatus) => {
        const param = { ownerId: userid, countryShortCode: countryCode }
        this.setLoading(true)

        registerStripeAccount(param).then(response => {
            const { status, data } = response
            console.log('registerStripeAccount response==', response)

            // this.setLoading(false)

            if (status === 200 && !data.error) {
                const stripeParams = { stripeAccountNumber: data.data.id }
                this.updateStripeAccountId(userid, stripeParams, id, offerStatus)
            }
            else if (status === 200 && data.error) {
                this.setLoading(false)
                showFlashBanner("", data.message)
            }
        }).catch(error => {

        })

    }
    updateStripeAccountId = (userId, profileParam, id, offerStatus) => {
        this.setLoading(true)

        updateUserProfile(profileParam, userId).then(response => {
            const { status, data } = response
            //this.setLoading(false)
            if (status === 200 && !data.error) {
                let result = data.message.profile
                setUserData(JSON.stringify(result))
                console.log('response updateUserProfile:', response)

                if (result.stripeAccountNumber !== null) {
                    this.acceptDeclineOffer(id, offerStatus, userId)
                }
            }
            else if (status === 200 && data.error) {
                this.setLoading(false)
                showFlashBanner("", data.message)
            }
            else {
                showAlert('', strings('SomethingWentWrong'))
            }
        }).catch(error => {
            this.setLoading(false)
            showAlert('', strings('SomethingWentWrong'))

        })
    }
    updateUserProfileData = (profileParam) => {
        getUserId().then(userId => {
            updateUserProfile(profileParam, userId).then(response => {
                const { status, data } = response
                //this.setLoading(false)
                if (status === 200 && !data.error) {
                    let result = data.message.profile
                    setUserData(JSON.stringify(result))
                    console.log('response updateUserProfile:', response)

                }
                else if (status === 200 && data.error) {
                    this.setLoading(false)
                    showFlashBanner("", data.message)
                }
                else {
                    showFlashBanner("", strings('SomethingWentWrong'))
                }
            }).catch(error => {
                showAlert('', strings('SomethingWentWrong'))

            })
        })

    }
    updateUserCountry = (profileParam, id, offerStatus, ownerId) => {
        this.setLoading(true)
        console.log('profileParam updateUserCountry:', profileParam)

        getUserId().then(userId => {
            updateUserProfile(profileParam, userId).then(response => {
                const { status, data } = response
                console.log('response updateUserCountry:', response)
                //this.setLoading(false)
                if (status === 200 && !data.error) {
                    let result = data.message.profile
                    setUserData(JSON.stringify(result))
                    this.onRegisterStripeAccount(ownerId, "SG", id, offerStatus)
                }
                else if (status === 200 && data.error) {
                    this.setLoading(false)
                    showFlashBanner("", data.message)
                }
                else {
                    showAlert('', strings('SomethingWentWrong'))
                }
            }).catch(error => {
                this.setLoading(false)
                showAlert('', strings('SomethingWentWrong'))

            })
        })
    }

    getupdatecampaign = (campaignId, enabledisable) => {
        this.setLoading(true)
        let param = { isDisabled: enabledisable }

        doCampaignsupdate(param, campaignId).then(response => {
            console.log('response:', response)
            this.setLoading(false)

        }).catch(error => {
            this.setLoading(false)
        })
        // })
    }

    doupdatedeviceinfo = async () => {
        const token = await messaging().getToken();
        getUserId().then(userid => {
            let param = {
                ownerId: userid,
                platform_OS: Platform.OS === 'android' ? 'Android' : "iOS",
                OS_Version: DeviceInfo.getSystemVersion(),
                Platform: 'App',
                App_Version: DeviceInfo.getVersion(),
                buildnumber:DeviceInfo.getBuildNumber(),
                fcmToken: token
            }
            doupdatedeviceinfo(param).then(response => {
                const { status } = response
                if (status === 200) {
                    this.setCampaignStatus(null)
                }
            }).catch(error => {

            })
        })
    }
    getUserAppliedCampaignsList = () => {
        if (!this.isRefreshing) {
            this.setLoading(true)
        }
        getUserId().then(userId => {
            let condition = ''

            if (this.updatedsearch === '') {
                 // Old Condition without likes and comments
                //condition = { include: ["campaigns", "profile"], where: { ownerId: userId }, order: "id DESC" }
                condition = {include: [{relation: 'campaigns',
                        scope: {
                        include: ['likes','comments'],
                      },
                  }, 
                  {relation: 'profile'}], where: { ownerId: userId,remarkStatus:1 }, order: "id DESC"
                  }
            } else {
                condition = {
                    include: ["campaigns", "profile"], where:
                    {
                        campaignTitle: { like: '%' + this.updatedsearch + '%' },
                        ownerId: userId
                    },
                    order: "id DESC"
                }

            }


            getMyApplications(condition).then(response => {
                console.log('getMyApplications:', response)
                this.setMyApplications([])
                if (this.isRefreshing) {
                    this.setRefreshing(false)
                } else {
                    this.setLoading(false)
                }
                const { status, data } = response
                if (status === 200) {

                    this.setMyApplications(data)
                }

            })
                .catch(error => {
                    if (this.isRefreshing) {
                        this.setRefreshing(false)
                    } else {
                        this.setLoading(false)
                    }
                    // console.log('error in fetching campaign list', error)
                })



        })
    }
    getAppliedCampaignsStatus = () => {

        getUserId().then(userId => {
            let condition = { include: ["campaigns"], where: { ownerId: userId }, order: "id DESC" }


            getMyApplications(condition).then(response => {
                console.log('getMyApplications:', response)
                const { status, data } = response
                if (status === 200) {

                    this.setMyApplications(data)
                }

            })
                .catch(error => {
                    console.log('error in fetching campaign list', error)
                })



        })
    }

    geApplicantcountbaseoncampaign(campaignId)
    {
        let condition = {  where: { campaignId: campaignId,remarkStatus: 1 } }
        console.log('condition:', condition)
        getMyApplications(condition).then(response => {
            console.log('getApplications:', response.data)
            const { status, data } = response
            if (status === 200) {
                this.setcampaignByRemarklist(response.data)
            }

        })
            .catch(error => {
                console.log('error in fetching campaign list', error)
            })

    }
    setStripePublishKey = (key) => {
        this.stripePublishableKey = key
    }
    setStripeSecretKey = (key) => {
        this.stripeSecretKey = key
    }
    getStripeKeys = () => {
        this.setLoading(true)

        getStripeData().then(response => {
            this.setLoading(false)
            if (response.status === 200) {
                if (response.data !== undefined) {
                    console.log('response.data.Publishable_Key:', response.data.Publishable_Key)
                    console.log('response.data.Secret_Key:', response.data.Secret_Key)

                    this.setStripePublishKey(response.data.Publishable_Key)
                    this.setStripeSecretKey(response.data.Secret_Key)

                    let publisbhKeybytes = CryptoJS.AES.decrypt(response.data.Publishable_Key, Config.AES_KEY);
                    let stripePublishableKey = publisbhKeybytes.toString(CryptoJS.enc.Utf8);
                    // console.log('stripePublishableKey:',stripePublishableKey)

                    //let secretKeybytes  = CryptoJS.AES.decrypt(response.data.stripeSecretKey, '5L9yLb85bT9WessPBdDYug4mDDDNZpf0uHmuzBk2F9A');
                    let secretKeybytes = CryptoJS.AES.decrypt(response.data.Secret_Key, Config.AES_KEY);


                    let stripeSecretKey = secretKeybytes.toString(CryptoJS.enc.Utf8);

                    console.log('stripePublishableKey:', stripePublishableKey)
                    console.log('stripeSecretKey:', stripeSecretKey)
                    //showFlashBanner("hfghfhfhfg",stripePublishableKey)

                    this.setStripePublishKey(stripePublishableKey)
                    this.setStripeSecretKey(stripeSecretKey)
                    setTimeout(() => {
                        stripe.setOptions({

                            publishableKey: stripePublishableKey,//'PUBLISHABLE_KEY',india 
                            merchantId: stripeSecretKey,//'MERCHANT_ID', // india

                            androidPayMode: 'test', // test|production Android only

                        })
                    }, 1000);


                }

            }

        }).catch(error => {
            this.setLoading(false)
        })
        // })
    }
    initiateStripePayment = (param) => {
        console.log('initiateStripePayment param:', param)
        this.setLoading(true)
        getUserId().then(userId => {
            getAccessToken().then(accessToken => {
                const dataParams = { ...param, ...{ ownerId: userId } }
                console.log('report initiateStripePayment dataParams =', dataParams)

                initiateInflencerPayment(accessToken, dataParams).then(response => {
                    console.log('report initiateStripePayment response =', response)
                    this.setSwipeViewActive(false)
                    this.setLoading(false)
                    this.navigation.goBack()
                    const { status } = response
                    if (status === 200) {
                        //this.setCampaignReported(true)
                        showAlert('', strings('Your_payment_was_successful'))
                    } else {
                        showAlert('', strings('SomethingWentWrong'))
                    }
                }).catch(error => {
                    this.setLoading(false)
                })
            })

        })
    }
    markCampaignAsCompleted = (id,props) => {
        this.setLoading(true)
        getUserId().then(userId => {
            const param = { id: id, ownerId: userId }
            var doneTaskUrl = this.taskUrl
            if(this.taskUrl !== '')
            {
                var prefix = 'https://';
                if (doneTaskUrl.substr(0, prefix.length) !== prefix) {
                    doneTaskUrl = prefix + doneTaskUrl
                }
            }
            const dataParam = { isMarkAsDone: 1, markAsDoneText: this.markAsDoneText, markAsDoneTextUrl: doneTaskUrl }
            console.log('param:', param)
            markCampaignCompleted(param, dataParam).then(response => {
                this.setLoading(false)
                this.setMarkAsDonPopupStatus(false)
                const { status } = response
                console.log('markCampaignCompleted api response =', response)
                if (status !== 200) {
                    showAlert('', strings('SomethingWentWrong'))

                }
                else
                {
                    showToast(strings('CampaignCompleted'))
                    props.navigation.goBack();
                }
                // else {
                //     showAlert('', strings('SomethingWentWrong'))
                // }
            }).catch(error => {
                this.setLoading(false)
            })
        })
    }
    makeOfferCampaign = (id, amount, userId, hidePopupStatus) => {
        //   offerStatus 
        // 0 - No action taken
        // 1 - Pending
        // 2 - Accepted
        // 3 - Declined

        this.setLoading(true)
        getUserId().then(userloginId => {
        const param = { id: id, ownerId: userId }
        const dataParam = { offerAmount: amount, offerStatus: 1 ,isCounter:1,counterBy:userloginId,lastOfferAmount:amount}
        console.log('param:', param)
        markCampaignCompleted(param, dataParam).then(response => {
            this.setLoading(false)
            const { status } = response
            // this.setMarkAsDonPopupStatus(false)
            hidePopupStatus(false)


            if (status === 200) {
                showAlert('', strings('Offer_Submitted_Confirmation'))

            } else {
                showAlert('', strings('SomethingWentWrong'))
            }
        }).catch(error => {
            this.setLoading(false)
        })
    })
    }
    hireInfluencer = (id, userId) => {
        //   offerStatus 
        // 0 - No action taken
        // 1 - Pending
        // 2 - Accepted
        // 3 - Declined
        this.setLoading(true)
        const param = { id: id, ownerId: userId }
        const dataParam = { isHired: 1 }
        console.log('param:', param)
        markCampaignCompleted(param, dataParam).then(response => {
            this.setLoading(false)
            const { status } = response
          
            // this.setMarkAsDonPopupStatus(false)


            if (status === 200) {
                console.log('hireInfluencer api response =', response)
                showAlert('', strings('Influencer_Hired'))

            } else {
                console.log('hireInfluencer api response =', response)
                showAlert('', strings('SomethingWentWrong'))
            }
        }).catch(error => {
            this.setLoading(false)
        })
    }
    acceptDeclineOffer = (id, offerStatus, userId) => {
        //   offerStatus 
        // 0 - No action taken
        // 1 - Pending
        // 2 - Accepted
        // 3 - Declined
        this.setLoading(true)
        const param = { id: id, ownerId: userId }
        const dataParam = { offerStatus: offerStatus }
        console.log('param:', param)
        markCampaignCompleted(param, dataParam).then(response => {
            this.setLoading(false)
            const { status } = response
            console.log('acceptDeclineOffer api response =', response)
           // this.remarkDetails(id)

            if (status === 200) {
                showAlert('', strings('Accept_Decline_Offer'))

            } else {
                showAlert('', strings('SomethingWentWrong'))
            }
        }).catch(error => {
            this.setLoading(false)
        })
    }
    getAndCheckAppVersion = () => {
        const param = { include: ["Koliplatformfee"]}
        getAppVersions(param).then(response => {
            const { status, data } = response
            //this.setLoading(false)
            console.log('response getAndCheckAppVersion:', response)
            const currentAppVersion = DeviceInfo.getVersion()
            if (status === 200 && !data.error) {
                if(response.data[0].Koliplatformfee){
                    this.setFeesAndTransactionData(response.data[0].Koliplatformfee)
                    setFeesAndCommission(response.data[0].Koliplatformfee)
                }
                console.log('currentAppVersion Ios', data[0].iosVersion ,currentAppVersion)
                    console.log('currentAppVersion Android', data[0].androidVersion,currentAppVersion)
                if (Platform.OS === 'ios') {
                    

                    if (currentAppVersion < data[0].iosVersion && data[0].isForceUpdate) {
                        setTimeout(() => {
                            this.setShowForceUpdatePopup(true)
                        }, 1000);
                    }
                    if (currentAppVersion< data[0].iosVersion) {
                        
                       this.setshowMessageUpdateVersion(true)
                    }
                }else if (Platform.OS === 'android') {
                    if (currentAppVersion !== data[0].androidVersion && data[0].isForceUpdate) {
                        setTimeout(() => {
                            this.setShowForceUpdatePopup(true)
                        }, 1000);
                    }

                    if (currentAppVersion <data[0].androidVersion) {
                        this.setshowMessageUpdateVersion(true)


                    }

                }
            }
        }).catch(error => {
            this.setLoading(false)
        })
    }

    delUserfromRemakList = (remarkid,compaignid) => {
        if (remarkid !== "") {
            delUserfromRemarkList(remarkid).then(response => {
                if (response.data.count === 1) {
                    this.setCampaignStatus(false)
                    this.setJobAwarded(false)
                    this.geApplicantcountbaseoncampaign(compaignid)
                }
            })
        }
    }

    cancelCampaignfromBothInfluencerAndBrand=(campaignId,dataParam,isCancelledByOtherParty)=>{
        cancelCampFromBothInfluenerBrand(campaignId, dataParam).then(response => {
            this.setLoading(false)
            const { status } = response
            console.log('cancel Job Status updated', response)
            if (status === 200) {
                if(isCancelledByOtherParty==1){
                    let body = {
                        campaignStatus:4
                    }
                    cancelCampFromBothInfluenerBrand(campaignId, body).then(response=>{
                        this.setLoading(false)
                        const { status } = response
                        console.log('cancel Campaign Status updated', response)
                        if (status === 200) {
                            this.setCampaignStatus(2)
                            this.setJobAwarded(false)
                            this.geApplicantcountbaseoncampaign(campaignId)
                        } else {
                            showAlert('', strings('SomethingWentWrong'))
                        }
                    })
                }
             

            } else {
                showAlert('', strings('SomethingWentWrong'))
            }
        }).catch(error => {
            this.setLoading(false)
        })
    }

    cancelOnAppliedJob = (remarkid,compaignid) => {
        this.setLoading(true)
        getUserId().then(userId => {
        const param = { id: remarkid, ownerId: userId }
        const dataParam = { remarkStatus: 2 }
        console.log('param:', param)
        markCampaignCompleted(param, dataParam).then(response => {
            this.setLoading(false)
            const { status } = response
            console.log('cancel Job Status updated', response.data)
            if (status === 200) {
                this.setCampaignStatus(2)
                this.setJobAwarded(false)
                this.geApplicantcountbaseoncampaign(compaignid)

            } else {
                showAlert('', strings('SomethingWentWrong'))
            }
        }).catch(error => {
            this.setLoading(false)
        })
    })
    }



    counterOfferJobUpdate = (remarkid,amount) => {
        this.setLoading(true)
        getUserId().then(userId => {
        const param = { id: remarkid, ownerId: userId }
        const dataParam = { offerAmount:amount, isCounter:1,counterBy:userId,lastOfferAmount:amount  }
        console.log('param:', param)
        markCampaignCompleted(param, dataParam).then(response => {
            this.setLoading(false)
            const { status } = response
            console.log('counter offer  updated', response.data)
            if (status === 200) {
              

            } else {
                showAlert('', strings('SomethingWentWrong'))
            }
        }).catch(error => {
            this.setLoading(false)
        })
    })
    }





    campaignDetails = (campaignId) =>{
        
        let condition = {
            include: ["remarks", "profile","likes","comments"],
              
                    }
        this.setLoading(true)
        getCampaignDetailsdata(condition,campaignId).then(response =>{
            const {status, data} = response
            console.log('---_>',status,data)
            if (status === 200 && !data.error) {
                // this.setcampaignDetailData([])   
                if(!!data.country){
                    data.country =  data.country.split(',').join(', ')
                    console.log(';-;-;-;', data.country)
                }
                this.setcampaignDetailData(data)
                //this.setcampaignByRemarklist(response.data.remarks)
                 this.setLoading(false)  
            }else
            {
                this.setLoading(false)

            }
        }).catch(error => {
            this.setLoading(false)
        })
    }


    getCatgoriesList = () => {
        getCampaignCategories()
            .then(response => {
              
                if(response.status === 200)
                {
                    const categoryList = response.data.map(el=>{
                        el.isSelected = false
                        return el
                    })
                    this.categoriesArray=categoryList
                    this.setCategoryData(this.categoriesArray)
                    
                   
                //     var selectedCats = categoryList.map(item => {
                //         console.log('categoryList:',this.campainData.campaignCategories.includes(item.categoryName))

                //         if(this.campainData.campaignCategories.indexOf(item.categoryName) > -1)
                //         {
                //             item.isSelected=true
                //         }
                //       return item
                //   })
                //   console.log('selectedCats:',selectedCats)
          
                //    selectedCats = selectedCats.filter(item => {
                //       return item.isSelected
                //   })
                //   console.log('selectedCats:',selectedCats)
                //   this.setSelectedCatgoriesList(selectedCats)
                //   this.setCatgoriesList(categoryList)


                }

            })
            .catch(error => {
                this.setCategoriesLoading(false)
            })
    }
    setSelectDeselectCatgories = (index) => {
    let arr = [...this.categoriesArray]
    const updatedArr = arr.map(el=>{
      el.isSelected = false
      return el
    })   

    console.log("index==",index)
     updatedArr[index].isSelected = true
     console.log("index==",updatedArr)

      this.setCategoryData(updatedArr) 
      this.categoriesArray=updatedArr 
      this.setcategoryfilter(updatedArr[index].categoryName)
      
    }


    remarkDetails = (remarkid) => {
            const param = { where: { id: remarkid} }
            getremarkDetails(param).then(response => {
                const { status, data } = response

                console.log("data==",data)
                if (status === 200 && data.length > 0) {
                    

             
                } 
            }).catch(error => {
            })
    }

}
decorate(CompaignsStore, {

    compaignsList: observable,
    myCompaignsList: observable,
    isFetchedData: observable,
    isLoading: observable,
    isRefreshing: observable,
    isRefreshingMyCampaign: observable,
    jobAwarded: observable,
    showReport: observable,
    campaignReportd: observable,
    report: observable,
    applyCampaignLoading: observable,
    appliedForCampaign: observable,
    campaignRemark: observable,
    jobStatus: observable,
    country: observable,
    city: observable,
    gender: observable,
    pricerangemin: observable,
    pricerangemax: observable,
    agegroup: observable,
    FilterApply: observable,
    updatedsearch: observable,
    Sortby: observable,
    mergecampaignlist: observable,
    campaigntype: observable,
    myApplicationsList: observable,
    stripePublishableKey: observable,
    stripeSecretKey: observable,
    navigation: observable,
    isSwipeViewActive: observable,
    markAsDoneText: observable,
    taskUrl: observable,
    showMarkAsDonePopup: observable,
    isAppUpdate: observable,
    searchedCampaigns: observable,
    campaignDataById: observable,
    campaignStatusLoading: observable,
    hasNextPage: observable,
    end_curser: observable,
    offSetlength: observable,
    refreshNewContent:observable,
    campaignAppliedRemarkId: observable,
    SortApply: observable,
    sortcompaignsList:observable,
    campaignByRemarklist:observable,
    minAge: observable,
    maxAge: observable,
    categoryfilter:observable,
    showMessageUpdateVersion:observable,
    campaignDetailData:observable,
    feesAndTransactionData: observable,
    CategoryData:observable,
    categoriesArray:observable,
    MyBidFee:observable,
    RaiseDisputePopupStatus:observable,
    counterOfferPopupStatus:observable,
    appliedRemarkData:observable,
    counterAmount:observable,
    isPayment:observable,
    isPaymentReleased:observable,

    setCompaigns: action,
    getCampaigns: action,
    setMyApplications: action,
    setLoading: action,
    getMyCampaigns: action,
    getMostAppliedCampaignsList: action,
    setMyCompaigns: action,
    setRefreshing: action,
    setMyCampaignRefreshing: action,
    getCampaignStatus: action,
    setJobAwarded: action,
    setShowReport: action,
    reportCampaign: action,
    setCampaignReported: action,
    setReport: action,
    setApplyCampaign: action,
    applyForCampaign: action,
    setCampaignApplied: action,
    setCampaignRemark: action,
    setCampaignStatus: action,
    setcountry: action,
    setcity: action,
    setgender: action,
    setpricerangemin: action,
    setpricerangemax: action,
    setagegroup: action,
    setFilterApply: action,
    getupdatecampaign: action,
    setupdatedsearch: action,
    setSortby: action,
    setmergecampaignlist: action,
    setcampaigntype: action,
    getUserAppliedCampaignsList: action,
    getStripeKeys: action,
    setStripePublishKey: action,
    setStripeSecretKey: action,
    initiateStripePayment: action,
    setNavigation: action,
    setSwipeViewActive: action,
    markCampaignAsCompleted: action,
    setMarkAsDonPopupStatus: action,
    setMarkAsDoneText: action,
    onRegisterStripeAccount: action,
    setShowForceUpdatePopup: action,
    getAppliedCampaignsStatus: action,
    setSearchedCampaigns: action,
    getSearchCampaigns: action,
    updateUserProfileData: action,
    getCampaignsByCampaignId: action,
    setCampaignDataById: action,
    hireInfluencer: action,
    setCampaignStatusLoading: action,
    setSkip: action,
    setLastFetchedCount: action,
    setRefreshNewContent:action,
    setcampaignAppliedRemarkId: action,
    setSortApply: action,
    setcampaignByRemarklist:action,
    setminAge: action,
    setmaxAge: action,
    setcategoryfilter:action,
    setTaskUrl: action,
    setshowMessageUpdateVersion:action,
    setcampaignDetailData:action,
    setFeesAndTransactionData:action,
   setCategoryData:action,
   setSelectDeselectCatgories:action,
   setMyBidFee:action,
   setRaiseDisputePopupStatus:action,
   setcounterOfferPopupStatus:action,
   setappliedRemarkData:action,
   setcounterAmount:action,
   setisPayment:action,
   setisPaymentReleased:action,
   
});

export default CompaignsStore;