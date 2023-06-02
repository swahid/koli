import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, Modal, Alert } from 'react-native';
import metrics from '../../../../Themes/Metrics';
import { observer, inject } from 'mobx-react';
import images from '../../../../Themes/Images';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import FastImage from 'react-native-fast-image'
import { styles } from './styles';
import { commonStyles } from '../../../../SupportingFIles/Constants'
import { strings } from '../../../../Locales/i18';
import { SwipeablePanel } from 'rn-swipeable-panel';
import KoliStripePayment from '../../../Stripe/KoliStripePayment/KoliStripePayment';
import Slideshow from '../../../../SupportingFIles/Slideshow';
import colors from '../../../../Themes/Colors';

import { showAlert,convertCurrencybyCode } from '../../../../SupportingFIles/Utills';
import Loader from '../../../../SupportingFIles/Loader';

const formatCurrency = new Intl.NumberFormat('en-US')

class PurchaseCampaign extends Component {
    constructor(props) {
        super(props);
        this.props.navigation.setOptions({
            // title: this.props.route.params.JobData.campaignTitle,
            headerLeft: () => (
                <TouchableOpacity style={{ marginLeft: metrics.dimen_15 }} onPress={() => this.props.navigation.goBack()}>
                    <Image source={images.backImage} />
                </TouchableOpacity>
            )
        })
        const userData = this.props.route.params.userData

        this.state = {
            amount: userData.offerStatus === 2 ? userData.offerAmount.toString() : '',
            isActive: false
        };
    }
    componentDidMount = () => {
        this.props.CompaignsStore.getStripeKeys()
        this.props.CompaignsStore.setNavigation(this.props.navigation)

    }

    render() {
        const store = this.props.CompaignsStore
        const { isLoading } = store

        const campaignData = this.props.route.params.campignData
        const userData = this.props.route.params.userData
        const userName = userData.profile.username.replace("@", "")
        const urlPic = userData.profile.avatarUrl
        const imageUrl = (urlPic === null || urlPic === 'NA') ? images.userPlaceholder : { uri: urlPic }

        console.log('campaignData :', JSON.stringify(campaignData))
        console.log('userData :', JSON.stringify(this.props.route.params.userData))

        return (
            <View style={styles.mainView}>


                <Loader loading={isLoading} />
                <Modal
                    visible={store.isSwipeViewActive}
                    transparent={true}>
                    <View style={{ marginHorizontal: 0, marginVertical: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <SwipeablePanel
                            style={{ height: '90%', marginTop: -100 }}
                            fullWidth={true}
                            noBackgroundOpacity={true}
                            openLarge={true}
                            showCloseButton={false}
                            onClose={() => this.closePanel()}
                            onPressCloseButton={() => this.closePanel()}
                            isActive={store.isSwipeViewActive}>
                            <KoliStripePayment userData={userData}
                                campaignData={campaignData}
                                amount={userData.offerStatus === 2 ? userData.offerAmount.toString() : this.state.amount}
                                //amount={this.state.amount}
                                closePanel={this.closePanel} />
                        </SwipeablePanel>
                    </View>
                </Modal>
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>

                <Slideshow
            // onPress={() => this.onPropertySelect(item, index) }
            //height={metrics.width - metrics.dimen_48}
            width={metrics.width}
            dataSource={campaignData.campaignGallery ? campaignData.campaignGallery : []}
            indicatorColor={colors.white}
            indicatorSelectedColor={colors.indicaterselected}
            arrowSize={0}
            titleStyle={{ marginTop: 50, color: 'red' }}
            containerStyle={styles.bannerImageStyle}
            isCampaignDetail={true} />

                    {/* <FastImage
                        style={styles.bannerImageStyle}
                        source={{
                            uri: campaignData.campaignImage,
                            priority: FastImage.priority.normal
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    /> */}
                    <View style={styles.viewCampaignAndDetail}>
                        <Text style={styles.textCampaignName}>{campaignData.campaignTitle}</Text>
                        <View style={styles.viewPrice}>
                            <Text style={styles.textPrice}>{convertCurrencybyCode(campaignData.campaignAmountCurrency) + formatCurrency.format(campaignData.campaignAmount)}</Text>
                            <Text style={styles.labelPrice}>{strings('price')}</Text>
                        </View>
                        <View style={styles.lineView} />
                        <Text style={styles.labelHiredInfluencer}>{strings('hire_influencer')}</Text>
                        <View style={styles.viewPrice}>
                            <FastImage
                                style={styles.imageUser}
                                source={imageUrl}
                                resizeMode={FastImage.resizeMode.cover}
                            />

                            <View style={styles.viewUserName}>
                                <Text style={styles.textName}>
                                    {(userData.profile.first ?
                                        userData.profile.first : '')
                                        + " " +
                                        (userData.profile.last ? userData.profile.last : '')}
                                </Text>
                                <Text style={styles.textUserName}>@{userName}</Text>
                            </View>

                        </View>

                    </View>
                    <View style={styles.viewAmount}>
                        <Text style={styles.textName}>{strings('Your_offered_amount')}</Text>
                        <View style={styles.viewAmountField}>
                            <Text style={styles.textdollar}>$</Text>
                            <TextInput style={styles.textInputAmount}
                            editable={userData.offerStatus === 2 ? false : true}

                            value={userData.offerStatus === 2 ? formatCurrency.format(userData.offerAmount).toString() : this.state.amount}
                                //keyboardType="decimal-pad"
                                keyboardType={"decimal-pad"}

                                onChangeText={this.decimalTextChange}
                                //onChangeText={(text) =>this.onChangeTextInput(text)}

                            ></TextInput>

                        </View>

                    </View>
                    <TouchableOpacity style={styles.containerEscrow}
                    onPress={()=>this.showEscrowAlert()}>
                    <Text style={styles.textEscrow}>{strings('What_is_Escrow')}</Text>
                    <Image source={images.infoIcon} style={styles.imageInfo}/> 

                    </TouchableOpacity>

                </KeyboardAwareScrollView>
                <TouchableOpacity style={styles.bottomViewStyle}
                    onPress={() => this.stripePayment()}
                >
                    <Text style={[commonStyles.LatoBold_16, styles.textPayNow]}>{strings('Continue_to_Escrow')}</Text>
                </TouchableOpacity>

                {/* <View style={{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(0,0,0,0.5)',zIndex: 999}}></View> */}

            </View>
        );
    }
    decimalTextChange = (amount) => {
        let newText = '';
        let numbers = '0123456789.';
        var editedText = amount

        for (var i = 0; i < amount.length; i++) {
            if (numbers.indexOf(amount[i]) > -1) {
                newText = newText + amount[i];
                if (amount[i] === ".") {
                    numbers = '0123456789'
                }
            }
            else {
                editedText = amount.slice(0, -1)
                //this.setState({ amount: editedText });

                // your call back function
                // alert("please enter numbers only");
            }
        }
        this.setState({ amount: editedText });


    }
    showEscrowAlert = () =>{
        // Works on both Android and iOS
Alert.alert(
    strings('What_is_Escrow'),
    strings('Escrow_Text'),
    [
      {
        text: strings('Okay'),
        onPress: () => console.log('Ask me later pressed')
      },
    ],
    { cancelable: false }
  );
    }
    closePanel = () => {
        this.props.CompaignsStore.setSwipeViewActive(false)
        //this.setState({isActive:false})
    };
    stripePayment = () => {
        
        if (this.state.amount === '') {
            showAlert('', strings('Please_enter_offered_amount'))
        }
        else {
            // const userData = this.props.route.params.userData
            // const dataParam = {
            //     amount: this.state.amount, name: (userData.profile.first ?
            //         userData.profile.first : '')
            //         + " " +
            //         (userData.profile.last ? userData.profile.last : ''),
            //     email: userData.profile.email, description: 'Stripe Payment for Influencer Hiring'
            // }
            this.props.CompaignsStore.setSwipeViewActive(true)

            // this.setState({isActive:true})

            //this.props.navigation.navigate('CustomStripeCard')
            //initiatePayment(payType.card,this.state.amount,dataParam,this.props.CompaignsStore)
        }
    }
}
export default inject("ApplicantListStore", "CompaignsStore")(observer(PurchaseCampaign))

