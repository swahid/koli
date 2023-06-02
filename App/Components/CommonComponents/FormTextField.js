import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { strings } from '../../Locales/i18';
import metrics from '../../Themes/Metrics';
import colors from '../../Themes/Colors';
class FormTextField extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
      const {title, placeholder, onChange, isSubmit, fieldData, errorText, styleTitle, fieldKeyboardType } = this.props
    return (
      <View >
         {/* Account type */}
         <Text style={[styles.textFieldTitle, styleTitle]}>{title}
                            <Text style={{ color: colors.app_RedColor }}> *</Text>
                            </Text>
                            <View style={styles.campaignViewStyle}>
                                <TextInput style={styles.inputTextFieldStyle}
                                    placeholder={placeholder}
                                   // maxLength={30}
                                   keyboardType={fieldKeyboardType !== undefined ? fieldKeyboardType : 'default'}
                                    placeholderTextColor={colors.bankInfoTextPlacholder}
                                    value={this.state.bankName}
                                    onChangeText={(text) => {
                                        onChange(text)
                                    }}
                                />
                               

                            </View>
                            {isSubmit && fieldData === '' &&
                                    <Text style={styles.errorTextStyle}>{errorText}</Text>}
      </View>
    );
  }
}
const styles = StyleSheet.create({
   
    textFieldTitle: {
        marginTop: metrics.aspectRatioHeight(90), 
        fontFamily: metrics.Lato_SemiBold,
        fontSize: metrics.getFontSize(14),
        color: colors.bankInfoListValue,
        marginHorizontal: metrics.dimen_27,

   },
   inputTextFieldStyle:{
    fontFamily: metrics.Lato_SemiBold,
    fontSize: metrics.getFontSize(14),
    color: colors.bankInfoListValue,
    //marginHorizontal: metrics.dimen_27,
    
    width: '100%', 
    height: metrics.dimen_46, 
    backgroundColor: colors.clear, 
    marginLeft: metrics.widthSize(33)
  },
  campaignViewStyle:{
    marginTop: metrics.aspectRatioHeight(30), 
    backgroundColor: 'rgba(248, 248, 248, 1)',
    borderRadius: metrics.dimen_4,
    height: metrics.dimen_46,
    alignItems: 'center', 
    flexDirection: 'row',
    marginHorizontal: metrics.dimen_27,
  },
  errorTextStyle:{
    fontFamily: metrics.LatoRegular_Normal,
    color: colors.app_RedColor,
    marginTop: metrics.dimen_2,
    alignSelf:'flex-start',
    marginHorizontal: metrics.dimen_27,
  }
});
export default FormTextField;
