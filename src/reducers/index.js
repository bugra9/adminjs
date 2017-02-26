import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { system } from './system';
import { tree } from './tree';
import { documents } from './documents';

export default combineReducers({
  routing: routerReducer,
  system,
  tree,
  documents
});