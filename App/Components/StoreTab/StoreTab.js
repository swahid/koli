import React, { Component } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image
} from 'react-native';
import { inject, observer } from 'mobx-react';
import Loader from '../../SupportingFIles/Loader';
import { strings } from '../../Locales/i18';
import styles from './styles'
import FastImage from 'react-native-fast-image'
import images from '../../Themes/Images';
import metrics from '../../Themes/Metrics';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import ChatIconHeader from '../CommonComponents/ChatIconHeader'
import colors from '../../Themes/Colors';
import { useScrollToTop } from '@react-navigation/native';

const formatCurrency = new Intl.NumberFormat('en-US')
@inject('ProductStore','AuthStore')
@observer
class StoreTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialArr : [1,2]
        };
    }
    componentDidMount() {
        this.props.navigation.setOptions({ headerRight: () => (
            <View style={{marginRight: metrics.dimen_20, flexDirection: 'row'}}>
                {/* <TouchableOpacity onPress={() => this.props.navigation.navigate('ChatListing')}>
                  <Image source={images.chatTabLine}
                  resizeMode='contain'
                   style={{ marginLeft: metrics.dimen_22, width: metrics.dimen_16, height: metrics.dimen_16 }} />
      
                </TouchableOpacity> */}
                          <ChatIconHeader navigation={this.props.navigation} />

            </View>
          ) })
          this.props.navigation.addListener('focus', () => {
            this.props.ProductStore.getProductsData()
        });
    }

    render() {
        const { isLoading, products } = this.props.ProductStore
        return (
            <View style={styles.mainContainer}>
                {/* <Loader loading={isLoading} /> */}
               
                {!isLoading &&  <FlatList
                    style={styles.listView}
                    numColumns={1}
                    ref={this.props.scrollRef}
                    // keyboardShouldPersistTaps={'handled'}
                    data={products}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => this.renderProduct(item)}
                />}
                 {isLoading && 
        this.renderPlaceHolderView()
       }
            </View>
        );
    }
    renderProduct = (item) => {
        return (
            <TouchableOpacity style={styles.cellContainer} 
            activeOpacity={1}
            onPress={()=>this.props.navigation.navigate("ProductDetails",{productDetails:item,fetchSimilarProducts:true})}
            >
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
                    <Text style={styles.textProductName}>{item.productTitle}</Text>
                    <Text style={styles.textProductDescriptio}>{item.productDescription}</Text>
                    {item.stockCount === 0 && 
                    <Text style={[styles.textProductDescriptio,{color:"#800000"}]}>{strings('Out_Of_Stock')}</Text>}
                    <View style={styles.viewPriceContainer}>
                        {item.stockCount > 0 && 
                        <TouchableOpacity style={styles.viewBuyNow} onPress={()=>this.props.navigation.navigate('BuyProductStep1',{productData: item})}>
                            <Text style={styles.textBuyNow}>{strings('Buy_Now')}</Text>
                        </TouchableOpacity>}
                        <View style={styles.viewPrice}>
                        {item.productDiscount !== undefined && item.productDiscount > 0 &&
                         <Text style={styles.textPrice}>
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
            </TouchableOpacity>
        )
    }
    renderPlaceHolderView = () => {
        return (
            this.state.initialArr.map(obj => (
                <SkeletonPlaceholder>


                    <View style={{padding: metrics.widthSize(24)}}>
                        <View
                            style={styles.imageProduct}
                        />
                        <View style={styles.viewProductDetail}>
                            <View style={[styles.textProductName, { width: '40%', height: 20 }]} />
                            <View style={[styles.textProductDescriptio, { width: '80%', height: 50 }]} />
                            <View style={styles.viewPriceContainer}>
                                <View style={styles.viewBuyNow} />
                                    <View style={{ width: metrics.widthSize(240), height: 20, alignSelf: "flex-start" }} />

                            </View>

                        </View>
                    </View>
                </SkeletonPlaceholder>
            ))
        )
    }
}

//export default inject("ProductStore", "AuthStore")(observer(StoreTab))
export default function(props) {
    const ref = React.useRef(null);
  
    useScrollToTop(ref);
  
    return <StoreTab {...props} scrollRef={ref} />;
  }