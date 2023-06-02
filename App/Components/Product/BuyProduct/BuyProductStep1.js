import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import Loader from '../../../SupportingFIles/Loader';
import { inject, observer } from 'mobx-react';
import { strings } from '../../../Locales/i18';
import styles from './styles'
import userStyles from '../../Address/UserAddress/styles'

import images from '../../../Themes/Images';
import metrics from '../../../Themes/Metrics';
import colors from '../../../Themes/Colors';
import { commonStyles } from '../../../SupportingFIles/Constants';
import NoAddresses from '../../../Assets/Images/NoAddresses';
import { showAlert } from '../../../SupportingFIles/Utills';

class BuyProductStep1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex:null
        };
    }

    componentDidMount = () => {
        this.props.navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity style={{ ...commonStyles.backButtonContainercampaign }}
                    onPress={() => this.props.navigation.goBack()}
                >
                    <Image style={{ tintColor: colors.app_black }} source={images.backImage} />
                </TouchableOpacity>
            ),
            headerRight: () => (

                <TouchableOpacity style={{ marginRight: metrics.dimen_20, }}
                    onPress={() =>
                        //this.props.navigation.navigate('CreateCampaign1',{type:'Add'})
                        this.props.navigation.navigate('ManageAddress')

                    }>
                    <Image source={images.plusIcon} style={{ marginLeft: metrics.dimen_22 }} />
                </TouchableOpacity>

            )
        })
        this.props.navigation.addListener('focus', () => {
            if (this.props.AddressStore.reloadContent) {
                this.props.AddressStore.getAddressData()
                //  this.props.AddressStore.setAddressAdded(false)

            }
        })
    }

    render() {
        const store = this.props.AddressStore
        setTimeout(() => {
            if(store.addresses.length === 0 && !store.isLoading)
            {
                this.props.navigation.navigate('ManageAddress')
            }
        }, 500)

      
        return (
            <View style={styles.mainView}>
                <Loader loading={store.isLoading} />
                <View style={styles.viewSteps}>
                            <View style={styles.viewConetentSteps}>

                                <View style={styles.viewStepNumber}>
                                    <Text style={styles.labelStepCircle} >1</Text>
                                </View>

                                <View style={styles.viewLine} />

                                <View style={[styles.viewStepNumber, {backgroundColor:'rgba(22,88,211,0.05)'}]}>
                                    <Text style={[styles.labelStepCircle,{color:colors.app_Blue}]} >2</Text>
                                </View>
                                
                                <View style={styles.viewLine} />

                                <View style={[styles.viewStepNumber, {backgroundColor:'rgba(22,88,211,0.05)'}]}>
                                    <Text style={[styles.labelStepCircle,{color:colors.app_Blue}]} >3</Text>
                                </View>
                                
                            </View>
                 </View>
                {!store.isLoading && (store.addresses === null || store.addresses.length === 0) &&
                    <View style={styles.emptyContainer}>

                      

                        <NoAddresses style={userStyles.imageAddAddress} />
                        {/* <Image source = {images.BankInfo}
        resizeMode="contain"
        style={userStyles.imageAddAddress} /> */}
                        <Text style={userStyles.textEmptyAddress}>{strings('No_Shipping_address')}</Text>
                        <Text style={userStyles.textPlaceholderDetail}>{strings('No_Shipping_address_detail')}</Text>
                    </View>}
                {!store.isLoading && store.addresses !== null && store.addresses.length > 0 &&
                    <FlatList
                        style={styles.listContainer}
                        data={store.addresses}
                        keyExtractor={(index) => index.toString()}
                        renderItem={({item, index}) => this.listItem(item,index)}>
                    </FlatList>}
                    <TouchableOpacity style={{...styles.bottomViewStyle}}
      onPress={() =>
{
    if(this.state.selectedIndex !== null)
    {
        this.props.navigation.navigate('BuyProductStep2',{addressData: store.addresses[this.state.selectedIndex], productData: this.props.route.params.productData})

    }
    else
    {
        showAlert('Please select address')
    }
}
       
       }>

<Text style = {[commonStyles.LatoBold_16, styles.submitButton]}>
          {strings('Deliver_Here')}</Text>
      </TouchableOpacity>
            </View>

        );
    }
    listItem = (item,index) => {
        // console.log('item:',item)
        return (
            <View style={{ backgroundColor: colors.white, }}>

           
            <TouchableOpacity style={styles.viewListItem}
             onPress={() => {
                console.log('index:',index)
                this.setState({ selectedIndex: index, currentSelcted: false })
            }}>
                                <TouchableOpacity style={styles.radioButtonContainer}
                                    onPress={() => {
                                        this.setState({ selectedIndex: index, currentSelcted: false })
                                    }}>
                                    <View style={[styles.radioButton, this.state.selectedIndex !== index && styles.radioButtonUnselected]}>
                                        {
                                            this.state.selectedIndex === index ?
                                                <View style={styles.radioButtonInnerCircle} />
                                                : null
                                        }
                                    </View>
                                </TouchableOpacity>
                                <View>
                                <Text style={userStyles.textName}>{item.fullName}</Text>
                <Text style={userStyles.textAddress}>
                    {`${item.buildingName}, ${item.area}, ${item.city}, ${item.state}, ${item.country}, ${item.pincode}`}
                </Text>
                <Text style={userStyles.textAddress}>{item.phone}</Text>
               
                                </View>
               
            </TouchableOpacity>
             <View
             style={userStyles.borderBottomLine}
         />
          </View>
        )
    }
}
export default inject("AddressStore", "AuthStore")(observer(BuyProductStep1))


