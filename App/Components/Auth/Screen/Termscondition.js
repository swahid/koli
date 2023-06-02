import React, { Component } from 'react';
import { View, StyleSheet,ScrollView} from 'react-native';
import { strings } from '../../../Locales/i18';
import metrics from '../../../Themes/Metrics';
import colors from '../../../Themes/Colors';
import {gettermsCondition} from '../../../API/Auth/TermsAndPolicy/TermsPrivacyPolicy'
import HTML from 'react-native-render-html';
import ContentPagesSkeleton from '../../CommonComponents/ContentPagesSkeleton'

export const htmlIgnoredStyles = ['text-align', 'text-decoration-style', 'text-decoration-color','font-family','important','font-weight','background-color','white-space','color']


export default class Termscondition extends Component {


  constructor(props) {
    super(props);
    this.state = {
      isLoadingWebPage: false,
      description:''
    }
  }

  componentDidMount(){
    this.setNavigationTitle()

    let fromScreen = this.props.route.params.From
    if(fromScreen === "TermsCondition")
    {
      this.gettermsCondition()
    }

  }

  gettermsCondition = () => {
    this.setState({isLoadingWebPage:true})
    gettermsCondition().then(response => {
        this.setState({isLoadingWebPage:false})
        const {status,data} = response
            if (status === 200 ){
                this.setState({description:data.message[0].description})
            }
        }).catch(error => {
            this.setLoading(false)
        })
    
}
 

  render() {
    return (
      <View style = {{flex: 1,backgroundColor:colors.white,paddingHorizontal:metrics.dimen_15}}>
        { this.state.isLoadingWebPage &&
                <ContentPagesSkeleton/>}
      
        <ScrollView  style={{ flex: 1 }} keyboardShouldPersistTaps={'handled'}showsVerticalScrollIndicator={false}>

        <HTML html={this.state.description} /></ScrollView>


        
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
