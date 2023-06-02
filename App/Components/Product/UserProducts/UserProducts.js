import React, { Component } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    SafeAreaView
} from 'react-native';
import { inject, observer } from 'mobx-react';
import Loader from '../../../SupportingFIles/Loader';
import { strings } from '../../../Locales/i18';
import styles from './styles'
import images from '../../../Themes/Images';
import metrics from '../../../Themes/Metrics';
import FastImage from 'react-native-fast-image'
import { commonStyles } from '../../../SupportingFIles/Constants';
import ShoppingBasketPlaceholder from '../../../Assets/Images/ShoppingBasketPlaceholder';

const formatCurrency = new Intl.NumberFormat('en-US')

class UserProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount() {
       // this.props.ProductStore.getProductsData(true)
    }
   
    render() {
        const { isLoading, userProducts } = this.props.ProductStore
        const liveProducts = userProducts.filter(el => el.productStatus === 1)
        const inactiveProducts = userProducts.filter(el => el.productStatus === 0)

        return (
            <SafeAreaView style={styles.mainContainer}>
                <Loader loading={isLoading} />
                {!isLoading && userProducts.length === 0 ? this.renderNoItems()  :null}

                <FlatList
                    style={styles.listView}
                    numColumns={2}
                    
                    columnWrapperStyle={{justifyContent: 'space-between'}}
                    // keyboardShouldPersistTaps={'handled'}
                    data={this.props.tab === 'live' ? liveProducts : inactiveProducts}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => this.renderProduct(item)}
                />
                {this.props.tab === 'live' && 
                 <TouchableOpacity style={styles.viewAddProduct} onPress={()=>this.props.navigation.navigate("AddProduct")}>
            <Image style={styles.imagePlus} source={images.plusIcon}></Image>
        </TouchableOpacity>}
            </SafeAreaView>
        );
    }
    renderProduct = (item) => {
        return (
            <View style={styles.cellContainer}>
                {/* <Slideshow
                    // onPress={() => this.props.navigation.navigate('CampaignDetails', { data: item })}
                    height={metrics.width}
                    // width={360}
                    dataSource={item.productGallery}
                    indicatorColor={colors.white}
                    indicatorSelectedColor={colors.indicaterselected}
                    arrowSize={0}
                    // titleStyle={{ marginTop: 50, color: 'red' }}
                    containerStyle={styles.imageProduct}
                /> */}
                 <FastImage
       // renderPlaceholder={this.renderPlaceholder}
       // renderErrorImage={this.renderPlaceholder}

       style={styles.imageProduct}
          source={{uri:item.productImage}}
        />
                {/* <Image source={{uri:item.productImage}} style={styles.imageProduct} /> */}
                <View style={styles.viewProductDetail}>
                    <Text style={styles.textProductName} numberOfLines={1}>{item.productTitle}</Text>
                    {/* <Text style={styles.textProductDescriptio}>{item.productDescription}</Text> */}
                        {/* <View style={styles.viewBuyNow}>
                            <Text style={styles.textBuyNow}>{strings('Buy_Now')}</Text>
                        </View> */}
                        <View style={styles.viewPrice}>
                        {item.productDiscount !== undefined && item.productDiscount > 0 &&
                         <Text style={styles.textPrice} numberOfLines={1}>
                         {item.productAmountCurrency + " " + 
                        formatCurrency.format(item.productAmount - (item.productAmount*item.productDiscount)/100) }
                         </Text> }
                         {item.productDiscount === undefined || item.productDiscount === 0 &&
                         <Text style={styles.textPrice}>
                         {item.productAmountCurrency + " " + formatCurrency.format(item.productAmount)}
                         </Text> }
                            {item.productDiscount !== undefined && item.productDiscount > 0 &&
                            <View style={styles.viewDiscountContainer}>
                            <Text style={styles.textDiscount}> {
                            item.productAmountCurrency + " " + formatCurrency.format(item.productAmount)}</Text>
                            <View style={styles.viewDiscountPercent}>
                            <Text style={styles.textDiscountPercent}>{item.productDiscount+"% OFF"}</Text>
                        </View>
                        </View>
                            }

                    </View>

                </View>
            </View>
        )
    }
    renderNoItems(){
        return(
        <View style = {{alignItems: 'center', height: '90%', justifyContent: 'center'}}>
            {/* <View style={{width:200,height:200, flex:1}}> */}
            <ShoppingBasketPlaceholder  width="100"
            height="100"/>

            {/* </View> */}
          <Text style = {{...commonStyles.LatoBold_16, marginTop: metrics.dimen_10, width:"80%", textAlign:"center"}}>{strings('No_Product')}</Text>
        </View>)
      }
}

export default inject("ProductStore", "AuthStore")(observer(UserProducts))
