import React, {Component} from 'react';
import {View, Text} from 'react-native';
import TransactionSuccess from '../../../../../Assets/Images/TransactionSuccess';
import TransactionFailure from '../../../../../Assets/Images/TransactionFailure';
import FastImage from 'react-native-fast-image';
import {commonStyles} from '../../../../../SupportingFIles/Constants';
import images from '../../../../../Themes/Images';
import metrics from '../../../../../Themes/Metrics';
class TransactionStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {remarkData, paymentStatus} = this.props;
    const name =
      (remarkData && remarkData.profile.first ? remarkData.profile.first : '') +
      ' ' +
      (remarkData && remarkData.profile.last ? remarkData.profile.last : '');
    const urlPic =
      remarkData && remarkData.profile.avatarUrl
        ? remarkData.profile.avatarUrl
        : '';
    const imageUrl =
      urlPic == null || urlPic === 'NA' || urlPic === ''
        ? images.userPlaceholder
        : {uri: urlPic};
    console.log('remarkData==', remarkData);
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          marginTop: -metrics.dimen_60,
        }}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          {paymentStatus === 'success' && (
            <TransactionSuccess style={{width: 140, height: 130}} />
          )}
          {paymentStatus === 'failure' && (
            <TransactionFailure style={{width: 140, height: 130}} />
          )}
          {remarkData.isPaymentReleased == 1 ? (
            <Text
              style={{
                marginTop: 32,
                fontFamily: metrics.Lato_Bold,
                fontSize: metrics.getFontSize(18),
                color: '#3E3E46',
              }}>
              {'Payment has been released'}
            </Text>
          ) : (
            <Text
              style={{
                marginTop: 32,
                fontFamily: metrics.Lato_Bold,
                fontSize: metrics.getFontSize(18),
                color: '#3E3E46',
              }}>
              Your Payment was{' '}
              {paymentStatus === 'success' ? 'Successful' : 'Failed'}.
            </Text>
          )}
          <FastImage
            style={{
              width: metrics.dimen_60,
              height: metrics.dimen_60,
              marginTop: 43,
            }}
            source={imageUrl}
            resizeMode={FastImage.resizeMode.cover}
          />
          <Text
            style={{
              fontFamily: metrics.Lato_SemiBold,
              fontSize: metrics.getFontSize(13),
              color: '#3E3E46',
              marginTop: metrics.dimen_7,
            }}>
            {name}
          </Text>
          <Text
            style={{
              fontFamily: metrics.Lato_Bold,
              fontSize: metrics.getFontSize(12),
              color: '#3E3E46',
              marginTop: metrics.dimen_10,
              width: 170,
              textAlign: 'center',
            }}>
            {/* {`Influencer hired by you for amount $${remarkData.offerAmount}.`} */}
            {remarkData && this.getStatusText(remarkData.offerAmount)}
          </Text>
        </View>
      </View>
    );
  }
  getStatusText = (amount) => {
    const isPayment = this.props.isPayment;
    if (isPayment !== null && isPayment) {
      return `Influencer hired for $${amount}.`;
    } else {
      return `Payment sent to user for amount $${amount}.`;
    }
  };
}

export default TransactionStatus;
