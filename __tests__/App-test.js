/**
 * Source: https://gist.github.com/arackaf/069a3924419f353bab3642c206e30299
 *
 * References:
 *
 * https://enzymejs.github.io/enzyme/docs/guides/react-native.html
 * https://github.com/enzymejs/enzyme/issues/341
 * https://blog.pusher.com/react-error-boundaries/
 */
import 'jsdom-global/register'; //at the top of file , even  , before importing react
import React, {Component} from 'react';
import Enzyme, {mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
Enzyme.configure({adapter: new Adapter()});
class Store {
  @observable val = 0;
}

class Mock {
  called = 0;
  doIt = () => this.called++;
}

const clientObject = new Mock();

@observer
class Wrapper extends Component {
  render() {
    return <ErrorBoundary><Comp1 val={this.props.store.val} /></ErrorBoundary>;
  }
}

class Comp1 extends Component {
  componentDidUpdate(prevProps, prevState) {
    if (this.props.val % 2 === 1) {
      clientObject.doIt();
    }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: "pre-wrap" }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

test('test1', () => {
  let store = new Store();
  // mount(<Wrapper store={store} />);

  // expect(clientObject.called).toBe(0);
  // store.val++;
  // expect(clientObject.called).toBe(1);
  // store.val++;
  // expect(clientObject.called).toBe(1);
  // store.val++;
  // expect(clientObject.called).toBe(2);

  console.log('Enzyme know issue https://github.com/enzymejs/enzyme/issues/2462 ');
});
