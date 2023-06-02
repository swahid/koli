import { action, observable, decorate } from 'mobx';

import { getAllNotifications, updateNotifications, } from '../../API/Notification/APINotification';
import { formatDate,getUserId } from '../../SupportingFIles/Utills';

import {
    getCampaigns,
    getMyApplications,
} from '../../API/Campaign/ApiCampaign';
import { act } from 'react-test-renderer';

class NotificationStore {
    constructor(rootStore) {
        this.rootStore = rootStore
    }
    isLoading = false
    notificationList = []
    readAllUpdated = false
    unreadCount = 0
    campaignDataById = null
    navigation = null
    reloadPage = true
    unreadNotificationCount = 0


    setUnreadNotifictionCount = (notificationDataCount) => {
        console.log("notificationDataCount:",notificationDataCount)
        this.unreadNotificationCount = notificationDataCount
    }
    setReloadPage = (status) => {
        this.reloadPage = status
    }
    setNavigation = (navigation) => {
        this.navigation = navigation
    }
    setCampaignDataById = (campaign) => {
        this.campaignDataById = campaign 
    }
    setNotificationList = (notificationData) => {
        this.notificationList = notificationData
    }

    setisLoading = (loading) => {
        this.isLoading = loading
    }
    setUnreadCount = (count) => {
        this.unreadCount = count
    }

    getNotificationList = (params) => {
        this.setisLoading(true)
        getAllNotifications(params).then(response => {
            console.warn('response.data',response.data)
            
            
            this.setisLoading(false)


            let sectionDataTemp = response.data
            let sectionData = []
            
            sectionDataTemp.map(item=>{

                let date  = formatDate('DD-MMM-YYYY',item.createdAt).split(' ')[0]
              console.warn('date',date)
                let d2 = new Date(date)
                let tempData = sectionData.find(item => new Date(formatDate('DD-MMM-YYYY',item.title).split(' ')[0]).getTime() === d2.getTime())
                let tempData1 = this.notificationList.find(item => new Date(formatDate('DD-MMM-YYYY',item.title).split(' ')[0]).getTime() === d2.getTime())

                if(!tempData){
                    if (!tempData1) {
                        let obj = {}
                    obj['title'] = item.createdAt
                    obj['data']  = sectionDataTemp.filter(item=>{
                        let date1  = formatDate('DD-MMM-YYYY',item.createdAt).split(' ')[0]
                        let d1 = new Date(date1)
                        return d2.getTime()===d1.getTime()
                    })
                    sectionData.push(obj)
                    }else{
                        const count = this.notificationList.length
                        const lastElement = this.notificationList[count-1]
                        let data = lastElement.data
                        data.push(item)
                        this.notificationList[count-1].data = data
                    }
                }
            })
     
         this.setNotificationList({notificationList:[...this.notificationList,...sectionData]})

            // this.setNotificationList(response.data)
        })

    }
    getAllNotificationList = () =>{
        getUserId().then(userid => {
            const param = { where: { ownerId: userid }, order: "id DESC",include: ["profile"] }
            getAllNotifications(param).then(response => {
                const filteredReadData = response.data.filter(function(item){
                    return item.readStatus === 0;
                 })
                //console.log("getAllNotifications:",response.data)
                            this.setUnreadNotifictionCount(filteredReadData.length)
    
                // this.setNotificationList(response.data)
            })
          })
    }

    updateNotification = (params,dataParam, campaignId) => {
        this.setisLoading(true)
        updateNotifications(params,dataParam).then(response => {
            console.warn('response.updateNotifications',response)
            this.setisLoading(false)
            if(campaignId !== undefined)
            {
                this.getCampaignsByCampaignId(campaignId)
            }
          //  this.setReadAllStatus(true)

        })
    }
    setReadAllStatus = (status) => {
        this.readAllUpdated = status
    }
    getCampaignsByCampaignId = (notificationData) => {
            this.setisLoading(true)
            let condition = ''
            condition = {
                where: {
                    id: notificationData.campaignId,
                },
                include: ["remarks"],
            }
            this.setCampaignDataById(null)

            getCampaigns(condition).then(response => {
                console.log('getCampaign:', response)
                console.log('condition:', condition)

                 
                    this.setisLoading(false)
                const { status, data } = response
               
               
                if (status === 200 && !data.error) {
                 if(notificationData.type === "OWNER_PAYMENT_RELEASED")
                    {
                      this.navigation.navigate('CampaignDetails', { data: data[0] })
                    }
                    else  if(notificationData.type === "USER_CAMPAIGN_APPLY")
                    {
                        console.log('notificationData:', notificationData)
                        this.navigation.navigate('ApplicantList', { JobData: data[0] })
                    }
                    
                    else
                    {
                       this.navigation.navigate('MYCampaignDetails', {data: data[0], isFromMyApplications:false,} )

                    }
                        // this.setCampaignDataById(data)
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


    getUserAppliedCampaignsList = (notificationData) => {
        getUserId().then(userId => {
            let condition = ''
                 // Old Condition without likes and comments
                //condition = { include: ["campaigns", "profile"], where: { ownerId: userId }, order: "id DESC" }
                condition = {where: {id:notificationData.remarkId },include: [{relation: 'campaigns',
                        scope: {
                        include: ['likes','comments'],
                      },
                  }, 
                  {relation: 'profile'}], 
                  }
            console.log(condition,condition)

            getMyApplications(condition).then(response => {
    
                const { status, data } = response
                if (status === 200) {


                    this.navigation.navigate('MYCampaignDetails', {data: response.data[0].campaigns, isFromMyApplications:true, id:response.data[0].id, applicantData: response.data[0]} )

                    //this.setMyApplications(data)
                }

            }).catch(error => {
                    
                    // console.log('error in fetching campaign list', error)
                })



        })
    }
}

decorate(NotificationStore, {
    notificationList: observable,
    isLoading: observable,
    readAllUpdated: observable,
    unreadCount: observable,
    campaignDataById: observable,
    navigation: observable,
    reloadPage: observable,
    unreadNotificationCount: observable,

    setisLoading: action,
    setNotificationList: action,
    setNotificagetNotificationListtionList: action,
    updateNotification: action,
    setReadAllStatus: action,
    setUnreadCount: action,
    getCampaignsByCampaignId: action,
    setCampaignDataById: action,
    setNavigation: action,
    setReloadPage: action,
    getAllNotificationList: action,
    setUnreadNotifictionCount: action


})
export default NotificationStore