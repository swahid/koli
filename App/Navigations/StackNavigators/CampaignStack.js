import React, { ReactElement } from 'react';
import { Image, View, TouchableOpacity, StyleSheet} from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';

import UserProfile from '../../Components/Profile/Screen/UserProfile';

import MyCompaign from '../../Components/Campaign/Screen/MyCompaign'

import images from '../../Themes/Images';
import colors from '../../Themes/Colors';
import metrics from '../../Themes/Metrics';
import { strings } from '../../Locales/i18';
import CreateCampaign1 from '../../Components/CreateCampaign/CreateCampaign1'
import CreateCampaign2 from '../../Components/CreateCampaign/CreateCampaign2'
import CreateCampaign3 from '../../Components/CreateCampaign/CreateCampaign3'
import CreateCampaign4 from '../../Components/CreateCampaign/CreateCampaign4'
import CreateCampaign7 from '../../Components/CreateCampaign/CreateCampaign7'
import CreateCampaign8 from '../../Components/CreateCampaign/CreateCampaign8'
import CreateCampaign9 from '../../Components/CreateCampaign/CreateCampaign9'
import CreateCampaign10 from '../../Components/CreateCampaign/CreateCampaign10'
import CampaignAddCategory from '../../Components/CreateCampaign/CampaignAddCategory'
import CreateCampaignForm from '../../Components/CreateCampaign/CreateCampaignFrom/CreateCampaignForm'
import PurchaseCampaign from '../../Components/Campaign/Screen/PurchaseCampaign/PurchaseCampaign'
import CustomStripeCard from '../../Components/Stripe/CustomStripeCard';

import CampaignPreview from '../../Components/CreateCampaign/CampaignPreview'
import CampaignDetails from '../../Components/Campaign/Screen/CampaignDetails'
import ApplicantList from '../../Components/Campaign/Screen/ApplicantList'
import SocialProfileWebView from '../../Components/SocialProfileWebView'

import MYCampaignDetails from '../../Components/Campaign/Screen/MYCampaignDetails'
import ChatDetail from '../../Components/Chat/ChatDetail'

import AuthStore from '../../Stores/Auth/AuthStore'
import { inject, observer } from 'mobx-react';

//let authData = new AuthStore()

const myCompaignStack = createStackNavigator()
const CampaignStackScreen = (props) => {
    const authData = props.AuthStore
    return (
        <myCompaignStack.Navigator
        screenOptions={{
            gestureEnabled:true,
            // headerStyle: styles.navBar,
            headerTintColor: colors.app_Blue,
            headerTitleStyle: {
                fontFamily: metrics.Roboto_Medium,
                color: 'rgba(199, 199, 199, 1)',
                fontSize: metrics.text_16,
            },
        }}
    >
        <myCompaignStack.Screen name='MyCompaign' component={MyCompaign}   options={({ navigation, route }) => ({
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
        })} />
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
            title: strings('Details'), headerBackTitle: '', headerTitleStyle: {
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
<myCompaignStack.Screen name="PurchaseCampaign" component={PurchaseCampaign} options={{
            title: strings('Purchase_Campaign'), headerBackTitle: '', headerTitleStyle: {
                fontFamily: metrics.Lato_Bold,
                color: 'rgba(26, 30, 36, 1)',
                fontSize: metrics.text_16
            }

        }} />
        <myCompaignStack.Screen name="CustomStripeCard" component={CustomStripeCard} options={{
            title: strings('Purchase_Campaign'), headerBackTitle: '', headerTitleStyle: {
                fontFamily: metrics.Lato_Bold,
                color: 'rgba(26, 30, 36, 1)',
                fontSize: metrics.text_16
            }

        }} />
        <myCompaignStack.Screen name='CampaignDetails' component={CampaignDetails} options={{ title: strings('Details') }} />

    </myCompaignStack.Navigator>
    );

}


export default inject("AuthStore", "ChatStore")(observer(CampaignStackScreen))
// function CampaignStackScreen(authData) {
//     return (
//         <myCompaignStack.Navigator
//         screenOptions={{
//             gestureEnabled:true,
//             // headerStyle: styles.navBar,
//             headerTintColor: colors.app_Blue,
//             headerTitleStyle: {
//                 fontFamily: metrics.Roboto_Medium,
//                 color: 'rgba(199, 199, 199, 1)',
//                 fontSize: metrics.text_16,
//             },
//         }}
//     >
//         <myCompaignStack.Screen name='MyCompaign' component={MyCompaign} options={{
//             headerTitleStyle: {
//                 fontFamily: metrics.Lato_Bold,
//                 color: 'rgba(26, 30, 36, 1)',
//                 fontSize: metrics.text_16
//             },
//             title: strings('MyCampaign'), headerLeft: () => authData.isLogin ? (
//                 <TouchableOpacity style={{ marginLeft: metrics.dimen_20 }}
//                     onPress={() => navigation.openDrawer()}>
//                     <Image source={images.drawerIcon} />
//                 </TouchableOpacity>
//             ) : null,
//             headerRight: () => (
//                 <View style={{ marginRight: metrics.dimen_20, flexDirection: 'row' }}>
//                     <Image source={images.search} />
//                     <TouchableOpacity onPress={() => navigation.navigate('CreateCampaign1', { type: 'Add' })}>
//                         <Image source={images.plusIcon} style={{ marginLeft: metrics.dimen_20 }} />
//                     </TouchableOpacity>
//                 </View>
//             )
//         }} />
//         <myCompaignStack.Screen name='CreateCampaignForm' component={CreateCampaignForm} options={
//             { 
//             title: strings('Create_campaign'), 
//             headerBackTitle: null,
//             headerTitleStyle: {
//                 fontFamily: metrics.Lato_Bold,
//                 color: 'rgba(26, 30, 36, 1)',
//                 fontSize: metrics.text_16
//             },
//             headerTintColor: colors.app_black
//  }} />
//         <myCompaignStack.Screen name='CreateCampaign1' component={CreateCampaign1} options={{ headerStyle: styles.navBar, title: '1/9', headerBackTitle: null }} />
//         <myCompaignStack.Screen name='CreateCampaign2' component={CreateCampaign2} options={{ headerStyle: styles.navBar, title: '2/9', headerBackTitle: null }} />
//         <myCompaignStack.Screen name='CreateCampaign3' component={CreateCampaign3} options={{ headerStyle: styles.navBar, title: '3/9', headerBackTitle: null }} />
//         <myCompaignStack.Screen name='CreateCampaign4' component={CreateCampaign4} options={{ headerStyle: styles.navBar, title: '4/9', headerBackTitle: null }} />
//         {/* <myCompaignStack.Screen name='CreateCampaign5' component={CreateCampaign5} options={{ headerStyle: styles.navBar, title: '5/7', headerBackTitle: '' }} /> */}
//         <myCompaignStack.Screen name='CreateCampaign7' component={CreateCampaign7} options={{ headerStyle: styles.navBar, title: '6/9', headerBackTitle: null }} />
//         <myCompaignStack.Screen name='CreateCampaign10' component={CreateCampaign10} options={{ headerStyle: styles.navBar, title: '7/9', headerBackTitle: null }} />
//         <myCompaignStack.Screen name='CreateCampaign8' component={CreateCampaign8} options={{ headerStyle: styles.navBar, title: '8/9', headerBackTitle: null }} />
//         <myCompaignStack.Screen name='CreateCampaign9' component={CreateCampaign9} options={{ headerStyle: styles.navBar, title: '9/9', headerBackTitle: null }} />
//         <myCompaignStack.Screen name='CampaignPreview' component={CampaignPreview} options={{ headerStyle: styles.navBar, title: '', headerBackTitle: null }} />
//         <myCompaignStack.Screen name='CampaignAddCategory' component={CampaignAddCategory} options={{ headerStyle: styles.navBar, title: '5/9', headerBackTitle: null }} />

//         <myCompaignStack.Screen name='ApplicantList' component={ApplicantList} options={{
//             title: strings('Details'), headerBackTitle: '', headerTitleStyle: {
//                 fontFamily: metrics.Lato_Bold,
//                 color: 'rgba(26, 30, 36, 1)',
//                 fontSize: metrics.text_16
//             }

//         }} />
//         <myCompaignStack.Screen name='UserProfile' component={UserProfile} options={{
//             headerStyle: styles.navBar, title: '', headerBackTitle: '', headerTitleStyle: {
//                 fontFamily: metrics.Lato_Bold,
//                 color: 'rgba(26, 30, 36, 1)',
//                 fontSize: metrics.text_16
//             }
//         }} />
//         <myCompaignStack.Screen name='SocialProfileWebView' component={SocialProfileWebView} options={{
//             headerBackTitle: '', headerTitleStyle: {
//                 fontFamily: metrics.Lato_Bold,
//                 color: 'rgba(26, 30, 36, 1)',
//                 fontSize: metrics.text_16,
//                 textTransform: 'capitalize'
//             }, headerTintColor: colors.app_black
//         }} />
//         <myCompaignStack.Screen name='MYCampaignDetails' component={MYCampaignDetails} options={{
//             title: strings('Details'), headerTitleStyle: {
//                 fontFamily: metrics.Lato_Bold,
//                 color: 'rgba(26, 30, 36, 1)',
//                 fontSize: metrics.text_16,
//                 textTransform: 'capitalize'
//             }, headerTintColor: colors.app_black
//         }} />

//         <myCompaignStack.Screen name='ChatDetail' component={ChatDetail} options={{
//             headerStyle: styles.navBar, title: '', headerBackTitle: '',
//             headerTitleStyle: { textTransform: 'capitalize' }
//         }} />
// <myCompaignStack.Screen name="PurchaseCampaign" component={PurchaseCampaign} options={{
//             title: strings('Purchase_Campaign'), headerBackTitle: '', headerTitleStyle: {
//                 fontFamily: metrics.Lato_Bold,
//                 color: 'rgba(26, 30, 36, 1)',
//                 fontSize: metrics.text_16
//             }

//         }} />
//         <myCompaignStack.Screen name="CustomStripeCard" component={CustomStripeCard} options={{
//             title: strings('Purchase_Campaign'), headerBackTitle: '', headerTitleStyle: {
//                 fontFamily: metrics.Lato_Bold,
//                 color: 'rgba(26, 30, 36, 1)',
//                 fontSize: metrics.text_16
//             }

//         }} />
//         <myCompaignStack.Screen name='CampaignDetails' component={CampaignDetails} options={{ title: strings('Details') }} />

//     </myCompaignStack.Navigator>
//     );
//   }

// function myCompaignStackScreen(): ReactElement {
//     return (
//         <myCompaignStack.Navigator
//         screenOptions={{
//             gestureEnabled:true,
//             // headerStyle: styles.navBar,
//             headerTintColor: colors.app_Blue,
//             headerTitleStyle: {
//                 fontFamily: metrics.Roboto_Medium,
//                 color: 'rgba(199, 199, 199, 1)',
//                 fontSize: metrics.text_16,
//             },
//         }}
//     >
//         <myCompaignStack.Screen name='MyCompaign' component={MyCompaign} options={{
//             headerTitleStyle: {
//                 fontFamily: metrics.Lato_Bold,
//                 color: 'rgba(26, 30, 36, 1)',
//                 fontSize: metrics.text_16
//             },
//             title: strings('MyCampaign'), headerLeft: () => authData.isLogin ? (
//                 <TouchableOpacity style={{ marginLeft: metrics.dimen_20 }}
//                     onPress={() => navigation.openDrawer()}>
//                     <Image source={images.drawerIcon} />
//                 </TouchableOpacity>
//             ) : null,
//             headerRight: () => (
//                 <View style={{ marginRight: metrics.dimen_20, flexDirection: 'row' }}>
//                     <Image source={images.search} />
//                     <TouchableOpacity onPress={() => navigation.navigate('CreateCampaign1', { type: 'Add' })}>
//                         <Image source={images.plusIcon} style={{ marginLeft: metrics.dimen_20 }} />
//                     </TouchableOpacity>
//                 </View>
//             )
//         }} />
//         <myCompaignStack.Screen name='CreateCampaignForm' component={CreateCampaignForm} options={
//             { 
//             title: strings('Create_campaign'), 
//             headerBackTitle: null,
//             headerTitleStyle: {
//                 fontFamily: metrics.Lato_Bold,
//                 color: 'rgba(26, 30, 36, 1)',
//                 fontSize: metrics.text_16
//             },
//             headerTintColor: colors.app_black
//  }} />
//         <myCompaignStack.Screen name='CreateCampaign1' component={CreateCampaign1} options={{ headerStyle: styles.navBar, title: '1/9', headerBackTitle: null }} />
//         <myCompaignStack.Screen name='CreateCampaign2' component={CreateCampaign2} options={{ headerStyle: styles.navBar, title: '2/9', headerBackTitle: null }} />
//         <myCompaignStack.Screen name='CreateCampaign3' component={CreateCampaign3} options={{ headerStyle: styles.navBar, title: '3/9', headerBackTitle: null }} />
//         <myCompaignStack.Screen name='CreateCampaign4' component={CreateCampaign4} options={{ headerStyle: styles.navBar, title: '4/9', headerBackTitle: null }} />
//         {/* <myCompaignStack.Screen name='CreateCampaign5' component={CreateCampaign5} options={{ headerStyle: styles.navBar, title: '5/7', headerBackTitle: '' }} /> */}
//         <myCompaignStack.Screen name='CreateCampaign7' component={CreateCampaign7} options={{ headerStyle: styles.navBar, title: '6/9', headerBackTitle: null }} />
//         <myCompaignStack.Screen name='CreateCampaign10' component={CreateCampaign10} options={{ headerStyle: styles.navBar, title: '7/9', headerBackTitle: null }} />
//         <myCompaignStack.Screen name='CreateCampaign8' component={CreateCampaign8} options={{ headerStyle: styles.navBar, title: '8/9', headerBackTitle: null }} />
//         <myCompaignStack.Screen name='CreateCampaign9' component={CreateCampaign9} options={{ headerStyle: styles.navBar, title: '9/9', headerBackTitle: null }} />
//         <myCompaignStack.Screen name='CampaignPreview' component={CampaignPreview} options={{ headerStyle: styles.navBar, title: '', headerBackTitle: null }} />
//         <myCompaignStack.Screen name='CampaignAddCategory' component={CampaignAddCategory} options={{ headerStyle: styles.navBar, title: '5/9', headerBackTitle: null }} />

//         <myCompaignStack.Screen name='ApplicantList' component={ApplicantList} options={{
//             title: strings('Details'), headerBackTitle: '', headerTitleStyle: {
//                 fontFamily: metrics.Lato_Bold,
//                 color: 'rgba(26, 30, 36, 1)',
//                 fontSize: metrics.text_16
//             }

//         }} />
//         <myCompaignStack.Screen name='UserProfile' component={UserProfile} options={{
//             headerStyle: styles.navBar, title: '', headerBackTitle: '', headerTitleStyle: {
//                 fontFamily: metrics.Lato_Bold,
//                 color: 'rgba(26, 30, 36, 1)',
//                 fontSize: metrics.text_16
//             }
//         }} />
//         <myCompaignStack.Screen name='SocialProfileWebView' component={SocialProfileWebView} options={{
//             headerBackTitle: '', headerTitleStyle: {
//                 fontFamily: metrics.Lato_Bold,
//                 color: 'rgba(26, 30, 36, 1)',
//                 fontSize: metrics.text_16,
//                 textTransform: 'capitalize'
//             }, headerTintColor: colors.app_black
//         }} />
//         <myCompaignStack.Screen name='MYCampaignDetails' component={MYCampaignDetails} options={{
//             title: strings('Details'), headerTitleStyle: {
//                 fontFamily: metrics.Lato_Bold,
//                 color: 'rgba(26, 30, 36, 1)',
//                 fontSize: metrics.text_16,
//                 textTransform: 'capitalize'
//             }, headerTintColor: colors.app_black
//         }} />

//         <myCompaignStack.Screen name='ChatDetail' component={ChatDetail} options={{
//             headerStyle: styles.navBar, title: '', headerBackTitle: '',
//             headerTitleStyle: { textTransform: 'capitalize' }
//         }} />
// <myCompaignStack.Screen name="PurchaseCampaign" component={PurchaseCampaign} options={{
//             title: strings('Purchase_Campaign'), headerBackTitle: '', headerTitleStyle: {
//                 fontFamily: metrics.Lato_Bold,
//                 color: 'rgba(26, 30, 36, 1)',
//                 fontSize: metrics.text_16
//             }

//         }} />
//         <myCompaignStack.Screen name="CustomStripeCard" component={CustomStripeCard} options={{
//             title: strings('Purchase_Campaign'), headerBackTitle: '', headerTitleStyle: {
//                 fontFamily: metrics.Lato_Bold,
//                 color: 'rgba(26, 30, 36, 1)',
//                 fontSize: metrics.text_16
//             }

//         }} />
//         <myCompaignStack.Screen name='CampaignDetails' component={CampaignDetails} options={{ title: strings('Details') }} />

//     </myCompaignStack.Navigator>
//     );
//   }

//     export default CampaignStackScreen;
//   export default inject('AuthStore')(observer(myCompaignStackScreen))

const styles = StyleSheet.create({
    navBar: {
        shadowColor: 'transparent',
        elevation: 0,
        backgroundColor: 'white',
        flex: 1
    }
})