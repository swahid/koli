import React, { Component } from 'react';
import { View, Text, SafeAreaView, FlatList, ScrollView,TouchableOpacity } from 'react-native';
import { strings } from '../../../Locales/i18';
import styles from './styles'
import productGridStyles from '../UserProducts/styles'
import colors from '../../../Themes/Colors';

import FastImage from 'react-native-fast-image'
import images from '../../../Themes/Images';
import metrics from '../../../Themes/Metrics';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { inject, observer } from 'mobx-react';
import Slideshow from '../../../SupportingFIles/Slideshow';
import BackIconInCircle from '../../../Assets/Images/BackIconInCircle';
import ReadMoreText from '../../CommonComponents/ReadMoreLess'
import { commonStyles } from '../../../SupportingFIles/Constants'

const formatCurrency = new Intl.NumberFormat('en-US')

class ProductDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount = () => {
    const item = this.props.route.params.productDetails
    if(this.props.route.params.fetchSimilarProducts)
    {
    this.props.ProductStore.getUserProductsData(item.productOwnerId)
    }
  }
  componentWillUnmount = () =>{
    if(this.props.route.params.fetchSimilarProducts)
    {
      this.props.ProductStore.setSimilarProducts([])
    }
  }

  render() {

    const productData = this.props.route.params.productDetails
    const { products, similarProducts } = this.props.ProductStore
    const urlPic = productData.profile.avatarUrl
    const imageUrl = (urlPic === null || urlPic === 'NA' || urlPic === '') ? images.userPlaceholder : { uri: urlPic }

    //console.log("similarProducts:", JSON.stringify(similarProducts))
    const filterProducts = similarProducts.filter(obj => obj.id !== productData.id)
    return (
      <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
        <ScrollView style={styles.mainContainer}>
          
          <View style={styles.viewImageProductsContainer}>
         
          <Slideshow
           
           height={metrics.width}
           width={metrics.width}
           dataSource={productData.productGallery}
           indicatorColor={colors.white}
           indicatorSelectedColor={colors.indicaterselected}
           arrowSize={0}
           // titleStyle={{ marginTop: 50, color: 'red' }}
          containerStyle={styles.imageProductsContainer} 
           />
            {/* <FastImage
              // renderPlaceholder={this.renderPlaceholder}
              // renderErrorImage={this.renderPlaceholder}

              style={styles.imageProductsContainer}
              source={{ uri: productData.productImage }}
              resizeMode='contain'
            /> */}
             
          </View>
          {/* <Image source={{uri:item.productImage}} style={styles.imageProduct} /> */}
          <View style={styles.viewProductDetail}>
            <Text style={styles.textProductName}>{productData.productTitle}</Text>
            <ReadMoreText style={styles.textProductDescriptio}
            seeMoreStyle={{ ...commonStyles.LatoItalic_Medium,color:colors.app_Blue}}
            seeLessStyle={{ ...commonStyles.LatoItalic_Medium,color:colors.app_Blue  }}
            backgroundColor='#F6F6F6'>
{productData.productDescription}
            </ReadMoreText>
            {/* <ReadMore
              numberOfLines={3}
              renderTruncatedFooter={this._renderTruncatedFooter}
              renderRevealedFooter={this._renderRevealedFooter}
            // onReady={this._handleTextReady}
            >
            <Text style={styles.textProductDescriptio}>{productData.productDescription}</Text>
            </ReadMore> */}
            {/* <Text style={styles.textProductDescriptio}>{productData.productDescription}</Text> */}
            <View style={styles.viewPriceContainer}>
              {/* <View style={styles.viewBuyNow}>
                            <Text style={styles.textBuyNow}>{strings('Buy_Now')}</Text>
                        </View> */}
              <View style={styles.viewPrice}>
                {productData.productDiscount !== undefined && productData.productDiscount > 0 &&
                  <Text style={styles.textPrice}>
                    {productData.productAmountCurrency + " " +
                      formatCurrency.format(productData.productAmount - (productData.productAmount * productData.productDiscount) / 100)}
                  </Text>}
                {productData.productDiscount === undefined || productData.productDiscount === 0 &&
                  <Text style={styles.textPrice}>
                    {productData.productAmountCurrency + " " + formatCurrency.format(productData.productAmount)}
                  </Text>}
                {productData.productDiscount !== undefined && productData.productDiscount > 0 &&
                  <View style={styles.viewDiscountContainer}>
                    <Text style={styles.textDiscount}> {
                      productData.productAmountCurrency + " " + formatCurrency.format(productData.productAmount)}</Text>
                    <View style={styles.viewDiscountPercent}>
                      <Text style={styles.textDiscountPercent}>{productData.productDiscount + "% OFF"}</Text>
                    </View>
                  </View>
                }

              </View>
            </View>

          </View>

          {/*View More Products*/}
         <View>
         {filterProducts.length>0 && <View style={styles.viewSeperator} />}
         {filterProducts.length>0 &&   <View style={styles.viewMoreProducts}>
              <Text style={styles.textMoreProductsFromSeller}>{strings('More_products_from_seller')}</Text>
              <View style={styles.viewUserDetails}>
                <FastImage
                  // renderPlaceholder={this.renderPlaceholder}
                  // renderErrorImage={this.renderPlaceholder}

                  style={styles.userImage}
                  source={imageUrl}
                  resizeMode='contain'
                />
             <View style={styles.viewUserName}>
                  <Text style={styles.textName}>{productData.profile.first+" "+productData.profile.last}</Text>
                  <Text style={styles.textUserName}>{productData.profile.username}</Text>

                </View>
              </View>
            </View>}
            {filterProducts.length>0 &&  <FlatList
              style={{ width: '100%' }}
              numColumns={2}
              // ListHeaderComponent={()=>this.renderHeaderComponent()}

              //columnWrapperStyle={{justifyContent: 'space-between'}}
              // keyboardShouldPersistTaps={'handled'}
              data={filterProducts}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => this.renderProduct(item)}
            />}
          </View>
          <TouchableOpacity style={styles.backImageContainer} onPress={()=> this.props.navigation.goBack()}>
                 <BackIconInCircle style={styles.backImage}/>
                 </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }
  _renderTruncatedFooter = (handlePress) => {
    return (
      <Text style={{ ...styles.textProductDescriptio, marginTop: metrics.dimen_5, color: 'rgba(22, 88, 211, 1)' }} onPress={handlePress}>
        {strings('ReadMore')}
      </Text>
    );
  }

  _renderRevealedFooter = (handlePress) => {
    return (
      <Text style={{ ...styles.textProductDescriptio, marginTop: metrics.dimen_5, color: 'rgba(22, 88, 211, 1)' }} onPress={handlePress}>
        {strings('ShowLess')}
      </Text>
    );
  }
  renderHeaderComponent = () => {

  }
  renderProduct = (item) => {
    console.log("item", item)
    return (
      <TouchableOpacity style={productGridStyles.cellContainer}
      activeOpacity={1}
      onPress={()=>this.props.navigation.push("ProductDetails",{productDetails:item,fetchSimilarProducts:false})}>

        <FastImage
          // renderPlaceholder={this.renderPlaceholder}
          // renderErrorImage={this.renderPlaceholder}

          style={productGridStyles.imageProduct}
          source={{ uri: item.productImage }}
        />
        {/* <Image source={{uri:item.productImage}} style={styles.imageProduct} /> */}
        <View style={productGridStyles.viewProductDetail}>
          <Text style={productGridStyles.textProductName} numberOfLines={1}>{item.productTitle}</Text>
          {/* <Text style={styles.textProductDescriptio}>{item.productDescription}</Text> */}
          {/* <View style={styles.viewBuyNow}>
                        <Text style={styles.textBuyNow}>{strings('Buy_Now')}</Text>
                    </View> */}
          <View style={styles.viewPriceGrid}>
            {item.productDiscount !== undefined && item.productDiscount > 0 &&
              <Text style={productGridStyles.textPrice} numberOfLines={1}>
                {item.productAmountCurrency + " " +
                  formatCurrency.format(item.productAmount - (item.productAmount * item.productDiscount) / 100)}
              </Text>}
            {item.productDiscount === undefined || item.productDiscount === 0 &&
              <Text style={productGridStyles.textPrice}>
                {item.productAmountCurrency + " " + formatCurrency.format(item.productAmount)}
              </Text>}
            {item.productDiscount !== undefined && item.productDiscount > 0 &&
              <View style={productGridStyles.viewDiscountContainer}>
                <Text style={productGridStyles.textDiscount}> {
                  item.productAmountCurrency + " " + formatCurrency.format(item.productAmount)}</Text>
              </View>
            }

          </View>
          {item.productDiscount !== undefined && item.productDiscount > 0 &&
            <View style={styles.viewDiscountPercentGrid}>
              <Text style={productGridStyles.textDiscountPercent}>{item.productDiscount + "% OFF"}</Text>
            </View>}
        </View>
      </TouchableOpacity>
    )
  }
}
export default inject("ProductStore", "AuthStore")(observer(ProductDetails))

