import { action, observable, decorate } from 'mobx';

import { getBlockUserList, delUserfromList } from '../../API/Profile/User/ApiProfile';

import { getUserId } from '../../SupportingFIles/Utills'

class BlockUserStore {
    constructor(rootStore) {
        this.rootStore = rootStore
    }
    isLoading = false
    BlockUserList = []
    refreshing = false
    blockUserFilterList = []

    setBlockUserList = (BlockUserList) => {
        this.BlockUserList = BlockUserList
    }

    setisLoading = (loading) => {
        this.isLoading = loading
        this.refreshing = loading
    }
    setIsRefreshing = (refreshing) => {
        this.refreshing = refreshing
    }
    setblockUserFilterList=(blockUserFilterList)=>
    {
        this.blockUserFilterList = blockUserFilterList
    }

    getBlockUserList = () => {
        this.setisLoading(true)       
         getUserId().then(userid => {
            
            const param = { "include": ["profile"], "where": { "ownerId": userid }, order: "id DESC" }
            getBlockUserList(param).then(response => {
                this.setisLoading(false)
                this.setBlockUserList(response.data)
                this.setblockUserFilterList(response.data)
                console.log("response", response.data)

            })

        })

    }

    delUserfromBlockList = (blockid) => {
        delUserfromList(blockid).then(response => {

            this.getBlockUserList()
            this.setisLoading(false)



        })
    }

}

decorate(BlockUserStore, {
    BlockUserList: observable,
    isLoading: observable,
    refreshing: observable,
    blockUserFilterList: observable,

    setBlockUserList: action,
    setisLoading: action,
    getBlockUserList: action,
    setIsRefreshing: action,
    setblockUserFilterList:action,



})
export default BlockUserStore
