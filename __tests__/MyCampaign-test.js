import * as React from "react";
import MyCampaignTest from "../App/Components/Campaign/Screen/MyCampaignTest";
import { render } from 'react-native-testing-library';
// import { render } from "react-testing-library";
import { MyCompaigns } from "../__mocks__/helpers/campaigns";

let myCompaignsList = MyCompaigns;
let updatedsearch = null
let isLoading = false
let isRefreshingMyCampaign = false
const mockCompaignsStore = {
  updatedsearch,
  myCompaignsList,
  isLoading,
  isRefreshingMyCampaign
}

const createTestProps = (props: Object) => ({
  navigation: {
    setOptions: () => {},
    navigate: () => {},
    addListener: () => {}
  },
  ...props
});
let props = createTestProps({});

const { getByTestId, getByText } = render(<MyCampaignTest {...props} CompaignsStore={mockCompaignsStore} />);
const list = getByTestId("list");
const text1 = getByText('Dfdsfds')
const text2 = getByText('Dfd gd')
const text3 = getByText('Yeh haha')
// const items = list.querySelector('[renderItem]')

describe("rendering", () => {
  it("should render a <FlatList/>", () => {
    expect(list).not.toBe(null);
  });
  it("should find all the text inside <FlatList/>", () => {
    expect(text1).not.toBe(null);
    expect(text2).not.toBe(null);
    expect(text3).not.toBe(null);
  });
});
