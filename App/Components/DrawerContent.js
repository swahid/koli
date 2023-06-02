import React from 'react';
import { observer, inject } from 'mobx-react';
import {
    View,
    StyleSheet,
    Image,
    Text,
    TouchableOpacity,
    Alert,
    Platform,
    StatusBar,
} from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Avatar, Caption, Drawer } from 'react-native-paper';
import metrics from '../Themes/Metrics';
import colors from '../Themes/Colors';
import images from '../Themes/Images';
import { strings } from '../Locales/i18';
import { setisLogin, setUserData, setUserId } from '../SupportingFIles/Utills';
import { webPageUrl } from '../SupportingFIles/Constants';
import DeviceInfo from 'react-native-device-info';

export const DrawerContent = inject(
    'AuthStore',
    'CompaignsStore',
    'SettingsStore',
)(
    observer((props) => {
        const {
            firstName,
            lastName,
            userImage,
            userName,
            isLogin,
            selectedMenuItem,
        } = props.AuthStore;
        const imageUrl =
            userImage == null || userImage === '' || userImage === 'NA'
                ? images.userPlaceholder
                : { uri: userImage };
        var userNamenew = userName.replace('@', '');
        const { myApplicationsList } = props.CompaignsStore;

        return (
            <View style={{ flex: 1 }}>
                {/* <StatusBar backgroundColor='red' barStyle="dark-content"/> */}

                <DrawerContentScrollView {...props}>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity
                            style={{ ...styles.userInfo, alignItems: 'center' }}
                            onPress={() => {
                                isLogin
                                    ? props.navigation.navigate('ProfileStackScreen')
                                    : props.navigation.navigate('AuthStack');
                            }}>
                            <Avatar.Image
                                source={imageUrl}
                                size={70}
                                style={{
                                    overflow: 'hidden',
                                    borderWidth: 0,
                                    borderColor: colors.app_Blue,
                                }}
                            />
                            <View
                                style={{
                                    paddingLeft: metrics.dimen_15,
                                    justifyContent: 'space-between',
                                }}>
                                <Text
                                    numberOfLines={2}
                                    style={{
                                        ...styles.menuTextStyle,
                                        textTransform: 'capitalize',
                                        width: metrics.dimen_120,
                                    }}>
                                    {isLogin ? firstName + ' ' + lastName : strings('Guest')}
                                </Text>
                                {isLogin && (
                                    <Caption style={{ color: 'black' }}>@{userNamenew}</Caption>
                                )}
                                {!isLogin && (
                                    <Text
                                        style={{
                                            ...styles.menuTextStyle,
                                            textTransform: 'uppercase',
                                            color: colors.app_Blue,
                                            marginTop: 2,
                                            fontSize: metrics.dimen_12,
                                        }}>
                                        {strings('Login')}
                                    </Text>
                                )}
                            </View>
                            <Image
                                source={images.rightArrowIcon}
                                style={{
                                    marginLeft: metrics.dimen_50,
                                    tintColor: 'lightgray',
                                    marginRight: metrics.dimen_10,
                                }}
                            />
                        </TouchableOpacity>
                        <Drawer.Section style={styles.drawerSection}>
                            <DrawerItem
                                focused={selectedMenuItem === 0 ? true : false}
                                activeBackgroundColor={colors.menuActiveColor}
                                icon={() =>
                                    renderDrawerImage(
                                        images.home,
                                        selectedMenuItem === 0 ? true : false,
                                    )
                                }
                                label={() =>
                                    renderLabel(
                                        strings('Home'),
                                        selectedMenuItem === 0 ? true : false,
                                    )
                                }
                                onPress={() => {
                                    props.navigation.navigate('Home');
                                    props.AuthStore.setSelectedMenuItem(0);
                                }}
                            />
                            <DrawerItem
                                focused={selectedMenuItem === 1 ? true : false}
                                activeBackgroundColor={colors.menuActiveColor}
                                icon={() =>
                                    renderDrawerImage(
                                        images.myCompaign,
                                        selectedMenuItem === 1 ? true : false,
                                    )
                                }
                                label={() =>
                                    renderLabel(
                                        strings('MyCampaign'),
                                        selectedMenuItem === 1 ? true : false,
                                    )
                                }
                                onPress={() => {
                                    // props.AuthStore.setSelectedMenuItem(isLogin ? 0 : 0)
                                    props.AuthStore.setSelectedMenuItem(0);
                                    // selectedMenuItem=isLogin ? 1 : 0
                                    isLogin
                                        ? props.navigation.navigate('MyCompaign', {
                                            screen: 'MyCompaign',
                                        })
                                        : props.navigation.navigate('AuthStack');
                                }}
                            />
                            <DrawerItem
                                focused={selectedMenuItem === 2 ? true : false}
                                activeBackgroundColor={colors.menuActiveColor}
                                icon={() =>
                                    renderDrawerImage(
                                        images.myApplications,
                                        selectedMenuItem === 2 ? true : false,
                                    )
                                }
                                label={() =>
                                    myApplicationsList.length > 0
                                        ? renderLabelMyApplications(
                                            strings('My_Applications'),
                                            myApplicationsList,
                                            selectedMenuItem === 2 ? true : false,
                                        )
                                        : renderLabel(
                                            strings('My_Applications'),
                                            selectedMenuItem === 2 ? true : false,
                                        )
                                }
                                onPress={() => {
                                    props.AuthStore.setSelectedMenuItem(isLogin ? 2 : 0);
                                    // selectedMenuItem=isLogin ? 2 : 0
                                    isLogin
                                        ? props.navigation.navigate('myApplicationsStackScreen', {
                                            screen: 'MyApplications',
                                            params: { isFromApplications: true },
                                        })
                                        : props.navigation.navigate('AuthStack');
                                }}
                            />
                            {/* <DrawerItem
                            icon = {() => <Image source = {images.myFavorite}/>}
                            label={()=>renderLabel(strings('MyFavorite'))}
                            // onPress={()=>props.navigation.navigate('MyCompaignTab')}
                         /> */}

                            <DrawerItem
                                focused={selectedMenuItem === 3 ? true : false}
                                activeBackgroundColor={colors.menuActiveColor}
                                icon={() =>
                                    renderDrawerImage(
                                        images.aboutKoli,
                                        selectedMenuItem === 3 ? true : false,
                                    )
                                }
                                label={() =>
                                    renderLabel(
                                        strings('AboutKoli'),
                                        selectedMenuItem === 3 ? true : false,
                                    )
                                }
                                onPress={() => {
                                    //selectedMenuItem=isLogin ? 3 : 0
                                    // props.AuthStore.setSelectedMenuItem(isLogin ? 3 : 0)
                                    props.AuthStore.setSelectedMenuItem(3);
                                    props.navigation.navigate('webViewStackScreen', {
                                        screen: 'WebViewNavCom',
                                        params: { From: 'about', url: webPageUrl.aboutKoli },
                                    });
                                }}
                            />
                            <DrawerItem
                                focused={selectedMenuItem === 4 ? true : false}
                                activeBackgroundColor={colors.menuActiveColor}
                                icon={() =>
                                    renderDrawerImage(
                                        images.privacyPolicy,
                                        selectedMenuItem === 4 ? true : false,
                                    )
                                }
                                label={() =>
                                    renderLabel(
                                        strings('PrivacyPolicy'),
                                        selectedMenuItem === 4 ? true : false,
                                    )
                                }
                                onPress={() => {
                                    //selectedMenuItem=isLogin ? 4 : 0
                                    //props.AuthStore.setSelectedMenuItem(isLogin ? 4 : 0)
                                    props.AuthStore.setSelectedMenuItem(4);
                                    props.navigation.navigate('privacyPolicyStackScreen', {
                                        screen: 'PrivacyPolicy',
                                        params: { From: 'Privacy', url: webPageUrl.privacyPolicy },
                                    });
                                }}
                            />
                            <DrawerItem
                                focused={selectedMenuItem === 5 ? true : false}
                                activeBackgroundColor={colors.menuActiveColor}
                                icon={() =>
                                    renderDrawerImage(
                                        images.termsCondition,
                                        selectedMenuItem === 5 ? true : false,
                                    )
                                }
                                label={() =>
                                    renderLabel(
                                        strings('TermsConditions'),
                                        selectedMenuItem === 5 ? true : false,
                                    )
                                }
                                onPress={() => {
                                    //props.AuthStore.setSelectedMenuItem(isLogin ? 5 : 0)
                                    props.AuthStore.setSelectedMenuItem(5);
                                    //selectedMenuItem=isLogin ? 5 : 0
                                    props.navigation.navigate('TermsconditionStackScreen', {
                                        screen: 'Termscondition',
                                        params: {
                                            From: 'TermsCondition',
                                            url: webPageUrl.termsConditions,
                                        },
                                    });
                                }}
                            />
                            <DrawerItem
                                focused={selectedMenuItem === 6 ? true : false}
                                activeBackgroundColor={colors.menuActiveColor}
                                icon={() =>
                                    renderDrawerImage(
                                        images.faq,
                                        selectedMenuItem === 6 ? true : false,
                                    )
                                }
                                label={() =>
                                    renderLabel(
                                        strings('Faqs'),
                                        selectedMenuItem === 6 ? true : false,
                                    )
                                }
                                onPress={() => {
                                    //props.AuthStore.setSelectedMenuItem(isLogin ? 6 : 0)
                                    props.AuthStore.setSelectedMenuItem(6);
                                    // selectedMenuItem=isLogin ? 6 : 0
                                    props.navigation.navigate('webViewStackScreen', {
                                        screen: 'WebViewNavCom',
                                        params: { From: 'FAQ', url: webPageUrl.faq },
                                    });
                                }}
                            />
                            <DrawerItem
                                focused={selectedMenuItem === 7 ? true : false}
                                activeBackgroundColor={colors.menuActiveColor}
                                icon={() =>
                                    renderDrawerImage(
                                        images.help,
                                        selectedMenuItem === 7 ? true : false,
                                    )
                                }
                                label={() =>
                                    renderLabel(
                                        strings('Help'),
                                        selectedMenuItem === 7 ? true : false,
                                    )
                                }
                                onPress={() => {
                                    //props.AuthStore.setSelectedMenuItem(isLogin ? 7 : 0)
                                    props.AuthStore.setSelectedMenuItem(7);
                                    //selectedMenuItem=isLogin ? 7 : 0
                                    isLogin
                                        ? props.navigation.navigate('HelpStackScreen')
                                        : props.navigation.navigate('AuthStack');
                                }}
                            />
                            <DrawerItem
                                focused={selectedMenuItem === 8 ? true : false}
                                activeBackgroundColor={colors.menuActiveColor}
                                icon={() =>
                                    renderDrawerImage(
                                        images.setting,
                                        selectedMenuItem === 8 ? true : false,
                                    )
                                }
                                label={() =>
                                    renderLabel(
                                        strings('Setting'),
                                        selectedMenuItem === 8 ? true : false,
                                    )
                                }
                                onPress={() => {
                                    //props.AuthStore.setSelectedMenuItem(isLogin ? 8 : 0)
                                    props.AuthStore.setSelectedMenuItem(8);
                                    //selectedMenuItem=isLogin ? 8 : 0
                                    isLogin
                                        ? props.navigation.navigate('SettingStackScreen')
                                        : props.navigation.navigate('AuthStack');
                                }}

                            // onPress={()=>props.navigation.navigate('SettingStackScreen')}
                            />
                            {isLogin && (
                                <DrawerItem
                                    activeBackgroundColor={colors.menuActiveColor}
                                    icon={() => renderDrawerImage(images.logout)}
                                    label={() => renderLabel(strings('Logout'))}
                                    onPress={() => {
                                        Alert.alert(
                                            strings('Logout'),
                                            strings('AreYouSureLogout'),
                                            [
                                                {
                                                    text: strings('No'),
                                                    onPress: () => console.log('No Pressed'),
                                                },
                                                {
                                                    text: strings('Yes'),
                                                    onPress: () => {
                                                        props.AuthStore.dologout();

                                                        setisLogin('false');
                                                        //props.AuthStore.setSelectedMenuItem(isLogin ? 0 : 0)
                                                        props.AuthStore.setSelectedMenuItem(0);
                                                        props.AuthStore.setIsLogin(false);
                                                        props.AuthStore.setUserImage('');
                                                        setUserData('');
                                                        setUserId('');
                                                        props.navigation.navigate('AuthStack');
                                                        props.SettingsStore.setAccountDetailsArray(null);
                                                        props.SettingsStore.setAccountDetails(null);
                                                    },
                                                },
                                            ],
                                            { cancelable: true },
                                        );
                                    }}
                                />
                            )}
                        </Drawer.Section>
                    </View>
                </DrawerContentScrollView>
                <Drawer.Section style={styles.bottomDrawerSection}>
                    <Text
                        style={{
                            alignSelf: 'center',
                            color: 'rgba(54,54,54,1)',
                            fontSize: metrics.text_medium,
                            fontWeight: metrics.LatoRegular,
                            fontFamily: metrics.Lato,
                        }}>
                        {strings('version_code') +
                            ' ' +
                            DeviceInfo.getVersion() +
                            ' ( ' +
                            DeviceInfo.getBuildNumber() +
                            ' )'}
                    </Text>
                </Drawer.Section>
            </View>
        );
    }),
);

const renderDrawerImage = (image, isFocused) => {
    return (
        <Image
            source={image}
            style={[
                styles.menuItemImage,
                { tintColor: isFocused ? colors.app_Blue : colors.drawerIconTint },
            ]}
        />
    );
};
const renderLabel = (name, isFocused) => {
    return (
        <Text
            style={[
                styles.menuTextStyle,
                {
                    color: isFocused ? colors.app_Blue : 'rgba(62,62,20,1)',
                    marginLeft: -10,
                },
            ]}>
            {name}
        </Text>
    );
};
const renderLabelMyApplications = (name, myApplicationsList, isFocused) => {
    const offerStatusObject = myApplicationsList.filter(
        (el) => el.offerStatus === 1,
    );
    return (
        <View style={styles.viewLabelWithCount}>
            <Text
                style={[
                    styles.menuTextStyle,
                    {
                        color: isFocused ? colors.app_Blue : 'rgba(62,62,20,1)',
                        marginLeft: -10,
                    },
                ]}>
                {name}
            </Text>
            {offerStatusObject.length > 0 && (
                <View style={styles.viewCount}>
                    <Text style={styles.textCount}>{offerStatusObject.length}</Text>
                </View>
            )}
        </View>
    );
};
const styles = StyleSheet.create({
    menuItemImage: {
        width: metrics.widthSize(60),
        height: metrics.widthSize(60),
        tintColor: colors.drawerIconTint,
        marginLeft: metrics.dimen_30,
    },
    userInfo: {
        paddingLeft: metrics.dimen_20,
        flexDirection: 'row',
        backgroundColor: 'rgba(241,244,252,1)',
        paddingVertical: metrics.dimen_20,
    },
    drawerSection: {
        marginTop: metrics.dimen_15,
        marginLeft: -metrics.dimen_10,
        marginRight: -metrics.dimen_10,
    },
    bottomDrawerSection: {
        marginBottom: Platform.OS == 'android' ? 0 : metrics.dimen_15,
        marginLeft: metrics.dimen_20,
    },
    menuTextStyle: {
        fontFamily: metrics.Lato_Bold,
        fontSize: metrics.text_16,
        color: 'rgba(62,62,20,2)',
    },
    viewLabelWithCount: {
        flexDirection: 'row',
    },
    viewCount: {
        borderRadius: metrics.dimen_10,
        height: metrics.dimen_20,
        backgroundColor: 'red',
        marginLeft: metrics.dimen_20,
        paddingHorizontal: metrics.dimen_6,
        justifyContent: 'center',
    },
    textCount: {
        fontFamily: metrics.Lato_Regular,
        fontSize: metrics.text_13,
        color: colors.white,
    },
});