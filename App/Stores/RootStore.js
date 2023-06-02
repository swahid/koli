
import { configure } from 'mobx';
import AuthStore from './Auth/AuthStore'
import MyProfileStore from './Profile/MyProfileStore'
import UserProfileStore from './Profile/UserProfileStore'
import InfluencerStore from './Influencer/InfluencerStore'
import InfluencerSearchStore from './Influencer/InfluencerSearchStore'
import CompaignsStore from './Campaign/CompaignsStore'
import CreateCampaignStore from './Campaign/CreateCampaignStore'
import ApplicantListStore from './Campaign/ApplicantListStore'
import HelpStore from './Profile/HelpStore'
import ChatStore from './ChatStore'
import NotificationStore from './Notification/NotificationStore'
import SettingsStore from './Settings/SettingsStore'
import ProductStore from './Products/ProductStore'
import AddressStore from './Products/AddressStore'
import BlockUserStore from './Profile/BlockUserStore'
import HomeStore from './Campaign/HomeStore'



configure({ enforceActions: "observed" })

class RootStore{
    constructor(){
        this.AuthStore = new AuthStore(this);
        this.CompaignsStore = new CompaignsStore(this);
        this.MyProfileStore = new MyProfileStore(this)
        this.CreateCampaignStore = new CreateCampaignStore(this)
        this.ApplicantListStore = new ApplicantListStore(this)
        this.UserProfileStore = new UserProfileStore(this)
        this.InfluencerStore=new InfluencerStore(this)
        this.InfluencerSearchStore=new InfluencerSearchStore(this)
        this.HelpStore=new HelpStore(this)
        this.ChatStore=new ChatStore(this)
        this.NotificationStore=new NotificationStore(this)
        this.SettingsStore=new SettingsStore(this)
        this.ProductStore=new ProductStore(this)
        this.AddressStore=new AddressStore(this)
        this.BlockUserStore=new BlockUserStore(this)
        this.HomeStore=new HomeStore(this)
        
        
    }
}
const rootStore = new RootStore();

export default rootStore;
