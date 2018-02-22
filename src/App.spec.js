import React from 'react';
import axios from 'axios';
import App, { doIncrement, doDecrement, Counter, fetchCounter } from './';

describe('Business Logic', () => {
  it('should increment the counter in state', () => {
    const state = { counter: 0 };
    const newState = doIncrement(state);

    expect(newState.counter).to.equal(1);
  });

  it('should decrement the counter in state', () => {
    const state = { counter: 0 };
    const newState = doDecrement(state);

    expect(newState.counter).to.equal(-1);
  });
});

describe('App', () => {
  let result = [3, 5, 9];
  let promise = new Promise((resolve) => resolve(result));

  before(() => {
    sinon.stub(axios, 'get').withArgs('http://mydomain/counter').returns(promise);
  });

  after(() => {
    axios.get.restore();
  });

  it('renders the Counter wrapper', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find(Counter)).to.have.length(1);
  });

  it('passes all props to its child wrapper', () => {
    const wrapper = shallow(<App />);
    let counterWrapper = wrapper.find(Counter);

    expect(counterWrapper.props().counter).to.equal(0);

    wrapper.setState({ counter: -1 });

    counterWrapper = wrapper.find(Counter);
    expect(counterWrapper.props().counter).to.equal(-1);
  });

  it('increments the counter', () => {
    const wrapper = shallow(<App />);

    wrapper.setState({ counter: 0 });
    wrapper.find('button').at(0).simulate('click');

    expect(wrapper.state().counter).to.equal(1);
  });

  it('decrements the counter', () => {
    const wrapper = shallow(<App />);

    wrapper.setState({ counter: 0 });
    wrapper.find('button').at(1).simulate('click');

    expect(wrapper.state().counter).to.equal(-1);
  });

  it('calls render', () => {
    sinon.spy(App.prototype, 'render');

    const wrapper = mount(<App />);
    expect(App.prototype.render.calledOnce).to.equal(true);
  });

  it('fetches an async counter', () => {
    const wrapper = shallow(<App />);

    expect(wrapper.state().asyncCounter).to.equal(null);

    return promise.then(() => {
      expect(wrapper.state().asyncCounter).to.equal(result);
    });
  });
});