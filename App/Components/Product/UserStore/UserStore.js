import React, { Component,useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    SafeAreaView
} from 'react-native';
import { inject, observer } from 'mobx-react';
import Loader from '../../../SupportingFIles/Loader';
import { strings } from '../../../Locales/i18';
import styles from './styles'
import images from '../../../Themes/Images';
import metrics from '../../../Themes/Metrics';
import { commonStyles } from '../../../SupportingFIles/Constants';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import UserProducts from '../UserProducts/UserProducts'
import MerchantDashboard from '../MerchantDashboard/MerchantDashboard'
import colors from '../../../Themes/Colors';
import ShoppingBasketPlaceholder from '../../../Assets/Images/ShoppingBasketPlaceholder';

const initialLayout = { width: metrics.width };

const UserStore = ({navigation,ProductStore}) => {
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
      { key: 'first', title: 'Dashboard' },
      { key: 'second', title: 'Live' },
      { key: 'third', title: 'Sold' },
      // { key: 'fourth', title: 'Inactive' },
    ]); 
  
    // const renderScene = SceneMap({
    //   first: <UserProducts/>,
    //   second: renderNoItems,
    //   third: renderNoItems,
    // });
    const renderScene = ({ route, jumpTo }) => {
      switch (route.key) {
        case 'first':
          return <MerchantDashboard navigation={navigation} tab={'live'}/>;
        case 'second':
          return <UserProducts navigation={navigation} tab={'live'}/>;
        case 'third':
          return renderNoItems();
          case 'fourth':
            return  renderNoItems();
      }
    };
    useEffect(() => {
      navigation.addListener('focus', () => {
       ProductStore.getProductsData(true)
      });

        // Update the document title using the browser API
               navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity style={{ ...commonStyles.backButtonContainer }}
                    onPress={() => navigation.goBack()}
                >
                    <Image source={images.backImage} />
                </TouchableOpacity>
            ),
        }
        )
      });
    return (
        <SafeAreaView style={styles.mainContainer}>
        {/* <Loader loading={isLoading} /> */}
        <TabView
        renderTabBar={props => <TabBar 
            {...props} indicatorStyle={{ backgroundColor: colors.app_Blue }}
        style={{ backgroundColor: colors.white }}
        renderLabel={({ route, focused, color }) => (
            <Text style={focused ? styles.activeTabTextStyle : styles.inactiveTabTextStyle}>
              {route.title}
              {/* {route.key === "first" ? ` (${ProductStore.userProducts.length})` : ""} */}
            </Text>
          )}
        />}
      
navigationState={{ index, routes }}
renderScene={renderScene}
onIndexChange={setIndex}
initialLayout={initialLayout}
/>
        {/* <TouchableOpacity style={styles.viewAddProduct} onPress={()=>navigation.navigate("AddProduct")}>
            <Image style={styles.imagePlus} source={images.plusIcon}></Image>
        </TouchableOpacity> */}
    </SafeAreaView>
    );
   function renderNoItems(){
      return(
      <View style = {{alignItems: 'center', height: '90%', justifyContent: 'center'}}>
          {/* <View style={{width:200,height:200, flex:1}}> */}
          <ShoppingBasketPlaceholder  width="100"
          height="100"/>

          {/* </View> */}
        <Text style = {{...commonStyles.LatoBold_16, marginTop: metrics.dimen_10, width:"80%", textAlign:"center"}}>{'Currently there is no product in this section'}</Text>
      </View>)
    }
  }
// class UserStore extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             index:0,
//             routes: [
//                 { key: 'first', title: 'Live' },
//                 { key: 'second', title: 'Sold' },
//                 { key: 'second', title: 'Inactive' },
//               ]
//         };
//     }
//     componentDidMount() {
//         this.props.navigation.setOptions({
//             headerLeft: () => (
//                 <TouchableOpacity style={{ ...commonStyles.backButtonContainer }}
//                     onPress={() => this.props.navigation.goBack()}
//                 >
//                     <Image source={images.backImage} />
//                 </TouchableOpacity>
//             ),
//         }
//         )
//     }
   
//     render() {
//         const { isLoading, products } = this.props.ProductStore
//         return (
//             <SafeAreaView style={styles.mainContainer}>
//                 {/* <Loader loading={isLoading} /> */}
//                 <TabView
//       navigationState={{ index, routes }}
//       renderScene={renderScene}
//       onIndexChange={setIndex}
//       initialLayout={initialLayout}
//     />
//                 <TouchableOpacity style={styles.viewAddProduct} onPress={()=>this.props.navigation.navigate("AddProduct")}>
//                     <Image style={styles.imagePlus} source={images.plusIcon}></Image>
//                 </TouchableOpacity>
//             </SafeAreaView>
//         );
//     }
// }

export default inject("ProductStore", "AuthStore")(observer(UserStore))
