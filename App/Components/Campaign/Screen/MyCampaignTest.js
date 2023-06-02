/**
 * This is just a temporary Component for the test. It should not be needed in the future, after we fully refactor it to work with jest.
 */
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  Image,
  TouchableOpacity,
  RefreshControl
} from "react-native";
import { observer, inject } from "mobx-react";
import metrics from "../../../Themes/Metrics";
import images from "../../../Themes/Images";
import colors from "../../../Themes/Colors";
// import Loader from "../../../SupportingFIles/Loader";
import ReadMore from "react-native-read-more-text";
// import { Button } from "react-native-paper";
import { Button } from "react-native"
import { commonStyles } from "../../../SupportingFIles/Constants";
import Slideshow from "../../../SupportingFIles/Slideshow";
import { convertCurrencybyCode } from '../../../SupportingFIles/Utills';

import "intl";
// import "intl/locale-data/jsonp/en-US";
import "react-intl";
import { SearchBar } from "react-native-elements";
// import { strings } from "../Locales/i18";
const strings = (text) => text

var context = null;
const formatCurrency = new Intl.NumberFormat("en-US");
// const formatCurrency = { format: (amount) => amount }


class TestMyCompaign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchvisible: false,
      data: ""
    };
    context = this;
  }

  componentDidMount() {
    const store = this.props.CompaignsStore;
    this.props.navigation.addListener("focus", () => {
      store.setupdatedsearch("");
      store.getMyCampaigns();
      this.setState({ data: store.myCompaignsList });

      this.props.navigation && this.props.navigation.setOptions({headerRight: () => (
        <View style={{marginRight: metrics.dimen_20, flexDirection: 'row'}}>
        {store.myCompaignsList.length !== 0&& <TouchableOpacity onPress={()=>context.SearchOnOf()}>
          <Image source={images.search} />
          </TouchableOpacity>}

          <TouchableOpacity onPress={()=>this.props.navigation.navigate('CreateCampaign1',{type:'Add'})}>
            <Image source={images.plusIcon} style = {{marginLeft: metrics.dimen_22}}/>
            </TouchableOpacity>

        </View>
      ) })
    });
  }

  SearchOnOf() {
    this.setState({
      searchvisible: this.state.searchvisible === false ? true : false
    });
  }

  UpdateSerch = search => {
    const store = this.props.CompaignsStore;
    store.setupdatedsearch(search);
    const newData = store.myCompaignsList.filter(item => {
      const itemData = `${item.campaignTitle.toUpperCase()}   
      ${item.campaignTitle.toUpperCase()} ${item.campaignTitle.toUpperCase()}`;
      const textData = search.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    this.setState({ data: newData });
  };
  render() {
    console.log('Test currency format in Japanese Yen: ');
    console.log(new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(1.88));
    const {
      updatedsearch,
      myCompaignsList,
      isLoading,
      isRefreshingMyCampaign
    } = this.props.CompaignsStore;

    this.props.navigation.setOptions({
      headerRight: () => (
        <View style={{ marginRight: metrics.dimen_20, flexDirection: "row" }}>
          {myCompaignsList.length !== 0 && (
            <TouchableOpacity onPress={() => context.SearchOnOf()}>
              <Image source={images.search} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("CreateCampaign1", { type: "Add" })
            }
          >
            <Image
              source={images.plusIcon}
              style={{ marginLeft: metrics.dimen_22 }}
            />
          </TouchableOpacity>
        </View>
      )
    });
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <StatusBar barStyle="dark-content" />
        {/* <Loader loading={isLoading} /> */}
        {this.state.searchvisible && (
          <View
            style={{
              marginLeft: metrics.dimen_5,
              width: "96%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: colors.white,
              marginTop: 5
            }}
          >
            <SearchBar
              lightTheme
              platform="default"
              placeholder={strings("Search")}
              inputStyle={{
                fontFamily: metrics.Lato_Regular,
                fontSize: metrics.text_normal
              }}
              onChangeText={text => this.UpdateSerch(text)}
              value={updatedsearch}
              containerStyle={{
                width: "96%",
                backgroundColor: colors.white,
                borderBottomColor: "transparent",
                borderTopColor: "transparent",
                marginTop: -metrics.dimen_5,
                marginLeft: -15,
                marginRight: -15
              }}
              inputContainerStyle={{
                backgroundColor: colors.app_light_gray,
                shadowColor: colors.shadow_color,
                borderRadius: 20
              }}
              onClear={() => {
                this.UpdateSerch("");
                this.setState({ data: myCompaignsList });
              }}
              onEndEditing={() => {}}
            />
          </View>
        )}

        {!isLoading && myCompaignsList.length === 0 ? this.renderNoJobs() : null}

        <FlatList
          testID="list"
          style={{
            marginHorizontal: metrics.dimen_20,
            marginTop: metrics.dimen_15
          }}
          showsVerticalScrollIndicator={false}
          numColumns={1}
          data={updatedsearch ? this.state.data : myCompaignsList}
          renderItem={({ item }) => this.renderCompaign(item)}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshingMyCampaign}
              onRefresh={this._onRefresh}
            />
          }
        />
      </View>
    );
  }
  _onRefresh = () => {
    this.props.CompaignsStore.setMyCampaignRefreshing(true);
    this.props.CompaignsStore.getMyCampaigns();
  };
  renderNoJobs() {
    return (
      <View
        style={{
          alignItems: "center",
          height: "80%",
          justifyContent: "center"
        }}
      >
        <Image source={images.Campaign} />
        <Text
          style={{ ...commonStyles.LatoBold_16, marginTop: -metrics.dimen_40 }}
        >
          {strings("No_Campaign")}
        </Text>
        <Button
          style={{
            ...commonStyles.NextButtonStyle,
            marginTop: metrics.dimen_25,
            borderRadius: metrics.dimen_22,
            paddingVertical: metrics.dimen_2
          }}
          labelStyle={{
            ...commonStyles.LatoSemiBold_Normal,
            color: "white",
            paddingBottom: metrics.dimen_2
          }}
          onPress={() =>
            this.props.navigation.navigate("CreateCampaign1", { type: "Add" })
          }
          Type="contained"
          uppercase={false}
        >
          {strings("CreateNew")}
        </Button>
      </View>
    );
  }
  renderHeader = () => {
    return <Text style={styles.headerTextStyle}>{strings("Compaign")}</Text>;
  };
  renderCompaign = item => {
    let campaignImage = images.tagBlue;
    if (item.campaignStatus === 0) {
      campaignImage = images.inactiveRibbon;
    } else if (item.campaignStatus === 1) {
      campaignImage = images.tagYellow;
    } else if (item.campaignStatus === 2) {
      campaignImage = images.tagBlue;
    } else if (item.campaignStatus === 3) {
      campaignImage = images.tagGreen;
    }


    return (
      <View style={styles.cellContainer}>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate("MYCampaignDetails", { data: item })
          }
        >
          <View>
            <Slideshow
              onPress={() =>
                this.props.navigation.navigate("MYCampaignDetails", {
                  data: item
                })
              }
              height={metrics.width - metrics.dimen_48}
              width={metrics.width - metrics.dimen_48}
              dataSource={item.campaignGallery}
              indicatorColor={colors.white}
              indicatorSelectedColor={colors.indicaterselected}
              arrowSize={0}
              titleStyle={{ marginTop: 50, color: "red" }}
              containerStyle={styles.imageContainer}
            />

            <View style={{ marginLeft: metrics.dimen_13 }}>
              <Text
                style={{
                  ...styles.boldText,
                  fontSize: metrics.text_16,
                  marginTop: metrics.dimen_14,
                  marginBottom: metrics.dimen_8
                }}
              >
                {item.campaignTitle}
              </Text>
              <ReadMore
                numberOfLines={2}
                renderTruncatedFooter={this._renderTruncatedFooter}
                renderRevealedFooter={this._renderRevealedFooter}
                // onReady={this._handleTextReady}
              >
                <Text
                  style={{ ...styles.mediumText, marginTop: metrics.dimen_8 }}
                >
                  {item.campaignDetails}
                </Text>
              </ReadMore>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: metrics.dimen_8,
                  marginBottom: metrics.dimen_10
                }}
              >
                <Text
                  style={{ ...styles.boldText, color: "rgba(22, 88, 211, 1)" }}
                >
                  {convertCurrencybyCode(item.campaignAmountCurrency) + formatCurrency.format(item.campaignAmount)}
                </Text>
                <View
                  style={{
                    alignItems: "center",
                    marginRight: -metrics.dimen_1
                  }}
                >
                  <Image source={campaignImage} />
                  <TouchableOpacity
                    style={styles.tagViewStyle}
                    disabled={item.campaignStatus != 2 ? true : false}
                    onPress={() =>
                      this.props.navigation.navigate("ApplicantList", {
                        JobData: item
                      })
                    }
                  >
                    <Image
                      source={
                        item.campaignStatus === 3
                          ? images.jobAwarded
                          : item.campaignStatus === 0
                          ? images.cautionIcon
                          : images.timerIcon
                      }
                      style={{ marginLeft: metrics.dimen_2 }}
                    />
                    <Text style={{ ...styles.tagTextStyle }}>
                      {item.campaignStatus === 1
                        ? strings("Awaiting_Approval")
                        : item.campaignStatus === 2
                        ? item.remarks && item.remarks.length +
                          " " +
                          (item.remarks && item.remarks.length > 1
                            ? strings("Applications_Received")
                            : strings("Application_Received"))
                        : item.campaignStatus === 3
                        ? strings("Awarded")
                        : strings("Inactive")}
                    </Text>
                    {item.campaignStatus !== 3 && item.campaignStatus !== 0 ? (
                      <Image source={images.rightArrow} />
                    ) : (
                      <Image style={{ marginLeft: metrics.dimen_10 }} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  _renderTruncatedFooter = handlePress => {
    return (
      <Text
        style={{
          ...styles.normalText,
          marginTop: metrics.dimen_5,
          color: "rgba(22, 88, 211, 1)"
        }}
        onPress={handlePress}
      >
        {strings("ReadMore")}
      </Text>
    );
  };

  _renderRevealedFooter = handlePress => {
    return (
      <Text
        style={{
          ...styles.normalText,
          marginTop: metrics.dimen_5,
          color: "rgba(22, 88, 211, 1)"
        }}
        onPress={handlePress}
      >
        {strings("ShowLess")}
      </Text>
    );
  };
}

export default inject("CompaignsStore")(observer(TestMyCompaign));
// export default TestMyCompaign;

const styles = StyleSheet.create({
  headerTextStyle: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_xxxl,
    marginBottom: metrics.dimen_20,
    color: "rgba(61, 64, 70, 1)"
  },
  normalText: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_normal,
    color: colors.app_black
  },
  mediumText: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_medium,
    color: "rgba(97, 97, 100, 1)"
  },
  boldText: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_normal,
    color: "rgba(61, 64, 70, 1)"
  },
  imageContainer: {
    width: metrics.width - metrics.dimen_48,
    height: metrics.width - metrics.dimen_48
  },
  cellContainer: {
    shadowColor: "lightgray",
    shadowOffset: { width: 0, height: metrics.dimen_3 },
    shadowOpacity: 0.3,
    shadowRadius: metrics.dimen_4,
    flex: 1,
    marginBottom: metrics.dimen_20,
    backgroundColor: "white",
    margin: metrics.dimen_4,
    elevation: metrics.dimen_6
  },
  tagTextStyle: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_small,
    color: "white",
    marginTop: -metrics.dimen_2
  },
  tagViewStyle: {
    position: "absolute",
    top: metrics.dimen_5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "95%",
    left: metrics.dimen_6
  }
});
