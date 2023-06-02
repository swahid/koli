import { action, observable, decorate } from 'mobx';
import {
  getCampaignDetails,
  transferCampaignAmount,
  payoutAmountToUser,
  ShortListedRemark,
  getClientTokenPayPal,
  checkoutPaypalUsingNonce,
  releaseUserPayment,
  SubmitReview,
} from '../../API/Campaign/ApiCampaign';
// import { showFlashBanner } from '../../SupportingFIles/Utills';
import { getUserDetail } from '../../API/Profile/User/ApiProfile';
import { strings } from '../../Locales/i18';
import {
  getUserId,
  showAlert,
  getAccessToken,
  showFlashBanner,
} from '../../SupportingFIles/Utills';

class ApplicantListStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }
  isLoading = false;
  applicantList = [];
  suggestedUsers = [];
  selectedUser = '';
  showMakeOfferPopup = false;
  reloadApplicantsList = false;
  campaignDetails = '';
  SortBy = '';
  payPalToken = '';

  setisLoading = (loading) => {
    this.isLoading = loading;
  };
  setApplicantList = (jobList) => {
    this.applicantList = jobList;
  };
  setSuggestedList = (usersList) => {
    this.suggestedUsers = usersList;
  };
  setSelectedUser = (user) => {
    this.selectedUser = user;
  };
  setMakeOfferPopupStatus = (status) => {
    this.showMakeOfferPopup = status;
  };
  setReloadApplicantsList = (status, id) => {
    if (status === true) {
      this.getApplicantList(id);
    }
  };

  setcampaignDetails = (campaignDetails) => {
    this.campaignDetails = campaignDetails;
  };

  setSortBy = (SortBy) => {
    this.SortBy = SortBy;
  };
  getApplicantList = (campaignId, responseCallback) => {
    this.setisLoading(true);
    getCampaignDetails(campaignId)
      .then((response) => {
        this.setisLoading(false);
        const { status, data } = response;
        console.log('getApplicantList:==', response);
        if (status === 200 && !data.error) {
          this.setApplicantList(data.remarksoncampains);
          this.setcampaignDetails(data.campaigndetails);
          this.setSuggestedList(data.suggestedUser);
          if (responseCallback !== undefined) {
            responseCallback('success');
          }
        }
      })
      .catch((error) => {
        this.setisLoading(false);
      });
  };

  getApplicantListsubmitreview = (campaignId) => {
    this.setisLoading(true);
    getCampaignDetails(campaignId)
      .then((response) => {
        this.setisLoading(false);
        const { status, data } = response;
        console.log('getApplicantList:===', response);
        console.log('shortlisted:===', data.remarksoncampains);
        if (status === 200 && !data.error) {
          this.setApplicantList(data.remarksoncampains);
          this.setcampaignDetails(data.campaigndetails);
          this.setSuggestedList(data.suggestedUser);
        }
      })
      .catch((error) => {
        this.setisLoading(false);
      });
  };

  releasePayment = (userID) => {
    this.setisLoading(true);
    const param = { where: { ownerId: userID } };

    getUserDetail(param)
      .then((response) => {
        console.log('response releasePayment:', response);
        //this.setisLoading(false)
        const { status, data } = response;
        if (status === 200 && !data.error) {
          this.onTransferAmount(data[0]);
        } else if (status === 200 && data.error) {
          this.setisLoading(false);
          showFlashBanner('', data.message);
        }
      })
      .catch((error) => {
        this.setisLoading(false);
      });
  };
  onRelaseCampaignAmount = (paramsToSend) => {
    console.log('paramsToSend :', paramsToSend);
    this.setisLoading(true);

    transferCampaignAmount(paramsToSend)
      .then((response) => {
        console.log('response onTransferAmount:', response);
        this.setisLoading(false);
        const { status, data } = response;
        if (status === 200 && !data.error) {
          showFlashBanner(data.message, strings('Successfull_Payout'));
        } else if (status === 200 && data.error) {
          this.setisLoading(false);
          showFlashBanner('', data.message);
        }
      })
      .catch((error) => {
        this.setisLoading(false);
      });
  };
  onTransferAmount = (userData) => {
    console.log('userData :', userData);
    if (
      userData.stripeBankAccountId !== null &&
      userData.stripeBankAccountId !== ''
    ) {
      const paramsToSend = {
        stripeAccountNumber: userData.stripeBankAccountId,
        ownerId: userData.ownerId,
        isPaymentReleased: 1,
      };
      transferCampaignAmount(paramsToSend)
        .then((response) => {
          console.log('response onTransferAmount:', response);
          // this.setisLoading(false)
          const { status, data } = response;
          if (status === 200 && !data.error) {
            this.onPayoutAmount(userData);
          } else if (status === 200 && data.error) {
            this.setisLoading(false);
            showFlashBanner('', data.message);
          }
        })
        .catch((error) => {
          this.setisLoading(false);
        });
    } else {
      this.setisLoading(false);
      showFlashBanner('', 'No Bank account added for the recipient user');
    }
  };
  onPayoutAmount = (userData) => {
    const paramsToSend = {
      ownerId: userData.ownerId,
    };
    payoutAmountToUser(paramsToSend)
      .then((response) => {
        console.log('response payoutAmountToUser:', response);
        this.setisLoading(false);
        const { status, data } = response;
        if (status === 200 && !data.error) {
          showFlashBanner(data.message, strings('Successfull_Payout'));
        } else if (status === 200 && data.error) {
          this.setisLoading(false);
          showFlashBanner('', data.message);
        }
      })
      .catch((error) => {
        this.setisLoading(false);
      });
  };

  remarkShortlisted = (remarkID, Status, campaignid) => {
    console.log('remarkID,Status', remarkID, Status);
    const paramsToSend = {
      shortlisted: Status,
    };
    ShortListedRemark(remarkID, paramsToSend)
      .then((response) => {
        console.log('response', response.data);
        const { data } = response;
        if (data.count) {
          this.getApplicantList(campaignid);
        }
      })
      .catch((error) => {
        this.setisLoading(false);
      });
  };

  getPayPalToken = () => {
    getClientTokenPayPal().then((response) => {
      const { data } = response;
      this.payPalToken = data;
    });
  };
  initiatePaypalPayment = (param, responseCallback) => {
    console.log('initiatePaypalPayment param:', param);
    this.setisLoading(true);
    getUserId().then((userId) => {
      getAccessToken().then((accessToken) => {
        const dataParams = { ...param, ...{ ownerId: userId } };
        console.log('report initiatePaypalPayment dataParams =', dataParams);

        checkoutPaypalUsingNonce(accessToken, dataParams)
          .then((response) => {
            console.log('report initiatePaypalPayment response =', response);
            this.setisLoading(false);
            const { status, data } = response;
            if (status === 200 && !data.error) {
              //this.setCampaignReported(true)
              //showAlert('', strings('Your_payment_was_successful'))
              this.getApplicantList(param.campaignId, responseCallback);
            } else {
              //showAlert('', 'Payment not completed')
              responseCallback('failure');
              //   showAlert('', strings('SomethingWentWrong'))
            }
          })
          .catch((error) => {
            this.setLoading(false);
          });
      });
    });
  };
  releasePaymentPaypal = (param, responseCallback) => {
    console.log('releasePayment param:', param);
    this.setisLoading(true);
    getUserId().then((userId) => {
      getAccessToken().then((accessToken) => {
        const dataParams = { ...param, ...{ ownerId: userId } };
        console.log('report releasePayment dataParams =', dataParams);

        releaseUserPayment(accessToken, dataParams)
          .then((response) => {
            console.log('report releasePayment response =', response);
            this.setisLoading(false);
            const { status, data } = response;
            if (status === 200 && !data.error) {
              //this.setCampaignReported(true)
              //showAlert('', 'Payment sent to user')
              responseCallback('success');
              //this.getApplicantList(param.campaignid)
            } else {
              //showAlert('', 'Payment not completed')
              responseCallback('failure');
              //   showAlert('', strings('SomethingWentWrong'))
            }
          })
          .catch((error) => {
            this.setLoading(false);
          });
      });
    });
  };

  submitReview = (param, campaignId) => {
    //this.setisLoading(true)
    SubmitReview(param, campaignId)
      .then((response) => {
        this.setisLoading(false);
        const { status, data } = response;
        //console.log('param:', param)
        console.log('getSubmitResponce:', response.data);
        if (status === 200 && !data.error) {
          this.getApplicantList(campaignId);
        }
      })
      .catch((error) => {
        this.setisLoading(false);
      });
  };
}

decorate(ApplicantListStore, {
  isLoading: observable,
  applicantList: observable,
  suggestedUsers: observable,
  selectedUser: observable,
  showMakeOfferPopup: observable,
  reloadApplicantsList: observable,
  campaignDetails: observable,
  SortBy: observable,
  payPalToken: observable,

  setisLoading: action,
  setApplicantList: action,
  getApplicantList: action,
  setSuggestedList: action,
  setSelectedUser: action,
  setMakeOfferPopupStatus: action,
  setReloadApplicantsList: action,
  releasePayment: action,
  setcampaignDetails: action,
  setSortBy: action,
  getPayPalToken: action,
  initiatePaypalPayment: action,
  releasePaymentPaypal: action,
});
export default ApplicantListStore;