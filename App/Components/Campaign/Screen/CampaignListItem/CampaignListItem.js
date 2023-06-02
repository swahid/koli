import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Slideshow from '../../../../SupportingFIles/Slideshow';
import colors from '../../../../Themes/Colors';
import metrics from '../../../../Themes/Metrics';
// import styles from './styles'
import 'intl';
import 'intl/locale-data/jsonp/en-US'
import Moment from 'moment'
import ReadMore from 'react-native-read-more-text';
import { strings } from '../../../../Locales/i18';
import { convertCurrencybyCode,gettUserData } from '../../../../SupportingFIles/Utills';
import {styles} from '../Home'
import CommentView from '../CampaignResuableComponent/LikeCommentView'

const formatCurrency = new Intl.NumberFormat('en-US')

class CampaignListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount()
    {
        //this.props.HomeStore.getLikeByCampaign()
    }

    render() {
        const item = this.props.item
        const campaignGallery = item.campaignGallery
        // data.endStoryPostDate>=
        // data.endStoryPostDate>=currentdate
        console.warn("item",item.remarks)
        return (
            <View style={styles.cellContainer}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.navigation.navigate('CampaignDetails', { data: item })
                    }}>
                    <Slideshow
                        onPress={() => {
                            this.props.navigation.navigate('CampaignDetails', { data: item })
                            //this.logAnalyticsEvent(item)
                        }}
                        width={metrics.width}
                        dataSource={campaignGallery.length > 0 ? campaignGallery : [item.campaignImage]}
                        indicatorColor={colors.white}
                        indicatorSelectedColor={colors.indicaterselected}
                        arrowSize={0}
                       // titleStyle={{ marginTop: metrics.dimen_50, color: 'red' }}
                        containerStyle={styles.imageContainer}
                        placeholderStyle={styles.imageContainer} />


                  <CommentView 
                        campaignData={item} 
                        navigation={this.props.navigation}/>

                    <View style={{ marginHorizontal: metrics.dimen_13 }}>
                        {/* <Text style={{ ...styles.postedOnText, marginTop: metrics.dimen_14, marginBottom: metrics.dimen_8 }}>
                            {`${strings('Posted_On')}: ${Moment(item.createdAt).format('MMM DD, YYYY')}`}</Text> */}
                        <Text style={{ ...styles.boldText, fontSize: metrics.text_16, marginBottom: metrics.dimen_5 }}>{item.campaignTitle}</Text>
                        {item.comments&&item.comments.length>0? <TouchableOpacity
                        onPress={()=>{
                        gettUserData().then(Userdata => {
                        this.props.navigation.navigate('UserComment',{campaignData:item,userProfileUrl:Userdata?Userdata.avatarUrl:"",Userdata:Userdata})
                       })

                 }}
                >
             <Text style = {{fontFamily:metrics.Lato_Regular, fontSize:metrics.text_medium, marginBottom:metrics.dimen_5,color:"#7A818A"}}>{"View all "+ item.comments.length+" comments"}</Text>
             </TouchableOpacity>:null}
                        <ReadMore
                            numberOfLines={2}
                            renderTruncatedFooter={this._renderTruncatedFooter}
                            renderRevealedFooter={this._renderRevealedFooter}>
                            <Text style={{ ...styles.mediumText, marginTop: metrics.dimen_8 }}>{item.campaignDetails}</Text>
                        </ReadMore>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: metrics.dimen_8, marginBottom: metrics.dimen_10, marginLeft: metrics.dimen_13 }}>
                        <View style={{
                            backgroundColor: item.campaignType === "shoutout" ? '#58DC72' :item.campaignType === "paid" ? colors.app_Blue : "#FFC107",
                            paddingHorizontal: metrics.dimen_13,
                            height: metrics.dimen_25,
                            borderRadius: metrics.dimen_13,
                            justifyContent: 'center'
                        }}>
                            {item.campaignType === "shoutout" && <Text style={{ fontFamily: metrics.Lato_SemiBold, fontSize: metrics.text_13, color: colors.white }}>
                                {"Shoutout Exchange"}
                            </Text>}
                            {item.campaignType === "paid" && <Text style={{ fontFamily: metrics.Lato_SemiBold, fontSize: metrics.text_13, color: colors.white }}>
                                {`Paid: ${convertCurrencybyCode(item.campaignAmountCurrency) +formatCurrency.format(item.campaignAmount)}`}
                            </Text>}

                            {item.campaignType === "sponsored" && <Text style={{ fontFamily: metrics.Lato_SemiBold, fontSize: metrics.text_13, color: colors.white }}>
                            {`Product Sponsor: ${convertCurrencybyCode(item.campaignAmountCurrency) + formatCurrency.format(item.campaignAmount)}`}             
                            </Text>}

                            {item.campaignType === "commissionBased" && <Text style={{ fontFamily: metrics.Lato_SemiBold, fontSize: metrics.text_13, color: colors.white }}>
                            {`Commission Based: ${formatCurrency.format(item.campaignAmount)+" "+"%"}`}             
                            </Text>}

                            {item.campaignType === "eventsAppearence" && <Text style={{ fontFamily: metrics.Lato_SemiBold, fontSize: metrics.text_13, color: colors.white }}>
                            {`Events Appearance: ${convertCurrencybyCode(item.campaignAmountCurrency) + formatCurrency.format(item.campaignAmount)}`}             
                            </Text>}
                            {item.campaignType === "photoshootVideo" && <Text style={{ fontFamily: metrics.Lato_SemiBold, fontSize: metrics.text_13, color: colors.white }}>
                            {`Photo / Video Shoot: ${convertCurrencybyCode(item.campaignAmountCurrency) +  formatCurrency.format(item.campaignAmount)}`}             
                            </Text>}
                        </View>
                        <View style={{ alignItems: 'center', marginRight: -metrics.dimen_4, height: 25, justifyContent: 'center' }}>

                            {/* {item.campaignType === "shoutout" &&
                                <Text style={[styles.tagTextStyle, { marginRight: metrics.dimen_15 }]}>
                                    {this.returnShoutoutContent(item)}
                                </Text>} */}

                                <Text style={[styles.tagTextStyle, { marginRight: metrics.dimen_15 }]}>
                                    {item.remarks.length > 0 ? `${item.remarks.filter(el=>el.remarkStatus === 1).length} ${strings('Applications')}` : `${strings('New_Listing')}`}
                                </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    returnShoutoutContent = (item) => {
        if (item.profile !== undefined && item.remarks.length > 0) {
          return ` ${item.remarks.length} ${strings('Applications')}`
        }else{
          return `${strings('New_Listing')}`
        }
      }
}

export default CampaignListItem;
