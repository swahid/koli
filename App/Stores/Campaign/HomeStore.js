import { action, observable, decorate } from 'mobx';
import {
    getCampaigns,
    getMostAppliedCampaigns,
    getMostappliedrecent,
    PostCampaignLikes,
    getCampaignByLike,
    PostComment,
    getCampaignByComment,
    delUserLikeFromkList,
    getuserFollowList,
} from '../../API/Campaign/ApiCampaign';
import { getAppVersions } from '../../API/Profile/User/ApiProfile';

import moment from 'moment';
import DeviceInfo from 'react-native-device-info';
import { getUserId } from '../../SupportingFIles/Utills';

var currentdatetoday = new Date();
var currentdate = moment(currentdatetoday).format('YYYY-MM-DD');

class HomeStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }
    isLoading = true;
    campaignStatusLoading = true;
    compaignsList = [];
    compaignsListPaid = null;
    compaignsListShoutout = null;
    compaignsListsponsored = null;
    compaignsListcommissionBased = null;
    compaignsListeventsAppearence = null;
    compaignsListphotoshootVideo = null;
    fetchedCampaignData = null;
    offSetlength = 20;
    skip = 0;
    isRefreshing = false;
    lastFetchedCount = 20;
    showMessageUpdateVersion = false;
    isAppUpdate = false;
    isRefreshinghome = false;
    filterData = null;
    CampaignLikeList = [];
    CampaignCommentList = [];
    UserLoginID = 0;
    likeUserFilterList = [];
    isLoadingLikelist = false;
    FollowerUserlist = [];
    setCompaigns = (data) => {
        this.compaignsList = data;
    };

    SetcompaignsListPaid = (compaignsListPaid) => {
        this.compaignsListPaid = compaignsListPaid;
    };

    setcompaignsListShoutout = (compaignsListShoutout) => {
        this.compaignsListShoutout = compaignsListShoutout;
    };

    setcompaignsListsponsored = (compaignsListsponsored) => {
        this.compaignsListsponsored = compaignsListsponsored;
    };

    setcompaignsListcommissionBased = (compaignsListcommissionBased) => {
        this.compaignsListcommissionBased = compaignsListcommissionBased;
    };

    setcompaignsListeventsAppearence = (compaignsListeventsAppearence) => {
        this.compaignsListeventsAppearence = compaignsListeventsAppearence;
    };

    setcompaignsListphotoshootVideo = (compaignsListphotoshootVideo) => {
        this.compaignsListphotoshootVideo = compaignsListphotoshootVideo;
    };

    setShowForceUpdatePopup = (isAppUpdate) => {
        this.isAppUpdate = isAppUpdate;
    };

    setshowMessageUpdateVersion = (showMessageUpdateVersion) => {
        this.showMessageUpdateVersion = showMessageUpdateVersion;
    };

    setisRefreshinghome = (isRefreshinghome) => {
        this.isRefreshinghome = isRefreshinghome;
    };

    setisLoading = (isLoading) => {
        this.isLoading = isLoading;
    };
    setisLoadingLikelist = (isLoadingLikelist) => {
        this.isLoadingLikelist = isLoadingLikelist;
    };
    setCampaignLikeList = (CampaignLikeList) => {
        this.CampaignLikeList = CampaignLikeList;
    };

    setCampaignCommentList = (CampaignCommentList) => {
        this.CampaignCommentList = CampaignCommentList;
    };

    setlikeUserFilterList = (likeUserFilterList) => {
        this.likeUserFilterList = likeUserFilterList;
    };

    setUserLoginID = (UserLoginID) => {
        this.UserLoginID = UserLoginID;
    };
    setFollowerUserlist = (FollowerUserlist) => {
        this.FollowerUserlist = FollowerUserlist;
    };

    getCampaignsPaid = () => {
        var filterWherePaid = {
            campaignStatus: { gt: 1 },
            campaignType: 'paid',
            endStoryPostDate: { gte: currentdate },
            isDisabled: 0,
        };
        let condition = '';
        condition = {
            limit: 10,
            //skip:this.skip,
            where: filterWherePaid,
            order: ['featurePosition ASC', 'updatedAt DESC'],
        };

        if (this.isRefreshinghome) {
            this.setisRefreshinghome(false);
        }

        console.log('condition===', condition);
        getCampaigns(condition)
            .then((response) => {
                const { status, data } = response;
                console.log('response home new paid:', response);

                if (status === 200) {
                    this.SetcompaignsListPaid(data);
                }
            })
            .catch((error) => {
                console.log('response home error:', error);
            });
    };

    getCampaignsshoutout = () => {
        var filterWhere = {
            campaignStatus: { gt: 1 },
            campaignType: 'shoutout',
            endStoryPostDate: { gte: currentdate },
            isDisabled: 0,
        };
        let condition = '';
        condition = {
            limit: 10,
            //skip:this.skip,
            where: filterWhere,
            order: ['featurePosition ASC', 'updatedAt DESC'],
        };
        getCampaigns(condition)
            .then((response) => {
                const { status, data } = response;
                console.log('response home shoutout:', response.data);

                if (status === 200) {
                    this.setcompaignsListShoutout(data);
                }
            })
            .catch((error) => {
                console.log('response home error:', error);
            });
    };

    getCampaignssponsored = () => {
        var filterWhere = {
            campaignStatus: { gt: 1 },
            campaignType: 'sponsored',
            endStoryPostDate: { gte: currentdate },
            isDisabled: 0,
        };
        let condition = '';
        condition = {
            limit: 10,
            //skip:this.skip,
            where: filterWhere,
            order: ['featurePosition ASC', 'updatedAt DESC'],
        };
        getCampaigns(condition)
            .then((response) => {
                const { status, data } = response;
                console.log('response home new sponsored:', response.data);

                if (status === 200) {
                    this.setcompaignsListsponsored(data);
                }
            })
            .catch((error) => {
                console.log('response home error:', error);
            });
    };

    getCampaignsCommissionBased = () => {
        var filterWhere = {
            campaignStatus: { gt: 1 },
            campaignType: 'commissionBased',
            endStoryPostDate: { gte: currentdate },
            isDisabled: 0,
        };
        let condition = '';
        condition = {
            limit: 10,
            //skip:this.skip,
            where: filterWhere,
            order: ['featurePosition ASC', 'updatedAt DESC'],
        };
        getCampaigns(condition)
            .then((response) => {
                const { status, data } = response;
                console.log('response home new:', response.data);

                if (status === 200) {
                    this.setcompaignsListcommissionBased(data);
                }
            })
            .catch((error) => {
                console.log('response home error:', error);
            });
    };

    getCampaignsEventsAppearence = () => {
        var filterWhere = {
            campaignStatus: { gt: 1 },
            campaignType: 'eventsAppearence',
            endStoryPostDate: { gte: currentdate },
            isDisabled: 0,
        };
        let condition = '';
        condition = {
            limit: 10,
            //skip:this.skip,
            where: filterWhere,
            order: ['featurePosition ASC', 'updatedAt DESC'],
        };
        getCampaigns(condition)
            .then((response) => {
                const { status, data } = response;
                console.log('response home new:', response.data);

                if (status === 200) {
                    this.setcompaignsListeventsAppearence(data);
                }
            })
            .catch((error) => {
                console.log('response home error:', error);
            });
    };

    getCampaignsPhotoshootVideo = () => {
        var filterWhere = {
            campaignStatus: { gt: 1 },
            campaignType: 'photoshootVideo',
            endStoryPostDate: { gte: currentdate },
            isDisabled: 0,
        };
        let condition = '';
        condition = {
            limit: 10,
            //skip:this.skip,
            where: filterWhere,
            order: ['featurePosition ASC', 'updatedAt DESC'],
        };
        getCampaigns(condition)
            .then((response) => {
                const { status, data } = response;
                console.log('response home photoshootVideo:', response.data);

                if (status === 200) {
                    this.setcompaignsListphotoshootVideo(data);
                }
            })
            .catch((error) => {
                console.log('response home error:', error);
            });
    };

    getAllCampaignWithPagination = (campaignType) => {
        console.log('this.offSetlength==', this.offSetlength);
        if (!this.isRefreshing) {
            this.setRefreshing(true);

            var filterWhere = {
                campaignStatus: { gt: 1 },
                campaignType: campaignType,
                endStoryPostDate: { gte: currentdate },
                isDisabled: 0,
            };

            if (this.filterData !== null) {
                filterWhere = Object.assign({}, filterWhere, this.filterData);
            }
            console.log(
                'condition home getAllCampaignWithPagination:',
                JSON.stringify(filterWhere),
            );

            let condition = '';
            condition = {
                limit: this.offSetlength,
                skip: this.skip,
                where: filterWhere,
                include: ['remarks', 'likes', 'profile', 'comments'],
                order: ['featurePosition ASC', 'updatedAt DESC'],
            };
            getCampaigns(condition)
                .then((response) => {
                    const { status, data } = response;
                    console.log('response home getAllCampaignWithPagination:', response);

                    if (status === 200) {
                        this.setFetchedCampaignData(data);
                    }
                })
                .catch((error) => {
                    this.setRefreshing(false);
                    console.log('response getAllCampaignWithPagination error:', error);
                });
        }
    };
    setFetchedCampaignData = (campaignData) => {
        if (this.fetchedCampaignData === null) {
            this.fetchedCampaignData = campaignData;
        } else {
            this.fetchedCampaignData = [...this.fetchedCampaignData, ...campaignData];
        }
        this.skip = this.fetchedCampaignData.length;
        this.lastFetchedCount = campaignData.length;

        this.isRefreshing = false;
    };

    resetData = () => {
        this.fetchedCampaignData = null;
        this.offSetlength = 20;
        this.skip = 0;
        this.isRefreshing = false;
        this.lastFetchedCount = 20;
        this.setFilterData(null);
    };
    setRefreshing = (refreshing) => {
        this.isRefreshing = refreshing;
    };
    setFilterData = (data) => {
        this.filterData = data;
    };

    getAndCheckAppVersion = () => {
        getAppVersions()
            .then((response) => {
                const { status, data } = response;
                //this.setLoading(false)
                console.log('response getAndCheckAppVersion:', response);
                const currentAppVersion = DeviceInfo.getVersion();
                if (status === 200 && !data.error) {
                    console.log(
                        'currentAppVersion Ios',
                        data[0].iosVersion,
                        currentAppVersion,
                    );
                    console.log(
                        'currentAppVersion Android',
                        data[0].androidVersion,
                        currentAppVersion,
                    );
                    if (Platform.OS === 'ios') {
                        if (
                            currentAppVersion < data[0].iosVersion &&
                            data[0].isForceUpdate
                        ) {
                            setTimeout(() => {
                                this.setShowForceUpdatePopup(true);
                            }, 1000);
                        }
                        if (currentAppVersion < data[0].iosVersion) {
                            this.setshowMessageUpdateVersion(true);
                        }
                    } else if (Platform.OS === 'android') {
                        if (
                            currentAppVersion !== data[0].androidVersion &&
                            data[0].isForceUpdate
                        ) {
                            setTimeout(() => {
                                this.setShowForceUpdatePopup(true);
                            }, 1000);
                        }

                        if (currentAppVersion < data[0].androidVersion) {
                            this.setshowMessageUpdateVersion(true);
                        }
                    }
                }
            })
            .catch((error) => {
                this.setLoading(false);
            });
    };
    getMostAppliedRecentCampaigns = (campaignType) => {
        this.resetData();

        this.setRefreshing(true);
        getUserId().then((userId) => {
            const queryParam = `${userId}&campaignType=${campaignType}`;
            getMostappliedrecent(queryParam)
                .then((response) => {
                    this.setRefreshing(false);
                    const { status, data } = response;
                    if (status === 200) {
                        console.log('response:==1', data.data);

                        this.setFetchedCampaignData(data.data);
                    }
                })
                .catch((error) => {
                    this.setRefreshing(false);
                    // console.log('error in fetching campaign list =', error)
                });
        });
    };
    getMostAppliedCampaignsList = (campaignType) => {
        this.resetData();

        this.setRefreshing(false);
        getUserId().then((userId) => {
            const queryParam = `${userId}&campaignType=${campaignType}`;
            getMostAppliedCampaigns(queryParam)
                .then((response) => {
                    this.setRefreshing(false);
                    const { status, data } = response;
                    if (status === 200) {
                        console.log('response:==2', data.data);

                        this.setFetchedCampaignData(data.data);
                    }
                })
                .catch((error) => {
                    this.setRefreshing(false);
                    // console.log('error in fetching campaign list =', error)
                });
        });
    };

    postCampaignLike = (campaignId) => {
        //  this.setisLoading(true)
        const param = { where: { campaignId: campaignId } };
        getCampaignByLike(param)
            .then((response) => {
                console.log('Campaign Like', response.data);
                if (response.data.length > 0) {
                    const likedCampaign = response.data.some(
                        (el) => el.ownerId === this.UserLoginID,
                    );

                    console.log('likedCampaign1', likedCampaign);
                    if (!likedCampaign) {
                        getUserId().then((userId) => {
                            const paramlike = { ownerId: userId, campaignId: campaignId };
                            PostCampaignLikes(paramlike)
                                .then((responselike) => {
                                    console.log('like Api response:', responselike);
                                })
                                .catch((error) => {
                                    // this.setisLoading(false)
                                });
                        });
                    }
                } else {
                    console.log('likedCampaign2', '2');

                    getUserId().then((userId) => {
                        const params = { ownerId: userId, campaignId: campaignId };
                        PostCampaignLikes(params)
                            .then((postresponse) => {
                                //  this.setisLoading(false)
                                console.log('like Api response:', postresponse);
                            })
                            .catch((error) => {
                                // this.setisLoading(false)
                            });
                    });
                }

                this.setisLoadingLikelist(false);
            })
            .catch((error) => {
                console.log('Campaign Like error', error);

                this.setisLoadingLikelist(false);
            });
    };

    getLikeByCampaign = (campaignId) => {
        this.setisLoadingLikelist(true);
        const param = {
            where: { campaignId: campaignId },
            include: ['profile'],
            order: ['createdAt DESC'],
        };
        getCampaignByLike(param)
            .then((response) => {
                const { status, data } = response;
                console.log('Campaign Like', response);
                if (status === 200 && !data.error) {
                    this.setisLoadingLikelist(false);
                    if (response.data.length > 0) {
                        var arrNew = [];
                        for (let index = 0; index < response.data.length; index++) {
                            arrNew = response.data;
                            var newItem = arrNew[index];
                            newItem.isFollowed = false;
                            arrNew[index] = newItem;
                        }
                        console.log('arrNew', arrNew);
                        const result = arrNew.map(
                            ({ ownerId, isFollowed, createdAt, id, modifiedAt, profile }) => ({
                                ownerId,
                                createdAt: createdAt,
                                id: id,
                                modifiedAt: modifiedAt,
                                profile: profile,
                                isFollowed:
                                    isFollowed ||
                                    this.FollowerUserlist.some(
                                        (item) => item.followUserId === ownerId,
                                    ),
                            }),
                        );
                        console.log('result', result);
                        this.setCampaignLikeList(result);
                        this.setlikeUserFilterList(result);
                    }
                }
            })
            .catch((error) => {
                console.log('Campaign Like error', error);

                this.setisLoadingLikelist(false);
            });
    };

    // delUserLikeList = (likeid) => {
    //     if (likeid !== "") {
    //         delUserLikeFromkList(likeid).then(response => {
    //             // if (response.data.count === 1) {

    //             // }
    //         })
    //     }
    // }

    delUserLikeList = (campaignId) => {
        const param = { where: { campaignId: campaignId } };
        getCampaignByLike(param)
            .then((response) => {
                const { data } = response;
                if (data.length > 0) {
                    const likeData = response.data.filter(
                        (el) => el.ownerId === this.UserLoginID,
                    );
                    if (likeData.length > 0) {
                        delUserLikeFromkList(likeData[0].id).then((delresponse) => {
                            console.log('response delete data', delresponse.data);
                        });
                    }
                }
            })
            .catch((error) => {
                console.log('Campaign Delete error', error);
            });

        // if (likeid !== "") {
        //     delUserLikeFromkList(likeid).then(response => {
        //         // if (response.data.count === 1) {

        //         // }
        //     })
        // }
    };

    postCommentOnCampaign = (campaignId, comment) => {
        getUserId().then((userId) => {
            const param = {
                ownerId: userId,
                campaignId: campaignId,
                commentText: comment,
            };

            PostComment(param)
                .then((response) => {
                    console.log('Comment Api response:', response.data);
                })
                .catch((error) => {
                    // this.setisLoadingLikelist(false)
                });
        });
    };

    getCommentByCampaign = (campaignId) => {
        this.setisLoadingLikelist(true);
        const param = {
            where: { campaignId: campaignId },
            include: ['profile'],
            order: ['createdAt DESC'],
        };
        getCampaignByComment(param)
            .then((response) => {
                this.setisLoadingLikelist(false);
                const { status, data } = response;

                if (status === 200 && !data.error) {
                    this.setCampaignCommentList(response.data);
                }
            })
            .catch((error) => {
                this.setisLoadingLikelist(false);
            });
    };

    getUserFollowesList = () => {
        getUserId().then((userId) => {
            const param = { where: { ownerId: userId } };
            console.log('param==', param);
            getuserFollowList(param)
                .then((response) => {
                    const { status, data } = response;
                    console.log('response.data1', response.data);
                    if (status === 200 && !data.error) {
                        console.log('response.data2', response.data);
                        this.setFollowerUserlist(response.data);
                    }
                })
                .catch((error) => {
                    //this.setisLoadingLikelist(false)
                });
        });
    };
}
decorate(HomeStore, {
    compaignsList: observable,
    compaignsListPaid: observable,
    compaignsListShoutout: observable,
    compaignsListsponsored: observable,
    compaignsListcommissionBased: observable,
    compaignsListeventsAppearence: observable,
    compaignsListphotoshootVideo: observable,
    fetchedCampaignData: observable,
    isRefreshing: observable,
    lastFetchedCount: observable,
    isAppUpdate: observable,
    showMessageUpdateVersion: observable,
    isRefreshinghome: observable,
    filterData: observable,
    isLoading: observable,
    UserLoginID: observable,
    likeUserFilterList: observable,
    isLoadingLikelist: observable,
    CampaignCommentList: observable,
    FollowerUserlist: observable,

    setCompaigns: action,
    SetcompaignsListPaid: action,
    setcompaignsListShoutout: action,
    setcompaignsListsponsored: action,
    setcompaignsListcommissionBased: action,
    setcompaignsListeventsAppearence: action,
    setcompaignsListphotoshootVideo: action,
    getAllCampaignWithPagination: action,
    setFetchedCampaignData: action,
    resetData: action,
    setRefreshing: action,
    setShowForceUpdatePopup: action,
    setshowMessageUpdateVersion: action,
    setisRefreshinghome: action,
    setFilterData: action,
    setisLoading: action,
    setUserLoginID: action,
    setlikeUserFilterList: action,
    setisLoadingLikelist: action,
    setCampaignCommentList: action,
    setFollowerUserlist: action,
});

export default HomeStore;