import React, { Component } from 'react';
import { View, Text, TouchableOpacity,Image } from 'react-native';
import { ProgressBar, Button } from 'react-native-paper';
import metrics from '../../Themes/Metrics';
import colors from '../../Themes/Colors';
import { commonStyles } from '../../SupportingFIles/Constants';
import { strings } from '../../Locales/i18';
import { observer, inject } from 'mobx-react';
import images from '../../Themes/Images';


class CreateCampaign5 extends Component {
  constructor(props) {
    super(props);

  }

  componentDidMount() {
    this.props.navigation.setOptions({ 
       
      headerLeft: () => (
        <TouchableOpacity style={{...commonStyles.backButtonContainercampaign}}
            onPress={()=>this.props.navigation.goBack()}
        >
            <Image style={{tintColor:colors.app_Blue}} source = {images.backImage} />
        </TouchableOpacity>
      ),
    }
      )
    this.props.navigation.addListener('focus', () => {
      this.resetStoreData()
    });
  }

  resetStoreData() {
    const store = this.props.CreateCampaignStore
    store.setCampaignData({ productSwipeLink: '' })
  }

  render() {
    const { campainData, validationError } = this.props.CreateCampaignStore
    return (
      <View style={{ backgroundColor: 'white', flex: 1 }}>
        <View style={{ marginHorizontal: metrics.dimen_27, justifyContent: 'space-between', flex: 1 }}>
          <View>
            <ProgressBar style={{ ...commonStyles.progressBarStyle }} progress={0.55} color={'rgba(22, 88, 211, 1)'} />
            <Text style={{ ...commonStyles.LatoBold_24, marginTop: metrics.dimen_28 }}>{strings('Shipping_Product')}</Text>
            <View style={{ marginTop: metrics.dimen_28, flexDirection: 'row', justifyContent: 'flex-start' }}>
              <TouchableOpacity style={{
                ...commonStyles.AppButtonStyle,
                height: metrics.dimen_50,
                width: metrics.dimen_100,
                marginRight: metrics.dimen_12,
                backgroundColor: campainData.shipping == 'Yes' ? colors.app_Blue : colors.app_light_gray,
                shadowColor: campainData.shipping == 'Yes' ? colors.app_Blue : colors.app_light_gray,
                borderColor: campainData.shipping == 'Yes' ? colors.app_Blue : colors.app_light_black
              }}
                onPress={() => this.onButtonClick('Yes')}
              >
                <Text style={{ ...commonStyles.LatoSemiBold_Normal, color: campainData.shipping == "Yes" ? 'white' : colors.app_black }}>{strings('Yes')}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{
                ...commonStyles.AppButtonStyle,
                height: metrics.dimen_50,
                width: metrics.dimen_100,
                marginRight: metrics.dimen_12,
                backgroundColor: campainData.shipping == 'No' ? colors.app_Blue : colors.app_light_gray,
                shadowColor: campainData.shipping == 'No' ? colors.app_Blue : colors.app_light_gray,
                borderColor: campainData.shipping == 'No' ? colors.app_Blue : colors.app_light_black
              }}
                onPress={() => this.onButtonClick('No')}
              >
                <Text style={{ ...commonStyles.LatoSemiBold_Normal, color: campainData.shipping == "No" ? 'white' : colors.app_black }}>{strings('No')}</Text>
              </TouchableOpacity>


            </View>
            {validationError.shippingError ? <Text style={{ ...commonStyles.errorTextStyle }}>{validationError.shippingError}</Text> : null}
          </View>
          <Button style={{ ...commonStyles.NextButtonStyle }} labelStyle={{ ...commonStyles.LatoBold_14, color: 'white' }} onPress={() => {
            if (this.props.CreateCampaignStore.campainData.shipping.length == 0) {
              this.props.CreateCampaignStore.setValidationData({ shippingError: strings('Select_One_Option') })
            } else {
              this.props.navigation.navigate('CreateCampaign7')
            }
          }
          }>
            {strings('Next')}
          </Button>
        </View>
      </View>
    );
  }
  onButtonClick = (shipping) => {
    this.props.CreateCampaignStore.setCampaignData({ shipping: shipping })
    this.props.CreateCampaignStore.deleteValidationError('shippingError')

  }
}
export default inject("CreateCampaignStore")(observer(CreateCampaign5))

