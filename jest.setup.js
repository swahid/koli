jest.setTimeout(10000); // in milliseconds
jest.useFakeTimers();

jest.mock('react-native-geolocation-service', () => ({
    requestAuthorization: jest.fn(),
    getCurrentPosition: jest.fn()
  }));
  
/* eslint-disable no-undef */
jest.mock('@react-native-firebase/app', () => ({
    messaging: jest.fn(() => ({
      hasPermission: jest.fn(() => Promise.resolve(true)),
      subscribeToTopic: jest.fn(),
      unsubscribeFromTopic: jest.fn(),
      requestPermission: jest.fn(() => Promise.resolve(true)),
      getToken: jest.fn(() => Promise.resolve('myMockToken')),
    })),
    notifications: jest.fn(() => ({
      onNotification: jest.fn(),
      onNotificationDisplayed: jest.fn(),
    })),
    analytics: jest.fn(() => ({
      logEvent: jest.fn(),
      setUserProperties: jest.fn(),
      setUserId: jest.fn(),
      setCurrentScreen: jest.fn(),
    })),
  }));
  
jest.mock("react-native/Libraries/EventEmitter/NativeEventEmitter");

jest.mock('react-native-simple-toast', () => ({
    SHORT: jest.fn(),
}));

import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
});

// As of react-native@0.64.X file has moved
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('react-native-device-info', () => {
    return {
        getVersion: () => 4,
        getBuildNumber: () => 1689
    }
})

/**
 * https://spin.atomicobject.com/2021/02/24/react-navigation-5-unit-testing-components/
 */
jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      dispatch: jest.fn(),
    }),
  };
});

// jest.mock("react-native", () => {
//   const React = jest.requireActual("react");
//   const actual = jest.requireActual("react-native");
//   const View = actual.View;
//   function MockedFlatList(props) {
//       const items = props.data.map((item, index) => {
//           const key = props.keyExtractor(item, index);
//           return (
//               <View key={key}>
//                   {props.renderItem({item, index})}
//               </View>
//           );
//       });
//       return (
//           <View>
//               {items}
//           </View>
//       );
//   }
//   Object.defineProperty(actual, "FlatList", {
//       get: () => MockedFlatList,
//   });
//   return actual;
// });

// jest.mock("react-native-raw-bottom-sheet");

// jest.mock('react-native/Libraries/LogBox/LogBox');

import { Platform } from 'react-native';

jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'android', // or 'ios'
  select: () => null
}));

jest.mock('@react-native-community/cookies', () => {
  return {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    openURL: jest.fn(),
    canOpenURL: jest.fn(),
    getInitialURL: jest.fn(),
  }
})

jest.mock('@react-native-community/viewpager', () => {
  const RealComponent = jest.requireActual('@react-native-community/viewpager');
  const React = require('react');

  return class ViewPager extends RealComponent {
    index = 0;

    setPage = (page) => {
      this.index = Math.max(
        0,
        Math.min(page, React.Children.count(this.props.children)),
      );
    };

  };
});

