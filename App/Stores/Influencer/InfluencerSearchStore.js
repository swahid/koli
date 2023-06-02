import {action, observable, decorate} from 'mobx';
import {SearchInfluencer} from '../../API/Profile/User/ApiInfluencer';

class InfluencerSearchStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }
  isLoading = false;
  InfluencerList = [];
  userExist = false;
  hasNextPage = 0;
  end_curser = false;
  offSetlength = 20;
  updateSearch = '';
  searchedInfluencer = [];

  setEndCurser = (end_curser) => {
    this.end_curser = end_curser;
  };

  setInfluencerList = (InfluencerList) => {
    console.log('InfluencerList:', InfluencerList);
    this.InfluencerList = InfluencerList;
  };
  sethasNextPage = (hasNextPage) => {
    this.hasNextPage = hasNextPage;
  };

  setupdateSearch = (updateSearch) => {
    this.updateSearch = updateSearch;
    this.setsearchedInfluencer([]);
  };

  getSearchInfluencerList = (searchvalue) => {
    this.setIsLoading(true);
    const param = {searchkey: searchvalue, offset: this.hasNextPage};
    SearchInfluencer(param).then((response) => {
      console.log('Search Response:', response);
      this.setIsLoading(false);
      if (!response.data.error) {
        this.setInfluencerList(response.data.message);
        if (response.data.message.length == this.offSetlength) {
          this.hasNextPage = this.hasNextPage + response.data.message.length;
        }
      } else {
        this.setInfluencerList([]);
      }
    });
  };

  setIsLoading = (loading) => {
    this.isLoading = loading;
  };

  setsearchedInfluencer = (searchedInfluencer) => {
    this.searchedInfluencer = searchedInfluencer;
  };

  getSearchInfluencerNextPage = (searchvalue) => {
    const param = {searchkey: searchvalue, offset: this.hasNextPage};

    SearchInfluencer(param).then((response) => {
      let list = [];
      if (response.data.message.length === this.offSetlength) {
        this.hasNextPage = this.hasNextPage + 1;

        list = response.data.message
          ? [...this.InfluencerList, ...response.data.message]
          : this.InfluencerList;
      } else {
        list = response.data.message
          ? [...this.InfluencerList, ...response.data.message]
          : this.InfluencerList;
        this.setEndCurser(true);
      }

      this.hasNextPage = list.length;
      this.setInfluencerList(list);
    });
  };
}

decorate(InfluencerSearchStore, {
  InfluencerList: observable,
  isLoading: observable,
  updateSearch: observable,
  searchedInfluencer: observable,

  setInfluencerList: action,
  setIsLoading: action,
  getInfluencerList: action,
  sethasNextPage: action,
  setEndCurser: action,
  setupdateSearch: action,
  setsearchedInfluencer: action,
});
export default InfluencerSearchStore;