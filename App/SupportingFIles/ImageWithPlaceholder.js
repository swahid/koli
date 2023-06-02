import React, { useState, useMemo, memo } from "react";
import PropTypes from "prop-types";
import { View, StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";

const ImageWithPlaceholder = memo(
  ({
    renderPlaceholder,
    renderErrorImage,
    onError,
    onLoad,
    imageStyle,
    ...otherProps
  }) => {
    const [isLoading, setLoading] = useState(true);
    const [isErrored, setIsErrored] = useState(false);

    const CachedImageMemoized = useMemo(() => {
      return (
        <FastImage
          {...otherProps}
          style={[imageStyle, styles.image]}
          onError={() => {
            setLoading(false);
            setIsErrored(true);
            onError && onError();
          }}
          onLoad={e => {
            setLoading(false);
            onLoad && onLoad(e);
          }}
        />
      );
    }, [onError, onLoad, imageStyle, otherProps]);

    return (
      <View style={imageStyle}>
        {CachedImageMemoized}
        {isLoading && renderPlaceholder()}
        {isErrored && renderErrorImage()}
      </View>
    );
  }
);

ImageWithPlaceholder.priority = FastImage.priority;
ImageWithPlaceholder.resizeMode = FastImage.resizeMode;

ImageWithPlaceholder.propTypes = {
  renderPlaceholder: PropTypes.func,
  renderErrorImage: PropTypes.func,
  onError: PropTypes.func,
  onLoad: PropTypes.func,
  imageStyle: PropTypes.object.isRequired
  // Your imageStyle can look like:
  // imageStyle = {width: XYZ, height: XYZ}
};

const styles = StyleSheet.create({
  image: { position: "absolute", zIndex: -1 }
});

export default ImageWithPlaceholder;
