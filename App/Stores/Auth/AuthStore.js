import {
    Platform
} from 'react-native';
import { action, observable, decorate } from 'mobx';
import { doLogin, doFacebookLogin, doAppleLoginRequest, checkUserName, dologout } from '../../API/Auth/Login/ApiLogin';
import { doSignUp } from '../../API/Auth/Signup/ApiSignup';
import { doReset } from '../../API/Auth/ForgotPassword/Apiforgotpassword';
import { updateUserProfile, getUserDetail } from '../../API/Profile/User/ApiProfile';
import { showAlert, validateEmail, setisLogin, setUserData, setUserId, getUserId, setAccessToken } from '../../SupportingFIles/Utills';
import { strings } from '../../Locales/i18';
import { AccessToken,LoginManager } from 'react-native-fbsdk';
import messaging from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';
import { SignupUserTypes } from '../../SupportingFIles/Constants';
import { debug } from '../../../__mocks__/react-native-reanimated/mock';


const removeEmojis = (string) => {
    // emoji regex from the emoji-regex library
    const regex = /\uD83C\uDFF4(?:\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74)\uDB40\uDC7F|\u200D\u2620\uFE0F)|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC68(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3]))|\uD83D\uDC69\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\uD83D\uDC68(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83D\uDC69\u200D[\u2695\u2696\u2708])\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC68(?:\u200D(?:(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D[\uDC66\uDC67])|\uD83C[\uDFFB-\uDFFF])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDD1-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDEEB\uDEEC\uDEF4-\uDEF9]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD70\uDD73-\uDD76\uDD7A\uDD7C-\uDDA2\uDDB0-\uDDB9\uDDC0-\uDDC2\uDDD0-\uDDFF])|(?:[#*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEF9]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD70\uDD73-\uDD76\uDD7A\uDD7C-\uDDA2\uDDB0-\uDDB9\uDDC0-\uDDC2\uDDD0-\uDDFF])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC69\uDC6E\uDC70-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD26\uDD30-\uDD39\uDD3D\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDD1-\uDDDD])/g
  
    return string.replace(regex, '')
  }

class AuthStore {
    constructor(rootStore) {
        this.rootStore = rootStore
    }

    isFirstLaunch = true
    isLoading = false
    isLogin = false
    isShowTermsConditon = false
    termsAccepted = true
    showPassword = true
    showConfirmPassword = true
    signupSuccess = false

    firstName = ''
    lastName = ''
    userImage = ''
    userName = ''
    email = ''
    password = ''
    confirmPassword = ''
    validationError = {}
    userNameSet = true
    resetSuccess = false
    isUsernamePending = false
    navigation = null
    termsdescription = ''
    selectedMenuItem = 0
    navigationTabObj = null
    unreadNotiCount = 0
    usernamevalidate = false
    usernamevalidatedsuccess = ''
    socialsignuptype = ''
    socialsignupid = ""
    userlattitude = ""
    userlongitude = ""
    userlocationcountry = ""
    selectedSignupUserType = SignupUserTypes.Influencer
    affilateCode=""

    setNotiCount = (count) => {
        this.unreadNotiCount = count
    }
    setSelectedMenuItem = (index) => {
        this.selectedMenuItem = index
    }
    settermsdescription = (termsdescription) => {
        this.termsdescription = termsdescription
    }
    setNavigation = (navigation) => {
        this.navigation = navigation
    }
    setNavigationTabObj = (navigationTab) => {
        this.navigationTabObj = navigationTab
    }
    setUserImage = (userImage) => {
        this.userImage = userImage
    }
    setResetSuccess = (success) => {
        this.resetSuccess = success
    }
    setUserName = (userName) => {
        this.userName = removeEmojis(userName.trim())
    }
    setIsFirstLaunch = (firstLaunch) => {
        this.isFirstLaunch = firstLaunch
    }
    setIsLogin = (login) => {
        this.isLogin = login
    }
    setLoading = (loading) => {
        this.isLoading = loading
    }
    setTermsAccepted = (isAccepted) => {
        this.termsAccepted = isAccepted
    }
    setShowPassword = (showPassword) => {
        this.showPassword = showPassword
    }
    setShowConfirmPassword = (showConfirmPassword) => {
        this.showConfirmPassword = showConfirmPassword
    }
    setFirstName = (firstName) => {
        firstName = firstName.replace(/[^A-Za-z]/ig, '')
        this.firstName = firstName
        this.deleteValidationError('firstNameError')
    }
    setLastName = (lastName) => {
        lastName = lastName.replace(/[^A-Za-z]/ig, '')
        this.lastName = lastName
        this.deleteValidationError('lastNameError')
    }
    setEmail = (email) => {
        this.email = email
        this.deleteValidationError('emailError')
    }
    setPassword = (password) => {
        this.password = password
        this.deleteValidationError('passwordError')
    }
    setConfirmPassword = (confirmPassword) => {
        this.confirmPassword = confirmPassword
        this.deleteValidationError('confirmPasswordError')
    }
    setSignupSuccess = (isScuccess) => {
        this.signupSuccess = isScuccess
    }
    setValidationError = (param) => {
        this.validationError = param
    }
    setShowTermsCondition = (isShow) => {
        this.isShowTermsConditon = isShow
    }
    setUserNameSet = (set) => {
        this.userNameSet = set
    }
    setisUsernamePending = (isUsernamePending) => {
        this.isUsernamePending = isUsernamePending
    }
    setusernamevalidate = (usernamevalidate) => {
        this.usernamevalidate = usernamevalidate
    }

    setusernamevalidatedsuccess = (usernamevalidatedsuccess) => {
        this.usernamevalidatedsuccess = usernamevalidatedsuccess
    }

    setsocialsignuptype = (socialsignuptype) => {
        this.socialsignuptype = socialsignuptype
    }
    setsocialsignupid = (socialsignupid) => {
        this.socialsignupid = socialsignupid
    }

    setuserlattitude = (userlattitude) => {
        this.userlattitude = userlattitude
    }
    setuserlongitude = (userlongitude) => {
        this.userlongitude = userlongitude
    }

    setuserlocationcountry = (userlocationcountry) => {
        this.userlocationcountry = userlocationcountry
    }
    setaffilateCode=(affilateCode)=>{
      
        this.affilateCode=removeEmojis(affilateCode)
    }

    deleteValidationError = (param) => {
        switch (param) {
            case 'firstNameError':
                delete this.validationError.firstNameError
                break;
            case 'lastNameError':
                delete this.validationError.lastNameError
                break;
            case 'emailError':
                delete this.validationError.emailError
                break;

            case 'passwordError':
                delete this.validationError.passwordError
                break;
            case 'confirmPasswordError':
                delete this.validationError.confirmPasswordError
                break;
            case 'usernameError':
                delete this.validationError.usernameError
                break;

            default:
                break;
        }
    }
    deleteAllValidationError = () => {
        this.validationError = {}
    }
    onSignup = async () => {

        //check normal signup and social signup
        if (this.socialsignuptype !== "" && this.socialsignuptype === "fb" || this.socialsignuptype === "Apple") {
            let validationObj = {}
            if (this.firstName.length === 0) {
                validationObj = { ...validationObj, firstNameError: strings('EnterFirstName') }
            }
            if (this.lastName.length === 0) {
                validationObj = { ...validationObj, lastNameError: strings('EnterLastName') }
            }


            if (this.userName.length === 0) {
                validationObj = { ...validationObj, usernameError: strings('Enter_User_Name') }
            } else if (this.userName.length < 3) {
                validationObj = { ...validationObj, usernameError: strings('User_Name_Length') }
            } else if (this.validationError.usernameError) {
                validationObj = { ...validationObj, usernameError: strings('user_name_Already') }
            }
            if (Object.keys(validationObj).length > 0) {
                this.setValidationError(validationObj)
            } else {
                const profile = {
                    first: this.firstName,
                    last: this.lastName,
                    userType: this.selectedSignupUserType,
                    avatarUrl: this.userImage,
                    username: this.userName,
                    isDisplay: this.userImage != "" ? 1 : 0,
                    socialid: this.socialsignupid,
                    affilateCode:this.affilateCode===""?this.userName:this.affilateCode
                }
                const token = await messaging().getToken();

                const finalParam = {
                    email: this.email,
                    password: this.password,
                    profile: profile,
                    platform_OS: Platform.OS === 'android' ? 'Android' : "iOS",
                    OS_Version: DeviceInfo.getSystemVersion(),
                    fcmToken: token,
                    Platform: 'App',
                    App_Version: DeviceInfo.getVersion(),
                    buildnumber:DeviceInfo.getBuildNumber()
                }
                this.setLoading(true)
                
                console.log('finalParam==', finalParam)

                
                doSignUp({ data: finalParam })
                    .then(response => {
                        console.log('response==', response)

                        // this.setLoading(false)
                        if (response.status === 200) {
                            const data = response.data
                            if (data.statusCode === 200) {
                                console.log("response.data", response.data)
                                setUserId(data.data.id + '')
                                this.getUserProfileData(data.data.id)

                               
                            } else if (data.statusCode === 422) {
                                this.setSignupSuccess(false)
                                showAlert(strings('ErrorInSignup'), strings('EmailAlreadyExist'))
                            } else {
                                this.setSignupSuccess(false)
                                showAlert('ErrorInSignup=1', strings('SomethingWentWrong'))
                            }
                        }
                    })
                    .catch(error => {
                        this.signupSuccess = false
                        this.setLoading(false)
                        showAlert('ErrorInSignup=2', strings('SomethingWentWrong'))
                    })
            }

        } else {


            let validationObj = {}
            if (this.firstName.length === 0) {
                validationObj = { ...validationObj, firstNameError: strings('EnterFirstName') }
            }
            if (this.lastName.length === 0) {
                validationObj = { ...validationObj, lastNameError: strings('EnterLastName') }
            }
            if (this.email.length === 0) {
                validationObj = { ...validationObj, emailError: strings('EnterEmail') }
            } else if (!validateEmail(this.email)) {
                validationObj = { ...validationObj, emailError: strings('InvalidEmailAddress') }
            }

            if (this.userName.length === 0) {
                validationObj = { ...validationObj, usernameError: strings('Enter_User_Name') }
            } else if (this.userName.length < 3) {
                validationObj = { ...validationObj, usernameError: strings('User_Name_Length') }
            } else if (this.validationError.usernameError) {
                validationObj = { ...validationObj, usernameError: strings('user_name_Already') }
            }
            if (this.password.length === 0) {
                validationObj = { ...validationObj, passwordError: strings('EnterPassword') }
            } else if (this.password.length < 8) {
                validationObj = { ...validationObj, passwordError: strings('PasswordLengthMessage') }
            }
            if (this.confirmPassword.length === 0) {
                validationObj = { ...validationObj, confirmPasswordError: strings('EnterConfirmPassword') }
            }
            if (this.confirmPassword.length!==0&& this.confirmPassword!== this.password) {
                 validationObj = { ...validationObj, confirmPasswordError: strings('PasswordNotMatched') }
                //showAlert('', strings('PasswordNotMatched'))
            }
            if (Object.keys(validationObj).length > 0) {
                this.setValidationError(validationObj)
            } else {
                const profile = {
                    first: this.firstName,
                    last: this.lastName,
                    userType: this.selectedSignupUserType,
                    avatarUrl: this.userImage,
                    username: this.userName,
                    isDisplay: this.userImage != "" ? 1 : 0,
                    socialid: this.socialsignupid,
                    affilateCode:this.affilateCode===""?this.userName:this.affilateCode



                }
                const finalParam = {
                    email: this.email,
                    password: this.password,
                    profile: profile
                }
                this.setLoading(true)
                console.log('finalParam==', finalParam)
                
                doSignUp({ data: finalParam })
                    .then(response => {
                        this.setLoading(false)
                        if (response.status === 200) {
                            const data = response.data
                            if (data.statusCode === 200) {
                                this.setSignupSuccess(true)
                                showAlert(strings('Congrats'), strings('EmailVerificationPending'))
                            } else if (data.statusCode === 422) {
                                this.setSignupSuccess(false)
                                showAlert(strings('ErrorInSignup'), strings('EmailAlreadyExist'))
                            } else {
                                this.setSignupSuccess(false)
                                showAlert(strings('ErrorInSignup'), strings('SomethingWentWrong'))
                            }
                        }
                    })
                    .catch(error => {
                        this.signupSuccess = false
                        this.setLoading(false)
                        showAlert(strings('ErrorInSignup'), strings('SomethingWentWrong'))
                    })
            }
        }
    }


    onLogin = async () => {

        const token = await messaging().getToken();

        let validationObj = {}
        if (this.email.length === 0) {
            validationObj = { ...validationObj, emailError: strings('EnterEmail') }
        } else if (!validateEmail(this.email)) {
            validationObj = { ...validationObj, emailError: strings('InvalidEmailAddress') }
        }
        if (this.password.length === 0) {
            validationObj = { ...validationObj, passwordError: strings('EnterPassword') }
        } else if (this.password.length < 8) {
            validationObj = { ...validationObj, passwordError: strings('PasswordLengthMessage') }
        }
        if (Object.keys(validationObj).length > 0) {
            this.setValidationError(validationObj)
        } else {

            const param = {
                email: this.email,
                password: this.password,
                platform_OS: Platform.OS === 'android' ? 'Android' : "iOS",
                OS_Version: DeviceInfo.getSystemVersion(),
                fcmToken: token,
                Platform: 'App',
                App_Version: DeviceInfo.getVersion(),
                buildnumber:DeviceInfo.getBuildNumber()
            }

            console.log('param onLogin', param)
            this.setLoading(true)
            doLogin(param).then(response => {
                const { data } = response
                console.log('data doLogin', response.data)

                if (data.error === true) {
                    this.setLoading(false)
                    showAlert(strings('ErrorInLogin'), data.message)
                } else {
                    setUserId(data.userId + '')
                    setAccessToken(data.id)
                    this.getUserProfileData(data.userId)
                }
            })
                .catch(error => {
                    this.setLoading(false)
                    showAlert(strings('ErrorInSignup'), strings('SomethingWentWrong'))

                })
        }
    }
    onReset = () => {
        let validationObj = {}
        if (this.email.length === 0) {
            validationObj = { ...validationObj, emailError: strings('EnterEmail') }
        } else {
            if (!validateEmail(this.email)) {
                validationObj = { ...validationObj, emailError: strings('InvalidEmailAddress') }
            }
        }
        if (Object.keys(validationObj).length > 0) {
            this.setValidationError(validationObj)
        } else {
            this.setLoading(true)
            const param = { email: this.email }
            doReset(param).then(response => {
                console.log('response:', response)
                const { status, data } = response
                this.setLoading(false)
                if (status === 204 && !data.error) {
                    this.setResetSuccess(true)
                    showAlert(strings('ResetPassword'), strings('ResetSuccess'))
                } else {
                    showAlert(strings('InvalidEmailAddress'), strings('EmailNotFound'))
                }
            }).catch(error => {
                this.setLoading(false)
            })
        }
    }
    onCheckUserName = async (text) => {
        const token = await messaging().getToken();
        if (this.userName.length === 0) {
            this.setValidationError({ usernameError: strings('Enter_User_Name') })
        } else if (this.userName.length < 4) {
            this.setValidationError({ usernameError: strings('User_Name_Length') })
        } else {
            this.setLoading(true)
            checkUserName(this.userName).then(response => {
                const { status, data } = response
                console.log(response)
                if (status === 200 && !data.error) {
                    this.setLoading(false)
                    this.setusernamevalidate(true)
                    this.setusernamevalidatedsuccess(this.userName)
                    // showAlert( '', data.message)

                    //Comment because Now user name checking on Signup (18/Feb/2021)
                    // if(this.socialsignuptype!==""&&this.socialsignuptype=="fb"||this.socialsignuptype=="Apple")
                    // {
                    //           getUserId().then(userid => {
                    //               let param = {username: this.userName,fcmToken:token,deviceType:Platform.OS == 'android'?'Android':"iOS" }
                    //               updateUserProfile(param,userid).then(response =>{
                    //                   const {status, data} = response
                    //                   this.setLoading(false)
                    //                   if (status == 200 && !data.error) {

                    //                       let result = data.message.profile
                    //                        setUserData(JSON.stringify(result))
                    //                       setisLogin('true')
                    //                       this.setIsLogin(true)
                    //                       this.setUserNameSet(true)
                    //                       this.navigation.reset({
                    //                           index: 0,
                    //                           routes: [{name: 'TabStack'}],
                    //                         });
                    //                       this.navigation.navigate('TabStack')


                    //                   }else{
                    //                       showAlert( '', strings('SomethingWentWrong'))
                    //                   }
                    //               }).catch(error => {
                    //                   this.setLoading(false)
                    //                   showAlert( '', strings('SomethingWentWrong'))

                    //               })
                    //           })
                    //       }
                } else {
                    this.setLoading(false)
                    this.setusernamevalidatedsuccess('')

                    this.setusernamevalidate(false)

                    this.setValidationError({ usernameError: data.message })
                }
            }).catch(error => {
                this.setLoading(false)
                showAlert('', strings('SomethingWentWrong'))
            })
        }
    }

    doFacebookLogin = async () => {
        try {
            
        
        const token = await messaging().getToken();
        //   this.setLoading(true)
          const datatoken = await AccessToken.getCurrentAccessToken()
          let param = {code: datatoken.accessToken, type: 'facebook',socialid:this.socialsignupid ,
          platform_OS:Platform.OS === 'android'?'Android':"iOS",
          OS_Version:DeviceInfo.getSystemVersion(),
          fcmToken:token,
          Platform:'App',
          App_Version:DeviceInfo.getVersion(),
          buildnumber:DeviceInfo.getBuildNumber()}
         
          console.log('fbparam',param)

          doFacebookLogin(param).then(response => {
            console.log('Profile doFacebooklogin==',response.data)

              const {data} = response
              if (data.error === true){
                  this.setLoading(false)
                  showAlert(strings('ErrorInLogin'), data.message)
              }else{
                  if(data.userId)
                  {
                    setUserId(data.userId+'')
                    console.warn('data.userId',data.userId)
                    setAccessToken(data.id)
                    this.getUserProfileData(data.userId)
                } else {
                    this.setLoading(false)
                    this.setsocialsignuptype('fb')
                    this.setUserName('')
                    this.navigation.navigate('Signup')

                }

            }
        }).catch(error => {
            this.setLoading(false)
            showAlert('', strings('SomethingWentWrong'))
        })
    } catch (error) {
         console.log(error)   
    }
    }

    doAppleLogin = async (email, token, profile) => {
        const firebasetoken = await messaging().getToken();
        this.setLoading(true)
        let EmailValue = email ? email : "NA"
        let param = {
            email: EmailValue, appleid: token, profile: profile, socialid: this.socialsignupid,
            platform_OS: Platform.OS === 'android' ? 'Android' : "iOS",
            OS_Version: DeviceInfo.getSystemVersion(),
            fcmToken: firebasetoken,
            Platform: 'App',
            App_Version: DeviceInfo.getVersion(),
            buildnumber:DeviceInfo.getBuildNumber()
        }
        console.log('Profile doAppleLogin', param)

        doAppleLoginRequest(param).then(response => {
            const { data } = response

            if (data.error == true) {
                this.setLoading(false)
                console.log(('ErrorInLogin'), response)
                showAlert(strings('ErrorInLogin'), data.message)
            } else {

                if (data.userId) {
                    setUserId(data.userId + '')
                    setAccessToken(data.id)
                    this.getUserProfileData(data.userId)
                } else {
                    this.setLoading(false)
                    this.setsocialsignuptype('Apple')
                    this.setUserName('')

                    this.navigation.navigate('Signup')
                }
            }
        }).catch(error => {
            this.setLoading(false)
            showAlert('', strings('SomethingWentWrong'))
        })
    }
    getUserProfileData = (datavalue) => {
        const param = { where: { ownerId: datavalue } }

        getUserDetail(param).then(response => {
            this.setLoading(false)
            const { status, data } = response
            console.log('user data:', data)
            // let result = JSON.parse(data.message[0].profile);
            if (status === 200) {
                // this.navigation.navigate('DrawerScreens')
                setUserData(JSON.stringify(data[0]))
                this.setFirstName(data[0].first)
                this.setLastName(data[0].last)
                this.setUserImage(data[0].avatarUrl)
                if (data[0].username !== data[0].display) {
                    this.setLoading(false)
                    setisLogin('true')
                    this.setIsLogin(true)
                    this.setUserName(data[0].username)
                    this.setisUsernamePending(true)
                    //this.navigation.navigate('DrawerScreens')
                    this.navigation.reset({
                        index: 0,
                        routes: [{ name: 'TabStack' }],
                    });
                    this.navigation.navigate('TabStack')

                } else {
                    this.setLoading(false)
                    this.setisUsernamePending(true)
                    this.setUserName('')
                    this.setUserNameSet(false)
                    this.navigation.navigate('UserName')

                    //   this.setFirstName(data[0].first)
                    //   this.setLastName(data[0].last)
                    //   this.setUserImage(data[0].avatarUrl)
                    //   this.setLoading(false)
                    //   this.setisUsernamePending(true)
                    //   this.setUserName('')
                    //   this.setUserNameSet(false)
                    //   this.navigation.navigate('Signup')

                }
            }
        }).catch(error => {
            this.setLoading(false)
            showAlert(strings('ErrorInSignup'), strings('SomethingWentWrong'))

        })
    }
    getUserProfileDataForUpdate = (datavalue) => {

        getUserDetail(datavalue).then(response => {
            // this.setLoading(false)
            const { status, data } = response
            console.log('user data:', data)
            // let result = JSON.parse(data.message[0].profile);
            if (status === 200) {
                // this.navigation.navigate('DrawerScreens')
                setUserData(JSON.stringify(data[0]))
                this.setFirstName(data[0].first)
                this.setLastName(data[0].last)
                this.setUserImage(data[0].avatarUrl)

                if (data[0].username !== data[0].display) {
                    this.setLoading(false)
                    setisLogin('true')
                    this.setIsLogin(true)
                    this.setUserName(data[0].username)
                    this.setisUsernamePending(true)

                } else {
                    this.setLoading(false)
                    this.setisUsernamePending(true)
                    this.setUserName('')
                    this.setUserNameSet(false)
                    this.navigation.navigate('UserName')

                }
            }
        }).catch(error => {
            // this.setLoading(false)
            // showAlert( strings('ErrorInSignup'), strings('SomethingWentWrong'))

        })
    }

   

    dologout = async () => {
      
        await LoginManager.logOut();
     
        getUserId().then(userid => {
            dologout(userid).then(response => {
                const { status } = response
                if (status === 200) {
                    console.log('logout response==', response)
                }
            }).catch(error => {

            })
        })
    }

    updateUserLastSeen = async() => {
        const token = await messaging().getToken();

        getUserId().then(userid => {
            let param = { lastSeen: new Date(), 
                OS_Version: DeviceInfo.getSystemVersion(),
                App_Version: DeviceInfo.getVersion(),
                buildnumber:DeviceInfo.getBuildNumber(),
                fcmToken: token
            }
            updateUserProfile(param, userid).then(response => {
                //const { status, data } = response
                //this.setLoading(false)
                console.log('updateUserLastSeen:', response)
                // if (status === 200 && !data.error) {
                //     let result = data.message.profile

                // }
                // else if (status === 200 && data.error) {
                //     this.setLoading(false)
                // }
                // else {
                //     showAlert('', strings('SomethingWentWrong'))
                // }
            }).catch(error => {
                console.log('updateUserLastSeen:', error)
                // showAlert('', strings('SomethingWentWrong'))

            })
        })

    }
    setUserSignupType = (type) => {
        this.selectedSignupUserType = type
    }
}

decorate(AuthStore, {
    isFirstLaunch: observable,
    isLogin: observable,
    termsAccepted: observable,
    showPassword: observable,
    showConfirmPassword: observable,
    firstName: observable,
    lastName: observable,
    email: observable,
    password: observable,
    confirmPassword: observable,
    signupSuccess: observable,
    validationError: observable,
    isLoading: observable,
    isShowTermsConditon: observable,
    userImage: observable,
    userName: observable,
    userNameSet: observable,
    resetSuccess: observable,
    isUsernamePending: observable,
    navigation: observable,
    termsdescription: observable,
    selectedMenuItem: observable,
    navigationTabObj: observable,
    unreadNotiCount: observable,
    selectedSignupUserType: observable,
    usernamevalidate: observable,
    usernamevalidatedsuccess: observable,
    socialsignuptype: observable,
    socialsignupid: observable,
    userlattitude: observable,
    longitude: observable,
    userlocationcountry: observable,
    affilateCode:observable,

    setNavigationTabObj: action,
    setNavigation: action,
    setIsLogin: action,
    setTermsAccepted: action,
    setShowPassword: action,
    setShowConfirmPassword: action,
    setFirstName: action,
    setLastName: action,
    setEmail: action,
    setPassword: action,
    setConfirmPassword: action,
    doSignUp: action,
    setSignupSuccess: action,
    onLogin: action,
    onReset: action,
    deleteValidationError: action,
    setValidationError: action,
    deleteAllValidationError: action,
    setSelectedMenuItem: action,

    setLoading: action,
    setShowTermsCondition: action,
    setIsFirstLaunch: action,
    setUserImage: action,
    setUserName: action,
    onCheckUserName: action,
    setUserNameSet: action,
    setResetSuccess: action,
    doFacebookLogin: action,
    getUserProfileData: action,
    setisUsernamePending: action,
    settermsdescription: action,
    getUserProfileDataForUpdate: action,
    setNotiCount: action,
    updateUserLastSeen: action,
    setUserSignupType: action,
    setusernamevalidate: action,
    setusernamevalidatedsuccess: action,
    setsocialsignuptype: action,
    setsocialsignupid: action,
    setuserlattitude: action,
    setuserlongitude: action,
    setuserlocationcountry: action,
    setaffilateCode:action

});
export default AuthStore;