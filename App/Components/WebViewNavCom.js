import React, { Component } from 'react';
import { View , StyleSheet} from 'react-native';
import { WebView } from 'react-native-webview';
import { strings } from '../Locales/i18';
import Loader from '../SupportingFIles/Loader';
import metrics from '../Themes/Metrics';
import colors from '../Themes/Colors';
import ContentPagesSkeleton from '../Components/CommonComponents/ContentPagesSkeleton'

export default class WebViewNavCom extends Component {


  constructor(props) {
    super(props);
    this.state = {
      isLoadingWebPage: true
    }
  }

  componentDidMount(){
    this.setNavigationTitle()

  }
  UNSAFE_componentWillReceiveProps(newProps){
    if (newProps.route.params.url != this.props.route.params.url) {
      this.setState({isLoadingWebPage: true})
      setTimeout(() => {
        this.setNavigationTitle()
      }, 100);
    }
  }

  render() {
    return (
      <View style = {{flex: 1}}>
        {/* <Loader loading={this.state.isLoadingWebPage}/> */}
        { this.state.isLoadingWebPage &&
                <ContentPagesSkeleton/>}
        <WebView 
        source={{ uri:  this.props.route.params.url}} 
        javaScriptEnabled={true}
        onLoad={() => this.setState({isLoadingWebPage: false})}
        />
        
      </View>
    );
  }
  setNavigationTitle(){
  let fromScreen = this.props.route.params.From
   let headerTitle = ''
   switch (fromScreen) {
     case "about":
       headerTitle = strings('AboutKoli')
       break;
     case "Privacy":
       headerTitle = strings('PrivacyPolicy')
         break;
     case "TermsCondition":
       headerTitle = strings('TermsConditions')
         break;
     case "FAQ":
       headerTitle = strings("Faqs")
         break;
 
     default:
       break;
   }
   this.props.navigation.setOptions({ title: headerTitle })
  }
}

const styles = StyleSheet.create({
    headerTextStyle:{
      fontFamily: metrics.Lato_Bold,
      fontSize: metrics.text_xxxl,
      marginBottom: metrics.dimen_20,
      color: 'rgba(61, 64, 70, 1)',
    },
    normalText:{
      fontFamily: metrics.Lato_Regular,
      fontSize: metrics.text_normal,
      color: colors.app_black,
    },
    mediumText:{
      fontFamily: metrics.Lato_Regular,
      fontSize: metrics.text_medium,
      color: 'rgba(97, 97, 100, 1)',
    },
    boldText:{
      fontFamily: metrics.Lato_Bold,
      fontSize: metrics.text_normal,
      color: 'rgba(61, 64, 70, 1)',
    },
    imageContainer:{
      width: metrics.width - metrics.dimen_48,
      height: (metrics.width - metrics.dimen_48) /1.83,
    },
    cellContainer:{
      shadowColor:'lightgray',
      shadowOffset: { width: 0, height: metrics.dimen_3 },
      shadowOpacity: 0.3,
      shadowRadius: metrics.dimen_4,
      flex: 1,
      marginBottom: metrics.dimen_20,
      backgroundColor: 'white',
      margin: metrics.dimen_4,
      elevation: metrics.dimen_6
    }
  
  })
