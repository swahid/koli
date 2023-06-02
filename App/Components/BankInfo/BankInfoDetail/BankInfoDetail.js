import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import styles from './styles'
import {observer, inject} from 'mobx-react';

import images from '../../../Themes/Images';
import { strings } from '../../../Locales/i18';
import Loader from '../../../SupportingFIles/Loader';
import { commonStyles } from '../../../SupportingFIles/Constants';
import { FlatList } from 'react-native-gesture-handler';
import { getUserId, gettUserData } from '../../../SupportingFIles/Utills';

class BankInfoDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
        bankDetailInfo:[
            // {heading: strings('accountType'), value: 'Saving'},
            {heading: strings('accountHolderName'), value: 'Account Holder Name'},
            {heading: strings('accountNumber'), value: '15626262663001'},
            {heading: strings('swiftCode'), value: 'AAAABBCCDDD'},
            {heading: strings('routingNumber'), value:'322271724'},
            // {heading: strings('bankAddress'), value:'12 Marina Boulevard, DBS Asia Central, Marina Bay Financial Centre Tower 3, Singapore 018982'},

        ]
    };
  }
   componentDidMount () {
    this.props.navigation.addListener('focus', async() => {
     // setTimeout(async () => {
        const store = this.props.SettingsStore
      store.getaccountDetails()
      await getUserId().then(userid => {
        if(userid !== null)
        {
            const param = {where:{ownerId: userid}}
      this.props.AuthStore.getUserProfileDataForUpdate(param)
        }

      })
      
      this.checkBankDetails()
    //  }, 1000)
      
      this.props.navigation.setOptions({ 
      headerLeft: () => (
        <TouchableOpacity style={{...commonStyles.backButtonContainer}}
            onPress={()=>this.props.navigation.goBack()}
        >
            <Image source = {images.backImage} />
        </TouchableOpacity>
      ),
    }
      )
    });

   

  }
  checkBankDetails =() =>{
    setTimeout(() => {
      const store = this.props.SettingsStore

      this.props.navigation.setOptions({ 
        headerRight: () => store.accountDetails === null ? (
            <View style={styles.headerRightContainer}>       
              <TouchableOpacity onPress={()=>
            
                // this.props.navigation.navigate('AddBankDetails', {
                //   bankData: store.accountDetails
                // })
                gettUserData().then(userData => {
                  if(userData.email !== null && userData.email !== "" && userData.email !== undefined)
                  {
                    this.props.navigation.navigate('AddPersonalInfo', {
                      bankData: store.accountDetails
                    })
                  }
                })
               
                }>
                <Image source={store.accountDetailsArray !== null ? images.EditIcon : images.plusIcon} 
                style = {store.accountDetailsArray !== null ? styles.imageEdit : styles.imagePlus}/>
                </TouchableOpacity>
            </View>
          ) : null,
    }
      )
    }, 1000)
  }
  render() {
    const store = this.props.SettingsStore
    this.checkBankDetails()
    return (
        <View style={styles.mainContainer}>
                  <Loader loading={store.isLoading} />
            {!store.isLoading && (store.accountDetailsArray === null ||  store.accountDetailsArray.length === 0) &&  
              <View style={styles.emptyContainer}>
        <Image source = {images.BankInfo}
        resizeMode="contain"
        style={styles.imageBankInfo} />
        <Text style={styles.textEmptyBankInfo}>{strings('Currently_no_bank_details')}</Text>
        <Text style={styles.textEmptyBankInfo}>{strings('Please_tap_on_above')}</Text>
            </View> }
            {!store.isLoading && store.accountDetailsArray !== null && store.accountDetailsArray.length > 0 &&
            <FlatList style={styles.listContainer}
            scrollEnabled={false}
            data={store.accountDetailsArray}
            keyExtractor={( index) => index.toString()}
            renderItem={(item) => this.listItem(item.item)}>
                </FlatList>}
        </View>
    
    );
  }
  listItem = (item) =>{
      console.log('item:',item)
      return(
          <View style={styles.viewListItem}>
        <Text style={styles.textTitle}>{item.heading}</Text>
        <Text style={[styles.textTitle, styles.textValue]}>{item.value !== '' ? item.value : "-"  }</Text>

          </View>
      )
  }
}
export default inject('SettingsStore', 'AuthStore')(observer(BankInfoDetail))

