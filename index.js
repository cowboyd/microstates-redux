import { filter, foldl } from 'funcadelic';
import { create, promap, pathOf, valueOf, Meta, isArrayType, mount } from 'microstates';

let ids = 0;

export function createReducer(Type, initialValue) {
  let id = ids++;
  let reduxStore;

  return (state = initialValue, action = {}) => {
    let start = create(Type, valueOf(state));

    if (action.type === '@@MICROSTATES/INIT') {
      reduxStore = action.store;
      return proxy(start);
    } else if (action.type.startsWith('M:') && action.id === id) {
      let microstate = action.path.reduce((microstate, key) => {
        if (isArrayType(microstate)) {
          let value = valueOf(microstate)[key];
          return mount(microstate, create(microstate.constructor.T, value), key);
        } else {
          return microstate[key];
        }
      }, start);
      let next = microstate[action.transitionName](...action.args);
      return valueOf(next) === valueOf(state) ? state : proxy(next);
    } else {
      if (state != null) {
        return state;
      } else {
        return proxy(start);
      }
    }

    // wrap a microstate representing the current state in a dispatch proxy.
    function proxy(microstate) {
      return promap(node => {
        let Dispatch = DispatchType(node.constructor.Type, pathOf(node), reduxStore);
        return new Dispatch(valueOf(node));
      }, x => x,  microstate);
    }
  };


  // Create a dispatch class for Type, path, and a store.
  // A dispatch instance wraps a microstate at a given path, and
  // dispatches a redux action to perform a state transition.
  function DispatchType(Type, P, store) {
    class Dispatch extends Type {
      static name = `Dispatch<${Type.name}>`;
      constructor(value) {
        super(value);
        Object.defineProperty(this, Meta.symbol, { enumerable: false, configurable: true, value: new Meta(this, value)});
      }
    }

    let methods = Object.keys(methodsOf(Type)).concat(["set"]);

    Object.assign(Dispatch.prototype, foldl((methods, transitionName) => {
      methods[transitionName] = function(...args) {
        store.dispatch({
          type: `M:${Type.name}#${transitionName}@/${P.join('/')}`,
          id,
          transitionName,
          path: P,
          args
        });
      };
      return methods;
    }, {}, methods));

    return Dispatch;
  }
}

// In microstates, every transition method needs a reference to
// the store so that it can dispatch transition actions. This enhancer just
// dispatches an action to pass the store to the microstate reducer..
//
// This should probably be the outer-most enhancer since the store
// created by this enhancer will be the one that microstate actions
// dispatch to.
export function enhancer(createStore) {
  return (...args) =>  {
    let store = createStore(...args);
    store.dispatch({
      type: '@@MICROSTATES/INIT',
      store
    });
    return store;
  };
}


// collect the transition methods of `Type`,
function methodsOf(Type) {
  return filter(({ key: name, value: desc }) => {
    return name !== 'constructor' && name !== 'set' && typeof name === 'string' && typeof desc.value === 'function';
  }, Object.getOwnPropertyDescriptors(Type.prototype));
}
