import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
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

import FastImage from 'react-native-fast-image'
import Moment from 'moment'
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import NoTransactionHistory from '../../Assets/Images/TransactionHistory';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { SafeAreaView } from 'react-native';

const formatCurrency = new Intl.NumberFormat('en-US')
const initialLayout = { width: metrics.width };

class TransactionHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: 0,
            selectedRow: -1,
            index:0,
            routes: [
                { key: 'first', title: 'Earnings' },
                { key: 'second', title: 'Spent' },
              ]

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
                this.props.ProductStore.getUserEarnedSpend(userid,"credit",0)
                //this.props.ProductStore.getUserTransactions(userid)
            })


            // if (this.props.AddressStore.reloadContent) {
            //     this.props.AddressStore.getAddressData()
            //     //  this.props.AddressStore.setAddressAdded(false)

            // }
        })
    }

    render() {
        const store = this.props.ProductStore
        const {index, routes} = this.state
        return (
            <SafeAreaView style={{ backgroundColor: colors.white, flex: 1 }}>
                {/* <Loader loading={store.isLoading} /> */}
                <TabView
        renderTabBar={props => <TabBar 
            {...props} indicatorStyle={{ backgroundColor: colors.app_Blue }}
        style={{ backgroundColor: colors.white }}
        renderLabel={({ route, focused, color }) => (
            <Text style={focused ? styles.activeTabTextStyle : styles.inactiveTabTextStyle}>
              {route.title}
              {/* {route.key === "first" ? ` (${ProductStore.userProducts.length})` : ""} */}
            </Text>
          )}
        />}
      
navigationState={{ index, routes }}
renderScene={this.renderScene}
onIndexChange={this.setIndex}
initialLayout={initialLayout}
/>
                

                    
                {/* {!store.isLoading && store.transactions !== null && store.transactions.length > 0 &&
                    <FlatList
                        style={{ backgroundColor: '#F3F3F3' }}
                        data={store.transactions}
                        keyExtractor={(index) => index.toString()}
                        renderItem={({ item, index }) => this.listItem(item, index)}>
                    </FlatList>} */}
            </SafeAreaView>

        );
    }
    setIndex = (index) =>{
        const {earnedData, spentData} = this.props.ProductStore
        this.setState({index})
        console.log("earnedData:",earnedData)
        console.log("spentData:",spentData)

        if(index === 0 && earnedData.length===0)
        {
            this.props.ProductStore.getUserEarnedSpend(this.state.userId,"credit",0)
        }
        else if(index === 1 && spentData.length===0)
        {
            this.props.ProductStore.getUserEarnedSpend(this.state.userId,"debit",0)
        }
    }
    renderScene = ({ route, jumpTo }) => {
        return this.renderEarning();
        // switch (route.key) {
        //   case 'first':
        //     return this.renderEarning();
        //   case 'second':
        //     return this.renderEarning();
        // }
      };
      renderEarning = () =>{
        const store = this.props.ProductStore
        const listData = this.state.index === 0 ? store.earnedData : store.spentData

        if(store.isLoading)
        {
            return this.renderPlaceHolderView()
        }
        else if(!store.isLoading && listData !== null && listData.length > 0)
        {
            return(
                <FlatList
                    style={{ backgroundColor: '#F3F3F3' }}
                    data={listData}
                    keyExtractor={(index) => index.toString()}
                    renderItem={({ item, index }) => this.listItem(item, index)}>
                </FlatList>
          )
        }
        else if(!store.isLoading && (listData === null || listData.length === 0)){
            return(
                    <View style={styles.emptyContainer}>
                        <NoTransactionHistory style={styles.imageNoTransactions} />
                        <Text style={styles.textEmptyAddress}>{strings('No_transactions_yet')}</Text>
                        <Text style={styles.textPlaceholderDetail}>{strings('No_transactions_description')}</Text>
                    </View>
            )
        }
      }
    listItem = (item, index) => {
         console.log('this.state.userId:',this.state.userId)
        return (
            <View style={{ backgroundColor: colors.white, }}>


                <TouchableOpacity style={styles.viewTransactionListItem}
                    onPress={() => {
                        if (this.state.selectedRow === index) {
                            this.setState({ selectedRow: -1, })
                        }
                        else {
                            this.setState({ selectedRow: index, })

                        }
                    }}>
                    {item.campaignId !== 0 &&
                        <CampaignTrans width={metrics.dimen_44}
                            height={metrics.dimen_44}
                        />
                    }
                    {item.productId !== 0 &&
                        <ProductTrans width={metrics.dimen_44}
                            height={metrics.dimen_44}
                        />
                    }
                    <View style={{ marginLeft: metrics.dimen_12, width: '90%' }}>

                        <View style={{ flexDirection: 'row', marginRight: metrics.dimen_10, alignItems: 'flex-end', justifyContent:'space-between' }}>

                            <Text style={{ fontFamily: metrics.Lato_SemiBold, fontSize: metrics.text_11, color: "#616164" }}>
                                {item.campaignId !== 0 ? item.payeeOwnerId !== this.state.userId ? "Campaign Fees" : "Influencer Hired"
                                    : item.payeeOwnerId !== this.state.userId ? "Product Purchase" : "Product Sold"}
                            </Text>
                            <View style={{ flexDirection: 'row',alignItems: 'flex-end' }}>
                            <Text style={[userStyles.textName, {
                                color: this.state.index === 1  ? "#FF4747" : "#40E8A4", alignSelf: 'flex-end', marginRight: metrics.dimen_20
                            }]}>{"S$" + " " + formatCurrency.format(item.amount)}</Text>
                            <Image style={styles.imageArrow}
                                source={this.state.selectedRow === index ? images.DropdownIcon : images.rightArrowIcon}
                                resizeMode="contain"
                            />
                            </View>
                          
                        </View>

                        <Text style={{ fontFamily: metrics.Lato_Regular, fontSize: metrics.text_11, color: "#616164", marginTop: metrics.dimen_6 }}>
                            {Moment(item.createdAt).format("DD MMM YYYY h:mm A")}
                        </Text>
                    </View>
                     
                </TouchableOpacity>
                {item.products !== undefined && this.state.selectedRow === index && this.productView(item.products, item)}

                <View
                    style={userStyles.borderBottomLine}
                />
            </View>
        )
    }

    productView = (productData, item) => {
        return (
            <View style={{ backgroundColor: colors.white, marginTop: metrics.heightSize(21), }}>

                <View
                    style={[userStyles.borderBottomLine, { width: "90%", alignSelf: 'center' }]}
                />
                <Text style={{ marginTop: metrics.dimen_10, marginHorizontal: metrics.widthSize(45), fontSize: metrics.text_11, fontFamily: metrics.Lato_SemiBold, color: "#979797" }}>
                    {`ORDER ID: ${item.id}`}
                </Text>
                <View style={[styles.viewProductData, { marginVertical: metrics.dimen_16 }]}>
                    <FastImage

                        style={styles.imageProduct}
                        source={{ uri: productData.productImage }}
                    />
                    <View>
                        <Text style={styles.textProductName}>{productData.productTitle}</Text>
                        <View style={[productDetailStyles.viewPrice, { alignSelf: 'flex-start', marginHorizontal: metrics.widthSize(36), marginBottom: metrics.heightSize(30) }]}>
                            {productData.productDiscount !== undefined && productData.productDiscount > 0 &&
                                <Text style={productDetailStyles.textPrice}>
                                    {productData.productAmountCurrency + " " +
                                        formatCurrency.format(productData.productAmount - (productData.productAmount * productData.productDiscount) / 100)}
                                </Text>}
                            {productData.productDiscount === undefined || productData.productDiscount === 0 &&
                                <Text style={[productDetailStyles.textPrice, { marginTop: metrics.dimen_10 }]}>
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
                        <Text style={{ marginHorizontal: metrics.widthSize(36), fontSize: metrics.text_11, fontFamily: metrics.Lato_Regular, color: "#979797" }}>
                            {`Paid VIA Stripe`}
                        </Text>
                    </View>

                </View>

            </View>
        )
    }
    renderPlaceHolderView = () => {
        return (

            [...Array(10)].map((e, i) =>
            <SkeletonPlaceholder style={{ backgroundColor: colors.white, }}>


            <View style={styles.viewTransactionListItem}>
               
                    <View style={{width: metrics.dimen_44, height: metrics.dimen_44, borderRadius: metrics.dimen_5}} 
                    />
                
                <View style={{ marginLeft: metrics.dimen_12, width: '90%' }}>

                    <View style={{ flexDirection: 'row', marginRight: metrics.dimen_10, alignItems: 'flex-end', justifyContent:'space-between' }}>

                    <View style={{ width: 50, height: 10, borderRadius: 4 }} />
                        <View style={{ flexDirection: 'row',alignItems: 'flex-end' }}>
                        <View style={{ width: 50, height: 10, borderRadius: 4, marginRight: metrics.dimen_10 }} />
                        <View style={{ width: 15, height: 15, borderRadius: 2 }} />
                        </View>
                      
                    </View>

                    <View style={{ width: 100, height: 10, borderRadius: 4,marginTop: metrics.dimen_6  }} />
                </View>
                 
            </View>
            <View
                style={userStyles.borderBottomLine}
            />
        </SkeletonPlaceholder>
            )
        )
    }
}
export default inject("ProductStore", "AuthStore")(observer(TransactionHistory))


