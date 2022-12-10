import { FILTER } from '../types';

const INITIAL_STATE = {
  isfilterOpen: false,
  companies: [],
  projects: [],
  employees: [],
  time: '',
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FILTER.CHANGE_FILTER:
      return {
        ...state,
        isfilterOpen: action.bool,
      };
    case FILTER.UPDATE_FILTER_VALUES:
      return {
        ...state,
        [action.key]: action.value,
      };
    case FILTER.CLEAR_FILTERS:
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default reducer;
