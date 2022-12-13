import { initStateFilters } from './context';
import { MainActionType } from './types';

const mainReducer = (state, action) => {
  switch (action.type) {
    case MainActionType.CHANGE_FILTER:
      return {
        ...state,
        filters: {
          ...state.filters,
          isfilterOpen: action.bool,
        },
      };
    case MainActionType.UPDATE_FILTER_VALUES:
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.name]: action.payload.value,
        },
      };
    case MainActionType.CLEAR_FILTERS:
      return {
        ...state,
        filters: initStateFilters,
      };

    default:
      return state;
  }
};

export default mainReducer;
