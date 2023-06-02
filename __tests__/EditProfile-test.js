import { render, fireEvent } from 'react-native-testing-library';
import * as React from "react";
import { Provider } from "mobx-react";
import EditProfileTest from "../App/Components/Profile/Screen/EditProfile";
import store from '../App/Stores/RootStore';
import { strings } from '../App/Locales/i18';
import { LoggedInUser } from "../__mocks__/helpers/users";

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

let loggedInUser = LoggedInUser;
let posts = [];
let isLoading = true;
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
const settingsStore = {};
const addressStore = {};
const params = {};
const createTestProps = (props: Object) => ({
    navigation: {
        setOptions: () => {},
        navigate: () => {},
        addListener: () => {}
    },
    route: params,
    ...props
});
let props = createTestProps({});

test('save my profile', () => {
  const mockFn = jest.fn();

  const { getAllByA11yLabel, getByText } = render(
    <Provider {...store}>
        <EditProfileTest {...props} MyProfileStore={mockMyProfileStore} AuthStore={mockAuthStore} SettingsStore={settingsStore} AddressStore={addressStore} />
    </Provider>
  );

  const answerInputs = getAllByA11yLabel('answer input');

//   fireEvent.changeText(answerInputs[0], 'a1');
//   fireEvent.changeText(answerInputs[1], 'a2');
  fireEvent.press(getByText(strings('Save')));

  expect(mockFn).toBeCalledWith({
    '1': { q: 'q1', a: 'a1' },
    '2': { q: 'q2', a: 'a2' },
  });
});