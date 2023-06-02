import React, { Component } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { commonStyles } from '../../SupportingFIles/Constants';
import images from '../../Themes/Images';

class HeaderBackComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <TouchableOpacity style={{ ...commonStyles.backButtonContainer }}
                onPress={() => this.props.navigation.goBack()}
            >
                <Image source={images.backImage} />
            </TouchableOpacity>
        );
    }
}

export default HeaderBackComponent;
