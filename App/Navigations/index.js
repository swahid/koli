
import React from 'react'
import { useRef } from 'react';
import { Image, View, TouchableOpacity, StyleSheet, Text, Alert, Platform } from 'react-native'
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite'
// import analytics from '@react-native-firebase/analytics';
import { FBANavigationEntity } from '../SupportingFIles/Constants';
import { logScreenView, logCustom } from '../API/Analytics/Firebase';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SplashVideo from '../Components/Auth/Screen/SplashVideo'
import Signup from '../Components/Auth/Screen/Signup';
import Login from '../Components/Auth/Screen/Login';
import ForgotPassword from '../Components/Auth/Screen/ForgotPassword';
import UserName from '../Components/Auth/Screen/UserName'
import Influencer from '../Components/Profile/Screen/Influencer'
import InfluencerSearch from '../Components/Profile/Screen/InfluencerSearch';
import SortInfluencer from '../Components/Profile/Screen/SortInfluencer'
import MyProfile from '../Components/Profile/Screen/MyProfile';
import EditProfile from '../Components/Profile/Screen/EditProfile';
import UserProfile from '../Components/Profile/Screen/UserProfile';
// import Home from '../Components/Campaign/Screen/Home'
import Home from '../Components/Campaign/Screen/HomeNew'
import Help from '../Components/Profile/Screen/Help'
import CampaignSearch from '../Components/Campaign/Screen/CampaignSearch'

import MyCompaign from '../Components/Campaign/Screen/MyCompaign'
import GiveAway from '../Components/GiveAway';
import { DrawerContent } from '../Components/DrawerContent';
import images from '../Themes/Images';
import colors from '../Themes/Colors';
import metrics from '../Themes/Metrics';
import Setting from '../Components/Setting'
import WebViewNavCom from '../Components/WebViewNavCom'
import Splash from '../Components/Splash';
import { strings } from '../Locales/i18';
import CreateCampaign1 from '../Components/CreateCampaign/CreateCampaign1'
import CreateCampaign2 from '../Components/CreateCampaign/CreateCampaign2'
import CreateCampaign3 from '../Components/CreateCampaign/CreateCampaign3'
import CreateCampaign4 from '../Components/CreateCampaign/CreateCampaign4'
import CreateCampaign7 from '../Components/CreateCampaign/CreateCampaign7'
import CreateCampaign8 from '../Components/CreateCampaign/CreateCampaign8'
import CreateCampaign9 from '../Components/CreateCampaign/CreateCampaign9'
import CreateCampaign10 from '../Components/CreateCampaign/CreateCampaign10'
import CampaignAddCategory from '../Components/CreateCampaign/CampaignAddCategory'
import CreateCampaignForm from '../Components/CreateCampaign/CreateCampaignFrom/CreateCampaignForm'

import CampaignPreview from '../Components/CreateCampaign/CampaignPreview'
import CampaignDetails from '../Components/Campaign/Screen/CampaignDetails'
import ApplyJob from '../Components/Campaign/Screen/ApplyJob'
import ApplicantList from '../Components/Campaign/Screen/ApplicantList'
import SocialProfileWebView from '../Components/SocialProfileWebView'
import PurchaseCampaign from '../Components/Campaign/Screen/PurchaseCampaign/PurchaseCampaign'

import CampaignFilter from '../Components/Campaign/Screen/CampaignFilter'
import MYCampaignDetails from '../Components/Campaign/Screen/MYCampaignDetails'
import ChatListing from '../Components/Chat/ChatListing'
import ChatDetail from '../Components/Chat/ChatDetail'
import SortCampaign from '../Components/Campaign/Screen/SortCampaign'
import Notification from '../Components/Notification'
import PrivacyPolicy from '../Components/Auth/Screen/PrivacyPolicy'
import Termscondition from '../Components/Auth/Screen/Termscondition'
import HelpSelectSubject from '../Components/Profile/Screen/HelpSelectSubject'
import ChatBackup from '../Components/Chat/ChatBackup'
import MyApplications from '../Components/MyApplications/MyApplications'
import CampaignStackScreen from './StackNavigators/CampaignStack'
import BankInfoDetail from '../Components/BankInfo/BankInfoDetail/BankInfoDetail'
import AddBankDetails from '../Components/BankInfo/AddBankDetails/AddBankDetails'
import AddProduct from '../Components/Product/AddProduct'
import StoreTab from '../Components/StoreTab/StoreTab'
import UserProducts from '../Components/Product/UserProducts/UserProducts'
import UserStore from '../Components/Product/UserStore/UserStore'
import ProductDetails from '../Components/Product/ProductDetail/ProductDetails'
import AddPersonalInfo from '../Components/BankInfo/AddPersonalInfo/AddPersonalInfo'
import ManageAddress from '../Components/Address/ManageAddress/ManageAddress'
import UserAddress from '../Components/Address/UserAddress/UserAddress'
import BuyProductStep1 from '../Components/Product/BuyProduct/BuyProductStep1'
import BuyProductStep2 from '../Components/Product/BuyProduct/BuyProductStep2'
import BuyProductStep3 from '../Components/Product/BuyProduct/BuyProductStep3'
import TransactionHistory from '../Components/Product/TransactionHistory'
import BoughtOrders from '../Components/Product/BoughtOrders'
import BlockUser from '../Components/Profile/Screen/BlockUser'
import ConnectSocialAccount from '../Components/Auth/Screen/ConnectSocialAccount'
import SortApplicant from '../Components/Campaign/Screen/ApplicantTab/SortApplicant'
import Social from '../Components/Profile/Screen/Social';
import SocialProfileSetup from '../Components/Profile/Screen/SocialProfileSetup';
import AffiliateSettings from '../Components/Profile/Screen/AffiliateSettings'
import UserReviewList from '../Components/Profile/Screen/UserReviewList'
import AddReview from '../Components/Profile/Screen/AddReview'
import ChangePassword from '../Components/Profile/Screen/ChangePassword'
import CampaignLike from '../Components/Campaign/Screen/CampaignLike'
import UserComment from '../Components/Campaign/Screen/UserComment'


//Custom Component
import ChatTabBarIcon from '../Components/CommonComponents/ChatTabBarIcon'
import DrawerIcon from './RoutesComponent/DrawerIcon'
import TabBarIcon from './RoutesComponent/TabBarIcon'
import CustomStripeCard from '../Components/Stripe/CustomStripeCard';
import CampaignViewAll from '../Components/Campaign/Screen/CampaignsViewAll/CampaignViewAll';
import PayPalWebview from '../Components/Campaign/Screen/PayPalWebview';

const AuthStack = createStackNavigator()
const SplashStack = createStackNavigator()
const ProfileStack = createStackNavigator()
const webViewStack = createStackNavigator()
const privacyPolicyStack = createStackNavigator()
const TermsconditionStack = createStackNavigator()


const SettingStack = createStackNavigator()
const HelpStack = createStackNavigator()
const InfluencerStack = createStackNavigator()
const HomeStack = createStackNavigator()
const myCompaignStack = createStackNavigator()
const TabStack = createBottomTabNavigator()
const DrawerStack = createDrawerNavigator();
const GiveAwayStack = createStackNavigator()
const tabStackStackNavigator = createStackNavigator()
const ChatStackNavigator = createStackNavigator()
const NotificationStackNavigator = createStackNavigator()
const ProductStackNavigator = createStackNavigator()
const StoreStackNavigator = createStackNavigator()

let userimage = ''
let authData = {}
let unreadConversations = 0

import { SafeAreaProvider } from 'react-native-safe-area-context';

const TabStackScreen = () => {
    return (
        <tabStackStackNavigator.Navigator
            screenOptions={{ gestureEnabled: true, swipeEnabled: false }}

        >
            <tabStackStackNavigator.Screen name='TabStack' component={TabScreens} options={{ headerShown: false }} />

            <tabStackStackNavigator.Screen name='AuthStack' component={AuthStackScreen} options={{ headerShown: false, gestureEnabled: false, swipeEnabled: false, }} />
            <tabStackStackNavigator.Screen name='Login' component={Login} options={{ headerShown: false }} />
            <tabStackStackNavigator.Screen name='SplashVideo' component={SplashVideo} options={{ headerShown: false, swipeEnabled: false, gestureEnabled: false }}

            />
            <tabStackStackNavigator.Screen name='UserName' component={UserName} options={{ headerShown: false }} />
            <tabStackStackNavigator.Screen name='DrawerScreens' component={DrawerScreens} options={{ headerShown: false }} />
            <tabStackStackNavigator.Screen name='CampaignDetails' component={CampaignDetails} options={{ title: strings('CampaignDetails'), headerTintColor: colors.app_black }} />
            <tabStackStackNavigator.Screen name="ApplyJob" component={ApplyJob} options={{ title: strings('Apply_job'), headerBackTitle: '' }} />
            <tabStackStackNavigator.Screen name='InfluencerSearch' component={InfluencerSearch} options={{
                title: strings('Search_Influencer'), headerTitleStyle: {
                    fontFamily: metrics.Lato_Bold,
                    color: 'rgba(26, 30, 36, 1)',
                    fontSize: metrics.text_16,
                    marginTop: Platform.OS === 'android' ? 9 : null,
                }
            }} />
            <tabStackStackNavigator.Screen name="CampaignSearch" component={CampaignSearch} options={{
                title: strings('Search'), headerBackTitle: '', headerTitleStyle: {
                    fontFamily: metrics.Lato_Bold,
                    color: 'rgba(26, 30, 36, 1)',
                    fontSize: metrics.text_16,
                    marginTop: Platform.OS === 'android' ? 10 : null,
                }

            }} />

            <tabStackStackNavigator.Screen name='UserProfile' component={UserProfile} options={{ title: '' }} />
            <tabStackStackNavigator.Screen name='UserReviewList' component={UserReviewList} options={{ title: '' }} />
            <tabStackStackNavigator.Screen name='AddReview' component={AddReview} options={{ title: '' }} />

            <tabStackStackNavigator.Screen name='EditProfile' component={EditProfile} options={{
                title: strings('Edit_profile'), headerBackTitle: '', headerTitleStyle: {
                    fontFamily: metrics.Lato_Bold,
                    color: 'rgba(26, 30, 36, 1)',
                    fontSize: metrics.text_16,
                    textTransform: 'capitalize'
                }
            }} />


            <tabStackStackNavigator.Screen name='Social' component={Social} options={{
                title: "", headerTitleStyle: {
                    fontFamily: metrics.Lato_Bold,
                    color: 'rgba(26, 30, 36, 1)',
                    fontSize: metrics.text_16,
                    textTransform: 'capitalize'
                }
            }} />

            <tabStackStackNavigator.Screen name='SocialProfileSetup' component={SocialProfileSetup} options={{
                title: "", headerTitleStyle: {
                    fontFamily: metrics.Lato_Bold,
                    color: 'rgba(26, 30, 36, 1)',
                    fontSize: metrics.text_16,
                    textTransform: 'capitalize'
                }
            }} />



            <tabStackStackNavigator.Screen name='ChatDetail' component={ChatDetail} options={{ title: strings('ChatDetail'), headerBackTitle: '', headerTitleStyle: { textTransform: 'capitalize' } }} />
            {/* <tabStackStackNavigator.Screen name='Help' component={Help} options={{ title: strings('Help'), headerBackTitle: '' }} /> */}
            <tabStackStackNavigator.Screen name='SocialProfileWebView' component={SocialProfileWebView} options={{
                headerBackTitle: '', headerTitleStyle: {
                    fontFamily: metrics.Lato_Bold,
                    color: 'rgba(26, 30, 36, 1)',
                    fontSize: metrics.text_16,
                    textTransform: 'capitalize'
                }, headerTintColor: colors.app_black
            }} />
            <tabStackStackNavigator.Screen name='myApplicationsStackScreen' component={myApplicationsStackScreen} options={{ headerShown: false }} />
            <tabStackStackNavigator.Screen name='SettingStackScreen' component={SettingStackScreen} options={{ headerShown: false }} />
            <tabStackStackNavigator.Screen name='webViewStackScreen' component={webViewStackScreen} options={{ headerShown: false }} />
            <tabStackStackNavigator.Screen name='privacyPolicyStackScreen' component={privacyPolicyStackScreen} options={{ headerShown: false }} />
            <tabStackStackNavigator.Screen name='TermsconditionStackScreen' component={TermsconditionStackScreen} options={{ headerShown: false }} />
            <tabStackStackNavigator.Screen name='HelpStackScreen' component={HelpStackScreen} options={{ headerShown: false }} />

            <tabStackStackNavigator.Screen name='CampaignFilter' component={CampaignFilter} options={{ headerShown: false }} />
            <tabStackStackNavigator.Screen name='SortInfluencer' component={SortInfluencer} options={{ headerShown: false }} />
            <tabStackStackNavigator.Screen name='MYCampaignDetails' component={MYCampaignDetails} options={{ title: strings('CampaignDetails') }} />
            <tabStackStackNavigator.Screen name='SortCampaign' component={SortCampaign} options={{ headerShown: false }} />
            <tabStackStackNavigator.Screen name='Notification' component={Notification} options={{ title: strings('Notifications') }} />
            <tabStackStackNavigator.Screen name='CampaignPreview' component={CampaignPreview} options={{ headerStyle: styles.navBar, title: '', headerBackTitle: null }} />
            <tabStackStackNavigator.Screen name='CampaignAddCategory' component={CampaignAddCategory} options={{ headerStyle: styles.navBar, title: '5/9', headerBackTitle: null }} />

            <tabStackStackNavigator.Screen name='CampaignLike' component={CampaignLike}
                options={
                    {
                        title: strings('likesc'),
                        headerBackTitle: null,
                        headerTitleStyle: {
                            fontFamily: metrics.Lato_Bold,
                            color: 'rgba(26, 30, 36, 1)',
                            fontSize: metrics.text_16
                        },
                        headerTintColor: colors.app_black
                    }} />

            <tabStackStackNavigator.Screen name='UserComment' component={UserComment}
                options={
                    {
                        title: strings('Comments'),
                        headerBackTitle: null,
                        headerTitleStyle: {
                            fontFamily: metrics.Lato_Bold,
                            color: 'rgba(26, 30, 36, 1)',
                            fontSize: metrics.text_16
                        },
                        headerTintColor: colors.app_black
                    }} />

            <tabStackStackNavigator.Screen name='CreateCampaignForm' component={CreateCampaignForm}
                options={
                    {
                        title: strings('Create_campaign'),
                        headerBackTitle: null,
                        headerTitleStyle: {
                            fontFamily: metrics.Lato_Bold,
                            color: 'rgba(26, 30, 36, 1)',
                            fontSize: metrics.text_16
                        },
                        headerTintColor: colors.app_black
                    }} />
            <tabStackStackNavigator.Screen name='ApplicantList' component={ApplicantList} options={{
                title: strings('Applications'), headerBackTitle: '', headerTitleStyle: {
                    fontFamily: metrics.Lato_Bold,
                    color: 'rgba(26, 30, 36, 1)',
                    fontSize: metrics.text_16
                }

            }} />
            <tabStackStackNavigator.Screen name='PayPalWebview' component={PayPalWebview} options={{
                headerTitleStyle: {
                    fontFamily: metrics.Lato_Bold,
                    color: 'rgba(26, 30, 36, 1)',
                    fontSize: metrics.text_16
                },
                title: strings('MAKE_PAYMENT'), headerBackTitle: ''
            }} />
            <tabStackStackNavigator.Screen name='SortApplicant' component={SortApplicant} options={{ headerShown: false }} />

            <tabStackStackNavigator.Screen name="PurchaseCampaign" component={PurchaseCampaign} options={{
                title: strings('hire_influencer'), headerBackTitle: '', headerTitleStyle: {
                    fontFamily: metrics.Lato_Bold,
                    color: 'rgba(26, 30, 36, 1)',
                    fontSize: metrics.text_16
                }

            }} />
            <tabStackStackNavigator.Screen name="CustomStripeCard" component={CustomStripeCard} options={{
                title: strings('hire_influencer'), headerBackTitle: '', headerTitleStyle: {
                    fontFamily: metrics.Lato_Bold,
                    color: 'rgba(26, 30, 36, 1)',
                    fontSize: metrics.text_16
                }

            }} />
            <tabStackStackNavigator.Screen name='HomeTab' component={homeStackScreen} options={{ title: '' }} />
            <tabStackStackNavigator.Screen name="ChatListing" component={ChatListing} options={{
                headerStyle: styles.navBar, title: (
                    strings('Chat')
                    // <Image     source={images.headerlogo_ios}/>
                ),
                // headerLeft: () => (
                //     <TouchableOpacity style={{ marginLeft: metrics.dimen_20 }} onPress={() => navigation.openDrawer()}>
                //         <Image source={images.backImage} />
                //     </TouchableOpacity>
                // )
            }} />

            {/* E-Comm Module */}
            <tabStackStackNavigator.Screen name="ProductStack" component={ProductStackScreen} options={{ headerShown: false }} />
            <tabStackStackNavigator.Screen name="StoreTabStackScreen" component={StoreTabStackScreen} options={{ title: '' }} />
            <tabStackStackNavigator.Screen name="ProductDetails" component={ProductDetails} options={{ headerShown: false }} />
            <tabStackStackNavigator.Screen name="BuyProductStep1" component={BuyProductStep1} options={{ title: strings('Select_Address'), }} />
            <tabStackStackNavigator.Screen name="BuyProductStep2" component={BuyProductStep2} options={{ title: strings('Order_Summary'), }} />
            <tabStackStackNavigator.Screen name="BuyProductStep3" component={BuyProductStep3} options={{ title: strings('Order_Summary'), }} />
            <tabStackStackNavigator.Screen name="TransactionHistory" component={TransactionHistory} options={{
                title: strings('Your_Transactions'),
                headerBackTitle: null,
                headerTitleStyle: {
                    fontFamily: metrics.Lato_Bold,
                    color: 'rgba(26, 30, 36, 1)',
                    fontSize: metrics.text_16
                }
            }} />
            <tabStackStackNavigator.Screen name="BoughtOrders" component={BoughtOrders} options={{
                title: strings('Bought_Orders'),
                headerBackTitle: null,
                headerTitleStyle: {
                    fontFamily: metrics.Lato_Bold,
                    color: 'rgba(26, 30, 36, 1)',
                    fontSize: metrics.text_16
                }
            }} />

            <tabStackStackNavigator.Screen name="ManageAddress" component={ManageAddress} options={{
                title: strings('Add_Address'),
                // headerStyle: styles.navBar,
                headerBackTitle: null,
                headerTitleStyle: {
                    fontFamily: metrics.Lato_Bold,
                    color: 'rgba(26, 30, 36, 1)',
                    fontSize: metrics.text_16
                }
            }} />
            <tabStackStackNavigator.Screen name="UserAddress" component={UserAddress} options={{
                title: strings('Manage_Address'),
                // headerStyle: styles.navBar,
                headerBackTitle: null,
                headerTitleStyle: {
                    fontFamily: metrics.Lato_Bold,
                    color: 'rgba(26, 30, 36, 1)',
                    fontSize: metrics.text_16
                }
            }} />

            <tabStackStackNavigator.Screen name="BankInfoDetail" component={BankInfoDetail} options={{
                title: strings('Bank_Info')
            }} />
            <tabStackStackNavigator.Screen name="CampaignViewAll" component={CampaignViewAll} options={{
                title: strings('CampaignViewAll'), headerBackTitle: '', headerTitleStyle: {
                    fontFamily: metrics.Lato_Bold,
                    color: 'rgba(26, 30, 36, 1)',
                    fontSize: metrics.text_16
                }

            }} />
        </tabStackStackNavigator.Navigator>
    )
}
const ProductStackScreen = () => (
    <ProductStackNavigator.Navigator >
        <ProductStackNavigator.Screen name='UserStore' component={UserStore} options={{
            title: strings('My_Store'),
            headerStyle: styles.navBar,
            headerBackTitle: null,
            headerTitleStyle: {
                fontFamily: metrics.Lato_Bold,
                color: 'rgba(26, 30, 36, 1)',
                fontSize: metrics.text_16
            }
        }} />
        <ProductStackNavigator.Screen name='UserProducts' component={UserProducts} options={{
            title: '',
            headerBackTitle: null,
            headerTitleStyle: {
                fontFamily: metrics.Lato_Bold,
                color: 'rgba(26, 30, 36, 1)',
                fontSize: metrics.text_16
            }
        }} />
        <ProductStackNavigator.Screen name='AddProduct' component={AddProduct} options={{
            title: strings('Add_Product'),
            headerBackTitle: null,
            headerTitleStyle: {
                fontFamily: metrics.Lato_Bold,
                color: 'rgba(26, 30, 36, 1)',
                fontSize: metrics.text_16
            }
        }} />
        {/* <AuthStack.Screen name='UserName' component={UserName} options={{ headerShown: false }} /> */}
    </ProductStackNavigator.Navigator>
)
const StoreTabStackScreen = () => (
    <StoreStackNavigator.Navigator >
        <StoreStackNavigator.Screen name="StoreTab" component={StoreTab} options={{
            title: strings('Store'),
            headerBackTitle: null,
            headerTitleStyle: {
                fontFamily: metrics.Lato_Bold,
                color: 'rgba(26, 30, 36, 1)',
                fontSize: metrics.text_16
            }
        }} />

        {/* <AuthStack.Screen name='UserName' component={UserName} options={{ headerShown: false }} /> */}
        {/* <StoreStackNavigator.Screen name="ProductDetails" component={ProductDetails} options={{  headerShown: false}}  /> */}
    </StoreStackNavigator.Navigator>
)
const AuthStackScreen = () => (
    <AuthStack.Navigator screenOptions={{ swipeEnabled: false, gestureEnabled: false }}>
        <AuthStack.Screen name='SplashVideo' component={SplashVideo} options={{ headerShown: false, swipeEnabled: false }} />
        <AuthStack.Screen name='Login' component={Login} options={{ headerShown: false, gestureEnabled: false }} />
        <AuthStack.Screen name='Signup' component={Signup} options={{ headerShown: false }} />
        <AuthStack.Screen name='ForgotPassword' component={ForgotPassword} options={{ headerShown: false }} />
        <AuthStack.Screen name='ConnectSocialAccount' component={ConnectSocialAccount} options={{
            headerStyle: styles.navBar, title: strings('Complete_Process'),
            // headerLeft: () => <DrawerIcon navigation={navigation}/>
        }} />

        {/* <AuthStack.Screen name='UserName' component={UserName} options={{ headerShown: false }} /> */}
    </AuthStack.Navigator>
)

const InfluencerStackScreen = ({ navigation }) => (
    <InfluencerStack.Navigator>
        <InfluencerStack.Screen name='Influencer' component={Influencer} options={{
            headerStyle: styles.navBar, title: strings('Influencer'),
            // headerLeft: () => <DrawerIcon navigation={navigation}/>
        }} />


    </InfluencerStack.Navigator>
)
const homeStackScreen = ({ navigation }) => (
    <HomeStack.Navigator>
        <HomeStack.Screen name='Home' component={Home} options={{
            headerStyle: styles.navBar,
            headerTitle: null
            // headerTitle: () => (
            //     <Image resizeMode='contain' style={{ flex: 1 }} source={images.headerlogo_ios} />
            // ),
            // headerLeft: () => (
            //     <TouchableOpacity style={{
            //         marginLeft: metrics.dimen_20,
            //         width: metrics.widthSize(150),
            //         //backgroundColor:'red',
            //         height: '100%',
            //         justifyContent:'center'
            //     }} onPress={() => navigation.openDrawer()}>
            //         <Image 
            //         // style={{ marginTop: Platform.OS == 'android' ? metrics.dimen_20 : 0 }}
            //             source={images.drawerIcon} />
            //     </TouchableOpacity>
            // )
        }} />
        <HomeStack.Screen name='MyCompaign' component={MyCompaign} options={{
            headerTitleStyle: {
                fontFamily: metrics.Lato_Bold,
                color: 'rgba(26, 30, 36, 1)',
                fontSize: metrics.text_16
            },
            title: strings('MyCampaign'), headerLeft: () => authData.isLogin ? (
                <TouchableOpacity style={{ marginLeft: metrics.dimen_20 }}
                    onPress={() => navigation.openDrawer()}>
                    <Image source={images.drawerIcon} />
                </TouchableOpacity>
            ) : null,
            headerRight: () => (
                <View style={{ marginRight: metrics.dimen_20, flexDirection: 'row' }}>
                    <Image source={images.search} />
                    <TouchableOpacity onPress={() => navigation.navigate('CreateCampaign1', { type: 'Add' })}>
                        <Image source={images.plusIcon} style={{ marginLeft: metrics.dimen_20 }} />
                    </TouchableOpacity>
                </View>
            )
        }} />
        <HomeStack.Screen name="ApplicantList" component={ApplicantList} options={{
            title: strings('CampaignDetails'), headerBackTitle: '', headerTitleStyle: {
                fontFamily: metrics.Lato_Bold,
                color: 'rgba(26, 30, 36, 1)',
                fontSize: metrics.text_16
            }

        }} />
        {/* <HomeStack.Screen name="CampaignViewAll" component={CampaignViewAll} options={{
            title: strings('CampaignViewAll'), headerBackTitle: '', headerTitleStyle: {
                fontFamily: metrics.Lato_Bold,
                color: 'rgba(26, 30, 36, 1)',
                fontSize: metrics.text_16
            }

        }} /> */}
        {/* <HomeStack.Screen name="CampaignSearch" component={CampaignSearch} options={{
            title: strings('Search'), headerBackTitle: '', headerTitleStyle: {
                fontFamily: metrics.Lato_Bold,
                color: 'rgba(26, 30, 36, 1)',
                fontSize: metrics.text_16,
                marginTop: Platform.OS === 'android' ? 10 : null,
            }

        }} /> */}
    </HomeStack.Navigator>
)
const myCompaignStackScreen = ({ navigation }) => (
    <myCompaignStack.Navigator
        screenOptions={{
            gestureEnabled: true,
            // headerStyle: styles.navBar,
            headerTintColor: colors.app_Blue,
            headerTitleStyle: {
                fontFamily: metrics.Roboto_Medium,
                color: 'rgba(199, 199, 199, 1)',
                fontSize: metrics.text_16,
            },
        }}
    >
        <myCompaignStack.Screen name='MyCompaign' component={MyCompaign} options={{
            headerTitleStyle: {
                fontFamily: metrics.Lato_Bold,
                color: 'rgba(26, 30, 36, 1)',
                fontSize: metrics.text_16
            },
            title: strings('MyCampaign'), headerLeft: () => authData.isLogin ? (
                <TouchableOpacity style={{ marginLeft: metrics.dimen_20 }}
                    onPress={() => navigation.openDrawer()}>
                    <Image source={images.drawerIcon} />
                </TouchableOpacity>
            ) : null,
            headerRight: () => (
                <View style={{ marginRight: metrics.dimen_20, flexDirection: 'row' }}>
                    <Image source={images.search} />
                    <TouchableOpacity onPress={() => navigation.navigate('CreateCampaign1', { type: 'Add' })}>
                        <Image source={images.plusIcon} style={{ marginLeft: metrics.dimen_20 }} />
                    </TouchableOpacity>
                </View>
            )
        }} />
        <myCompaignStack.Screen name='CreateCampaignForm' component={CreateCampaignForm} options={
            {
                title: strings('Create_campaign'),
                headerBackTitle: null,
                headerTitleStyle: {
                    fontFamily: metrics.Lato_Bold,
                    color: 'rgba(26, 30, 36, 1)',
                    fontSize: metrics.text_16
                },
                headerTintColor: colors.app_black
            }} />
        <myCompaignStack.Screen name='CreateCampaign1' component={CreateCampaign1} options={{ headerStyle: styles.navBar, title: '1/9', headerBackTitle: null }} />
        <myCompaignStack.Screen name='CreateCampaign2' component={CreateCampaign2} options={{ headerStyle: styles.navBar, title: '2/9', headerBackTitle: null }} />
        <myCompaignStack.Screen name='CreateCampaign3' component={CreateCampaign3} options={{ headerStyle: styles.navBar, title: '3/9', headerBackTitle: null }} />
        <myCompaignStack.Screen name='CreateCampaign4' component={CreateCampaign4} options={{ headerStyle: styles.navBar, title: '4/9', headerBackTitle: null }} />
        {/* <myCompaignStack.Screen name='CreateCampaign5' component={CreateCampaign5} options={{ headerStyle: styles.navBar, title: '5/7', headerBackTitle: '' }} /> */}
        <myCompaignStack.Screen name='CreateCampaign7' component={CreateCampaign7} options={{ headerStyle: styles.navBar, title: '6/9', headerBackTitle: null }} />
        <myCompaignStack.Screen name='CreateCampaign10' component={CreateCampaign10} options={{ headerStyle: styles.navBar, title: '7/9', headerBackTitle: null }} />
        <myCompaignStack.Screen name='CreateCampaign8' component={CreateCampaign8} options={{ headerStyle: styles.navBar, title: '8/9', headerBackTitle: null }} />
        <myCompaignStack.Screen name='CreateCampaign9' component={CreateCampaign9} options={{ headerStyle: styles.navBar, title: '9/9', headerBackTitle: null }} />
        <myCompaignStack.Screen name='CampaignPreview' component={CampaignPreview} options={{ headerStyle: styles.navBar, title: '', headerBackTitle: null }} />
        <myCompaignStack.Screen name='CampaignAddCategory' component={CampaignAddCategory} options={{ headerStyle: styles.navBar, title: '5/9', headerBackTitle: null }} />

        <myCompaignStack.Screen name='ApplicantList' component={ApplicantList} options={{
            title: strings('Applications'), headerBackTitle: '', headerTitleStyle: {
                fontFamily: metrics.Lato_Bold,
                color: 'rgba(26, 30, 36, 1)',
                fontSize: metrics.text_16
            }

        }} />
        <myCompaignStack.Screen name='UserProfile' component={UserProfile} options={{
            headerStyle: styles.navBar, title: '', headerBackTitle: '', headerTitleStyle: {
                fontFamily: metrics.Lato_Bold,
                color: 'rgba(26, 30, 36, 1)',
                fontSize: metrics.text_16
            }
        }} />
        <myCompaignStack.Screen name='SocialProfileWebView' component={SocialProfileWebView} options={{
            headerBackTitle: '', headerTitleStyle: {
                fontFamily: metrics.Lato_Bold,
                color: 'rgba(26, 30, 36, 1)',
                fontSize: metrics.text_16,
                textTransform: 'capitalize'
            }, headerTintColor: colors.app_black
        }} />
        <myCompaignStack.Screen name='MYCampaignDetails' component={MYCampaignDetails} options={{
            title: strings('CampaignDetails'), headerTitleStyle: {
                fontFamily: metrics.Lato_Bold,
                color: 'rgba(26, 30, 36, 1)',
                fontSize: metrics.text_16,
                textTransform: 'capitalize'
            }, headerTintColor: colors.app_black
        }} />

        <myCompaignStack.Screen name='ChatDetail' component={ChatDetail} options={{
            headerStyle: styles.navBar, title: '', headerBackTitle: '',
            headerTitleStyle: { textTransform: 'capitalize' }
        }} />
        <myCompaignStack.Screen name="PurchaseCampaign" component={PurchaseCampaign} options={{
            title: strings('hire_influencer'), headerBackTitle: '', headerTitleStyle: {
                fontFamily: metrics.Lato_Bold,
                color: 'rgba(26, 30, 36, 1)',
                fontSize: metrics.text_16
            }

        }} />
        <myCompaignStack.Screen name="CustomStripeCard" component={CustomStripeCard} options={{
            title: strings('hire_influencer'), headerBackTitle: '', headerTitleStyle: {
                fontFamily: metrics.Lato_Bold,
                color: 'rgba(26, 30, 36, 1)',
                fontSize: metrics.text_16
            }

        }} />
        <myCompaignStack.Screen name='CampaignDetails' component={CampaignDetails} options={{
            title: strings('CampaignDetails'), headerTitleStyle: {
                fontFamily: metrics.Lato_Bold,
                color: 'rgba(26, 30, 36, 1)',
                fontSize: metrics.text_16,
                textTransform: 'capitalize'
            }
        }} />

    </myCompaignStack.Navigator>


)
const myApplicationsStackScreen = ({ navigation }) => (
    <myCompaignStack.Navigator
        screenOptions={{
            gestureEnabled: true,
            // headerStyle: styles.navBar,
            headerTintColor: colors.app_Blue,
            headerTitleStyle: {
                fontFamily: metrics.Roboto_Medium,
                color: 'rgba(199, 199, 199, 1)',
                fontSize: metrics.text_16,
            },
        }}
    >
        <myCompaignStack.Screen name='MyApplications' component={MyApplications} options={{
            headerTitleStyle: {
                fontFamily: metrics.Lato_Bold,
                color: 'rgba(26, 30, 36, 1)',
                fontSize: metrics.text_16
            },
            title: strings('My_Applications'), headerLeft: () => authData.isLogin ? (
                <TouchableOpacity style={{ marginLeft: metrics.dimen_20 }}
                    onPress={() => navigation.goBack()}>
                    <Image source={images.backImage} />
                </TouchableOpacity>
            ) : null,
        }} />


        <myCompaignStack.Screen name='UserProfile' component={UserProfile} options={{
            headerStyle: styles.navBar, title: '', headerBackTitle: '', headerTitleStyle: {
                fontFamily: metrics.Lato_Bold,
                color: 'rgba(26, 30, 36, 1)',
                fontSize: metrics.text_16
            }
        }} />
        <myCompaignStack.Screen name='SocialProfileWebView' component={SocialProfileWebView} options={{
            headerBackTitle: '', headerTitleStyle: {
                fontFamily: metrics.Lato_Bold,
                color: 'rgba(26, 30, 36, 1)',
                fontSize: metrics.text_16,
                textTransform: 'capitalize'
            }, headerTintColor: colors.app_black
        }} />
        <myCompaignStack.Screen name='MYCampaignDetails' component={MYCampaignDetails} options={{
            title: strings('CampaignDetails'), headerTitleStyle: {
                fontFamily: metrics.Lato_Bold,
                color: 'rgba(26, 30, 36, 1)',
                fontSize: metrics.text_16,
                textTransform: 'capitalize'
            }, headerTintColor: colors.app_black
        }} />

        <myCompaignStack.Screen name='ChatDetail' component={ChatDetail} options={{
            headerStyle: styles.navBar, title: '', headerBackTitle: '',
            headerTitleStyle: { textTransform: 'capitalize' }
        }} />

        <myCompaignStack.Screen name='CampaignDetails' component={CampaignDetails} options={{
            title: strings('CampaignDetails'),
            headerTitleStyle: {
                fontFamily: metrics.Lato_Bold,
                color: 'rgba(26, 30, 36, 1)',
                fontSize: metrics.text_16,
                textTransform: 'capitalize'
            }, headerTintColor: colors.app_black
        }}
        />

    </myCompaignStack.Navigator>


)
const webViewStackScreen = ({ navigation }) => (
    <webViewStack.Navigator>
        <webViewStack.Screen name='WebViewNavCom' component={WebViewNavCom} options={{
            headerStyle: styles.navBar,
            headerLeft: () =>
                <TouchableOpacity style={{ marginLeft: metrics.dimen_20 }} onPress={() => navigation.goBack()}>
                    <Image source={images.backImage} />
                </TouchableOpacity>
            , title: ''
        }} />
    </webViewStack.Navigator>
)
const privacyPolicyStackScreen = ({ navigation }) => (
    <privacyPolicyStack.Navigator>
        <privacyPolicyStack.Screen name='PrivacyPolicy' component={PrivacyPolicy} options={{
            headerStyle: styles.navBar,
            headerLeft: () => (
                <TouchableOpacity style={{ marginLeft: metrics.dimen_20 }} onPress={() => navigation.goBack()}>
                    <Image source={images.backImage} />
                </TouchableOpacity>
            )
        }} />
    </privacyPolicyStack.Navigator>
)

const TermsconditionStackScreen = ({ navigation }) => (
    <TermsconditionStack.Navigator>
        <TermsconditionStack.Screen name='Termscondition' component={Termscondition} options={{
            headerStyle: styles.navBar,
            headerLeft: () => (
                <TouchableOpacity style={{ marginLeft: metrics.dimen_20 }} onPress={() => navigation.goBack()}>
                    <Image source={images.backImage} />
                </TouchableOpacity>
            )
        }} />
    </TermsconditionStack.Navigator>
)


const SettingStackScreen = ({ navigation }) => (
    <SettingStack.Navigator>
        <SettingStack.Screen name="Setting" component={Setting} options={{
            title: strings('Setting'),
            headerStyle: styles.navBar,
            headerLeft: () => authData.isLogin ? (
                <TouchableOpacity style={{ marginLeft: metrics.dimen_20 }} onPress={() => navigation.goBack()}>
                    <Image source={images.backImage} />
                </TouchableOpacity>
            ) : null
        }} />
        <SettingStack.Screen name="ChatBackup" component={ChatBackup} options={{
            title: strings('Chat_Backup'),
            headerStyle: styles.navBar,
            headerLeft: () => authData.isLogin ? (
                <TouchableOpacity style={{ marginLeft: metrics.dimen_20 }} onPress={() => navigation.openDrawer()}>
                    <Image source={images.drawerIcon} />
                </TouchableOpacity>
            ) : null
        }} />
        <SettingStack.Screen name="BankInfoDetail" component={BankInfoDetail} options={{
            title: strings('Bank_Info')
        }} />
        <SettingStack.Screen name="AddBankDetails" component={AddBankDetails} options={{
            title: strings('Bank_Info')
        }} />
        <SettingStack.Screen name="AddPersonalInfo" component={AddPersonalInfo} options={{
            title: strings('Bank_Info')
        }} />
        <SettingStack.Screen name='BlockUser' component={BlockUser} options={{
            title: strings('Blocked_users')
        }} />
        <SettingStack.Screen name='AffiliateSettings' component={AffiliateSettings} options={{
            title: strings('affiliateSettings')
        }} />

        <SettingStack.Screen name='ChangePassword' component={ChangePassword} options={{
            title: strings('change_Password')
        }} />

    </SettingStack.Navigator>


)
const HelpStackScreen = ({ navigation }) => (
    <HelpStack.Navigator>
        <HelpStack.Screen name={strings('Support')} component={Help} options={{
            // headerStyle: styles.navBar,
            // headerLeft: () => authData.isLogin ? (
            //     <TouchableOpacity style={{ marginLeft: metrics.dimen_20 }} onPress={() => navigation.goBack()}>
            //         <Image source={images.backImage} />
            //     </TouchableOpacity>
            // ) : null
            headerLeft: () => (
                <TouchableOpacity style={{ marginLeft: metrics.dimen_20 }} onPress={() => navigation.goBack()}>
                    <Image source={images.backImage} />
                </TouchableOpacity>
            )
        }} />
        <HelpStack.Screen name="HelpSelectSubject" component={HelpSelectSubject} options={{
            //headerStyle: styles.navBar, 
            title: strings('Select_Subject'), headerBackTitle: '',
            headerTitleStyle: { textTransform: 'capitalize' }
        }} />
    </HelpStack.Navigator>
)
const ProfileStackScreen = ({ navigation }) => (
    <ProfileStack.Navigator>
        <ProfileStack.Screen name='Account' component={MyProfile} options={{
            headerStyle: styles.navBar,
            // headerLeft: () => authData.isLogin ? (
            //     <TouchableOpacity style={{ marginLeft: metrics.dimen_20 }} onPress={() => navigation.openDrawer()}>
            //         <Image source={images.drawerIcon} />
            //     </TouchableOpacity>
            // ) : null
        }} />
        <ProfileStack.Screen name='MyCompaign' component={MyCompaign} options={{
            headerTitleStyle: {
                fontFamily: metrics.Lato_Bold,
                color: 'rgba(26, 30, 36, 1)',
                fontSize: metrics.text_16
            },
            title: strings('MyCampaign'),
            headerRight: () => (
                <View style={{ marginRight: metrics.dimen_20, flexDirection: 'row' }}>
                    <Image source={images.search} />
                    <TouchableOpacity onPress={() => navigation.navigate('CreateCampaign1', { type: 'Add' })}>
                        <Image source={images.plusIcon} style={{ marginLeft: metrics.dimen_20 }} />
                    </TouchableOpacity>
                </View>
            )
        }} />
        <ProfileStack.Screen name="ApplicantList" component={ApplicantList} options={{
            title: strings('CampaignDetails'), headerBackTitle: '', headerTitleStyle: {
                fontFamily: metrics.Lato_Bold,
                color: 'rgba(26, 30, 36, 1)',
                fontSize: metrics.text_16
            }

        }} />
        <ProfileStack.Screen name="CampaignSearch" component={CampaignSearch} options={{
            title: strings('Search'), headerBackTitle: '', headerTitleStyle: {
                fontFamily: metrics.Lato_Bold,
                color: 'rgba(26, 30, 36, 1)',
                fontSize: metrics.text_16
            }

        }} />
        <ProfileStack.Screen name='Termscondition' component={Termscondition} options={{
            headerStyle: styles.navBar,
            headerLeft: () => (
                <TouchableOpacity style={{ marginLeft: metrics.dimen_20 }} onPress={() => navigation.goBack()}>
                    <Image source={images.backImage} />
                </TouchableOpacity>
            )
        }} />
        {/* <ProfileStack.Screen name='EditProfile' component={EditProfile} options={{
            // headerStyle: styles.navBar,
            headerLeft: () => (<TouchableOpacity style={{ marginLeft: metrics.dimen_20 }} onPress={() => navigation.navigate('Account')}>
                <Image source={images.backImage} />
            </TouchableOpacity>)
        }} />*/}



    </ProfileStack.Navigator>
)
const GiveAwayStackScreen = ({ navigation }) => (
    <GiveAwayStack.Navigator>
        <GiveAwayStack.Screen name='GiveAway' component={GiveAway} options={{
            headerStyle: styles.navBar,
            title: "",
            headerLeft: () => authData.isLogin ? (
                <TouchableOpacity style={{ marginLeft: metrics.dimen_20 }} onPress={() => navigation.openDrawer()}>
                    <Image source={images.drawerIcon} />
                </TouchableOpacity>
            ) : null,
            headerRight: () => authData.isLogin ? (
                <View style={{ marginRight: metrics.dimen_20, flexDirection: 'row' }}>
                    <Image source={images.search} />
                    <Image source={images.bellIcon} style={{ marginLeft: metrics.dimen_20 }} />
                </View>
            ) : null
        }} />
    </GiveAwayStack.Navigator>
)
const ChatStackScreen = ({ navigation }) => (
    <ChatStackNavigator.Navigator>
        <ChatStackNavigator.Screen name='ChatListing' component={ChatListing} options={{
            headerStyle: styles.navBar, title: (
                strings('Chat')
                // <Image     source={images.headerlogo_ios}/>
            ),
            // headerLeft: () => (
            //     <TouchableOpacity style={{ marginLeft: metrics.dimen_20 }} onPress={() => navigation.openDrawer()}>
            //         <Image source={images.drawerIcon} />
            //     </TouchableOpacity>
            // )
        }} />



    </ChatStackNavigator.Navigator>
)


const NotificationStackScreen = ({ navigation }) => (
    <NotificationStackNavigator.Navigator>
        <NotificationStackNavigator.Screen name='Notification' component={Notification} options={{
            // headerStyle: styles.navBar, 
            title: (
                strings('Notifications')
                // <Image     source={images.headerlogo_ios}/>
            ),
        }}
        />

        <NotificationStackNavigator.Screen name='MyCompaign' component={MyCompaign} options={{
            headerTitleStyle: {
                fontFamily: metrics.Lato_Bold,
                color: 'rgba(26, 30, 36, 1)',
                fontSize: metrics.text_16
            },
            title: strings('MyCampaign'),
        }} />



    </NotificationStackNavigator.Navigator>

)
const TabScreens = ({ navigation }) => (
    <TabStack.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                var iconFilledName;

                if (route.name === 'HomeTab') {
                    iconName = images.HomeTabLine
                    iconFilledName = images.HomeTabFilled

                }
                else if (route.name === 'StoreTab') {
                    iconName = images.StoreTabLine
                    iconFilledName = images.StoreTabFilled

                }
                else if (route.name === 'InfluencersTab') {
                    iconName = images.influencerTabLine
                    iconFilledName = images.influencerTabFilled

                } else if (route.name === 'GiveAwayTab') {
                    iconName = images.giveAway
                    iconFilledName = images.homeTabIconFilled

                } else if (route.name === 'ProfileStackScreen') {

                    iconName = userimage == null || userimage === '' || userimage === 'NA' ?
                        images.userTabIcon : { uri: userimage }
                    iconFilledName = userimage == null || userimage === '' || userimage === 'NA' ?
                        images.userTabFilled : { uri: userimage }

                }
                if (route.name === 'NotificationTab') {
                    // iconName = images.NotificationTabLine
                    // iconFilledName = images.NotificationTabLine
                    return (
                        <ChatTabBarIcon iconName={images.NotificationTabLine}
                            iconFilledName={images.NotificationTabFilled}
                            focused={focused}
                            unreadConversations={3}
                        />
                    )
                }

                if (route.name === 'ProfileStackScreen' && userimage !== null && userimage !== '' && userimage !== 'NA') {
                    return <TabBarIcon iconName={iconName}
                        iconFilledName={iconFilledName}
                        focused={focused}
                        userProfile={true} />;
                    // return <Image source={iconName} style={{
                    //     height: metrics.dimen_20, width: metrics.dimen_20, borderRadius: metrics.dimen_20 / 2,
                    //     overflow: "hidden",
                    //     borderWidth: 1,
                    //     borderColor: colors.app_Blue
                    // }} />;
                }
                else if (route.name === 'ChatTab' && unreadConversations > 0) {
                    return (
                        <ChatTabBarIcon iconName={iconName}
                            focused={focused}
                            unreadConversations={unreadConversations}
                        />
                    )

                }
                else {
                    return <TabBarIcon focused={focused} iconName={iconName} iconFilledName={iconFilledName} />;
                }

            },
            // tabBarLabel: ({ focused, color }) => {
            //     let labelName;
            //     if (route.name === 'HomeTab') {
            //         labelName = strings('Compaign')
            //     } else if (route.name === 'InfluencersTab') {
            //         labelName = strings('Influencer')
            //     } else if (route.name === 'GiveAwayTab') {
            //         labelName = strings('Giveaway')
            //     } else if (route.name === 'ProfileStackScreen') {
            //         labelName = strings('Profile')
            //     }
            //     else if (route.name === 'ChatTab') {
            //         labelName = strings('Chat')
            //     }


            //     return <Text style={{ marginBottom: Platform.OS === 'android' ? metrics.dimen_12 : metrics.dimen_1, marginTop: Platform.OS == 'android' ? -metrics.dimen_5 : - metrics.dimen_6, fontFamily: metrics.Lato_Regular, color: focused ? colors.app_Blue : colors.app_gray }}>
            //         {labelName}
            //     </Text>;

            //     //return labelName

            // },

            onTabPress: (tab) => {
                Alert.alert("Save", "Dont forget to save your weather!");

            },
            headerShown: false,
            tabBarActiveTintColor: colors.app_Blue,
            // tabBarInactiveTintColor: theme.colors.text_detail,
            // tabBarShowLabel: true,
            tabBarStyle: {
                backgroundColor: '#f7f7f7',
                //----------add this line------------------------//
                // height: Platform.OS === 'android' ? 76 : metrics.dimen_70,
                borderTopColor: "#EBEBEB",
                // paddingVertical: Platform.OS === 'android' ? 10 : 0,
            }
        })}
    >
        <TabStack.Screen name='HomeTab' component={homeStackScreen} options={{ title: '', headerShown: false }} />
        <TabStack.Screen name='InfluencersTab' component={InfluencerStackScreen} options={{ title: '', headerShown: false }} />
        {/* <TabStack.Screen name='StoreTab' component={StoreTabStackScreen} options={{ title:  ''}} /> */}
        <TabStack.Screen name='NotificationTab' component={NotificationStackScreen} options={{ title: '', headerShown: false }} />
        {/* <TabStack.Screen name='GiveAwayTab' component={GiveAwayStackScreen} options={{ title: '' }} /> */}
        <TabStack.Screen name='ProfileStackScreen' component={ProfileStackScreen} options={{ title: '', headerShown: false }}
        // listeners={{
        //     tabPress: e => console.warn('Tab press', e.target),
        //   }}
        />
    </TabStack.Navigator >
    )
const showDrawer = false;

const DrawerScreens = () => {
    return (
        <DrawerStack.Navigator
            drawerContent={(props) => <DrawerContent {...props} />}
            screenOptions={{ gestureEnabled: false }}
            drawerStyle={{ width: !showDrawer ? null : 280 }}
        >

            <DrawerStack.Screen name='HomeDrawer' component={TabStackScreen} options={{ gestureEnabled: true }} />

            {/* <DrawerStack.Screen name='ProfileStackScreen' component={ProfileStackScreen} /> */}
            {/* <DrawerStack.Screen name='myCompaignStackScreen' component={CampaignStackScreen}/> */}

            {/* <DrawerStack.Screen name='myCompaignStackScreen' component={myCompaignStackScreen}/> */}
            <DrawerStack.Screen name='myApplicationsStackScreen' component={myApplicationsStackScreen} />
            <DrawerStack.Screen name='SettingStackScreen' component={SettingStackScreen} />
            <DrawerStack.Screen name='webViewStackScreen' component={webViewStackScreen} />
            <DrawerStack.Screen name='privacyPolicyStackScreen' component={privacyPolicyStackScreen} />
            <DrawerStack.Screen name='TermsconditionStackScreen' component={TermsconditionStackScreen} />
            <DrawerStack.Screen name='HelpStackScreen' component={HelpStackScreen} />
            <DrawerStack.Screen name='AuthStack' component={AuthStackScreen} options={{ gestureEnabled: false }} />

        </DrawerStack.Navigator>)
}

const AppContainer = (props) => {
    userimage = props.AuthStore.userImage
    authData = props.AuthStore
    unreadConversations = props.ChatStore.unreadConversations
    const navigationRef = useRef();
    const routeNameRef = useRef();
    // console.log('props.AuthStore:=',authData.navigation)

    if (props.AuthStore.isFirstLaunch) {
        return (
            <SafeAreaProvider>
                <NavigationContainer>
                    <SplashStack.Navigator>
                        <SplashStack.Screen name="splash" component={Splash} options={{ headerShown: false }} />
                    </SplashStack.Navigator>
                </NavigationContainer>
            </SafeAreaProvider>
        )
    }
    else if (props.AuthStore.isLogin) {
        return (
            <SafeAreaProvider>
                <NavigationContainer
                    ref={navigationRef}
                    onReady={() =>
                        (routeNameRef.current = navigationRef.current.getCurrentRoute().name)
                    }
                    onStateChange={async () => {
                        const previousRouteName = routeNameRef.current;
                        const currentRouteName = navigationRef.current.getCurrentRoute().name;

                        if (previousRouteName !== currentRouteName) {
                            // The line below uses the expo-firebase-analytics tracker
                            // https://docs.expo.io/versions/latest/sdk/firebase-analytics/
                            // Change this line to use another Mobile analytics SDK
                            logCustom(previousRouteName + "_to_" + currentRouteName, FBANavigationEntity, currentRouteName)
                            logScreenView(currentRouteName, currentRouteName);
                        }

                        // Save the current route name for later comparison
                        routeNameRef.current = currentRouteName;
                    }}>
                    <TabStackScreen />
                </NavigationContainer>
            </SafeAreaProvider>)
        } else
        return (
            <SafeAreaProvider>
                <NavigationContainer>
                    <TabStackScreen />
                </NavigationContainer>
            </SafeAreaProvider>
        )
}


export default inject("AuthStore", "ChatStore")(observer(AppContainer))

const styles = StyleSheet.create({
    navBar: {
        shadowColor: 'transparent',
        elevation: 0,
        backgroundColor: 'white',
        flex: 1
    },

    navBarhome: {
        shadowColor: 'transparent',
        elevation: 0,
        backgroundColor: 'transparent',
        flex: 1
    }
})