import { action, observable, decorate } from 'mobx';
import { validateInstaUsername, blockUser, getUserCampaigns, getUserDetail, userFollower, getuserFollowerscount, getuserFollowersunfallow, delFollowersunfallow,getUserReviewList ,getAppUseruserDetail} from '../../API/Profile/User/ApiProfile';
// import {getCampaigns} from '../../API/Campaign/ApiCampaign';
import { getUserId, showAlert } from '../../SupportingFIles/Utills';
import { strings } from '../../Locales/i18';
import images from '../../Themes/Images';



class UserProfileStore {
    constructor(rootStore) {
        this.rootStore = rootStore
    }

    firstName = ""
    lastName = ""
    instaUserName = ""
    userImage = ''
    userName = ''
    bio = ""
    country = ""
    followersCount = "-"
    postCount = "-"
    email = ''
    koliId = ''
    displayEmail = ''
    isLoading = false
    userPosts = []
    showReport = false
    instaaccounttype = ''
    campaignData = []
    selectedUserDetail = {}
    blockUserstatus = false
    KoliUserFollowerscount = ''
    KoliUserFollowingcount = ''
    followedbyYou = 0
    followedToYou = 0
    socialData=""
    userReviewlist=[]
    calculaterating=[]


    setinstaaccounttype = (instaaccounttype) => {
        this.instaaccounttype = instaaccounttype
    }
    setShowReport = (report) => {
        this.showReport = report
    }
    setFirstName = (firstName) => {
        this.firstName = firstName
    }
    setLastName = (lastName) => {
        this.lastName = lastName
    }
    setInstaUserName = (instaUserName) => {
        this.instaUserName = instaUserName
    }
    setUserImage = (userImage) => {
        this.userImage = userImage
    }
    setUserName = (userName) => {
        this.userName = userName
    }
    setBio = (bio) => {
        this.bio = bio
    }
    setCountry = (country) => {
        this.country = country
    }
    setFollowersCount = (followerCount) => {
        this.followersCount = followerCount
    }
    setPostsCount = (count) => {
        this.postCount = count
    }
    setPosts = (posts) => {
        this.userPosts = posts
    }
    setIsLoading = (loading) => {
        this.isLoading = loading
    }
    setSelectedUserDetail = (userData) => {
        this.selectedUserDetail = userData
    }
    setblockUserstatus = (blockUserstatus) => {
        this.blockUserstatus = blockUserstatus
    }

    setKoliUserFollowerscount = (KoliUserFollowerscount) => {

        this.KoliUserFollowerscount = KoliUserFollowerscount
    }

    setKoliUserFollowingcount = (KoliUserFollowingcount) => {
        this.KoliUserFollowingcount = KoliUserFollowingcount

    }

    setfollowedbyYou = (followedbyYou) => {
        this.followedbyYou = followedbyYou
    }

    setfollowedToYou = (followedToYou) => {
        this.followedToYou = followedToYou
    }
    
    setsocialData = (socialData) => {
        this.socialData = socialData
    }

    setuserReviewlist = (userReviewlist) => {
        this.userReviewlist = userReviewlist
    }
    setcalculaterating = (calculaterating) => {
        this.calculaterating = calculaterating
    }
    
    setblogUrl=(blogUrl)=>{
        this.blogUrl=blogUrl
    }
    

    SetUserData = (data) => {
        console.warn('SetUserData', data.blogUrl)
        let fName = data.first ? data.first.replace(/^"|"$/g, '') : ''
        this.setFirstName(fName)
        this.setLastName(data.last)
        this.setUserImage(data.avatarUrl)
        this.setBio(data.bio)
        this.setCountry(data.country)
        this.setInstaUserName(data.instaUsername)
        this.setUserName(data.username)
        this.setblogUrl(data.blogUrl)
        console.warn('instaUsername', data.instaUsername)
        if (data.instaUsername) {
            this.getInstaPosts(data.instaUsername, data.ownerId)
        }
        else {
            this.getAppSelectedUserData(data.ownerId)
        }
    }
    clearUserData = () => {
        this.setFirstName('')
        this.setLastName('')
        this.setUserImage('')
        this.setBio('')
        this.setCountry('')
        this.setInstaUserName('')
        this.setUserName('')
    }
    getInstaPosts = (userName, userId) => {
        this.setIsLoading(true)
        validateInstaUsername(userName).then(response => {
            console.warn('insta api userName =', userName)
            this.getAppSelectedUserData(userId)

            console.warn('insta api response =', response)     
            console.log('insta api response =', response)
            const { data } = response
            if (data.graphql) {
                this.setFollowersCount(data.graphql.user.edge_followed_by.count)
                this.setPosts(data.graphql.user.edge_owner_to_timeline_media.edges)
                this.setPostsCount(data.graphql.user.edge_owner_to_timeline_media.count)
                this.setinstaaccounttype(data.graphql.user.is_private)

            }
          
            // this.setIsLoading(false)
        }).catch(error => {
            //this.setIsLoading(false)
            //showAlert( '', strings('SomethingWentWrong'))

        })
    }

    blockUser = (Id) => {
        this.setIsLoading(true)
        getUserId().then(userId => {
            const param = { ownerId: userId, blockUserId: Id }
            blockUser(param).then(response => {
                const { status } = response
                this.setIsLoading(false)
                if (status === 200) {
                    this.setblockUserstatus(true)
                    showAlert('', strings('Blocked_successfully'))
                } else {
                    showAlert('', strings('SomethingWentWrong'))
                }
            }).catch(error => {
                this.setIsLoading(false)
                showAlert('', strings('SomethingWentWrong'))

            })
        })
    }

    userFollow = (Id, type) => {
        // this.setIsLoading(true)
        getUserId().then(userId => {
            const param = { ownerId: userId, followUserId: Id }
            userFollower(param).then(response => {
                const { status } = response
                // this.setIsLoading(false)
                if (status === 200) {
                    // if (type === 1) {
                    //     this.setfollowedbyYou(1)
                    // }
                    // if (type === 2) {
                    //     this.setshowfollowedToYou(1)
                    // }
                    this.getKoliUserFollowerscount(Id)
                    this.getKoliUserFollowingcount(Id)
                    this.showfollowedbyYou(Id)
                    this.showfollowedToYou(Id)
                   // showAlert('', strings('Follow_successfully'))
                } else {
                    showAlert('', strings('SomethingWentWrong'))
                }
            }).catch(error => {
                this.setIsLoading(false)
                showAlert('', strings('SomethingWentWrong'))

            })
        })
    }
    setCampaignList = (campaignList) => {
        console.log('setCampaignList:', campaignList)

        this.campaignData = campaignList
    }

    getCampaignList = (params) => {
        //this.setIsLoading(true)
        getUserCampaigns(params).then(response => {
            // this.setIsLoading(false)
            console.log('getCampaignList:', response.data.data)
            this.setCampaignList(response.data.data)
        })

    }
    // getSelectedUserData = (userID) => {
    //     this.setIsLoading(true)
    //     const param = { where: { ownerId: userID }, include: ["userBlockeds"] }
    //     getUserDetail(param).then(response => {
    //         console.log('userID==:', userID)
    //         const { status, data } = response
    //         if (status === 200 && !data.error) {
    //             this.setIsLoading(false)
             
    //             getUserId().then(userId => {
    //                 if(data[0].userBlockeds.filter(el=>el.ownerId === parseInt(userId,10) ).length>0){
    //                     this.setblockUserstatus(true)
    //                 }
    //             })
    //             this.setSelectedUserDetail(data[0])

               
    //                 const datavalue = data[0]
    //                 var socialUserData = []
    //                 console.log("datavalue",datavalue)
    //                 if (datavalue !== undefined) {
    //                   //INSTAGRAM
    //                   if (datavalue.instaUsername !== undefined && datavalue.instaUsername !== null && datavalue.instaUsername !== ''&&datavalue.followers>0) {
    //                     const instaObj = {
    //                       type: "instagram",
    //                       image: images.instaIcon,
    //                       title: 'Instagram',
    //                       followers: datavalue.followers,
    //                       metaData: "https://www.instagram.com/" + datavalue.instaUsername
    //                     }
    //                     socialUserData.push(instaObj)
    //                   }
                
    //                   //TIKTOK
    //                   if (datavalue.tiktoklink !== undefined && datavalue.tiktoklink !== null && datavalue.tiktoklink !== '') {
    //                     const tiktokObj = {
    //                       type: "tiktok",
    //                       image: images.tictocSocial,
    //                       title: 'TikTok',
    //                       followers: (datavalue.tiktokfollower !== null && datavalue.tiktokfollower !== '') ? datavalue.tiktokfollower : 0,
    //                       metaData: datavalue.tiktoklink
                
    //                     }
    //                     socialUserData.push(tiktokObj)
    //                   }
                
    //                   //YOUTUBE
    //                   if (datavalue.youtubelink !== undefined && datavalue.youtubelink !== null && datavalue.youtubelink !== '') {
    //                     const youtubeObj = {
    //                       type: "youtube",
    //                       image: images.youtubeSocial,
    //                       title: 'YouTube',
    //                       followers: (datavalue.youtubefollower !== null && datavalue.youtubefollower !== '') ? datavalue.youtubefollower : 0,
    //                       metaData: datavalue.youtubelink
                
    //                     }
    //                     socialUserData.push(youtubeObj)
    //                   }
                
    //                   //TWITTER
    //                   if (datavalue.twitterlink !== undefined && datavalue.twitterlink !== null && datavalue.twitterlink !== '') {
    //                     const obj = {
    //                       type: "twitter",
    //                       image: images.twitterSocial,
    //                       title: 'Twitter',
    //                       followers: (datavalue.twitterfollower !== null && datavalue.twitterfollower !== '') ? datavalue.twitterfollower : 0,
    //                       metaData: datavalue.twitterlink
                
    //                     }
    //                     socialUserData.push(obj)
    //                   }
                
    //                   //LINKEDIN
    //                   if (datavalue.linkedinlink !== undefined && datavalue.linkedinlink !== null && datavalue.linkedinlink !== '') {
    //                     const obj = {
    //                       type: "linkedin",
    //                       image: images.linkedinSocial,
    //                       isSelected: false,
    //                       title: 'Linkedin',
    //                       followers: (datavalue.linkedinfollower !== null && datavalue.linkedinfollower !== '') ? datavalue.linkedinfollower : 0,
    //                       metaData: datavalue.linkedinlink
                
    //                     }
    //                     socialUserData.push(obj)
    //                   }
                
    //                   //CLUBHOUSE
    //                   if (datavalue.clubhouselink !== undefined && datavalue.clubhouselink !== null && datavalue.clubhouselink !== '') {
    //                     const obj = {
    //                       type: "clubhouse",
    //                       image: images.clubhouseSocial,
    //                       isSelected: false,
    //                       title: 'Clubhouse',
    //                       followers: (datavalue.clubhousefollower !== null && datavalue.clubhousefollower !== '') ? datavalue.clubhousefollower : 0,
    //                       metaData: datavalue.clubhouselink
                
    //                     }
    //                     socialUserData.push(obj)
    //                   }
    //                   //TWITCH
    //                   if (datavalue.twitchlink !== undefined && datavalue.twitchlink !== null && datavalue.twitchlink !== '') {
    //                     const obj = {
    //                       type: "twitch",
    //                       image: images.twitchSocial,
    //                       title: 'Twitch',
    //                       followers: (datavalue.twitchfollower !== null && datavalue.twitchfollower !== '') ? datavalue.twitchfollower : 0,
    //                       metaData: datavalue.twitchlink
                
    //                     }
    //                     socialUserData.push(obj)
    //                   }

    //                   console.log("socialUserData==",socialUserData)
                     
    //                   this.setsocialData(socialUserData)
    //                 }
                  

               
    //         } else if (status === 200 && data.error) {
    //             this.setisLoading(false)
    //         } else {
    //             this.setIsLoading(false)

    //         }
    //     }).catch(error => {
    //         this.setisLoading(false)
    //     })
    // }

    //New Api call

    getAppSelectedUserData = (userID) => {
        getUserId().then(id => {
        this.setIsLoading(true)
        getAppUseruserDetail(id,userID).then(response => { 
            const { status, data } = response
            if (status === 200 && !data.error) {
               
                this.setIsLoading(false)
                getUserId().then(userId => {
                    if(data.data[0].userBlockeds.filter(el=>el.ownerId === parseInt(userId,10) ).length>0){
                        this.setblockUserstatus(true)
                    }
                })

                this.setSelectedUserDetail(data.data[0])
                this.setfollowedbyYou(data.followbyyou)
                this.setfollowedToYou(data.followtoyou)
                this.setKoliUserFollowingcount(data.UserFollowingCount)
                this.setKoliUserFollowerscount(data.UserFollowersCount)
                
                    const datavalue = data.data[0]
                    this.setblogUrl(datavalue !== undefined&&datavalue.blogUrl!==null?datavalue.blogUrl:"")
                    var socialUserData = []
                    console.log("datavalue",datavalue)
                    if (datavalue !== undefined) {
                      //INSTAGRAM
                      if (datavalue.instaUsername !== undefined && datavalue.instaUsername !== null && datavalue.instaUsername !== ''&&datavalue.followers>0) {
                        const instaObj = {
                          type: "instagram",
                          image: images.instaIcon,
                          title: 'Instagram',
                          followers: datavalue.followers,
                          metaData: "https://www.instagram.com/" + datavalue.instaUsername
                        }
                        socialUserData.push(instaObj)
                      }
                
                      //TIKTOK
                      if (datavalue.tiktoklink !== undefined && datavalue.tiktoklink !== null && datavalue.tiktoklink !== '') {
                        const tiktokObj = {
                          type: "tiktok",
                          image: images.tictocSocial,
                          title: 'TikTok',
                          followers: (datavalue.tiktokfollower !== null && datavalue.tiktokfollower !== '') ? datavalue.tiktokfollower : 0,
                          metaData: datavalue.tiktoklink
                
                        }
                        socialUserData.push(tiktokObj)
                      }
                
                      //YOUTUBE
                      if (datavalue.youtubelink !== undefined && datavalue.youtubelink !== null && datavalue.youtubelink !== '') {
                        const youtubeObj = {
                          type: "youtube",
                          image: images.youtubeSocial,
                          title: 'YouTube',
                          followers: (datavalue.youtubefollower !== null && datavalue.youtubefollower !== '') ? datavalue.youtubefollower : 0,
                          metaData: datavalue.youtubelink
                
                        }
                        socialUserData.push(youtubeObj)
                      }
                
                      //TWITTER
                      if (datavalue.twitterlink !== undefined && datavalue.twitterlink !== null && datavalue.twitterlink !== '') {
                        const obj = {
                          type: "twitter",
                          image: images.twitterSocial,
                          title: 'Twitter',
                          followers: (datavalue.twitterfollower !== null && datavalue.twitterfollower !== '') ? datavalue.twitterfollower : 0,
                          metaData: datavalue.twitterlink
                
                        }
                        socialUserData.push(obj)
                      }
                
                      //LINKEDIN
                      if (datavalue.linkedinlink !== undefined && datavalue.linkedinlink !== null && datavalue.linkedinlink !== '') {
                        const obj = {
                          type: "linkedin",
                          image: images.linkedinSocial,
                          isSelected: false,
                          title: 'Linkedin',
                          followers: (datavalue.linkedinfollower !== null && datavalue.linkedinfollower !== '') ? datavalue.linkedinfollower : 0,
                          metaData: datavalue.linkedinlink
                
                        }
                        socialUserData.push(obj)
                      }
                
                      //CLUBHOUSE
                      if (datavalue.clubhouselink !== undefined && datavalue.clubhouselink !== null && datavalue.clubhouselink !== '') {
                        const obj = {
                          type: "clubhouse",
                          image: images.clubhouseSocial,
                          isSelected: false,
                          title: 'Clubhouse',
                          followers: (datavalue.clubhousefollower !== null && datavalue.clubhousefollower !== '') ? datavalue.clubhousefollower : 0,
                          metaData: datavalue.clubhouselink
                
                        }
                        socialUserData.push(obj)
                      }
                      //TWITCH
                      if (datavalue.twitchlink !== undefined && datavalue.twitchlink !== null && datavalue.twitchlink !== '') {
                        const obj = {
                          type: "twitch",
                          image: images.twitchSocial,
                          title: 'Twitch',
                          followers: (datavalue.twitchfollower !== null && datavalue.twitchfollower !== '') ? datavalue.twitchfollower : 0,
                          metaData: datavalue.twitchlink
                
                        }
                        socialUserData.push(obj)
                      }

                      console.log("socialUserData==",socialUserData)
                     
                      this.setsocialData(socialUserData)
                    }
                  

                // if (data[0].userBlockeds.length > 0) {
                //     for (let j = 0; j < data[0].userBlockeds.length; j++) {
                //         if (data[0].userBlockeds[j].ownerId === parseInt(loginUserId,10) ) {
                //             this.setblockUserstatus(true)

                //         }

                //     }


                // }
            } else if (status === 200 && data.error) {
                this.setisLoading(false)
            } else {
                this.setIsLoading(false)

            }
        }).catch(error => {
            this.setisLoading(false)
        })
    })
    }



    getKoliUserFollowerscount = (id) => {
        const param = { "followUserId": id }
        getuserFollowerscount(param).then(response => {
            console.log('getKoliUserFollowerscount:',response)
            this.setKoliUserFollowerscount(response.data.count)


        })

    }

    getKoliUserFollowingcount = (id) => {
        const param = { "ownerId": id }
        getuserFollowerscount(param).then(response => {
            this.setKoliUserFollowingcount(response.data.count)


        })

    }




    showfollowedbyYou = (id) => {
        getUserId().then(userid => {
            const param = { "ownerId": userid, "followUserId": id }
            getuserFollowerscount(param).then(response => {
                this.setfollowedbyYou(response.data.count)

            })
        })

    }

    showfollowedToYou = (id) => {
        getUserId().then(userid => {
            const param = { "ownerId": id, "followUserId": userid }
            getuserFollowerscount(param).then(response => {
                this.setfollowedToYou(response.data.count)

            })
        })

    }

    unfollowuser = (id, type) => {
        // this.setIsLoading(true)

        getUserId().then(userid => {

            const param = { where: { "ownerId": userid, "followUserId": id } }

            getuserFollowersunfallow(param).then(response => {
                const { status, data } = response
                console.log("response=",response)
                if (status === 200 && !data.error) {
                    this.setIsLoading(false)
                    if(data.length>0)
                    {
                        this.userunfallowbyid(data, type, id)

                    }

                } else {
                    this.setIsLoading(false)

                }


            })
        })
    }


    userReviewList = (userid) => {
            const param = { "include": ["profile"], "where": { "applicantOwnerId": userid}, 
            order: [ "createdAt DESC"],
        }
            getUserReviewList(param).then(response => {
                const { status, data } = response
                console.log("response user list=",response.data)
                if (status === 200 && !data.error) {
                                      
                        this.setuserReviewlist(data)
                        const total = data.reduce((prev,next) => prev + next.reviewRating,0);  
                        console.warn("newValue",total)
                        this.setcalculaterating(total/data.length)

                } else {
                   

                }


            })
    }

    

    userunfallowbyid = (data, type, id) => {

        delFollowersunfallow(data[0].id).then(response => {
            this.setIsLoading(false)

                 this.getKoliUserFollowerscount(id)
                    this.getKoliUserFollowingcount(id)
                    this.showfollowedbyYou(id)
                    this.showfollowedToYou(id)
            // if (type === 3) {
            //     this.getKoliUserFollowerscount(id)
            //     this.getKoliUserFollowingcount(id)
            //     this.setfollowedbyYou(0)


            // }





        })
    }

}

decorate(UserProfileStore, {
    firstName: observable,
    lastName: observable,
    instaUserName: observable,
    bio: observable,
    country: observable,
    followersCount: observable,
    postCount: observable,
    userPosts: observable,
    userImage: observable,
    userName: observable,
    isLoading: observable,
    showReport: observable,
    campaignData: observable,
    selectedUserDetail: observable,
    blockUserstatus: observable,
    KoliUserFollowerscount: observable,
    KoliUserFollowingcount: observable,
    followedbyYou: observable,
    showfollowedToYou: observable,
    socialData:observable,
    userReviewlist:observable,
    calculaterating:observable,
    blogUrl:observable,

    setFirstName: action,
    setLastName: action,
    setInstaUserName: action,
    setBio: action,
    setCountry: action,
    setFollowersCount: action,
    setPostsCount: action,
    setPosts: action,
    setUserImage: action,
    setUserName: action,
    setIsLoading: action,
    getInstaPosts: action,
    SetUserData: action,
    setShowReport: action,
    blockUser: action,
    getCampaignList: action,
    setCampaignList: action,
    clearUserData: action,
    setSelectedUserDetail: action,
    getSelectedUserData: action,
    setblockUserstatus: action,
    setKoliUserFollowerscount: action,
    setKoliUserFollowingcount: action,
    setfollowedbyYou: action,
    setshowfollowedToYou: action,
    setsocialData:action,
    setuserReviewlist:action,
    setcalculaterating:action,
    getAppSelectedUserData:action,
    setblogUrl:action
})
export default UserProfileStore