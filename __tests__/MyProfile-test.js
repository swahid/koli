import { render, waitFor } from 'react-native-testing-library';
// import { render } from "react-testing-library";
import * as React from "react";
import { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Provider } from "mobx-react";
import MyProfileTest from "../App/Components/Profile/Screen/MyProfile";
// import MyProfileTest from "../App/Components/Profile/Screen/MyProfileTest";
import { LoggedInUser } from "../__mocks__/helpers/users";
import { NavigationContainer } from '@react-navigation/native';
import MockedNavigator from "../__mocks__/MockedNavigator";
jest.mock('../../SupportingFIles/countries.json', () => (
    [ 
      {"name": "Afghanistan", "code": "AF"}, 
      {"name": "Åland Islands", "code": "AX"}, 
      {"name": "Albania", "code": "AL"}
    ]
  ),
  {
    virtual: true
  }
);
jest.mock('react-native-aws3', () => ({
  put: jest.fn(),
}));
import store from '../App/Stores/RootStore';

let loggedInUser = LoggedInUser;
let posts = [];
let isLoading = false;
const mockMyProfileStore = {
  userName: 'tylim',
  firstName: 'ty',
  lastName: 'lim',
  userImage: 'tylim.png',
  city: 'SG',
  country: 'SG',
  bio: 'KOLI founder',
  instaUserName: '@tylim',
  instaaccounttype: 'business',
  KoliUserFollowerscount: 1,
  KoliUserFollowingcount: 3,
  blogUrl: 'https://koli.ai',
  updatelastMyProfileVisit: () => {},
  isLoading,
  posts,
  ...loggedInUser
};
const mockAuthStore = {
  isLoading,
  setNavigation: () => {}
};

const settingsStore = {

};

const addressStore = {

};

const createTestProps = (props: Object) => ({
  navigation: {
    setOptions: () => {},
    navigate: () => {},
    addListener: () => {}
  },
  ...props
});
let props = createTestProps({});

describe("rendering", () => {
  const MyProfileScreen = () => { 
    return (
      <MyProfileTest {...props} MyProfileStore={mockMyProfileStore} AuthStore={mockAuthStore} SettingsStore={settingsStore} AddressStore={addressStore} />
    )
  }
  // const component = <Provider {...store}>
  //   <MockedNavigator
  //     component={MyProfileScreen}
  //   />
  // </Provider>;
  const component = <Provider {...store}>MyProfileScreen</Provider>;;
  // const component = MyProfileScreen;
  let bio, bioText;
  beforeEach(() => {
    const { getByTestId, findByText } = render(component);
    // const { getByTestId, findByText } = await waitFor(() => render(component));
    bio = getByTestId("bio");
    bioText = findByText('KOLI founder');
  })

  it("should render a bio <Text/>", () => {
    console.log(`bio = ${bio}`)
    // expect(bioText).toBeInTheDocument();
    expect(bio).not.toBe(null);
  });

  // it("should contain a child text", () => {
  //   console.log(typeof bio)
  //   console.log(Object.values(bio))
  //   console.log(Object.values(bio)[1] && Object.values(bio)[1].children)
  //   let bioText = (Object.values(bio)[1] && Object.values(bio)[1].children) || (bio.children && bio.children[0])
  //   expect(bioText).toBe('I am Shaikh');
  // });

  // it("should be the same snapshot", () => {
  //   const {toJSON} = render(component);
  //   expect(toJSON()).toMatchSnapshot();    
  // });

});
