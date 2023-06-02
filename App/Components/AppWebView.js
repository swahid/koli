import React, {  useState } from 'react';
import { View, Modal, StyleSheet, Image, TouchableOpacity,ScrollView, Text} from 'react-native';
import images from '../Themes/Images';
import metrics from '../Themes/Metrics';
import Loader from '../SupportingFIles/Loader';
// import {observer, inject} from 'mobx-react';
import HTML from 'react-native-render-html';
import colors from '../Themes/Colors';
import { strings } from '../Locales/i18';


const AppWebView = props => {
  [isLoading, setLoading] = useState(false)
    const {
      isShow,
      url,
    } = props;

    
   
    
    return (
      <Modal 
        animationType = {"slide"} 
        visible={isShow} 
      >
        <Loader loading={isLoading}/>
        <View style={styles.modalBackground}>
          <View style={styles.viewTop}>
            <TouchableOpacity style = {styles.backButton} onPress={props.onClose}>
                <Image source = {images.cross}/>
            </TouchableOpacity>
            <Text style = {{...styles.signUpTextStyle}}>{strings('TermsConditions')}</Text>
            </View>
            {/* <WebView 
             source={{ uri:  url}}
              javaScriptEnabled={true}
              onLoadStart={() => setLoading(true)} 
              onLoad={() => setLoading(false)} 
            /> */}

<ScrollView  style={{ flex: 1 }} keyboardShouldPersistTaps={'handled'}showsVerticalScrollIndicator={false}>

<HTML html={url} /></ScrollView>
        </View>
      </Modal>
    )
  }

  const styles = StyleSheet.create({
    modalBackground: {

        width: '100%',
        height: '100%',
        paddingHorizontal:metrics.dimen_20,
        flex: 1
      },
      backButton: {
       // marginTop: metrics.dimen_40,
       // marginBottom: metrics.dimen_10,
          width:metrics.widthSize(132),
          aspectRatio:1,
        
      },
      signUpTextStyle:{
       // marginBottom: metrics.dimen_10,
       fontFamily: metrics.Lato_Bold,
                color: 'rgba(26, 30, 36, 1)',
                fontSize: metrics.text_16,
                width:"80%",
                textAlign:'center'
      },
      viewTop:{
        marginTop: metrics.dimen_40,
        marginBottom: metrics.dimen_10,
        flexDirection:'row',
        //backgroundColor:'red'
      }
  });
  export default  AppWebView;