import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import Loader from '../../../SupportingFIles/Loader';
import { inject, observer } from 'mobx-react';
import { strings } from '../../../Locales/i18';
import styles from '../UserAddress/styles'
import images from '../../../Themes/Images';
import metrics from '../../../Themes/Metrics';
import colors from '../../../Themes/Colors';
import { commonStyles } from '../../../SupportingFIles/Constants';
import NoAddresses from '../../../Assets/Images/NoAddresses';

class UserAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount = () =>{
    this.props.navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity style={{...commonStyles.backButtonContainercampaign}}
            onPress={()=>this.props.navigation.goBack()}
        >
            <Image style={{tintColor:colors.app_black}} source = {images.backImage} />
        </TouchableOpacity>
      ),
      headerRight: () => (
                 
        <TouchableOpacity style={{marginRight: metrics.dimen_20,}}
        onPress={()=>
          //this.props.navigation.navigate('CreateCampaign1',{type:'Add'})
          this.props.navigation.navigate('ManageAddress')

          }>
          <Image source={images.plusIcon} style = {{marginLeft: metrics.dimen_22}}/>
          </TouchableOpacity>
          
    ) })
    this.props.navigation.addListener('focus', () => {
      if(this.props.AddressStore.reloadContent)
      {
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
  }, 200)
    return (
        <View style={styles.contentView}>
                  <Loader loading={store.isLoading} />
            {!store.isLoading && (store.addresses === null ||  store.addresses.length === 0) &&  
              <View style={styles.emptyContainer}>
                <NoAddresses style={styles.imageAddAddress}/>
        {/* <Image source = {images.BankInfo}
        resizeMode="contain"
        style={styles.imageAddAddress} /> */}
        <Text style={styles.textEmptyAddress}>{strings('No_Shipping_address')}</Text>
        <Text style={styles.textPlaceholderDetail}>{strings('No_Shipping_address_detail')}</Text>
            </View> }
            {!store.isLoading && store.addresses !== null && store.addresses.length > 0 &&
            <FlatList 
            style={styles.listContainer}
            data={store.addresses}
            keyExtractor={( index) => index.toString()}
            renderItem={(item) => this.listItem(item.item)}>
                </FlatList>}
        </View>
    
    );
  }
  listItem = (item) =>{
     // console.log('item:',item)
      return(
          <View style={styles.viewListItem}>
        <Text style={styles.textName}>{item.fullName}</Text>
        <Text style={styles.textAddress}>
          {`${item.buildingName}, ${item.area}, ${item.city}, ${item.state}, ${item.country}, ${item.pincode}`}
          </Text>
        <Text style={styles.textAddress}>{item.phone}</Text>
        <View
          style={styles.borderBottomLine}
        />
          </View>
      )
  }
}
export default inject("AddressStore", "AuthStore")(observer(UserAddress))

