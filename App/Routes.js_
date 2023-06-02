
import React from 'react'
import { Image, View, TouchableOpacity, StyleSheet, Text, Alert, Platform } from 'react-native'
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SplashVideo from './Components/Auth/Screen/SplashVideo'
import Signup from './Components/Auth/Screen/Signup';
import Login from './Components/Auth/Screen/Login';
import ForgotPassword from './Components/Auth/Screen/ForgotPassword';
import UserName from './Components/Auth/Screen/UserName'
import Influencer from './Components/Profile/Screen/Influencer'
import InfluencerSearch from './Components/Profile/Screen/InfluencerSearch';
import SortInfluencer from './Components/Profile/Screen/SortInfluencer'
import MyProfile from './Components/Profile/Screen/MyProfile';
import EditProfile from './Components/Profile/Screen/EditProfile';
import UserProfile from './Components/Profile/Screen/UserProfile';
import Home from './Components/Campaign/Screen/Home'
import Help from './Components/Profile/Screen/Help'

import MyCompaign from './Components/Campaign/Screen/MyCompaign'
import GiveAway from './Components/GiveAway';
import { DrawerContent } from './Components/DrawerContent';
import images from './Themes/Images';
import colors from './Themes/Colors';
import metrics from './Themes/Metrics';
import Setting from './Components/Setting'
import WebViewNavCom from './Components/WebViewNavCom'
import Splash from './Components/Splash';
import { strings } from './Locales/i18';
import CreateCampaign1 from './Components/CreateCampaign/CreateCampaign1'
import CreateCampaign2 from './Components/CreateCampaign/CreateCampaign2'
import CreateCampaign3 from './Components/CreateCampaign/CreateCampaign3'
import CreateCampaign4 from './Components/CreateCampaign/CreateCampaign4'
import CreateCampaign7 from './Components/CreateCampaign/CreateCampaign7'
import CreateCampaign8 from './Components/CreateCampaign/CreateCampaign8'
import CreateCampaign9 from './Components/CreateCampaign/CreateCampaign9'
import CreateCampaign10 from './Components/CreateCampaign/CreateCampaign10'
import CampaignAddCategory from './Components/CreateCampaign/CampaignAddCategory'

import CampaignPreview from './Components/CreateCampaign/CampaignPreview'
import CampaignDetails from './Components/Campaign/Screen/CampaignDetails'
import ApplyJob from './Components/Campaign/Screen/ApplyJob'
import ApplicantList from './Components/Campaign/Screen/ApplicantList'
import SocialProfileWebView from './Components/SocialProfileWebView'

import CampaignFilter from './Components/Campaign/Screen/CampaignFilter'
import MYCampaignDetails from './Components/Campaign/Screen/MYCampaignDetails'
import ChatListing from './Components/Chat/ChatListing'
import ChatDetail from './Components/Chat/ChatDetail'
import SortCampaign from './Components/Campaign/Screen/SortCampaign'
import Notification from './Components/Notification'
import PrivacyPolicy from './Components/Auth/Screen/PrivacyPolicy'
import Termscondition from './Components/Auth/Screen/Termscondition'
import HelpSelectSubject from './Components/Profile/Screen/HelpSelectSubject'
import ChatBackup from './Components/Chat/ChatBackup'

//Custom Component
import ChatTabBarIcon from '../App/Components/CommonComponents/ChatTabBarIcon'

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

let userimage = ''
let authData = {}
let unreadConversations = 0
const tabStackScreen = () => (
    <tabStackStackNavigator.Navigator
        screenOptions={{ gestureEnabled: true }}

    >
        <tabStackStackNavigator.Screen name='TabStack' component={TabScreens} options={{ headerShown: false }} />
        <tabStackStackNavigator.Screen name='AuthStack' component={AuthStackScreen} options={{ headerShown: false }} mode="modal" />
        <tabStackStackNavigator.Screen name='Login' component={Login} options={{ headerShown: false }} />
        <AuthStack.Screen name='SplashVideo' component={SplashVideo} options={{ headerShown: false }}

        />
        <tabStackStackNavigator.Screen name='UserName' component={UserName} options={{ headerShown: false }} />
        <tabStackStackNavigator.Screen name='DrawerScreens' component={DrawerScreens} options={{ headerShown: false }} />
        <tabStackStackNavigator.Screen name='CampaignDetails' component={CampaignDetails} options={{ title: strings('Details') }} />
        <tabStackStackNavigator.Screen name="ApplyJob" component={ApplyJob} options={{ title: strings('Apply_job'), headerBackTitle: '' }} />
        <tabStackStackNavigator.Screen name='InfluencerSearch' component={InfluencerSearch} options={{ title: strings('Search_Influencer') }} />
        <tabStackStackNavigator.Screen name='UserProfile' component={UserProfile} options={{ title: '' }} />
        <tabStackStackNavigator.Screen name='EditProfile' component={EditProfile} options={{ title: strings('Edit_profile'), headerBackTitle: '' }} />
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
        <tabStackStackNavigator.Screen name='CampaignFilter' component={CampaignFilter} options={{ headerShown: false }} />
        <tabStackStackNavigator.Screen name='SortInfluencer' component={SortInfluencer} options={{ headerShown: false }} />
        <tabStackStackNavigator.Screen name='MYCampaignDetails' component={MYCampaignDetails} options={{ title: strings('Details') }} />
        <tabStackStackNavigator.Screen name='SortCampaign' component={SortCampaign} options={{ headerShown: false }} />
        <tabStackStackNavigator.Screen name='Notification' component={Notification} options={{ title: strings('Notifications') }} />



    </tabStackStackNavigator.Navigator>
)
const AuthStackScreen = () => (
    <AuthStack.Navigator >
        <AuthStack.Screen name='SplashVideo' component={SplashVideo} options={{ headerShown: false }} />
        <AuthStack.Screen name='Login' component={Login} options={{ headerShown: false }} />
        <AuthStack.Screen name='Signup' component={Signup} options={{ headerShown: false }} />
        <AuthStack.Screen name='ForgotPassword' component={ForgotPassword} options={{ headerShown: false }} />
        {/* <AuthStack.Screen name='UserName' component={UserName} options={{ headerShown: false }} /> */}
    </AuthStack.Navigator>
)

const InfluencerStackScreen = ({ navigation }) => (
    <InfluencerStack.Navigator>
        <InfluencerStack.Screen name='Influencer' component={Influencer} options={{
            headerStyle: styles.navBar, title: strings('Influencer'),
            headerLeft: () => (
                <TouchableOpacity style={{ marginLeft: metrics.dimen_20 }} onPress={() => navigation.openDrawer()}>
                    <Image source={images.drawerIcon} />
                </TouchableOpacity>
            )
        }} />


    </InfluencerStack.Navigator>
)
const homeStackScreen = ({ navigation }) => (
    <HomeStack.Navigator>
        <HomeStack.Screen name='Home' component={Home} options={{
            headerStyle: styles.navBar,
            headerTitle: () => (
                <Image resizeMode='contain' style={{ flex: 1 }} source={images.headerlogo_ios} />
            ),
            headerLeft: () => (
                <TouchableOpacity style={{
                    marginLeft: metrics.dimen_20,
                    width: metrics.widthSize(150),
                    height: '100%'
                }} onPress={() => navigation.openDrawer()}>
                    <Image style={{ marginTop: Platform.OS == 'android' ? metrics.dimen_20 : 0 }}
                        source={images.drawerIcon} />
                </TouchableOpacity>
            )
        }} />
        <HomeStack.Screen name="ApplicantList" component={ApplicantList} options={{
            title: '', headerBackTitle: '', headerTitleStyle: {
                fontFamily: metrics.Lato_Bold,
                color: 'rgba(26, 30, 36, 1)',
                fontSize: metrics.text_16
            }

        }} />
    </HomeStack.Navigator>
)
const myCompaignStackScreen = ({ navigation }) => (
    <myCompaignStack.Navigator
        screenOptions={{
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
            title: '', headerBackTitle: '', headerTitleStyle: {
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
            title: strings('Details'), headerTitleStyle: {
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

        <myCompaignStack.Screen name='CampaignDetails' component={CampaignDetails} options={{ title: strings('Details') }} />

    </myCompaignStack.Navigator>


)
const webViewStackScreen = ({ navigation }) => (
    <webViewStack.Navigator>
        <webViewStack.Screen name='WebViewNavCom' component={WebViewNavCom} options={{
            headerStyle: styles.navBar,
            headerLeft: () =>
                <TouchableOpacity style={{ marginLeft: metrics.dimen_20 }} onPress={() => navigation.openDrawer()}>
                    <Image source={images.drawerIcon} />
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
                <TouchableOpacity style={{ marginLeft: metrics.dimen_20 }} onPress={() => navigation.openDrawer()}>
                    <Image source={images.drawerIcon} />
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
                <TouchableOpacity style={{ marginLeft: metrics.dimen_20 }} onPress={() => navigation.openDrawer()}>
                    <Image source={images.drawerIcon} />
                </TouchableOpacity>
            )
        }} />
    </TermsconditionStack.Navigator>
)


const SettingStackScreen = ({ navigation }) => (
    <SettingStack.Navigator>
        <SettingStack.Screen name="ChatBackup" component={ChatBackup} options={{
            title: strings('Chat_Backup'),
            headerStyle: styles.navBar,
            headerLeft: () => authData.isLogin ? (
                <TouchableOpacity style={{ marginLeft: metrics.dimen_20 }} onPress={() => navigation.openDrawer()}>
                    <Image source={images.drawerIcon} />
                </TouchableOpacity>
            ) : null
        }} />
    </SettingStack.Navigator>
)
const HelpStackScreen = ({ navigation }) => (
    <HelpStack.Navigator>
        <HelpStack.Screen name='Help' component={Help} options={{
            // headerStyle: styles.navBar,
            headerLeft: () => authData.isLogin ? (
                <TouchableOpacity style={{ marginLeft: metrics.dimen_20 }} onPress={() => navigation.openDrawer()}>
                    <Image source={images.drawerIcon} />
                </TouchableOpacity>
            ) : null
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
            headerLeft: () => authData.isLogin ? (
                <TouchableOpacity style={{ marginLeft: metrics.dimen_20 }} onPress={() => navigation.openDrawer()}>
                    <Image source={images.drawerIcon} />
                </TouchableOpacity>
            ) : null
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
            headerLeft: () => (
                <TouchableOpacity style={{ marginLeft: metrics.dimen_20 }} onPress={() => navigation.openDrawer()}>
                    <Image source={images.drawerIcon} />
                </TouchableOpacity>
            )
        }} />



    </ChatStackNavigator.Navigator>
)
const TabScreens = () => (
    <TabStack.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === 'HomeTab') {
                    iconName = images.homeTabIcon
                } else if (route.name === 'InfluencersTab') {
                    iconName = images.campaigTabIcon
                } else if (route.name === 'GiveAwayTab') {
                    iconName = images.giveAway
                } else if (route.name === 'ProfileStackScreen') {

                    iconName = userimage == null || userimage == '' ? images.avtarIcon : { uri: userimage }
                }
                if (route.name === 'ChatTab') {
                    iconName = images.chatTabIcon
                }

                if (route.name === 'ProfileStackScreen' && userimage !== null && userimage !== '') {
                    return <Image source={iconName} style={{
                        height: metrics.dimen_20, width: metrics.dimen_20, borderRadius: metrics.dimen_20 / 2,
                        overflow: "hidden",
                        borderWidth: 1,
                        borderColor: colors.app_Blue
                    }} />;
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
                    return <Image style={{ paddingTop: metrics.dimen_10 }}
                        source={iconName} style={focused ? { tintColor: colors.app_Blue } : { height: metrics.dimen_20, width: metrics.dimen_20 }} />;
                }

            },
            tabBarLabel: ({ focused, color }) => {
                let labelName;
                if (route.name === 'HomeTab') {
                    labelName = strings('Compaign')
                } else if (route.name === 'InfluencersTab') {
                    labelName = strings('Influencer')
                } else if (route.name === 'GiveAwayTab') {
                    labelName = strings('Giveaway')
                } else if (route.name === 'ProfileStackScreen') {
                    labelName = strings('Profile')
                }
                else if (route.name === 'ChatTab') {
                    labelName = strings('Chat')
                }


                return <Text style={{ marginBottom: Platform.OS == 'android' ? metrics.dimen_12 : metrics.dimen_1, marginTop: Platform.OS == 'android' ? -metrics.dimen_5 : - metrics.dimen_6, fontFamily: metrics.Lato_Regular, color: focused ? colors.app_Blue : colors.app_gray }}>
                    {labelName}
                </Text>;

                //return labelName

            },
            onTabPress: (tab) => {
                Alert.alert("Save", "Dont forget to save your weather!");

            }
        })}
        tabBarOptions={{

            activeTintColor: colors.app_Blue,
            showLabel: true,
            style: {
                backgroundColor: '#f7f7f7',
                //----------add this line------------------------//
                height: Platform.OS == 'android' ? metrics.dimen_70 : metrics.dimen_80,
                borderTopWidth: metrics.dimen_1,
                borderTopColor: '#ffffff'
            },

        }}
    >
        <TabStack.Screen name='HomeTab' component={homeStackScreen} options={{ title: '' }} />
        <TabStack.Screen name='InfluencersTab' component={InfluencerStackScreen} options={{ title: '' }} />
        <TabStack.Screen name='ChatTab' component={ChatStackScreen} options={{ title: '' }} />
        {/* <TabStack.Screen name='GiveAwayTab' component={GiveAwayStackScreen} options={{ title: '' }} /> */}
        <TabStack.Screen name='ProfileStackScreen' component={ProfileStackScreen} options={{ title: '' }}
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
            screenOptions={{ gestureEnabled: true }}
            drawerStyle={{ width: !showDrawer ? null : 280 }}



        >

            <DrawerStack.Screen name='HomeDrawer' component={tabStackScreen} />

            {/* <DrawerStack.Screen name='ProfileStackScreen' component={ProfileStackScreen} /> */}
            <DrawerStack.Screen name='myCompaignStackScreen' component={myCompaignStackScreen} />
            <DrawerStack.Screen name='SettingStackScreen' component={SettingStackScreen} />
            <DrawerStack.Screen name='webViewStackScreen' component={webViewStackScreen} />
            <DrawerStack.Screen name='privacyPolicyStackScreen' component={privacyPolicyStackScreen} />
            <DrawerStack.Screen name='TermsconditionStackScreen' component={TermsconditionStackScreen} />
            <DrawerStack.Screen name='HelpStackScreen' component={HelpStackScreen} />

        </DrawerStack.Navigator>)
}

const AppContainer = (props) => {
    userimage = props.AuthStore.userImage
    authData = props.AuthStore
    unreadConversations = props.ChatStore.unreadConversations
    // console.log('props.AuthStore:=',authData.navigation)

    if (props.AuthStore.isFirstLaunch) {
        return (
            <NavigationContainer>
                <SplashStack.Navigator>
                    <SplashStack.Screen name="splash" component={Splash} options={{ headerShown: false }} />
                </SplashStack.Navigator>
            </NavigationContainer>)
    }
    else if (props.AuthStore.isLogin) {
        return (
            <NavigationContainer>
                <DrawerScreens />
            </NavigationContainer>)
    } else
        return (
            <NavigationContainer>
                <DrawerScreens />
            </NavigationContainer>)

}


export default inject("AuthStore", "ChatStore")(observer(AppContainer))

const styles = StyleSheet.create({
    navBar: {
        shadowColor: 'transparent',
        elevation: 0,
        backgroundColor: 'white',
        flex: 1
    }
})