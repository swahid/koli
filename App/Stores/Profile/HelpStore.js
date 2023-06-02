import { action, observable, decorate } from 'mobx';
import { dohelpsupport, getSubjectList } from '../../API/Profile/User/ApiProfile';
import { showAlert, getUserId } from '../../SupportingFIles/Utills';
import { strings } from '../../Locales/i18';



class HelpStore {
    constructor(rootStore) {
        this.rootStore = rootStore
    }
    name = ''
    email = ''
    title = ''
    message = ''
    validationError = {}
    isLoading = false
    navigation = null
    selectedSubject = {}
    subjectList = []
    imageUrl = ""
    logintype=""

    setNavigation = (navigation) => {
        this.navigation = navigation
    }
    setLoading = (loading) => {
        this.isLoading = loading
    }
    setemail = (email) => {
        this.email = email
        this.deleteValidationError('emailError')

    }
    setname = (name) => {
        this.name = name
        this.deleteValidationError('nameError')

    }
    settitle = (title) => {
        this.title = title
        this.deleteValidationError('firstNameError')
    }
    setmessage = (message) => {
        this.message = message
        this.deleteValidationError('lastNameError')
    }
    setReportImageUrl = (url) => {
        this.imageUrl = url
    }
    setValidationError = (param) => {
        this.validationError = param
    }
    setSubject = (param) => {
        this.selectedSubject = param
        this.title = param.title
        this.deleteValidationError('subjectError')
    }


    setlogintype=(logintype)=>
    {
        this.logintype=logintype
    }
    deleteValidationError = (param) => {
        switch (param) {

            case 'nameError':
                delete this.validationError.nameError
                break;
                case 'emailError':
                delete this.validationError.emailError
                break;
            case 'firstNameError':
                delete this.validationError.firstNameError
                break;
            case 'lastNameError':
                delete this.validationError.lastNameError
                break;
            case 'subjectError':
                delete this.validationError.subjectError
                break;

            default:
                break;
        }
    }
    deleteAllValidationError = () => {
        this.validationError = {}
    }
    onhelp = () => {
        let validationObj = {}
        console.log('this.title:', this.title)

        if (this.selectedSubject.id === undefined) {
            validationObj = { ...validationObj, subjectError: strings('Select_Subject') }
        }
        if (this.selectedSubject.id !== undefined && this.selectedSubject.id === 0 && this.title.trim() === '') {
            validationObj = { ...validationObj, firstNameError: strings('Enter_Subject') }
        }
        if (this.message.trim() === '') {
            validationObj = { ...validationObj, lastNameError: strings('Entermessage') }
        }

        if(this.logintype==false)
        {
            if (this.name.trim() === '') {
                validationObj = { ...validationObj, nameError: strings('Enter_fullname') }
            }
    
            if (this.email.trim() === '') {
                validationObj = { ...validationObj, emailError: strings('enter_email_address') }
            }
        }
       
        
        console.log('onhelp:', validationObj)

        if (Object.keys(validationObj).length > 0) {
            this.setValidationError(validationObj)
        } else {
            getUserId().then(userid => {
                var titleToSend = this.selectedSubject.subject !== null ? this.selectedSubject.subject : this.title
                if(this.selectedSubject.id !== undefined && this.selectedSubject.id === 0 )
                {
                    titleToSend=this.title
                }

                let param = {
                    name: this.name,
                    email: this.email,
                    message: this.message,
                    title: titleToSend,
                    ownerId: userid,
                    subjectId: this.selectedSubject.id,
                    help_pic_url: this.imageUrl
                }
                console.log('dohelpsupport:', param)
                this.setLoading(true)
                dohelpsupport(param)
                    .then(response => {
                        this.setLoading(false)
                        if (response.status === 200) {
                            showAlert(strings('RequestedSubmitted'), strings('helpsumitmessage'))
                            this.settitle('')
                            this.setmessage('')
                            this.setSubject({})
                            this.setReportImageUrl('')
                            setTimeout(() => {
                                if(this.logintype==false)
                                {
                                    this.navigation.navigate('AuthStack')


                                }else
                                {
                                    this.navigation.navigate('Home')

                                }
                            }, 500);


                        }
                    })
                    .catch(error => {
                        this.signupSuccess = false
                        this.setLoading(false)
                        //showAlert( strings('ErrorInSignup'), strings('SomethingWentWrong'))
                    })
            })

        }
    }
    getSubjectList = (param) => {
        this.setLoading(true)
        getSubjectList(param)
            .then(response => {
                this.setLoading(false)
                //console.log('response getSubjectList:',response)
                this.setSubjectList(response.data)

            })
            .catch(error => {
                this.setLoading(false)
            })
    }
    setSubjectList = (param) => {
        this.subjectList = param
    }
}

decorate(HelpStore, {

    title: observable,
    message: observable,
    name: observable,
    email: observable,
    validationError: observable,
    isLoading: observable,
    navigation: observable,
    selectedSubject: observable,
    subjectList: observable,
    imageUrl: observable,
    logintype:observable,

    setNavigation: action,
    settitle: action,
    setmessage: action,
    setemail: action,
    setname: action,
    deleteValidationError: action,
    setValidationError: action,
    deleteAllValidationError: action,
    setLoading: action,
    setSubject: action,
    getSubjectList: action,
    setSubjectList: action,
    setReportImageUrl: action,
    setlogintype:action

});
export default HelpStore;