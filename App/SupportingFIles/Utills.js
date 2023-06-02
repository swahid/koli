import {
  Alert,
  Platform,
  Dimensions,
  Linking,
  PermissionsAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AccessToken,
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';
import {keys} from './Constants';
import {logger} from 'react-native-logs';
import {colorConsoleAfterInteractions} from 'react-native-logs/dist/transports/colorConsoleAfterInteractions';
import {showMessage} from 'react-native-flash-message';
import colors from '../Themes/Colors';
import Moment from 'moment';
import 'intl';
import 'intl/locale-data/jsonp/en-US';
import Geolocation from 'react-native-geolocation-service';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import Toast from 'react-native-simple-toast';

import Config from 'react-native-config';

const formatCurrency = new Intl.NumberFormat('en-US');
// Google Api Key for Get GeoData
export const google_api_key = 'AIzaSyA4RVR9xYibHMD6X1QNf-00BFOFmWDrbkY';

const config = {
  transport: colorConsoleAfterInteractions,
};
var log = logger.createLogger(config);

if (__DEV__) {
  log.setSeverity('debug');
} else {
  log.setSeverity('error');
}

export {log};

export var navigationObj = null;
export const showAlert = (title = '', message = '') => {
  setTimeout(() => Alert.alert(title, message, [{text: 'OK'}]), 200);
};

export const validateEmail = (text) => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
  // if(reg.test(text) === false){
  //     return false;
  // }
  // else {
  //       return true;
  // }
  return reg.test(text);
};
export const validateUrl = (text) => {
  let reg =
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
  return reg.test(text);
};
export const fnum = (x) => {
  if (isNaN(x)) {
    return x;
  } else if (x < 999) {
    return x;
  } else if (x <= 999999) {
    return Math.round(x / 1000) + 'K';
  } else if (x <= 999999999) {
    return (x / 1000000).toFixed(2) + 'M';
  } else if (x <= 9999999999) {
    return (x / 1000000).toFixed(2) + 'B';
  } else {
    return '1T+';
  }
};
export const setAccessToken = (accessToken) => {
  AsyncStorage.setItem(keys.accessToken, accessToken);
};
export const getAccessToken = async () => {
  const accessToken = await AsyncStorage.getItem(keys.accessToken);
  return accessToken;
};
export const getInfluencerSortType = async () => {
  const influencerSortType = await AsyncStorage.getItem(
    keys.influencerSortType,
  );
  return influencerSortType;
};
export const setisLogin = (isLogin) => {
  AsyncStorage.setItem(keys.isLogin, isLogin);
};
export const isUserLoggedin = async () => {
  const val = await AsyncStorage.getItem(keys.isLogin);
  return val == 'true' ? true : false;
};
export const setUserId = (userId) => {
  AsyncStorage.setItem(keys.userId, userId);
};
export const setUserData = (userData) => {
  AsyncStorage.setItem(keys.userData, userData);
};
export const getUserId = async () => {
  const userId = await AsyncStorage.getItem(keys.userId);
  return userId;
};
export const gettUserData = async () => {
  const userData = await AsyncStorage.getItem(keys.userData);
  return JSON.parse(userData);
};

export const setCampaignSearchData = (CampaignSearchData) => {
  AsyncStorage.setItem(
    'CampaignSearchData',
    JSON.stringify(CampaignSearchData),
  );
};

export const getCampaignSearchData = async () => {
  const CampaignSearchData = await AsyncStorage.getItem('CampaignSearchData');
  if (CampaignSearchData) {
    return JSON.parse(CampaignSearchData);
  } else {
    CampaignSearchData = [];
    return JSON.parse(CampaignSearchData);
  }
};
export const setChatDataFetched = (dataFetched) => {
  AsyncStorage.setItem(keys.chatDataFetched, dataFetched);
};
export const getChatDataFetched = async () => {
  const val = await AsyncStorage.getItem(keys.chatDataFetched);
  return val === 'true' ? true : false;
};

export const setInfluencerSearchData = (InfluencerSearchData) => {
  console.log('setInfluencerSearchData===1', InfluencerSearchData);
  AsyncStorage.setItem(
    'InfluencerSearchData',
    JSON.stringify(InfluencerSearchData),
  );
};

export const getInfluencerSearchData = async () => {
  const InfluencerSearchData = await AsyncStorage.getItem(
    'InfluencerSearchData',
  );
  if (InfluencerSearchData) {
    console.log('setInfluencerSearchData===2', InfluencerSearchData);

    return JSON.parse(InfluencerSearchData);
  } else {
    InfluencerSearchData = [];
    return JSON.parse(InfluencerSearchData);
  }
};

export const fbLogin = async (callback) => {
  try {
    await LoginManager.logOut();
    // const data  = await LoginManager.logInWithPermissions(["public_profile","email","user_photos"])
    const data = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);
    if (!data.isCancelled) {
      const access = await AccessToken.getCurrentAccessToken();
      console.log('access token =', access);
      const infoRequest = new GraphRequest(
        '/me?fields=name,picture.type(large),first_name,last_name,email,photos',
        null,
        callback,
      );
      // Start the graph request.
      new GraphRequestManager().addRequest(infoRequest).start();
    } else {
      console.log('fb login cancelled =', data);
    }
  } catch (error) {
    console.log('error =', JSON.stringify(error));
  }
};

// export const formatCurrency = (value, currencyCode = '') => {

//   if (isNaN(value) || !value)
//       return '0'

//   let diff = parseFloat(value) - parseInt(value)
//   let str = parseFloat(value) + ''

//   str = diff > 0 ? str.replace(/\d(?=(\d{3})+\.)/g, '$&,') : str.replace(/(.)(?=(\d{3})+$)/g, '$1,')
//   str = currencyCode + ' ' + str
//   return str.trim()
// }

export const Numberformatesunit = (num) => {
  var units = ['K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'],
    decimal;
  for (var i = units.length - 1; i >= 0; i--) {
    decimal = Math.pow(1000, i + 1);

    if (num <= -decimal || num >= decimal) {
      return +(num / decimal).toFixed(0) + units[i];
    }
  }

  return num;
};
export const NumberformatesunitUptoOneDecimal = (num) => {
  var units = ['K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'],
    decimal;
  for (var i = units.length - 1; i >= 0; i--) {
    decimal = Math.pow(1000, i + 1);

    if (num <= -decimal || num >= decimal) {
      return +(num / decimal).toFixed(0) + units[i];
    }
  }

  return num;
};
export function isIphoneXorAbove() {
  const dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 812 ||
      dimen.width === 812 ||
      dimen.height === 896 ||
      dimen.width === 896)
  );
}

export function showFlashBanner(bannerTitle, bannerMessage, backgroundColor) {
  showMessage({
    message: bannerTitle,
    description: bannerMessage,
    type: 'default',
    backgroundColor: backgroundColor ? backgroundColor : colors.app_Blue, // background color
    color: colors.white, // text color
  });
}

export function showAppUpdateAlert() {
  Alert.alert(
    'Mandatory KOLI App Update',
    'In order to continue, you must update KOLI app now. This should only take few moments.',
    [
      {
        text: 'UPDATE',
        onPress: () =>
          Linking.openURL(
            'http://play.google.com/store/apps/details?id=co.koli.android',
          ),
      },
    ],
    {cancelable: false},
  );
}
/**
 *
 * @param {*} dateformat date format
 * @param {*} date  date string
 * @param {*} language current language
 */
export const formatDate = (dateformat, date, language = 'en') => {
  try {
    Moment.locale(language);
    return date ? Moment.utc(date).local().format(dateformat) : '';
  } catch (error) {
    return '';
  }
};
export function kFormatter(num) {
  // return Math.abs(num) > 1000 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
  return Math.abs(num) > 1000
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + 'k'
    : formatCurrency.format(num);
}

export function getUserCorrentLocation() {
  Geolocation.getCurrentPosition(
    (position) => {
      const initialPosition = JSON.stringify(position);
      //this.setState({initialPosition});
      console.log('User Location: ', initialPosition);
      return position;
    },
    (error) => {
      return error;
    },
    {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
  );
}
//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
export function calculateDistance(lat1, long1, lat2, long2) {
  //radians
  lat1 = (lat1 * 2.0 * Math.PI) / 60.0 / 360.0;
  long1 = (long1 * 2.0 * Math.PI) / 60.0 / 360.0;
  lat2 = (lat2 * 2.0 * Math.PI) / 60.0 / 360.0;
  long2 = (long2 * 2.0 * Math.PI) / 60.0 / 360.0;

  // use to different earth axis length
  var a = 6378137.0; // Earth Major Axis (WGS84)
  var b = 6356752.3142; // Minor Axis
  var f = (a - b) / a; // "Flattening"
  var e = 2.0 * f - f * f; // "Eccentricity"

  var beta = a / Math.sqrt(1.0 - e * Math.sin(lat1) * Math.sin(lat1));
  var cos = Math.cos(lat1);
  var x = beta * cos * Math.cos(long1);
  var y = beta * cos * Math.sin(long1);
  var z = beta * (1 - e) * Math.sin(lat1);

  beta = a / Math.sqrt(1.0 - e * Math.sin(lat2) * Math.sin(lat2));
  cos = Math.cos(lat2);
  x -= beta * cos * Math.cos(long2);
  y -= beta * cos * Math.sin(long2);
  z -= beta * (1 - e) * Math.sin(lat2);

  return Math.sqrt(x * x + y * y + z * z) / 1000;
}

const hasLocationPermissionIOS = async () => {
  const openSetting = () => {
    Linking.openSettings().catch(() => {
      Alert.alert('Unable to open settings');
    });
  };
  const status = await Geolocation.requestAuthorization('whenInUse');

  if (status === 'granted') {
    return true;
  }

  // if (status === 'denied') {
  //   Alert.alert('Location permission denied');
  // }

  if (status === 'disabled' || status === 'denied') {
    Alert.alert(`To show influencer based on user location..`, '', [
      {text: 'Go to Settings', onPress: openSetting},
      {text: "Don't Use Location", onPress: () => {}},
    ]);
  }

  return false;
};

export const checkLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    const hasPermission = await hasLocationPermissionIOS();
    return hasPermission;
  }

  if (Platform.OS === 'android' && Platform.Version < 23) {
    return true;
  }

  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }

  if (status === PermissionsAndroid.RESULTS.DENIED) {
    showFlashBanner('Location permission denied by user.');
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    showFlashBanner('Location permission revoked by user.');
  }

  return false;
};
export function time_ago(time) {
  switch (typeof time) {
    case 'number':
      break;
    case 'string':
      time = +new Date(time);
      break;
    case 'object':
      if (time.constructor === Date) time = time.getTime();
      break;
    default:
      time = +new Date();
  }
  var time_formats = [
    [60, 'seconds', 1], // 60
    [120, '1 minute', '1 minute from now'], // 60*2
    [3600, 'minutes', 60], // 60*60, 60
    [7200, '1 hour', '1 hour from now'], // 60*60*2
    [86400, 'hours', 3600], // 60*60*24, 60*60
    [172800, 'day', 86400], // 60*60*24*2
    [604800, 'days', 86400], // 60*60*24*7, 60*60*24
    [1209600, 'days', 86400], // 60*60*24*7*4*2
    [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
    [4838400, 'month', 2419200], // 60*60*24*7*4*2
    [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
    [58060800, 'year', 29030400], // 60*60*24*7*4*12*2
    [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
    [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
    [58060800000, 'centuries', 2903040000], // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
  ];
  var seconds = (+new Date() - time) / 1000,
    token = '',
    list_choice = 1;

  if (seconds === 0) {
    return 'Just now';
  }
  if (seconds < 0) {
    seconds = Math.abs(seconds);
    token = 'from now';
    list_choice = 2;
  }
  var i = 0,
    format;
  while ((format = time_formats[i++]))
    if (seconds < format[0]) {
      if (typeof format[2] === 'string') return format[list_choice];
      else
        return Math.floor(seconds / format[2]) + ' ' + format[1] + '' + token;
    }
  return time;
}
export function check_time_seconds(time) {
  switch (typeof time) {
    case 'number':
      break;
    case 'string':
      time = +new Date(time);
      break;
    case 'object':
      if (time.constructor === Date) time = time.getTime();
      break;
    default:
      time = +new Date();
  }
  var seconds = (+new Date() - time) / 1000;

  return seconds;
}

export const convertCurrencybyCode = (currency = '') => {
  let str = '';

  switch (currency) {
    case 'USD':
      str = '$';
      return str;
    case 'EUR':
      str = '€';
      return str;
    case 'GBP':
      str = '£';
      return str;
    default:
      return str;
  }
};

export const checkArrayEquals = (arr1, arr2) => {
  // console.log("arr1",arr1)
  // console.log("arr2",arr2)

  var arrsecond = arr2.map((v) => v.toLowerCase());
  const found = arr1.some((r) => arrsecond.includes(r.toLowerCase()));
  return found;
};

export const getGeoCode = (address) => {
  let url =
    'https://maps.googleapis.com/maps/api/geocode/json?address=' +
    address +
    `&key=${google_api_key}`;
  return fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.status === 'OK') {
        return responseJson;
      }
      return null;
    })
    .catch((error) => error);
};

export const getParams = (url) => {
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
  var obj = {};
  queryString = queryString.split('#')[0];
  var arr = queryString.split('&');
  for (let index = 0; index < arr.length; index++) {
    const element = arr[index].split('=');
    obj[element[0]] = element[1];
  }
  return obj;
};

export const generateFirebaseCampaignlink = async (campaignID) => {
  const link = await dynamicLinks().buildShortLink({
    link: 'https://app.koli.ai' + '?params=' + campaignID,
    domainUriPrefix: 'https://app.koli.ai',
    android: {
      packageName: Config.PackageAndroid,
      minimumVersion: '18',
    },
    ios: {
      bundleId: Config.PackageIOS,
      appStoreId: '1458269685',
      minimumVersion: '18',
    },
  });

  console.warn('link', link);

  return link;
};
export const setFeesAndCommission = (data) => {
  AsyncStorage.setItem(keys.feesAndCommission, JSON.stringify(data));
};
export const getFeesAndCommission = async () => {
  const feesAndCommission = await AsyncStorage.getItem(keys.feesAndCommission);
  const parsedData = JSON.parse(feesAndCommission);
  //console.log('feesAndCommission:',JSON.parse(feesAndCommission))
  return parsedData;
};
export const showToast = (message) => {
  Toast.show(message);
};
