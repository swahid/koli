import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { observer, inject } from 'mobx-react';
import metrics from '../../../Themes/Metrics';
import colors from '../../../Themes/Colors';
import { strings } from '../../../Locales/i18';
import Loader from '../../../SupportingFIles/Loader';
import { Button } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { showAlert, fbLogin } from '../../../SupportingFIles/Utills';
import { commonStyles } from '../../../SupportingFIles/Constants';

class Interests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_country_modal: false,
    };
    context = this;
  }

  componentWillMount() {
    this.props.MyProfileStore.getInterestList();
  }
  componentWillUnmount() {
    this.props.MyProfileStore.setUserExist(false);
    // this.props.MyProfileStore.setFollowersCount('0')
  }
  updateProfile = () => {
    this.props.MyProfileStore.setNavigation(this.props.navigation);

    this.props.MyProfileStore.updateUserProfile();
  };
  render() {
    const store = this.props.MyProfileStore;
    const { myInterests, isLoading } = store;

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <Loader loading={isLoading} />

        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <Text
            style={{
              ...styles.signUpTextStyle,
              marginHorizontal: metrics.dimen_20,
              marginTop: metrics.dimen_20,
              fontWeight: metrics.LatoRegular,
            }}>
            {strings('IntrestInfo')}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginHorizontal: metrics.dimen_20,
              marginVertical: metrics.dimen_20,
            }}>
            {store.interests.map((item) => {
              return (
                <TouchableOpacity
                  style={[
                    {
                      ...commonStyles.AppButtonStyle,
                      height: metrics.dimen_40,
                      marginRight: metrics.dimen_12,
                      marginBottom: metrics.dimen_10,
                      paddingHorizontal: metrics.dimen_15,
                      // width: metrics.dimen_70,
                      backgroundColor: myInterests.includes(item)
                        ? colors.app_Blue
                        : colors.app_light_gray,
                      shadowColor: myInterests.includes(item)
                        ? colors.app_Blue
                        : colors.app_light_gray,
                      borderColor: myInterests.includes(item)
                        ? colors.app_Blue
                        : colors.app_light_black,
                    },
                  ]}
                  onPress={() => {
                    // if(myInterests.length<5)
                    // {
                    if (myInterests.includes(item)) {
                      var filtered = myInterests.filter(function (
                        value,
                        index,
                        arr,
                      ) {
                        return value !== item;
                      });
                      store.setMyInterest(filtered);
                      store.setupdatestatus(true);
                    } else {
                      if (myInterests.length < 5) {
                        store.setMyInterest([...myInterests, item]);
                        store.setupdatestatus(true);
                      } else {
                        showAlert('', strings('you_can_select_max_interest'));
                      }
                    }

                    //   }else{

                    //  showAlert('', strings("you_can_select_max_interest"))

                    //   }
                  }}>
                  <Text
                    style={{
                      ...commonStyles.LatoSemiBold_Normal,
                      color: myInterests.includes(item)
                        ? 'white'
                        : colors.app_black,
                    }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{ height: metrics.dimen_40 }}></View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
  doFacebookLogin = async () => {
    const callback = (error, result) => {
      if (error) {
        showAlert('', JSON.stringify(error));
      } else {
        this.props.MyProfileStore.setFacebookUserName(result.name);
      }
    };
    await fbLogin(callback);
  };

  renderInterest = (item) => {
    return <Text style={{ flex: 1 }}>{item}</Text>;
  };

  showremoveAccountAlert = (type) => {
    setTimeout(() => {
      Alert.alert(
        strings('Remove_account'),
        strings('Are_you_sure'),
        [
          { text: strings('Cancel'), onPress: () => console.log('No Pressed') },
          {
            text: strings('Yes'),
            onPress: () => {
              type === 'insta'
                ? this.removeinstaccount()
                : this.removefacebookaccount();
            },
          },
        ],
        { cancelable: true },
      );
    }, 500);
  };
  removeinstaccount() {
    const store = this.props.MyProfileStore;
    store.setInstaUserName('');
    store.setUserExist(false);
    store.setFollowersCount('');
  }
  removefacebookaccount() {
    const store = this.props.MyProfileStore;

    store.setFacebookUserName('');
  }
}
export default inject('MyProfileStore', 'AuthStore')(observer(Interests));

const styles = StyleSheet.create({
  signUpTextStyle: {
    fontFamily: metrics.Lato_SemiBold,
    fontSize: metrics.text_normal,
    color: 'rgba(62,62,62,70)',
  },
  interestButtonStyle: {
    marginRight: metrics.dimen_10,
    marginBottom: metrics.dimen_10,
    paddingVertical: metrics.dimen_2,
  },
  interestTextStyle: {
    fontFamily: metrics.Lato,
    fontWeight: metrics.LatoBold,
    fontSize: metrics.text_normal,
  },
});