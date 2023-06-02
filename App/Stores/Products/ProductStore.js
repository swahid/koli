import { action, observable, decorate } from 'mobx';
import { getUserId, showAlert, getAccessToken } from '../../SupportingFIles/Utills';
import { addProduct, getProducts, productPayment, getTransactions, getMerchantData, getEarnedSpend } from '../../API/Products/APIProducts';
import { strings } from '../../Locales/i18';

class ProductStore {
    constructor(rootStore) {
        this.rootStore = rootStore
    }
    productData = {
        productTitle: '',
        productDescription: '',
        productCategories: [],
        productAmount: "",
        productOwnerId: '',
        productDiscount: "",
        productCommission: "",
        productStatus: 1,
        stockCount: "",
        productImage: '',
        productGallery: [],
        productCountry: [],
    }
    navigation = null
    products=[]
    userProducts=[]
    validationError = {}
    isLoading = false
    uploadingImage = false
    categoriesArray = []
    productAdded = false
    similarProducts = []
    transactions = []
    userBoughtOrders = []
    merchantData = {}
    earnedData = []
    spentData = []

    setEarnedData = (earnedData) => {
        this.earnedData = earnedData
    }
    setSpentData = (spentData) => {
        this.spentData = spentData
    }
    setMerchantData = (merchantData) => {
        this.merchantData = merchantData
    }
    setBoughtOrders = (orders) => {
        this.userBoughtOrders = orders
    }
    setTransactions = (transactions) => {
        this.transactions = transactions
    }
    setNavigation = (navigation) => {
        this.navigation = navigation
    }
    setProductData = (data) => {
        this.productData = { ...this.productData, ...data }
    }
    setSimilarProducts = (products) => {
        this.similarProducts = products
    }
   
    setValidationData = (data) => {
        this.validationError = { ...this.validationError, ...data }
    }
    setShowImagePicker = (show) => {
        this.showImagePicker = show
    }
    setimagegallery = (imagegallery) => {
        this.imagegallery = imagegallery
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
    setProductAdded = (added) => {
        this.productAdded = added
    }
    setProducts = (products) => {
        this.products = products
    }
    setUserProducts = (products) => {
        this.userProducts = products
    }
    resetProduct = () =>{
        this.productData = {
            productTitle: '',
            productDescription: '',
            productCategories: [],
            productAmount: "",
            productOwnerId: '',
            productDiscount: "",
            productCommission: "",
            productStatus: 1,
            stockCount: "",
            productImage: '',
            productGallery: [],
            productCountry: []
        }
        this.validationError = {}
        this.isLoading = false
        this.uploadingImage = false
        this.categoriesArray = []
        this.productAdded = false
    }
    setSelectDeselectCatgories = (index) => {
        this.productData.productCategories[index].isSelected = !this.productData.productCategories[index].isSelected
    }
    setSelectedCatgoriesList = (data) => {
        this.productData.productCategories=data

    }
    addProduct = () => {
        this.setLoading(true)
        const catNamesArray = this.productData.productCategories.map(function (item) {
            return item.categoryName;
        });

        getUserId().then(userId => {
            const param = {

                productTitle: this.productData.productTitle,
                productDescription: this.productData.productDescription,
                productCategories: catNamesArray,
                productAmount: this.productData.productAmount,
                productOwnerId: userId,
                productDiscount: this.productData.productDiscount,
                productCommission: this.productData.productCommission,
                productStatus: 1,
                stockCount: this.productData.stockCount,
                productImage: this.productData.productGallery[0],
                productGallery: this.productData.productGallery,
                productCountry: this.productData.productCountry,

            }
            console.log('addProduct param:', param)
            addProduct(param).then(response => {
                this.setLoading(false)
                const { status } = response
                // console.log("campain data request param =", response)

                if (status === 200) {
                    this.setProductAdded(true)
                } else {
                    showAlert('', strings('SomethingWentWrong'))
                }
                console.log("addProduct data response =", response)
            }).catch(error => {
                this.setLoading(false)
                console.log("addProduct data response =", error)
            })
        })
    }

    getProductsData = (isUserProducts) => {
            this.setLoading(true)
        getUserId().then(userId => {
            let condition = ''

            if(isUserProducts)
            {
                condition = {
                    where: {
                        productOwnerId: userId,
                        },
                    order: ["createdAt DESC"],
                    include: ["profile"],
                }  
            }
            else
            {
                condition = {
                    where: {
                        productStatus: "1",
                        },
                    order: ["createdAt DESC"],
                    include: ["profile"],
                }  
            }
                     
                    
            getProducts(condition).then(response => {
                console.log('getProducts:', response)
                console.log('condition:', condition)

                if(isUserProducts)
                {
                    this.setUserProducts([])
                }
                else
                {
                    this.setProducts([])
                }

                const { status, data } = response
                console.log('response:', response)
                if (status === 200) {
                    if(isUserProducts)
                    {
                        this.setUserProducts(data)
                    }
                    else
                    {
                        const outOfStockData = data.filter(el => el.stockCount===0)
                        const inStockData = data.filter(el => el.stockCount>0)
                        console.log('outOfStockData:', outOfStockData)
                        console.log('inStockData:', inStockData)

                        const combinedData = inStockData.concat(outOfStockData)
                        this.setProducts(combinedData)
                    }
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


    getUserProductsData = (userId) => {
        //this.setLoading(true)
        let condition = ''
            condition = {
                where: {
                    productOwnerId: userId,
                    productStatus: "1",
                    },
                order: ["createdAt DESC"],
                include: ["profile"],
            }  
                 
                
        getProducts(condition).then(response => {
            console.log('getUserProductsData:', response)
          //  console.log('condition:', condition)
            this.setSimilarProducts([])
            const { status, data } = response
            console.log('response:', response)
            if (status === 200 && !data.error) {
                this.setSimilarProducts(data)
            }
           // this.setLoading(false)
        })
            .catch(error => {
                if (this.isRefreshing) {
                    this.setRefreshing(false)
                } else {
                  //  this.setLoading(false)
                }
                // console.log('error in fetching campaign list', error)
            })



}

initiateProductPayment = (param) => {
    console.log('initiateStripePayment param:', param)
    this.setLoading(true)
    getUserId().then(userId => {
        getAccessToken().then(accessToken => {
            const dataParams = { ...param, ...{ ownerId: userId } }
            console.log('report initiateProductPayment dataParams =', dataParams)

            productPayment(accessToken, dataParams).then(response => {
                console.log('report initiateProductPayment response =', response)
              
                this.setLoading(false)
                const { status, data } = response
                if (status === 200 && !data.error) {
                    //this.setCampaignReported(true)
                    showAlert('', strings('Your_payment_was_successful'))
                    this.navigation.navigate('StoreTab')

                } else {
                    showAlert('',data.message !== undefined ? data.message : strings('SomethingWentWrong'))
                }
            }).catch(error => {
                this.setLoading(false)
            })
        })

    })
}
getUserTransactions = (userId) => {
    this.setLoading(true)
    let condition = ''
        condition = {
            where: {
                or: [{camapignOwnerId:userId},{payeeOwnerId:userId},{productOwnerId:userId}],
                },
                include:["products"]
        }  
       // {"where":{"or":[{"camapignOwnerId":1177},{"payeeOwnerId":1177}]}}
            
       getTransactions(condition).then(response => {
        console.log('getUserTransactions:', response)
      //  console.log('condition:', condition)
        this.setTransactions([])
        const { status, data } = response
        console.log('response:', response)
        if (status === 200) {
            this.setTransactions(data)
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
}

getUserEarnedSpend = (userId,type,offset) => {
    this.setLoading(true)
       let condition = `ownerId=${userId}&txnType=${type}&limit=100&offset=${offset}`
       getEarnedSpend(condition).then(response => {
        console.log('getUserEarnedSpend:', response)
     //   this.setEarnedData([])
       // this.setSpentData([])
        const { status, data } = response
        console.log('response:', response)
        if (status === 200) {
            if(type === "credit")
            {
                this.setEarnedData(data.transactionData)
            }
            else{
                this.setSpentData(data.transactionData)
            }
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
}
getUserBoughtOrders = (userId) => {
    this.setLoading(true)
    let condition = ''
        condition = {
            where: {
                payeeOwnerId:userId,
                productId: { gt: 1 },
                },
                include:["products"]
        }  
       // {"where":{"or":[{"camapignOwnerId":1177},{"payeeOwnerId":1177}]}}
            
       getTransactions(condition).then(response => {
        console.log('getUserTransactions:', response)
      //  console.log('condition:', condition)
        this.setBoughtOrders([])
        const { status, data } = response
        console.log('response:', response)
        if (status === 200) {
            this.setBoughtOrders(data)
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
}
getMerchantData = () => {
    this.setLoading(true)
    getUserId().then(userId => {
        getAccessToken().then(accessToken => {
            getMerchantData(userId).then(response => {
                console.log('getMerchantData:', response)
                this.setLoading(false)
                const { status, data } = response
                if (status === 200 && !data.error) {
                    this.setMerchantData(data)
                  //  showAlert('', strings('getMerchantData'))

                } else {
                    showAlert('',data.message !== undefined ? data.message : strings('SomethingWentWrong'))
                }
            }).catch(error => {
                this.setLoading(false)
            })
        })

    })
}
}
decorate(ProductStore, {
    
    productData: observable,
    validationError: observable,
    isLoading: observable,
    uploadingImage: observable,
    categoriesArray: observable,
    productAdded: observable,
    products: observable,
    userProducts: observable,
    similarProducts: observable,
    navigation: observable,
    transactions: observable,
    userBoughtOrders: observable,
    merchantData: observable,

    setProductData: action,
    setValidationData: action,
    setShowImagePicker: action,
    setimagegallery: action,
    deleteValidationError: action,
    setLoading: action,
    setProductAdded: action,
    addProduct: action,
    setSelectedCatgoriesList: action,
    resetProduct: action,
    setProducts: action,
    setUserProducts: action,
    getProductsData: action,
    getUserProductsData: action,
    setSimilarProducts: action,
    setNavigation: action,
    initiateProductPayment: action,
    getUserTransactions: action,
    setTransactions: action,
    setBoughtOrders: action,
    getUserBoughtOrders: action,
    setMerchantData: action,
    getMerchantData: action,
    setSpentData: action,
    setEarnedData: action,
    getUserEarnedSpend: action


});
export default ProductStore;