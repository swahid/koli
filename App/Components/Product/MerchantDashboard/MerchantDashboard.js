import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { inject, observer } from 'mobx-react';
import Loader from '../../../SupportingFIles/Loader';
import TotalRevenue from '../../../Assets/Images/TotalRevenue';
import images from '../../../Themes/Images';
import metrics from '../../../Themes/Metrics';
import Colors from '../../../Themes/Colors';
import { color } from 'react-native-reanimated';
import colors from '../../../Themes/Colors';
import { ScrollView } from 'react-native-gesture-handler';
import productDetailStyles from '../ProductDetail/styles'
import transactionStyles from '../styles'
import FastImage from 'react-native-fast-image'
import Moment from 'moment'
import {
    BarChart
  } from "react-native-chart-kit";
const formatCurrency = new Intl.NumberFormat('en-US')
const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43]
      }
    ]
  };
  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };
class MerchantDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productInsight: [
                { title: "Total Orders", value: '' },
                { title: "Units Today", value: '' },
                { title: "Products Instock", value: '' }

            ]
        };
        this.props.ProductStore.getMerchantData()
    }

    render() {
        const { isLoading, merchantData } = this.props.ProductStore
        //console.log("merchantData:",JSON.stringify(merchantData) )
        return (
            <ScrollView>
                <Loader loading={isLoading} />
                <View style={{ marginTop: metrics.dimen_30, marginHorizontal: metrics.dimen_24, flexDirection: 'row', alignItems: 'center' }}>
                    <TotalRevenue width={metrics.dimen_44} height={metrics.dimen_50} />
                    <View style={{ marginLeft: metrics.dimen_25, justifyContent: 'center' }}>
                        <Text style={{ fontFamily: metrics.Lato_Bold, fontSize: metrics.text_13, color: "#959EAB" }}>Total revenue</Text>
                        <Text style={{ fontFamily: metrics.Lato_Bold, fontSize: metrics.text_17, color: colors.app_Blue, marginVertical: metrics.dimen_2 }}>
                            {`$ ${merchantData !== undefined ? merchantData.totalRevenue : "-"}`}
                            </Text>
                        <Text style={{ fontFamily: metrics.Lato_SemiBold, fontSize: metrics.texttext_small1, color: '#595960' }}>
                            {`${merchantData !== undefined ? merchantData.productsInstock : "-"} Products`}
                            </Text>
                    </View>
                </View>
                <ScrollView style={{ marginTop: metrics.dimen_28, flexDirection: 'row' }} horizontal showsHorizontalScrollIndicator={false}>
                    {this.state.productInsight.map((data, index) => {
                        return (
                            <View style={{
                                marginLeft: metrics.dimen_12,
                                width: metrics.dimen_120,
                                height: metrics.dimen_70,
                                backgroundColor: colors.white,
                                borderRadius: metrics.dimen_10,
                                justifyContent: 'center',
                                paddingLeft: metrics.dimen_14
                            }}>
                                <Text style={{ fontFamily: metrics.Lato_Bold, fontSize: metrics.text_13, color: "#254D6E" }}>{data.title}</Text>
                                <Text style={{ fontFamily: metrics.Lato_Bold, fontSize: metrics.getFontSize(20), color: "#254D6E", marginTop: metrics.dimen_6 }}>
                                    {index === 0 ? merchantData.totalOrdersCount :
                                        index === 1 ? merchantData.todayOrdersCount : merchantData.productsInstockqty}
                                </Text>

                            </View>
                        )
                    })}
                </ScrollView>

                <View style={{
                    marginTop: metrics.dimen_20,
                    alignSelf: 'center',
                    width: "90%",
                    height: 300,
                    backgroundColor: colors.white,
                    borderRadius: metrics.dimen_10,
                    justifyContent: 'center',
                    paddingLeft: metrics.dimen_14
                }}>
{/* <BarChart
  //style={graphStyle}
  data={data}
  //width="100%"
  height={300}
  yAxisLabel="$"
  chartConfig={chartConfig}
  verticalLabelRotation={30}
/> */}
                </View>
                <View style={{
                    marginTop: metrics.dimen_20,
                    alignSelf: 'center',
                    width: "90%",
                    //height: 150,
                    backgroundColor: colors.white,
                    borderRadius: metrics.dimen_10,
                    justifyContent: 'center',
                    paddingLeft: metrics.dimen_14, 
                    flex: 1
                }}>
{merchantData.recentOrdersData !== undefined &&  merchantData.recentOrdersData.map((data, index) => {
                    return this.productView(data.products)
                })}
                </View>
                
            </ScrollView>
        );
    }
    productView = (productData) => {
        return (
            <View style={{  marginTop: metrics.heightSize(21), }}>
                <View style={[transactionStyles.viewProductData, { marginVertical: metrics.dimen_16 }]}>
                    <FastImage

                        style={transactionStyles.imageProduct}
                        source={{ uri: productData.productImage }}
                    />
                    <View>
                        <Text style={transactionStyles.textProductName}>{productData.productTitle}</Text>
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
                        </View>
                        {productData.productDiscount !== undefined && productData.productDiscount > 0 &&
                                <View style={[productDetailStyles.viewDiscountContainer,{productDetailStyles}]}>
                                    <Text style={productDetailStyles.textDiscount}> {
                                        productData.productAmountCurrency + " " + formatCurrency.format(productData.productAmount)}</Text>
                                </View>
                            }
                    </View>

                </View>

            </View>
        )
    }
}
export default inject("ProductStore", "AuthStore")(observer(MerchantDashboard))
