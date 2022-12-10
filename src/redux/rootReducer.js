import { combineReducers } from 'redux';

import { filter } from './reducers';

const rootReducer = combineReducers({
  filter,
});

export default rootReducer;
