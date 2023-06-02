const axios = require('axios');
import Config from "react-native-config";
const Base_URL = Config.API_HOST
import { getUserId } from '../../../SupportingFIles/Utills';

const AllInfluencer = Base_URL + "api/featuredinfluencerslist"
const Searchinfluencerslist = Base_URL + "api/searchinfluencerslist"
const koliinfluencers = Base_URL + "api/koliinfluencers"
const searchkoliinfluencerslist = Base_URL + "api/searchkoliinfluencerslist"
const AppUsers = Base_URL+"api/AppUsers"


export const getAllInfluencer = async(OffsetValue,followercount, latitude, longitude,country,state) =>{
    try {
   
    //let url = AllInfluencer + '?offset=' +OffsetValue+ "&followers=" +followercount

    var url = koliinfluencers + '?offset=' +OffsetValue + "&followers=" +followercount
    if(followercount === 3)
    {
        url = url+"&latitude=" +latitude+"&longitude=" +longitude
    }
    else if(followercount === 4)
    {
        url = koliinfluencers + '?offset=' +OffsetValue+"&lastSeen=1"
    }
    else if(followercount==5){
        let params ={
            limit: OffsetValue==0?10:OffsetValue*10,
            where: {
              and: [
                {
                  tiktoklink: {
                    neq: ""
                  }
                },
                {
                  tiktoklink: {
                    neq: null
                  }
                }
              ]
            }
          }
              
        
        console.log(encodeURIComponent(JSON.stringify(params)))
        url = AppUsers+"?filter="+ encodeURIComponent(JSON.stringify(params))

    }
    else if(followercount==6){
        let params ={
            limit: OffsetValue==0?10:OffsetValue*10,
            where: {
              and: [
                {
                    facebookUsername: {
                    neq: ""
                  }
                },
                {
                    facebookUsername: {
                    neq: null
                  }
                }
              ]
            }
          }
              
        
        console.log(encodeURIComponent(JSON.stringify(params)))
        url = AppUsers+"?filter="+ encodeURIComponent(JSON.stringify(params))
       

    }
    else if(followercount==7){
        let params ={
            limit: OffsetValue==0?10:OffsetValue*10,
            where: {
              and: [
                {
                    youtubelink: {
                    neq: ""
                  }
                },
                {
                    youtubelink: {
                    neq: null
                  }
                }
              ]
            }
          }
              
        
        console.log(encodeURIComponent(JSON.stringify(params)))
        url = AppUsers+"?filter="+ encodeURIComponent(JSON.stringify(params))

    }
    else if(followercount==8){
        let params ={
            limit: OffsetValue==0?10:OffsetValue*10,
            where: {
              and: [
                {
                    twitterlink: {
                    neq: ""
                  }
                },
                {
                    twitterlink: {
                    neq: null
                  }
                }
              ]
            }
          }
              
        
        console.log(encodeURIComponent(JSON.stringify(params)))
        url = AppUsers+"?filter="+ encodeURIComponent(JSON.stringify(params))

    }
    else if(followercount==9){
        let params = {
            limit: OffsetValue==0?10:OffsetValue*10,
            where: {
              and: [
                {
                    linkedinlink: {
                    neq: ""
                  }
                },
                {
                    linkedinlink: {
                    neq: null
                  }
                }
              ]
            }
          }
              
        
        console.log(encodeURIComponent(JSON.stringify(params)))
        url = AppUsers+"?filter="+ encodeURIComponent(JSON.stringify(params))

    }
    else if(followercount==10){
        let params ={
            limit: OffsetValue==0?10:OffsetValue*10,
            where: {
              and: [
                {
                    clubhouselink: {
                    neq: ""
                  }
                },
                {
                    clubhouselink: {
                    neq: null
                  }
                }
              ]
            }
          }
              
        
        console.log(encodeURIComponent(JSON.stringify(params)))
        url = AppUsers+"?filter="+ encodeURIComponent(JSON.stringify(params))

    }
    else if(followercount==11){
        let params ={
            limit: OffsetValue==0?10:OffsetValue*10,
            where: {
              and: [
                {
                    twitchlink: {
                    neq: ""
                  }
                },
                {
                    twitchlink: {
                    neq: null
                  }
                }
              ]
            }
          }
              
        
        console.log(encodeURIComponent(JSON.stringify(params)))
        url = AppUsers+"?filter="+ encodeURIComponent(JSON.stringify(params))
    }else if(followercount==12){
      let params = {    
        limit: OffsetValue==0?10:OffsetValue*10,
        where:{       
         and:[         
             {             
              country:country
              }      
            ]    
           } 
        }
       
      
      console.log('-=-=-=-=-=-',JSON.stringify(params));
      url = AppUsers+"?filter="+ encodeURIComponent(JSON.stringify(params))
  }
  else if(followercount==13){
    let params = {    
      limit: OffsetValue==0?10:OffsetValue*10,
      where:{       
       and:[    
         {
           country:country
         },     
           {             
             state:state    
            }  
                
          ]    
         } 
      }
    console.log('-=-=-=-=-=-',JSON.stringify(params));
    console.log(encodeURIComponent(JSON.stringify(params)))
    url = AppUsers+"?filter="+ encodeURIComponent(JSON.stringify(params))
}
    
   
    console.log("url=======",url)

    if(followercount<5){
    await getUserId().then(userid => {
        if(userid !== null)
        {
            url = url+"&ownerId=" +userid
           
        }
      })
    }
      console.log("url=======",url)
    return axios.get(url)
    .then(response =>{
      console.log(';;',response)
    return response}
      )
    .catch(error => error)
    }catch(err){
      console.log(err)
    }
}

export const SearchInfluencer = async(param) =>{
    await getUserId().then(userid => {
        if(userid !== null)
        {
            param.ownerId = userid
        }

      })
    return axios.post(searchkoliinfluencerslist,param)
    .then(response => response)
    .catch(error => error)
}