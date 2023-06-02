import React, { useState } from "react";
import { View, Image } from "react-native";
import FastImage from "react-native-fast-image";
import images from '../../Themes/Images';

export default function FastImageWithPlaceholder(props) {
	const { style, source, tintColor, placeholder,actualSource, placeholderStyle, isSquarePlaceholder } = props;
	const [loaded, setLoaded] = useState(false);
    const [source1, setSource] = useState(placeholder)
	const onLoad = () => {
		setLoaded(true);
	}
	const renderPlaceholder = () =>
	{
		return (
		<Image 
		source={isSquarePlaceholder ? images.KoliSquarePlaceholder : images.userPlaceholder} 
		resizeMode='contain'
		style={style}/>)
	}
	return (
		// <View> 
		// 	{ !loaded && renderPlaceholder()}
		// 	<FastImage style={!loaded ? { width: 0, height: 0 } : style} 
		// 	source={source} 
		// 	onLoadEnd={() => { setTimeout(() => { setLoaded(true) }, 100) }} 
		// 	resizeMode={FastImage.resizeMode.contain} /> 
		// 	</View>


		<FastImage
        renderPlaceholder={renderPlaceholder()}
        renderErrorImage={renderPlaceholder()}
       //fallback
        //defaultSource={isSquarePlaceholder ? images.KoliSquarePlaceholder : images.adminNotification}
          style={style}
          source={source}
        />
        // <FastImage  source={source1} onLoadEnd={ () => setSource(actualSource) }/>
		// <View>
		// 	{
		// 		(!loaded) && (
		// 			<View>
		// 				<FastImage 
		// 					source={placeholder || images.KoliSquarePlaceholder}
		// 					style={style}
		// 				/>
		// 			</View>
		// 		)
		// 	}
		// 	<FastImage
		// 		style={[style, loaded ? {} : {width: 0, height: 0}]}
		// 		source={source}
		// 		tintColor={tintColor}
		// 		onLoad={onLoad}
		// 	/>
		// </View>
	);
}