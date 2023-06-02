import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TouchableHighlight,
} from 'react-native';
import ImageView from 'react-native-image-view';
const reactNativePackage = require('react-native/package.json');
const splitVersion = reactNativePackage.version.split('.');
const majorVersion = +splitVersion[0];
const minorVersion = +splitVersion[1];
const height_ratio = 0.546;
import AutoHeightImage from 'react-native-auto-height-image';
import images from '../Themes/Images';
import LinearGradient from 'react-native-linear-gradient';
import FastImageWithPlaceholder from '../Components/CommonComponents/FastImageWithPlaceholder'
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#E8E8E8',
  },
  layoutIndicator: {
    height: 15,
    position: 'absolute',
    bottom: 5,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  indicator: {
    margin: 3,
    opacity: 0.9
  },
  indicatorSelected: {
    opacity: 1,
  },
  containerImage : {
    flex: 1,
    width: Dimensions.get('window').width,
  },
  overlay: {
    opacity: 0.5,
    backgroundColor: 'black',
  },
  layoutText: {
    position: 'absolute',
    paddingHorizontal: 15,
    bottom: 30,
    left: 0,
    right: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  textTitle: {
    fontWeight: 'bold',
    fontSize: 15, 
    color: 'white',
  },
  textCaption: {
    fontWeight: '400',
    fontSize: 12, 
    color: 'white',
  }
});

export default class Slideshow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      position: 0,
      //height: Dimensions.get('window').width * (4 / 9),
      width: this.props.width || Dimensions.get('window').width,
      scrolling: false,
      isImageViewVisible:false,
      selectedIndex:0
    };
  }

  _onRef(ref) {
    this._ref = ref;
    if (ref && this.state.position !== this._getPosition()) {
      this._move(this._getPosition());
    }
  }

  _move(index) {
    const isUpdating = index !== this._getPosition();
    const x = this.state.width * index;
    if (majorVersion === 0 && minorVersion <= 19) {
      this._ref.scrollTo(0, x, true); // use old syntax
    } else {
      this._ref.scrollTo({x: this.state.width * index, y: 0, animated: true});
    }
    this.setState({position: index});
    if (isUpdating && this.props.onPositionChanged) {
      this.props.onPositionChanged(index);
    }
  }

  _getPosition() {
    if (typeof this.props.position === 'number') {
      return this.props.position;
    }
    return this.state.position;
  }

  _next() {
    const pos = this.state.position === this.props.dataSource.length-1 ? 0 : this.state.position + 1;
    this._move(pos);
    this.setState({position: pos});
  }

  _prev() {
    const pos = this.state.position === 0 ? this.props.dataSource.length-1 : this.state.position - 1;
    this._move(pos);
    this.setState({position: pos});
  }

  componentDidUpdate(prevProps) {
    if (prevProps.position !== this.props.position) {
      this._move(this.props.position);
    }
  }

  componentWillMount() {
    
    this._interval = setInterval(() => {
      const newWidth = this.props.width || Dimensions.get('window').width;
      if (newWidth !== this.state.width) {
        this.setState({width: newWidth});
      }
    }, 16);
  }

  customOnScroll = (e)=>{

    const width = this.props.width || this.state.width;
    
    let contentOffset = e.nativeEvent.contentOffset
    let change  = Math.round(contentOffset.x/width)
    
    change = change<0?-1:change 
    const position = this._getPosition();
    
    if(position>change)
       this._move(position - 1);
    
    if(position<change)
      this._move(position+1);

  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  render() {
    const width = this.props.width || this.state.width;
    let height = this.props.height || this.state.height;
    // height = width*(this.props.height_ratio||height_ratio)
    const position = this._getPosition();
    const fullScreenImages = this.props.dataSource ? this.props.dataSource.map(obj => {
      return { source: {
       uri: obj,
   },
   title: 'CampaignImage',}
    }) : []
    return (
      <View style={[
          this.props.containerStyle,
          // { height: height }
        ]}>

          <ImageView
    images={fullScreenImages}
    imageIndex={this.state.selectedIndex}
    isSwipeCloseEnabled={true}
    isVisible={this.state.isImageViewVisible}
    onClose={()=>this.setState({isImageViewVisible:false})}
/>
        {/* SECTION IMAGE */}
        <ScrollView
          //bounces = {false}
          bounces={true}
          ref={ref => this._onRef(ref)}
          decelerationRate={0.99}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={this.props.scrollEnabled}
          pagingEnabled = {true}
          onMomentumScrollEnd = {this.customOnScroll}
          style={[
            styles.container, 
            // { height: height }
          ]}>
          {this.props.dataSource.map((image, index) => {
            const imageObject = typeof image === 'string' ? {uri: image} : image;
            const textComponent = (
              <View style={[styles.layoutText,this.props.textOverlay?styles.overlay:null]}>
                {image.title === undefined ? null : <Text style={this.props.titleStyle}>{image.title}</Text>}
                {image.caption === undefined ? null : <Text style={this.props.captionStyle}>{image.caption}</Text>}
              </View>
            );
            const imageComponent = (
              <TouchableOpacity key={index}
              activeOpacity={1}
                            disabled={this.props.isCampaignDetail !== undefined ? false : true}
              onPress={()=>{
                this.props.isCampaignDetail !== undefined && this.setState({isImageViewVisible:true,selectedIndex:index})
              }
              }>
                {this.props.isApplyJob && 
                <Image
                  source={imageObject}
                  style={{height, width,resizeMode:'cover'}}/>}
                  {this.props.isApplyJob === undefined && 
 <FastImageWithPlaceholder
 
 isSquarePlaceholder={true}
 style={this.props.containerStyle}
 source={imageObject}
 />

        //           <AutoHeightImage
        //   width={width}
        //   source={imageObject}
        //   fallbackSource={images.adminNotification}

        // />
        }
                {textComponent}
              </TouchableOpacity>
            );
            const imageComponentWithOverlay = (
              <View key={index} style={[styles.containerImage,{width:width}]}>
                <View style={styles.overlay}>
                  {/* <Image
                    source={imageObject}
                    style={{height, width,resizeMode:'cover'}}/> */}
                     <FastImageWithPlaceholder
 
 isSquarePlaceholder={true}
   style={this.props.containerStyle}
   source={imageObject}
 />
                    {/* <AutoHeightImage
          width={width}
          source={imageObject}
          fallbackSource={images.KoliSquarePlaceholder}

        /> */}
                </View>
                {textComponent}
              </View>
            );
            if (this.props.onPress) {
              return (
                <TouchableOpacity
                  key={index}
                  // style={{height, width}}
                  onPress={() => this.props.onPress({image, index})}
                  delayPressIn={200}>
                  {this.props.overlay ? imageComponentWithOverlay : imageComponent}
                </TouchableOpacity>
              );
            } else {
              return this.props.overlay ? imageComponentWithOverlay : imageComponent 
            }
          })}
        </ScrollView>
        {/* END SECTION IMAGE */}
        {/* SECTION INDICATOR */}
        {/* <View 
          style={[
            styles.layoutIndicator, 
          ]}>
          {this.props.dataSource.length>1&&this.props.dataSource.map((image, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => { return this._move(index); }}
                style={[
                  [
                    styles.indicator, 
                    setIndicatorSize(this.props.indicatorSize), 
                    setIndicatorColor(this.props.indicatorColor)
                  ], 
                  position === index && 
                  [
                    styles.indicatorSelected, 
                    setIndicatorColor(this.props.indicatorSelectedColor)
                  ]
                ]}>
              <View></View>
            </TouchableOpacity>);
          })}
        </View> */}
        {/* END SECTION INDICATOR */}
        {/* SECTION ARROW LEFT */}
        <View 
          style={[
            layoutArrow(this.props.height, this.props.arrowSize), 
            { left: 10, height: 50 },
          ]}>
          <TouchableOpacity
            onPress={() => this._prev()}>
            {
              this.props.arrowRight == undefined ? 
              <View 
                style={[
                  iconArrow(this.props.arrowSize), 
                  iconArrowLeft(this.props.arrowSize),
                ]}/>
              : 
              this.props.arrowLeft
            }
          </TouchableOpacity>
        </View>
        {/* END SECTION ARROW LEFT */}
        {/* SECTION ARROW RIGHT */}
        <View 
          style={[
            layoutArrow(this.props.height, this.props.arrowSize), 
            { right: 10, height: 50 },
          ]}>
          <TouchableOpacity
            onPress={() => this._next()}>
            {
              this.props.arrowRight == undefined ? 
              <View 
                style={[
                  iconArrow(this.props.arrowSize), 
                  iconArrowRight(this.props.arrowSize),
                ]}/>
              : 
              this.props.arrowRight
            }
          </TouchableOpacity>
        </View>
        {/* END SECTION ARROW RIGHT */}
        {this.props.dataSource.length>1 &&
        <LinearGradient colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.5)','rgba(0, 0, 0, 0.8)']} 
        style={{width:'100%', height:60, position: 'absolute',bottom:0, left:0, right:0, }}>
  {/* SECTION INDICATOR */}
  <View 
          style={styles.layoutIndicator}>
          {this.props.dataSource.length>1&&this.props.dataSource.map((image, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => { return this._move(index); }}
                style={[
                  [
                    styles.indicator, 
                    setIndicatorSize(this.props.indicatorSize), 
                    setIndicatorColor(this.props.indicatorSelectedColor)
                  ], 
                  position === index && 
                  [
                    styles.indicatorSelected, 
                    setIndicatorColor(this.props.indicatorColor)

                  ]
                ]}>
              <View></View>
            </TouchableOpacity>);
          })}
        </View>
        {/* END SECTION INDICATOR */}
</LinearGradient>}
      </View>
    );
  }
}

Slideshow.defaultProps = {
  height: 200,
  indicatorSize: 8,
  indicatorColor: '#CCCCCC',
  indicatorSelectedColor: '#FFFFFF',
  scrollEnabled: true,
  arrowSize: 16,
}

Slideshow.propTypes = {
	dataSource: PropTypes.arrayOf(PropTypes.shape({
	    title: PropTypes.string,
	    caption: PropTypes.string,
	    url: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })).isRequired, 
	indicatorSize: PropTypes.number,
	indicatorColor: PropTypes.string,
	indicatorSelectedColor: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
  height_ratio: PropTypes.number,
  position: PropTypes.number,
  scrollEnabled: PropTypes.bool,
  containerStyle: PropTypes.object,
  overlay: PropTypes.bool,
	arrowSize: PropTypes.number,
  arrowLeft: PropTypes.object,
  arrowRight: PropTypes.object,
	onPress: PropTypes.func,
	onPositionChanged: PropTypes.func,
};

const setIndicatorSize = function (size) {
  return {
    width: size,
    height: size,
    borderRadius: size / 2,
  };
}

const setIndicatorColor = function (color) {
  return {
    backgroundColor: color,
  };
}

const layoutArrow = function (imageHeight, iconHeight) {
  return {
    position: 'absolute',
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    top: (imageHeight-iconHeight)/2,
    bottom: (imageHeight-iconHeight)/2,
  };
}

const iconArrow = function (iconHeight) {
  return {
     width: 0,
     height: 0,
     margin: 5,
     backgroundColor: 'transparent',
     borderStyle: 'solid',
     borderTopColor: 'transparent',
     borderBottomColor: 'transparent',
     borderTopWidth: iconHeight/2,
     borderBottomWidth: iconHeight/2,
  };
}

const iconArrowRight = function (iconHeight) {
  return {
     borderRightWidth: 0,
     borderLeftWidth: iconHeight*75/100,
     borderRightColor: 'transparent',
     borderLeftColor: 'white',
  };
}

const iconArrowLeft = function (iconHeight) {
  return {
     borderRightWidth: iconHeight*75/100,
     borderLeftWidth: 0,
     borderRightColor: 'white',
     borderLeftColor: 'transparent',
  };
}
