import { action, observable, decorate } from 'mobx';
import { getUserId, showAlert } from '../../SupportingFIles/Utills';
import { addAddress, getAddress } from '../../API/Products/APIAddress';
import { strings } from '../../Locales/i18';

class AddressStore {
    constructor(rootStore) {
        this.rootStore = rootStore
    }
    addressData = {
        addressOwnerId: 0,
        fullName: '',
        buildingName: '',
        area: "",
        state: '',
        city: "",
        pincode: "",
        isDefault: 0,
        country: "",
        phone: "",
        id: 0,
    }
    addresses=[]
    validationError = {}
    isLoading = false
    reloadContent = true


    setAddressData = (data) => {
        this.addressData = { ...this.addressData, ...data }
    }
    setValidationData = (data) => {
        this.validationError = { ...this.validationError, ...data }
    }
    setAddressAdded = (added) => {
        this.addressAdded = added
    }
    setReloadContent = (reload) => {
        this.reloadContent = reload
    }
    deleteValidationError = (param) => {
        switch (param) {
            case 'titleError':
                delete this.validationError.titleError
                break;
            case 'descriptionError':
                delete this.validationError.titleError
                break;
            case 'categoryError':
                delete this.validationError.categoryError
                break;
            case 'amountError':
                delete this.validationError.amountError
                break;
            case 'productCommission':
                delete this.validationError.productCommission
                break;
            case 'stockCount':
                delete this.validationError.productCommission
                break;
            case 'productGallery':
                delete this.validationError.productGallery
                break;

            default:
                break;
        }
    }
    setLoading = (loading) => {
        this.isLoading = loading
    }
  
    setAddresses = (addresses) => {
        this.addresses = addresses
        this.setReloadContent(false)
    }
  
    resetAddress = () =>{
        this.addressData = {
            addressOwnerId: 0,
            fullName: '',
            buildingName: '',
            area: "",
            state: '',
            city: "",
            pincode: "",
            isDefault: 0,
            country: "",
            phone: "",
            id: 0,
        }
        this.addressAdded=false
        this.validationError = {}
        this.isLoading = false
        this.setReloadContent(true)
    }
   
    addAddress = () => {
        this.setLoading(true)
       
        getUserId().then(userId => {
            const param = {

                addressOwnerId: userId,
                fullName: this.addressData.fullName,
                buildingName: this.addressData.buildingName,
                area: this.addressData.area,
                state: this.addressData.state,
                city: this.addressData.city,
                pincode: this.addressData.pincode,
                isDefault: this.addressData.isDefault,
                country: this.addressData.country,
                phone: this.addressData.phone,
            }
            console.log('addAddress param:', param)
            addAddress(param).then(response => {
                this.setLoading(false)
                const { status } = response
                // console.log("campain data request param =", response)

                if (status === 200) {
                    this.setAddressAdded(true)
                } else {
                    showAlert('', strings('SomethingWentWrong'))
                }
                console.log("addAddress data response =", response)
            }).catch(error => {
                this.setLoading(false)
                console.log("addAddress data response =", error)
            })
        })
    }

    getAddressData = () => {
            this.setLoading(true)
        getUserId().then(userId => {
            let condition = ''

                condition = {
                    where: {
                        addressOwnerId: userId,
                        }
                    }  
        
                     
                    
            getAddress(condition).then(response => {
                console.log('getAddressData:', response)
                console.log('condition:', condition)

               
                    this.setAddresses([])

                const { status, data } = response
                console.log('response:', response)
                if (status === 200) {
                 
                        this.setAddresses(data)
                }
                this.setLoading(false)


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

}
decorate(AddressStore, {
    
    addressData: observable,
    validationError: observable,
    isLoading: observable,
    addresses: observable,
    addressAdded: observable,
    reloadContent: observable,


    setAddressData: action,
    setValidationData: action,
    deleteValidationError: action,
    setimagegallery: action,
    setLoading: action,
    setAddresses: action,
    resetAddress: action,
    getAddressData: action,
    getAddress: action,
    setAddressAdded: action,
    setReloadContent: action


});
export default AddressStore;