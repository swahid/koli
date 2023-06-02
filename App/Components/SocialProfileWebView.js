import React, { Component } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import Loader from '../SupportingFIles/Loader';



export default class SocialProfileWebView extends Component {
  constructor(props) {
    super(props);
    this.state = {
        isLoading: true
    };
  }

  componentDidMount(){
    this.props.navigation.setOptions({ 
        title: this.props.route.params.title
    })
  }

  render() {
    console.log('this.props.route.params.url:',this.props.route.params.url)
    var url = this.props.route.params.url
    if (!/^https?:\/\//i.test(url)) {
    url = 'http://' + url;
}
    return (
      <View style = {{flex:1}}>
        <Loader loading={this.state.isLoading}/>
        <WebView 
        source={{ uri:  url}} 
        javaScriptEnabled={true}
        onLoad={() => this.setState({isLoading: false})}
        onError={() => this.setState({isLoading: false})}
        />
      </View>
    );
  }
}
