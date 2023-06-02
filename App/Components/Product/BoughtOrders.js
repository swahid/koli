import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native';
import Loader from '../../SupportingFIles/Loader';
import { inject, observer } from 'mobx-react';
import { strings } from '../../Locales/i18';
import styles from './styles'
import userStyles from '../Address/UserAddress/styles'
import { getUserId } from '../../SupportingFIles/Utills';

import images from '../../Themes/Images';
import metrics from '../../Themes/Metrics';
import colors from '../../Themes/Colors';
import { commonStyles } from '../../SupportingFIles/Constants';
import CampaignTrans from '../../Assets/Images/CampaignTrans';
import ProductTrans from '../../Assets/Images/ProductTrans';
import productDetailStyles from '../Product/ProductDetail/styles'
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

import FastImage from 'react-native-fast-image'
import Moment from 'moment'
import NpBoughtOrders from '../../Assets/Images/BoughtOrders';

const formatCurrency = new Intl.NumberFormat('en-US')

class BoughtOrders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: 0,
            selectedRow: -1,
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
        this.props.navigation.addListener('focus', () => {
            getUserId().then(userid => {
                this.setState({ userId: userid })
                this.props.ProductStore.getUserBoughtOrders(userid)
            })


            // if (this.props.AddressStore.reloadContent) {
            //     this.props.AddressStore.getAddressData()
            //     //  this.props.AddressStore.setAddressAdded(false)

            // }
        })
    }

    render() {
        const store = this.props.ProductStore
        return (
            <SafeAreaView style={{backgroundColor:colors.white, flex:1}}>
                {/* <Loader loading={store.isLoading} /> */}
                {!store.isLoading && (store.userBoughtOrders === null || store.userBoughtOrders.length === 0) &&
                    <View style={styles.emptyContainer}>
                    <NpBoughtOrders style={styles.imageNoTransactions} />
                    <Text style={styles.textEmptyAddress}>{strings('No_bought_order')}</Text>
                    <Text style={styles.textPlaceholderDetail}>{strings('No_bought_order_description')}</Text>
                    <TouchableOpacity style={styles.startShoppingContainer}
                          onPress={()=>this.props.navigation.navigate('StoreTab')}>
                              <Text style={styles.textStartShopping}>
                              Start Shopping</Text>
                              </TouchableOpacity>
                </View>}
                {!store.isLoading && store.userBoughtOrders !== null && store.userBoughtOrders.length > 0 &&
                    <FlatList
                        style={{backgroundColor:'#F3F3F3'}}
                        data={store.userBoughtOrders}
                        keyExtractor={(index) => index.toString()}
                        renderItem={({ item, index }) => this.listItem(item, index)}>
                    </FlatList>}
                    {store.isLoading && this.renderPlaceHolderView()}
            </SafeAreaView>

        );
    }
    listItem = (item, index) => {
        // console.log('item:',item)
        return (
            <View style={{ backgroundColor: colors.white, marginTop: metrics.dimen_7 }}>

                {item.products !== undefined && this.productView(item.products, item)}

                {/* <View
                    style={userStyles.borderBottomLine}
                /> */}
            </View>
        )
    }

    productView = (productData, item) => {
        return (
            <View style={{ backgroundColor: colors.white, marginTop: metrics.heightSize(21), }}>

                <View style={{ marginTop: metrics.dimen_10, marginHorizontal: metrics.widthSize(45), justifyContent: "space-between", flexDirection: 'row' }}>
                    <Text style={{ fontSize: metrics.text_11, fontFamily: metrics.Lato_SemiBold, color: "#979797" }}>
                        {`Order ID: ${item.id}`}
                    </Text>
                    <Text style={{ fontSize: metrics.text_11, fontFamily: metrics.Lato_SemiBold, color: "#979797" }}>
                        {`Ordered On: ${Moment(item.createdAt).format('MMM DD, YYYY')}`}
                    </Text>
                </View>

                <View style={[styles.viewProductData, { marginVertical: metrics.dimen_16 }]}>
                    <FastImage

                        style={boughtOrderStyles.imageProduct}
                        source={{ uri: productData.productImage }}
                    />
                    <View>
                        <Text style={styles.textProductName}>{productData.productTitle}</Text>
                        <View style={[productDetailStyles.viewPrice, { alignSelf: 'flex-start', marginHorizontal: metrics.widthSize(36), marginBottom: metrics.heightSize(30) }]}>
                            {item.productDiscountPrice !== undefined && item.productDiscountPrice > 0 &&
                                <Text style={boughtOrderStyles.textPrice}>
                                    {productData.productAmountCurrency + " " +
                                        formatCurrency.format(item.productDiscountPrice)}
                                </Text>}
                            {item.productDiscountPrice === undefined || item.productDiscountPrice === 0 &&
                                <Text style={[productDetailStyles.textPrice, { marginTop: metrics.dimen_10 }]}>
                                    {productData.productAmountCurrency + " " + formatCurrency.format(item.amount)}
                                </Text>}
                        </View>
                        {item.productDiscountPrice !== undefined && item.productDiscountPrice > 0 &&
                            <View style={productDetailStyles.viewDiscountContainer}>
                                <Text style={productDetailStyles.textDiscount}> {
                                    productData.productAmountCurrency + " " + formatCurrency.format(item.amount)}</Text>
                            </View>
                        }
                    </View>

                </View>

            </View>
        )
    }
    renderPlaceHolderView = () => {
        return (
            [...Array(10)].map((e, i) =>
                <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item style={{ backgroundColor: colors.white, marginTop: metrics.dimen_7 }}>
                        <SkeletonPlaceholder.Item style={{ backgroundColor: colors.white, marginTop: metrics.heightSize(21), }}>

                            <View style={{ marginTop: metrics.dimen_10, marginHorizontal: metrics.widthSize(45), justifyContent: "space-between", flexDirection: 'row' }}>
                                <View style={{ width: 50, height: 10, borderRadius: 4 }} />
                                <View style={{ width: 50, height: 10, borderRadius: 4 }} />
                            </View>

                            <View style={[styles.viewProductData, { marginVertical: metrics.dimen_16 }]}>
                                <View style={[boughtOrderStyles.imageProduct]} />

                                <View>
                                    <View style={[styles.textProductName, { width: 200, height: 30, borderRadius: 4 }]} />
                                    <View style={[boughtOrderStyles.textPrice, { width: 50, height: 15, borderRadius: 4, marginLeft:metrics.dimen_10}]} />

                                </View>

                            </View>

                        </SkeletonPlaceholder.Item>

                    </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder>
            )
        )
    }

}
const boughtOrderStyles = StyleSheet.create({
    imageProduct: {
        width: metrics.widthSize(258),
        height: metrics.widthSize(258),
        borderRadius: metrics.dimen_8,
    },
    textPrice: {
        fontFamily: metrics.Lato_SemiBold,
        fontSize: metrics.getFontSize(14),
        color: colors.app_Blue,
        marginTop: metrics.dimen_6
    },
});
export default inject("ProductStore", "AuthStore")(observer(BoughtOrders))


