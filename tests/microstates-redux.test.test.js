import expect from 'expect';

import { valueOf } from 'microstates';

import { createStore, combineReducers } from 'redux';
import { createReducer, enhancer } from '../index';

describe('@microstates/redux', () => {
  describe('a single microstate with no initial value', () => {
    let store;
    beforeEach(function() {
      store = createStore(createReducer([Number]), enhancer);
    });
    it('has an initial state as a microstaten', function() {
      expect(valueOf(store.getState())).toEqual([]);
    });
    describe('invoking a transition', function() {
      beforeEach(function() {
        store.getState().push(10);
      });
      it('updates the state', function() {
        expect(valueOf(store.getState())).toEqual([10]);
      });
      describe('transitioning as a nested microstate', function() {
        beforeEach(function() {
          expect(store.getState().length).toBe(1);
          let [ first ] = store.getState();
          first.increment();
        });
        it('transitions the store as expected', function() {
          expect(valueOf(store.getState())).toEqual([11]);
        });
      });
    });
  });
  describe('a single microstate with an initial value', () => {
    let store;
    beforeEach(function() {
      store = createStore(createReducer([Number], [5, 1, 2]), enhancer);
    });
    it('has an initial state as a microstaten', function() {
      expect(valueOf(store.getState())).toEqual([5, 1, 2]);
      let [ first ] = store.getState();
      expect(first.state).toEqual(5);
    });
  });
  describe('in a store with non-microstate reducers', () => {
    let store;
    beforeEach(() => {
      let reducer = combineReducers({
        array: createReducer([Number]),
        count: (state = 0, action) => {
          if (action.type === 'INCREMENT') {
            return state + 1;
          } else {
            return state;
          }
        }
      })

      store = createStore(reducer, enhancer);
    });

    it('has the microstate', function() {
      expect(store.getState().array.length).toEqual(0);
      expect(valueOf(store.getState().array)).toEqual([]);
    });

    it('has the non-microstate', function() {
      expect(store.getState().count).toEqual(0);
    });

    describe('dispatching a microstate transition', function() {
      beforeEach(function() {
        store.getState().array.push(10);
      });
      it('updates the microstate', function() {
        expect(store.getState().array.length).toEqual(1);
        expect(valueOf(store.getState().array)).toEqual([10]);
      });
      it('does not update the non-microstate', function() {
        expect(store.getState().count).toEqual(0);
      });
    });

    describe('dispatching a non-microstate transition', function() {
      beforeEach(function() {
        store.dispatch({ type: 'INCREMENT' });
      });
      it('updates the non-microstate', function() {
        expect(store.getState().count).toEqual(1);
      });
      it('does not update the microstate', function() {
        expect(store.getState().array.length).toEqual(0);
      });
    });
  });
  describe('combined with independent string and number microstates', () => {
    let store;
    beforeEach(function() {
      store = createStore(combineReducers({
        number: createReducer(Number, 41),
        string: createReducer(String, 'hello')
      }), enhancer);
    });
    it('initializes both microstates independently', function() {
      expect(store.getState().number.state).toEqual(41);
      expect(store.getState().string.state).toEqual('hello');
    });
    describe('dispatching a transition on the number', function() {
      beforeEach(function() {
        store.getState().number.increment();
      });
      it('increments the number', function() {
        expect(store.getState().number.state).toEqual(42);
      });
      it('leaves the string alone', function() {
        expect(store.getState().string.state).toEqual('hello');
      });
    });
    describe('dispatching a transition on the string', function() {
      beforeEach(function() {
        store.getState().string.concat(' world');
      });
      it('adds to the string', function() {
        expect(store.getState().string.state).toEqual('hello world');
      });
      it('leaves the number alone', function() {
        expect(store.getState().number.state).toEqual(41);
      });
    });
  });
});
