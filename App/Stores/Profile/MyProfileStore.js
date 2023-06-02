import { action, observable, decorate } from 'mobx';
import { getInterest, getCity, updateUserProfile, validateInstaUsername, getNextPagePost, getuserFollowerscount,getAppUseruserDetail, submitState } from '../../API/Profile/User/ApiProfile';
import { getUserId, showAlert, setUserData, gettUserData, validateEmail } from '../../SupportingFIles/Utills';

import { strings } from '../../Locales/i18';
import moment from 'moment';
import { Alert } from 'react-native';
//  import Toast from 'react-native-simple-toast';
const countriesJson = require('../../SupportingFIles/countries.json');
const formatCurrency = new Intl.NumberFormat('en-US')




class MyProfileStore {
    constructor(rootStore) {
        this.rootStore = rootStore
    }

    firstName = ""
    lastName = ""
    instaUserName = ""
    userImage = ''
    userName = ''
    bio = ""
    city = ""
    country = ""
    countryCode = ""
    followersCount = "0"
    postCount = "0"
    email = ''
    koliId = ''
    interests = []
    displayEmail = ''
    cityList = []
    gender = ''
    myInterests = []
    isLoading = false
    posts = []
    userExist = false
    hasNextPage = false
    end_curser = null
    instaUserId = ''
    facebookUsername = ''
    validationError = {}
    SelectedItem = ''
    navigation = null
    instaperpost = ''
    facebookperpost = ''
    twitchPerPost=''
    tiktokPerPost=''
    twitterPerPost=''
    linkedinPerPost=''
    clubhousePerPost=''
    youtubePerPost=''
    updatestatus = false
    instaaccounttype = false
    navigationParams = null
    youtubeUrl=""
    youtubFollower=""
    twitterUrl=""
    twitterFollower=""
    tiktokUrl=""
    tiktokFollower=""
    linkedinUrl=""
    linkedinFollower=""
    clubhouseUrl=""
    clubhouseFollower=""
    twitchUrl=""
    twitchFollower=""
    paypalEmail=""
    dob=""
    emailPrivate=""
    phonePrivate=""
    affilateCode=""
        Mobile=""
        Mobilecode=""
        blogUrl=""
        selectedState=""
        selectedKeywordId=""
        KoliUserFollowerscount = ''
        KoliUserFollowingcount = ''
        backAfterupdatecode=false
    clearUserData = () => {
        this.selectedState=""
        this.selectedKeywordId=""
        this.firstName = ""
        this.lastName = ""
        this.instaUserName = ""
        this.userImage = ''
        this.userName = ''
        this.bio = ""
        this.city = ""
        this.country = ""
        this.countryCode = ""
        this.followersCount = "0"
        this.postCount = "0"
        this.email = ''
        this.koliId = ''
        this.interests = []
        this.displayEmail = ''
        this.cityList = []
        this.gender = ''
        this.myInterests = []
        this.isLoading = false
        this.posts = []
        this.userExist = false
        this.instaUserId = ''
        this.facebookUsername = ''
        this.validationError = {}
        this.SelectedItem = ''
        this.navigation = null
        this.instaperpost = ''
        this.facebookperpost = ''
        this.twitchPerPost=""
        this.tiktokPerPost=''
        this.twitterPerPost=''
        this.linkedinPerPost=''
        this.clubhousePerPost=''
        this.updatestatus = false
        this.instaaccounttype = false
        this.navigationParams = null
        this.KoliUserFollowerscount = ''
        this.KoliUserFollowingcount = ''
        this.backAfterupdatecode=false
        

    }

    setSelectedKeyowrdId=(keyword)=>{
        this.selectedKeywordId = keyword
    }

    setSelectedState=(state)=>{
        this.selectedState=state
    }
    
    setMobile = (Mobile) => {
        this.Mobile = Mobile
    }

    setMobilecode = (Mobilecode) => {
        this.Mobilecode = Mobilecode
    }

    

    setaffilateCode = (affilateCode) => {
        this.affilateCode = affilateCode
    }
    setinstaaccounttype = (instaaccounttype) => {
        this.instaaccounttype = instaaccounttype
        console.log('instaaccounttype=', instaaccounttype)
    }
    setinstaperpost = (instaperpost) => {
        let instaperpostv = instaperpost.replace(/[^0-9]/g, '')
        this.instaperpost = formatCurrency.format(instaperpostv)
    }
    setfacebookperpost = (facebookperpost) => {
        let facebookperpostv = facebookperpost.replace(/[^0-9]/g, '')

        this.facebookperpost = formatCurrency.format(facebookperpostv)
    }
    settiktokperpost = (tiktokperpost) => {
        let tiktokperpostv = tiktokperpost.replace(/[^0-9]/g, '')

        this.tiktokPerPost = formatCurrency.format(tiktokperpostv)
    }
    settwitterperpost = (twitterperpost) => {
        let twitterperpostv = twitterperpost.replace(/[^0-9]/g, '')

        this.twitterPerPost= formatCurrency.format(twitterperpostv)
    }
    setlinkedinperpost = (linkedinperpost) => {
        let linkedinperpostv = linkedinperpost.replace(/[^0-9]/g, '')

        this.linkedinPerPost= formatCurrency.format(linkedinperpostv)
    }
    setclubhouseperpost = (clubhouseperpost) => {
        let clubhhouseperpostv = clubhouseperpost.replace(/[^0-9]/g, '')

        this.clubhousePerPost= formatCurrency.format(clubhhouseperpostv)
    }
    setclubhouseperpost = (clubhouseperpost) => {
        let clubhhouseperpostv = clubhouseperpost.replace(/[^0-9]/g, '')

        this.clubhousePerPost= formatCurrency.format(clubhhouseperpostv)
    }
    settwitchperpost = (twitchperopsot) => {
        let twitchperpostv = twitchperopsot.replace(/[^0-9]/g, '')

        this.twitterPerPost= formatCurrency.format(twitchperpostv)
    }
    setyoutubeperpost = (youtubeperpost)=>{
        let youtubeperpostv = youtubeperpost.replace(/[^0-9]/g, '')

        this.youtubePerPost= formatCurrency.format(youtubeperpostv)
    }
    setNavigation = (navigation) => {
        this.navigation = navigation
    }
    setNavigationParams = (navigationParams) => {
        this.navigationParams = navigationParams
    }
    setFacebookUserName = (userName) => {
        if (userName == null) {
            this.facebookUsername = ""
        } else {
            this.facebookUsername = userName
        }
    }
    setInstaUserId = (id) => {
        this.instaUserId = id
    }
    setHasNextPage = (hasNext) => {
        this.hasNextPage = hasNext
    }
    setEndCurser = (end_curser) => {
        this.end_curser = end_curser
    }
    setFirstName = (firstName) => {
        // firstName = firstName.replace(/[^A-Za-z]/ig, '')
        this.firstName = firstName
        this.deleteValidationError('firstNameError')

    }
    setLastName = (lastName) => {
        // lastName = lastName.replace(/[^A-Za-z]/ig, '')
        this.lastName = lastName
        this.deleteValidationError('lastNameError')
    }

    setInstaUserName = (instaUserName) => {
     console.log('instaUserName-=-=-=-=-=-=-=>',instaUserName)
        if (instaUserName == null) {
            this.instaUserName = ""
        } else {
            this.instaUserName = instaUserName
        }
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

        // this.getCityList()
    }
    setFollowersCount = (followerCount) => {
        this.followersCount = followerCount
    }
    setPostsCount = (postCount) => {
        this.postCount = postCount
    }
    setPosts = (posts) => {
        this.posts = posts
    }
    setEmail = (email) => {
        this.email = email

    }
    setKoliId = (id) => {
        this.koliId = id
    }
    setInterest = (interest) => {
        this.interests = interest
    }
    setMyInterest = (interest) => {
        this.myInterests = interest
    }
    setDisplayEmail = (mail) => {
        this.displayEmail = mail
    }
    setCity = (city) => {
        this.cityList = city
    }
    setGender = (gender) => {
        this.gender = gender

    }
    getInterestList = () => {
        getInterest().then(response => {
            this.setInterest(response.data.value)
        })
    }
    setSelectedItem = (SelectedItem) => {
        this.SelectedItem = SelectedItem
    }

    setupdatestatus = (updatestatus) => {
        this.updatestatus = updatestatus
    }

    setKoliUserFollowerscount = (KoliUserFollowerscount) => {

        this.KoliUserFollowerscount = KoliUserFollowerscount
    }

    setKoliUserFollowingcount = (KoliUserFollowingcount) => {
        this.KoliUserFollowingcount = KoliUserFollowingcount

    }

    setyoutubeUrl = (youtubeUrl) => {
        this.youtubeUrl = youtubeUrl

    }
    setyoutubFollower = (youtubFollower) => {
        this.youtubFollower = youtubFollower

    }

    settwitterUrl = (twitterUrl) => {
        this.twitterUrl = twitterUrl

    }
    settwitterFollower = (twitterFollower) => {
        this.twitterFollower = twitterFollower

    }

    settiktokUrl = (tiktokUrl) => {
        this.tiktokUrl = tiktokUrl

    }
    settiktokFollower = (tiktokFollower) => {
        this.tiktokFollower = tiktokFollower

    }
    
    setlinkedinUrl = (linkedinUrl) => {
        this.linkedinUrl = linkedinUrl

    }
    setlinkedinFollower = (linkedinFollower) => {
        this.linkedinFollower = linkedinFollower

    }
    setclubhouseUrl = (clubhouseUrl) => {
        this.clubhouseUrl = clubhouseUrl

    }
    setclubhouseFollower = (clubhouseFollower) => {
        this.clubhouseFollower = clubhouseFollower

    }

    settwitchUrl = (twitchUrl) => {
        this.twitchUrl = twitchUrl

    }
    settwitchFollower = (twitchFollower) => {
        this.twitchFollower = twitchFollower

    }
    setPaypalEmail = (paypalEmail) => {
        this.paypalEmail = paypalEmail
        this.deleteValidationError('paypalError')
    }

    setdob = (dob) => {
        this.dob = dob
        // this.deleteValidationError('dobError')
    }
  
    setemailPrivate=(emailPrivate)=>
    {
        this.emailPrivate=emailPrivate
    }
    setphonePrivate=(phonePrivate)=>
    {
        this.phonePrivate=phonePrivate
    }
    
    getCityList = () => {
        getCity({ country: this.country }).then(response => {
            const { status, data } = response
            if (status == 200 && data) {
                let city = data
                city.map(obj => {
                    obj.label = obj.cityName
                    obj.value = obj.cityName
                })
                this.setCity(city)
            }

        })
    }


    setIsLoading = (loading) => {
        this.isLoading = loading
    }
    setUserExist = (exist) => {
        this.userExist = exist
    }
    setValidationError = (param) => {
        this.validationError = param
    }

    setbackAfterupdatecode=(backAfterupdatecode)=>
    {
        this.backAfterupdatecode=backAfterupdatecode
    }
    
    setblogUrl=(blogUrl)=>
    {
        this.blogUrl=blogUrl
    }
    
    deleteValidationError = (param) => {
        switch (param) {
            case 'firstNameError':
                delete this.validationError.firstNameError
                break;
            case 'lastNameError':
                delete this.validationError.lastNameError
                break;
            case 'paypalError':
                    delete this.validationError.paypalError
                    break;
                // case 'dobError':
                // delete this.validationError.dobError
                // break;
            default:
                break;
        }
    }
    updateUserProfile = (updatefrom = '') => {
        // displayedEmail: this.displayEmail,
        if (this.firstName.trim() == '' || this.lastName.trim() == '') {
            if (this.firstName.trim() == '') {
                this.setValidationError({ ...this.validationError, firstNameError: strings('EnterFirstName') })
            }
            if (this.lastName.trim() == '') {
                this.setValidationError({ ...this.validationError, lastNameError: strings('EnterLastName') })
            }
            // if (this.dob.trim() === '') {
            //     console.log("this.dob=2",this.dob)

            //     this.setValidationError({ ...this.validationError, dobError: strings('Enter_dob') })
                
            // }
        } 
        // else if (this.paypalEmail !== null && this.paypalEmail.trim() !== "")
        // {
        //     if (!validateEmail(this.paypalEmail)) {
        //         this.setValidationError({ ...this.validationError, paypalError: strings('paypal_email_error') })
        //     }
        //     else
        //     {
        //         this.updateProfileApiCall(updatefrom)
        //     }
        // }
        else {
        
            this.updateProfileApiCall(updatefrom)
        }
    }

    addState=()=>{
        getUserId().then(userid => {
            let param = {
                c: moment().toISOString(),
                rid: this.selectedState,
                influencerId: userid,
                keywordId: this.selectedKeywordId
            }
            console.log(param)
            submitState(param,userid).then((res)=>{
                        console.log('res========',res)
            })
            .catch(error => {
                console.log('updateUserProfile response:error', error)
    
                this.setIsLoading(false)
                showAlert('', strings('SomethingWentWrong'))
    
            })
        })
        
    }


    updateProfileApiCall = (updatefrom = '') =>{
        this.addState()
        const selectedCountry = countriesJson.filter(obj => obj.name === this.country)
        getUserId().then(userid => {
            let param = {
                first: this.firstName.trim(),
                last: this.lastName.trim(),
                bio: this.bio.trim(),
                country: this.country,
                state:this.selectedState,
                 gender: this.gender,
                 avatarUrl: this.userImage,
                interests: this.myInterests,
                instaUsername: this.instaUserName,
                facebookUsername: this.facebookUsername,
                instaPerPost: this.instaperpost.replace(/,/g, ""),
                facebookPerPost: this.facebookperpost.replace(/,/g, ""),
                // followers: this.followersCount,
                countryShortCode: selectedCountry[0].code,
                isDisplay:(this.userImage!=""||this.userImage!="NA")?1:0,
                youtubelink: this.youtubeUrl,
                youtubefollower: this.youtubFollower,
                // youtubePerPost:this.youtubePerPost,
                tiktoklink: this.tiktokUrl,
                tiktokfollower: this.tiktokFollower,
                // tiktokPerPost:this.tiktokPerPost,
                twitterlink: this.twitterUrl,
                twitterfollower: this.twitterFollower,
                // twitterPerPost:this.twitterPerPost,
                linkedinlink: this.linkedinUrl,
                linkedinfollower: this.linkedinFollower,
                // linkedinPerPost:this.linkedinPerPost,
                clubhouselink: this.clubhouseUrl,
                clubhousefollower: this.clubhouseFollower,
                // clubhousePerPost:this.clubhousePerPost,
                twitchlink: this.twitchUrl,
                twitchfollower: this.twitchFollower,
                // twitchPerPost:this.twitchPerPost,
                paypal_email: this.paypalEmail,
                emailPrivate:this.emailPrivate===true?1:0,
                phonePrivate:this.phonePrivate===true?1:0,
                affilateCode:this.affilateCode,
                mobile:this.Mobile,
                phoneCode:this.Mobilecode,
                blogUrl:this.blogUrl
            }
            if(this.followersCount!=="0")
            {
                param.followers =this.followersCount
            }
            
            if(this.dob!=="")
            {
                param.dob=this.dob
            }
             console.log('paramurlcheck2',param)
            this.setIsLoading(true)
            updateUserProfile(param, userid).then(response => {
                const { status, data } = response
                console.log('updateUserProfile response:', data)
                this.setIsLoading(false)
                if (status === 200) {
                    let result = data.message.profile
                    setUserData(JSON.stringify(result))
                    this.setFirstName(result.first)
                    this.setLastName(result.last)
                    this.setUserImage(result.avatarUrl)
                    this.setupdatestatus(false)
                    // this.setFollowersCount('0')
                    // this.setPosts([])
                    // this.setPostsCount('0')
                    // this.setUserExist(false)
                    if (updatefrom === '') {
                        this.showSuccessAlert()
                    } else {
                        //this.getInstaPosts(this.instaUserName)
                    }
                    // showAlert('', strings('updated_successfully'))
                    // setTimeout(() => {
                    //     this.navigation.navigate('ProfileStackScreen')
                    // }, 800);
                } else {
                    console.log('updateUserProfile response:error', error)
                    showAlert('', strings('SomethingWentWrong'))
                }
            }).catch(error => {
                console.log('updateUserProfile response:error', error)

                this.setIsLoading(false)
                showAlert('', strings('SomethingWentWrong'))

            })
        })
    }

    showSuccessAlert = () => {

        console.log('this.navigationParams:', this.navigationParams)
        //Toast.showWithGravity(strings('updated_successfully'), Platform.OS == 'android'?Toast.SHORT:Toast.LONG, Toast.BOTTOM);
        //When user navigated from apply campaign we need to redirect him to campaign detail after updating profile
        this.navigation.goBack()
        // if (this.navigationParams !== null) {
        //     if (this.navigationParams.isFromApplyJob) {
        //         this.navigation.goBack()
        //     }
        //     else {
        //         this.navigation.goBack()
        //     }
        // }
        // else {
        //     this.navigation.goBack()
        // }

        // setTimeout(() => {
        //     this.navigation.navigate('ProfileStackScreen')
        // }, 500);
    }
    validateInstaUserName = () => {
        if (this.instaUserName === '') {
            showAlert('', strings('Please_enter_instagramusername'))


        } else {

            this.setIsLoading(true)
            validateInstaUsername(this.instaUserName).then(response => {
                const { data } = response
                console.log("validateInstaUsername:", response)
                this.setIsLoading(false)
                if (data) {
                    this.setupdatestatus(true)
                    this.setFollowersCount(data.graphql.user.edge_followed_by.count)
                    this.setinstaaccounttype(data.graphql.user.is_private)
                    this.setPosts(data.graphql.user.edge_owner_to_timeline_media.edges)
                    this.setUserExist(true)
                    this.updateUserInstalinkedTime()

                } else {
                    this.setIsLoading(false)

                    //showAlert('Opps!!! Error fetching some details')
                }
            })
        }
    }
    validateInstaUserNamenew = (username) => {


        this.setIsLoading(true)
        validateInstaUsername(username).then(response => {
            const { data } = response
            console.log("validateInstaUsername:", response)

            if (data) {
                this.setInstaUserName(username)
                this.updateUserProfile('MyProfile')
                this.setFollowersCount(data.graphql.user.edge_followed_by.count)
                this.setPosts(data.graphql.user.edge_owner_to_timeline_media.edges)
                this.setinstaaccounttype(data.graphql.user.is_private)
                this.setUserExist(true)
                this.setIsLoading(false)

            } else {
                this.updateUserProfile('MyProfile')

                //showAlert('Opps!!! Error fetching some details')
            }
        })
    }

    getInstaPosts = (userName) => {
        // this.setIsLoading(true)
        console.log('response getInstaPosts==', userName)
        validateInstaUsername(userName).then(response => {
            this.setIsLoading(false)

            const { data } = response
            console.log('response getinstapost==', response)
            if (data.graphql) {
                this.setFollowersCount(data.graphql.user.edge_followed_by.count)
                this.setPosts(data.graphql.user.edge_owner_to_timeline_media.edges)
                this.setPostsCount(data.graphql.user.edge_owner_to_timeline_media.count)
                this.setHasNextPage(data.graphql.user.edge_owner_to_timeline_media.page_info.has_next_page)
                this.setEndCurser(data.graphql.user.edge_owner_to_timeline_media.page_info.end_cursor)
                this.setinstaaccounttype(data.graphql.user.is_private)
                this.setInstaUserId(data.graphql.user.id)
            }
            else {

                gettUserData().then(userData => {
                    console.log("userData:", userData)
                    this.setFollowersCount(userData.followers)
                    this.countryCode = userData.countryShortCode;
                })
                //this.setFollowersCount(0)
            }
        }).catch(error => {
            this.setIsLoading(false)
            gettUserData().then(userData => {
                console.log("userData:", userData)
                this.setFollowersCount(userData.followers)
            })
            //showAlert('Opps!!! Error fetching some details')

            //showAlert( '', strings('SomethingWentWrong'))

        })
    }
    getNextPost = () => {
        if (this.hasNextPage) {
            getNextPagePost(this.end_curser, this.instaUserId).then(response => {
                const { data } = response
                if (data.data.user.edge_owner_to_timeline_media) {
                    this.setPosts([...this.posts, ...data.data.user.edge_owner_to_timeline_media.edges])
                    this.setHasNextPage(data.data.user.edge_owner_to_timeline_media.page_info.has_next_page)
                    this.setEndCurser(data.data.user.edge_owner_to_timeline_media.page_info.end_cursor)
                }
            })
        }
    }
    updateSettings = (param) => {
        // displayedEmail: this.displayEmail,

        getUserId().then(userid => {
            this.setIsLoading(true)
            updateUserProfile(param, userid).then(response => {
                const { status, data } = response
                console.log('updateUserProfile response:', response, status)
                this.setIsLoading(false)
                if (status === 200) {
                    let result = data.message.profile
                    setUserData(JSON.stringify(result))
                } else {
                    showAlert('', strings('SomethingWentWrong'))
                }
            }).catch(error => {
                console.log('updateUserProfile response:', error)

                this.setIsLoading(false)
                showAlert('', strings('SomethingWentWrong'))

            })
        })
    }

    updateAffiliateCode = (param) => {
        getUserId().then(userid => {
            this.setIsLoading(true)
            updateUserProfile(param, userid).then(response => {
                const { status, data } = response
                console.log('updateUserProfile response:', response, status)
                this.setIsLoading(false)
                if (status === 200) {
                    let result = data.message.profile
                    setUserData(JSON.stringify(result))
                    this.setbackAfterupdatecode(true)
                } else {
                    showAlert('', strings('SomethingWentWrong'))
                }
            }).catch(error => {
                console.log('updateUserProfile response:', error)

                this.setIsLoading(false)
                showAlert('', strings('SomethingWentWrong'))

            })
        })
    }

    getprofile = () => {
        getUserId().then(userid => {
            let param = {
                first: this.firstName.trim()
            }
            updateUserProfile(param, userid).then(response => {
                const { status, data } = response
                console.log('updateUserProfile response:', response, status)
                this.setIsLoading(false)
                if (status === 200) {
                    let result = data.message.profile
                    setUserData(JSON.stringify(result))
                }
            }).catch(error => {
                

            })
        })
    }


    getKoliMYFollowerscount = () => {
        getUserId().then(userid => {
            const param = { "where": { "ownerId": userid } }
            console.log("param", param)
            getBlockUserList(param).then(response => {
                this.setisLoading(false)
                this.setBlockUserList(response.data)
                console.log("response", response.data)

            })

        })

    }

    getKoliUserFollowerscount = () => {
        getUserId().then(userid => {
            const param = { "followUserId": userid }
            getuserFollowerscount(param).then(response => {
                console.log("count response", response.data)
                this.setKoliUserFollowerscount(response.data.count)
                this.setisLoading(false)
                // console.log("count response", response.count)
            })
        })

    }

    getKoliUserFollowingcount = () => {
        getUserId().then(userid => {
            const param = { "ownerId": userid }
            getuserFollowerscount(param).then(response => {
                console.log("KoliUserFollowingcount", response.data)
                this.setKoliUserFollowingcount(response.data.count)
                this.setisLoading(false)


            })
        })


    }

    updateUserInstalinkedTime = () => {
        getUserId().then(userid => {
            let param = { lastSeen: new Date(),
                linked_insta_time:new Date(), }
            updateUserProfile(param, userid).then(response => {
                console.log('updateUserLastSeen insta:', response.data)          
            }).catch(error => {
                console.log('updateUserLastSeen:', error)
            })
        })

    }

    updatelastMyProfileVisit = () => {
        getUserId().then(userid => {
            let param = { lastSeen: new Date(),
                lastMyProfileVisit:new Date(), }
            updateUserProfile(param, userid).then(response => {
                console.log('updateUserLastSeen insta:', response.data)          
            }).catch(error => {
                console.log('updateUserLastSeen:', error)
            })
        })

    }



    getAppSelectedUserData = () => {
        getUserId().then(id => {
        
        getAppUseruserDetail(id,id).then(response => { 
            const { status, data } = response
            if (status === 200 && !data.error) {
               console.log("new Api responce",data)
                this.setIsLoading(false)
                
                this.setKoliUserFollowingcount(data.UserFollowingCount)
               this.setKoliUserFollowerscount(data.UserFollowersCount)
                
                  
                  

                
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

}

decorate(MyProfileStore, {
    selectedState:observable,
    selectedKeywordId:observable,
    firstName: observable,
    lastName: observable,
    instaUserName: observable,
    bio: observable,
    city: observable,
    country: observable,
    countryCode: observable,
    followersCount: observable,
    postCount: observable,
    posts: observable,
    interests: observable,
    userImage: observable,
    userName: observable,
    displayEmail: observable,
    gender: observable,
    myInterests: observable,
    isLoading: observable,
    userExist: observable,
    hasNextPage: observable,
    end_curser: observable,
    instaUserId: observable,
    facebookUsername: observable,
    validationError: observable,
    SelectedItem: observable,
    navigation: observable,
    instaperpost: observable,
    facebookperpost: observable,
    updatestatus: observable,
    instaaccounttype: observable,
    navigationParams: observable,
    KoliUserFollowerscount: observable,
    KoliUserFollowingcount: observable,
    youtubeUrl:observable,
    youtubFollower:observable,
    twitterUrl:observable,
    twitterFollower:observable,
    tiktokUrl:observable,
    tiktokFollower:observable,
    linkedinUrl:observable,
    linkedinFollower:observable,
    clubhouseUrl:observable,
    clubhouseFollower:observable,
    twitchUrl:observable,
    twitchFollower:observable,
    paypalEmail:observable,
    dob:observable,
    emailPrivate:observable,
    phonePrivate:observable,
    affilateCode:observable,
    Mobile:observable,
    Mobilecode:observable,
    backAfterupdatecode:observable,
    blogUrl:observable,

    setSelectedKeyowrdId:action,
    setSelectedState:action,
    setNavigation: action,
    setNavigationParams: action,
    setFirstName: action,
    setLastName: action,
    setInstaUserName: action,
    setBio: action,
    setCity: action,
    setCountry: action,
    setFollowersCount: action,
    setPostsCount: action,
    setPosts: action,
    setInterest: action,
    setUserImage: action,
    setUserName: action,
    setDisplayEmail: action,
    getCityList: action,
    setGender: action,
    setMyInterest: action,
    setIsLoading: action,
    updateUserProfile: action,
    validateInstaUserName: action,
    setUserExist: action,
    getInstaPosts: action,
    setHasNextPage: action,
    setEndCurser: action,
    setInstaUserId: action,
    setFacebookUserName: action,
    setValidationError: action,
    deleteValidationError: action,
    setSelectedItem: action,
    setinstaperpost: action,
    setfacebookperpost: action,
    setupdatestatus: action,
    setinstaaccounttype: action,
    clearUserData: action,
    setblockUserstatus: action,
    setKoliUserFollowerscount: action,
    setKoliUserFollowingcount: action,
    setyoutubeUrl:action,
    setyoutubFollower:action,
    settwitterUrl:action,
    settwitterFollower:action,
    settiktokUrl:action,
    settiktokFollower:action,
    setlinkedinUrl:action,
    setlinkedinFollower:action,
    setclubhouseUrl:action,
    setclubhouseFollower:action,
    settwitchUrl:action,
    settwitchFollower:action,
    setPaypalEmail:action,
    setdob:action,
    setemailPrivate:action,
    setphonePrivate:action,
    setaffilateCode:action,
    setMobile:action,
    setMobilecode:action,
    setbackAfterupdatecode:action,
    setblogUrl:action,
    addState:action


})
export default MyProfileStore