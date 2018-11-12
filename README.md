<!--
[![npm](https://img.shields.io/npm/v/@microstates/redux.svg)](https://www.npmjs.com/package/@microstates/redux)
[![bundle size (minified +
gzip)](https://badgen.net/bundlephobia/minzip/@microstates/redux)](https://bundlephobia.com/result?p=microstates/redux)
[![CircleCI](https://circleci.com/gh/microstates/redux.svg?style=shield)](https://circleci.com/gh/microstates/redux)
-->
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Created by The Frontside](https://img.shields.io/badge/created%20by-frontside.io-blue.svg)](https://frontside.io)


# @microstates/redux

Microstates + Redux = ❤

[Microstates][1] are primitives for expressing rich immutable data
structures along with the valid operations that can act upon
them. [Redux][2] is an immutable data store with first-class tooling used
by developers around the globe. Put them together for a truly breezy
development experience.

With `@microstates/redux` you can experience the pleasure of using
Redux without any of the headaches. Among other things:

- **No need to write reducers.** They're implicit to the type. If you have a
  `Number`, you get all number operations for free. Same for `Array`,
  `Object`, `String`, and all your custom types.
- **No need to write actions or action creators.** They're implicit to the
  type.
- **No need for third party property selector libraries.** The properties
  of a type are implicit to that type.
- **No stress about accidentally creating extra
  objects.** Microstates let's you use `===` everywhere.

Users of `react-redux` will appreciate:

- **dead simple `mapStateToProps`.**
- **no need for `mapDispatchToProps` ever again.** Because let's face it:
  nobody except for Dan ever knew what the hell that did anyway.


## Usage

To use a microstate inside your redux store, you use the
`createReducer` function coupled with the microstate store enhancer.

``` js
import { createReducer, enhancer } from '@microstates/redux';

// reducer for a `Number` microstate with initial value 5
let reducer = createReducer(Number, 5);

let store = createStore(reducer, enhancer);
```

That's it! Now the state of the store is a microstate and I can begin
invoking its methods to dispatch actions!

``` javascript
store.getState().increment();
store.getState().increment();
store.getState().state //=> 7
```

Yes, despite what the internet has come to make us believe, Redux
_can_ be this simple.

[1]: https://github.com/microstates/microstates.js
[2]: https://redux.js.org
