import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import Loader from '../../../SupportingFIles/Loader';
import { inject, observer } from 'mobx-react';
import { strings } from '../../../Locales/i18';
import styles from './styles'
import userStyles from '../../Address/UserAddress/styles'
import productDetailStyles from '../../Product/ProductDetail/styles'

import FastImage from 'react-native-fast-image'

import images from '../../../Themes/Images';
import metrics from '../../../Themes/Metrics';
import colors from '../../../Themes/Colors';
import { commonStyles } from '../../../SupportingFIles/Constants';
import NoAddresses from '../../../Assets/Images/NoAddresses';
import { Button } from 'react-native-paper';
const formatCurrency = new Intl.NumberFormat('en-US')

class BuyProductStep2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
            // headerRight: () => (

            //     <TouchableOpacity style={{ marginRight: metrics.dimen_20, }}
            //         onPress={() =>
            //             //this.props.navigation.navigate('CreateCampaign1',{type:'Add'})
            //             this.props.navigation.navigate('ManageAddress')

            //         }>
            //         <Image source={images.plusIcon} style={{ marginLeft: metrics.dimen_22 }} />
            //     </TouchableOpacity>

            // )
        })
      
    }

    render() {
        return (
            <View style={styles.mainView}>
                {/* <Loader loading={store.isLoading} /> */}
                <View style={styles.viewSteps}>
                            <View style={styles.viewConetentSteps}>

                            <View style={[styles.viewStepNumber, {backgroundColor:'rgba(22,88,211,0.05)'}]}>
                            <Text style={[styles.labelStepCircle,{color:colors.app_Blue}]} >1</Text>
                                </View>

                                <View style={styles.viewLine} />

                                <View style={styles.viewStepNumber}>
                                    <Text style={styles.labelStepCircle}>2</Text>
                                </View>
                                
                                <View style={styles.viewLine} />

                                <View style={[styles.viewStepNumber, {backgroundColor:'rgba(22,88,211,0.05)'}]}>
                                    <Text style={[styles.labelStepCircle,{color:colors.app_Blue}]} >3</Text>
                                </View>
                                
                            </View>
                 </View>
                 {this.listItem(this.props.route.params.addressData)}
                 {this.productView(this.props.route.params.productData)}
               
                    <TouchableOpacity style={{...styles.bottomViewStyle}}
      onPress={() => {
          this.props.navigation.navigate('BuyProductStep3',{
              productData: this.props.route.params.productData,
              addressData: this.props.route.params.addressData
          })
      }}>

<Text style = {[commonStyles.LatoBold_16, styles.submitButton]}>
          {strings('Continue')}</Text>
      </TouchableOpacity>
            </View>

        );
    }

    listItem = (item) => {
        // console.log('item:',item)
        return (
            <View style={{ backgroundColor: colors.white,  marginTop: metrics.aspectRatioHeight(21), }}>

           
            <View style={styles.viewListItem}>
                               
                                <View>
                                <Text style={userStyles.textName}>{item.fullName}</Text>
                <Text style={userStyles.textAddress}>
                    {`${item.buildingName}, ${item.area}, ${item.city}, ${item.state}, ${item.country}, ${item.pincode}`}
                </Text>
                <Text style={userStyles.textAddress}>{item.phone}</Text>
               
                                </View>
               
            </View>
            <Button
                    style={styles.buttonSubmit}
                    labelStyle={{ ...commonStyles.LatoBold_14, color: 'white' }}
                    onPress={() => this.props.navigation.goBack()
                    }

                >
                    {strings('Change_New_address')}
                </Button>
             <View
             style={userStyles.borderBottomLine}
         />
          </View>
        )
    }
    productView = (productData) =>{
        return (
            <View style={{backgroundColor: colors.white, marginTop: metrics.heightSize(21), }}>
            <View style={styles.viewProductData}>
                <FastImage
      
       style={styles.imageProduct}
          source={{uri:productData.productImage}}
        />
        <View>
        <Text style={styles.textProductName}>{productData.productTitle}</Text>
        <Text style={styles.textItemLeft}>{`${productData.stockCount} Items left`}</Text>
        </View>
       
            </View>
            <View style={[productDetailStyles.viewPrice,{alignSelf:'flex-start',  marginHorizontal: metrics.widthSize(45),marginBottom: metrics.heightSize(39)}]}>
                {productData.productDiscount !== undefined && productData.productDiscount > 0 &&
                  <Text style={productDetailStyles.textPrice}>
                    {productData.productAmountCurrency + " " +
                      formatCurrency.format(productData.productAmount - (productData.productAmount * productData.productDiscount) / 100)}
                  </Text>}
                {productData.productDiscount === undefined || productData.productDiscount === 0 &&
                  <Text style={productDetailStyles.textPrice}>
                    {productData.productAmountCurrency + " " + formatCurrency.format(productData.productAmount)}
                  </Text>}
                {productData.productDiscount !== undefined && productData.productDiscount > 0 &&
                  <View style={productDetailStyles.viewDiscountContainer}>
                    <Text style={productDetailStyles.textDiscount}> {
                      productData.productAmountCurrency + " " + formatCurrency.format(productData.productAmount)}</Text>
                    <View style={productDetailStyles.viewDiscountPercent}>
                      <Text style={productDetailStyles.textDiscountPercent}>{productData.productDiscount + "% OFF"}</Text>
                    </View>
                  </View>
                }

              </View>
            </View>
        )
    }
 
}
export default inject("AddressStore", "AuthStore")(observer(BuyProductStep2))


