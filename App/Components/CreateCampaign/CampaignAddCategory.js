import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    Keyboard,
    TouchableOpacity,
    Image,
    FlatList,
    StyleSheet,
    Alert
} from 'react-native';
import {  Button } from 'react-native-paper';
import metrics from '../../Themes/Metrics';
import images from '../../Themes/Images';
import Loader from '../../SupportingFIles/Loader';

import colors from '../../Themes/Colors';
import { commonStyles } from '../../SupportingFIles/Constants';
import { strings } from '../../Locales/i18';
import { observer, inject } from 'mobx-react';
// import { KeyboardAccessoryNavigation } from 'react-native-keyboard-accessory'
import SkeletonPlaceholder from "react-native-skeleton-placeholder";



class CampaignAddCategory extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            isTfActive: false,
            
        })
        if(this.props.route.params.isFromAdd !== undefined)
        {
            this.props.navigation.setOptions({ 
       
                title: strings('Category'),
                headerTitleStyle: {
                    fontFamily: metrics.Lato_Bold,
                    color: 'rgba(26, 30, 36, 1)',
                    fontSize: metrics.text_16
                }
              }
                
              )
        }
       

    }

    componentDidMount() {
        this.props.navigation.setOptions({

            headerLeft: () => (
                <TouchableOpacity style={{ ...commonStyles.backButtonContainercampaign }}
                    onPress={() => {
                       
                        Alert.alert(
                            "",
                            "You have unsaved categories, are you sure you want to go back?",
                            [
                              {
                                text: "No",
                                onPress: () =>console.log(''),
                              
                              },
                              { text: "Yes", onPress: () => {
                              store.resetCategoryArray()
                              this.props.navigation.goBack()
                            } 
                        }
                            ]
                          );
                    }}
                >
                    <Image style={{ tintColor: colors.app_Blue }} source={images.backImage} />
                </TouchableOpacity>
            ),
        }
        )


        const store = this.props.CreateCampaignStore
        // if(store.categoriesArray.length === 0)
        // {
        console.log('store.campainData.campaignCategories:', store.campainData.campaignCategories)
        console.log('store.categoriesArray:', store.categoriesArray)
        if(store.categoriesArray.length===0)
        {
            store.getCatgoriesList()
        }
        // }
        // else
        // {
        // this.props.navigation.addListener('focus', () => {
        //     //  if(store.campaigntype==='Edit')
        //     //  {
        //         console.log('store.campainData.campaignCategories:',store.campainData.campaignCategories)

        //       var selectedCats = store.categoriesArray.map(item => {
        //           if(store.campainData.campaignCategories.includes(item.categoryName ))
        //           {
        //               item.isSelected=true
        //           }
        //         return item
        //     })
        //     console.log('selectedCats:',selectedCats)

        //      selectedCats = selectedCats.filter(item => {
        //         return item.isSelected
        //     })
        //     console.log('selectedCats:',selectedCats)
        //     store.setSelectedCatgoriesList(selectedCats)


        //     });
        // }


    }

    resetStoreData() {
        const store = this.props.CreateCampaignStore
        store.setCampaignData({ campaignCategories: [] })
    }

    render() {
        const { categoriesLoading, categoriesArray } = this.props.CreateCampaignStore
        const selectedCategories = categoriesArray.filter(item => {
            return item.isSelected
        })
        return (
            <View style={{ backgroundColor: 'white', flex: 1 }}>
                {/* <Loader loading={isLoading} /> */}
                { categoriesLoading &&
                 [...Array(10)].map((e, i) =>
                 <SkeletonPlaceholder>

          <View style={styles.listItemContainer}>
           
              <View
                style={styles.placeholderListData}
              />
            </View>
            <View style={styles.bottomLinePlaceholder} />

        </SkeletonPlaceholder>
                 )}
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <View style={{ marginHorizontal: metrics.dimen_27, justifyContent: 'space-between', flex: 1 }}>
                        <View>
                            {/* <ProgressBar style={{ ...commonStyles.progressBarStyle }} progress={0.55} color={'rgba(22, 88, 211, 1)'} /> */}
                            {/* <Text style={{ ...commonStyles.LatoBold_24, marginTop: metrics.dimen_28 }}>{strings('Campaign_Category')}</Text> */}
                        </View>
                        <FlatList
                            bounces={false}
                            style={styles.styleListContainer}
                            numColumns={1}
                            data={categoriesArray}
                            renderItem={({ item, index }) => this.renderListItem(item, index)}
                            keyExtractor={(item, index) => index.toString()}
                            ItemSeparatorComponent={this.renderSeperator}
                        />
                    </View>

                </TouchableWithoutFeedback>
                {/* {!this.state.isTfActive && <Button style={{ ...commonStyles.CampaignNextButtonStyle }} labelStyle={{ ...commonStyles.LatoBold_14, color: 'white' }}
                    onPress={() => this.onNext()
                    }
                >
                    {strings('Next')}
                </Button>} */}
                <Button
                    style={{
                        ...commonStyles.NextButtonStyle,
                        marginHorizontal: metrics.dimen_27,
                        backgroundColor: selectedCategories.length > 0 ? colors.app_Blue : 'rgba(192, 196, 204, 0.6)',
                        shadowOpacity: selectedCategories.length > 0 ? 0.5 : 0
                    }}
                    labelStyle={{ ...commonStyles.LatoBold_14, color: 'white' }}
                    onPress={() => this.onNext()}
                    uppercase={true}
                    disabled={selectedCategories.length > 0 ? false : true}
                >
                    {this.props.route.params.isFromAdd !== undefined ? strings('Save') : strings('Next')}
                </Button>

            </View>
        );
    }
    renderSeperator() {
        return (
            <View style={{ ...styles.seperatorStyle }} />
        )
    }
    onNext = () => {
        if(this.props.route.params.isFromProduct)
        {
            const store = this.props.ProductStore
            const campaignStore = this.props.CreateCampaignStore

            const selectedCategories = campaignStore.categoriesArray.filter(item => {
                return item.isSelected
            })
            store.setSelectedCatgoriesList(selectedCategories)
             this.props.navigation.goBack()
            
        }
        else
        {
            const store = this.props.CreateCampaignStore
            const selectedCategories = store.categoriesArray.filter(item => {
                return item.isSelected
            })
            store.setSelectedCatgoriesList(selectedCategories)
            if(this.props.route.params.isFromAdd !== undefined)
            {
    this.props.navigation.goBack()
            }
            else
            {
                //console.log('store.campaignData:',store.campainData)
            this.props.navigation.navigate('CreateCampaign7')
            }
        }
       
        
    }
    renderListItem = (item, index) => {
        return (
            <TouchableOpacity style={styles.listItemContainer}
                onPress={() => {
                    if(item.categoryName=='Any'){
                        this.seletDeselectItem(item, index,'Any')
                    }else{
                    this.seletDeselectItem(item, index,'Individual')
                    }
                    }}>
                <Text style={styles.listTitle}>{item.categoryName}</Text>
                {item.isSelected && <Image source={images.tick}
                    resizeMode="contain"
                    style={styles.imageStyle} />}
            </TouchableOpacity>
        )
    }
    seletDeselectItem = (item, index,cattype) => {
        const store = this.props.CreateCampaignStore
        console.log(cattype)
        if(cattype=='Any'){
            store.setSelectDeselectCatgories(cattype,index)
        }else{
        store.setSelectDeselectCatgories(cattype,index)
        }
    }
}
const styles = StyleSheet.create({
    styleListContainer: {
        marginTop: metrics.getHeightAspectRatio(20)
    },
    // Container: {
    //     flexDirection: 'column',
    //     flex: 1,
    //     backgroundColor: colors.white
    // },
    // backButtonContainer: {
    //     marginLeft: metrics.dimen_16,
    //     marginTop: Platform.OS == 'android' ? metrics.dimen_6 : 3
    // },
    listItemContainer: {
        //width: '88%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    listTitle: {
        marginVertical: metrics.aspectRatioHeight(38),
        marginHorizontal: metrics.widthSize(15),
        fontFamily: metrics.Lato_SemiBold,
        fontSize: metrics.text_normal,
        color: '#3E3E46',
        textTransform: 'capitalize'
    },
    imageStyle: {
        height: metrics.getHeightAspectRatio(22),
        width: metrics.widthSize(40),
        alignSelf: 'center',
        marginRight: metrics.widthSize(42)
    },
    seperatorStyle: {
        backgroundColor: colors.text_grey,
        height:StyleSheet.hairlineWidth,
        },
        placeholderListData:{
                marginVertical: metrics.aspectRatioHeight(38),
                // marginHorizontal: metrics.widthSize(15),
                width:metrics.dimen_100,
                height:metrics.dimen_20,
                marginHorizontal: metrics.dimen_27,
        },
        bottomLinePlaceholder:{
            width:'85%',
            height:2, 
            marginHorizontal: metrics.dimen_27,
        }
}
)

export default inject("CreateCampaignStore","ProductStore")(observer(CampaignAddCategory))
