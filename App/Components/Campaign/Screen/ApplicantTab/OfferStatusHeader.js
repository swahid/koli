import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import colors from '../../../../Themes/Colors';
import { strings } from '../../../../Locales/i18';
import images from '../../../../Themes/Images';
import metrics from '../../../../Themes/Metrics';

const formatCurrency = new Intl.NumberFormat('en-US')
class OfferStatusHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
      const item = this.props.item
      var offerIcon = images.PendingOffer
      var textOffer = strings('Pending_offer_for')
      var styleOfferView = [styles.viewOfferStatus, ]
      if (item.offerStatus === 2) {
        offerIcon = images.jobAwarded
        textOffer = strings('Accepted_offer_for')
        styleOfferView = [styles.viewOfferStatus, ]
      }
      else if (item.offerStatus === 3) {
        offerIcon = images.RejectedOffer
        textOffer = strings('Rejected_offer_for')
        styleOfferView = [styles.viewOfferStatus, ]
      }
      const name = (item.profile.first ? item.profile.first : '') + " " + (item.profile.last ? item.profile.last : '')
  
    return (
      <View>
        {item.offerStatus > 0 &&
        <View style={{flexDirection:'column'}}>
          <View style={styleOfferView}>
            <Image source={offerIcon} style={styles.iconOffer} />
          
            {item.isPaymentReleased === 1?<Text style={styles.textOfferStatus}>{strings("Payment_Released")}</Text>:<Text style={styles.textOfferStatus}>{`${name} has ${textOffer} $${formatCurrency.format(item.offerAmount)}`}</Text>}
          </View>
          <View
          style={styles.borderBottomLine}
        />
          </View>}
      </View>
    );
  }
}

export default OfferStatusHeader;
const styles = StyleSheet.create({
    viewOfferStatus: {
       
        borderTopLeftRadius: metrics.dimen_5,
        borderTopRightRadius: metrics.dimen_5,
        height: metrics.dimen_28,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
      },
      textOfferStatus: {
        fontFamily: metrics.Lato_Italic,
        fontSize: metrics.text_11,
        color: "#3E3E46"
      },
      iconOffer: {
        marginRight: metrics.dimen_6,
        width: metrics.dimen_14,
        height: metrics.dimen_14,
        tintColor:"#3E3E46"
       
      },
      borderBottomLine: {
        backgroundColor: '#D5DBE6',
        height: 0.5,
       marginHorizontal:metrics.dimen_15,
       marginVertical:metrics.dimen_2
      },
})