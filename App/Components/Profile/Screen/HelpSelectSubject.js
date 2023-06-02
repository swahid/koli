import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { observer, inject } from 'mobx-react';
import metrics from '../../../Themes/Metrics';
import colors from '../../../Themes/Colors';
import images from '../../../Themes/Images';

class HelpSelectSubject extends Component {
  constructor(props) {
    super(props);
    const store = this.props.HelpStore;
    var itemList =
      store.subjectList !== undefined ? store.subjectList.slice() : [];
    itemList.push({ id: 0, subject: 'Other' });
    store.setSubject(itemList);
    this.state = {
      listData: itemList,
    };
  }

  componentDidMount() {
    // const Autstore = this.props.AuthStore
    // store.setname(Autstore.firstName+" "+Autstore.lastName)
    // store.setemail(Autstore.email)

    // this.props.navigation.addListener('focus', () => {
    //   this.props.HelpStore.deleteAllValidationError()
    // });

    this.props.navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={styles.backButtonContainer}
          onPress={() => this.props.navigation.goBack()}>
          <Image source={images.backImage} />
        </TouchableOpacity>
      ),
    });
  }
  render() {
    // const store = this.props.HelpStore

    return (
      <View style={{ backgroundColor: colors.white, flex: 1 }}>
        <FlatList
          style={{ marginTop: metrics.getHeightAspectRatio(20) }}
          numColumns={1}
          data={this.state.listData}
          renderItem={({ item }) => this.renderListItem(item)}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
  renderListItem = (item, index) => {
    return (
      <TouchableOpacity
        style={styles.listItemContainer}
        onPress={() => this.seletDeselectItem(item, index)}>
        <Text style={styles.listTitle}>{item.subject}</Text>
        {item.isSelected && (
          <Image
            source={images.tick}
            resizeMode="contain"
            style={styles.imageStyle}
          />
        )}
      </TouchableOpacity>
    );
  };
  seletDeselectItem = (item, index) => {
    const store = this.props.HelpStore;
    var itemList = this.state.listData.slice();
    itemList = itemList.map((el) => {
      el.isSelected = false;
      if (item === el) {
        el.isSelected = true;
      }
      return el;
    });
    store.setSubject(item);
    store.settitle('');
    this.setState(itemList);
    this.props.navigation.goBack();
  };
}
export default inject('HelpStore', 'AuthStore')(observer(HelpSelectSubject));

const styles = StyleSheet.create({
  // Container: {
  //   flexDirection: 'column',
  //   flex: 1,
  //   backgroundColor: colors.white
  // },
  backButtonContainer: {
    marginLeft: metrics.dimen_16,
    marginTop: Platform.OS === 'android' ? metrics.dimen_6 : 3,
  },
  listItemContainer: {
    alignSelf: 'center',
    width: '88%',
    marginVertical: metrics.widthSize(22),
    borderRadius: 5,
    backgroundColor: '#F8F8F8',
    marginBottom: metrics.aspectRatioHeight(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listTitle: {
    marginVertical: metrics.aspectRatioHeight(48),
    marginHorizontal: metrics.widthSize(51),
    fontFamily: metrics.Lato_SemiBold,
    fontSize: metrics.text_normal,
    color: '#3E3E46',
  },
  imageStyle: {
    height: metrics.getHeightAspectRatio(22),
    width: metrics.widthSize(40),
    alignSelf: 'center',
    marginRight: metrics.widthSize(42),
  },
});