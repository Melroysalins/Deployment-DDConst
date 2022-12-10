import { FILTER } from '../types';

const changeFilter = (bool) => ({
  type: FILTER.CHANGE_FILTER,
  bool,
});

const updateFilterValues = (key, value) => ({
  type: FILTER.UPDATE_FILTER_VALUES,
  key,
  value,
});

const clearFilters = () => ({
  type: FILTER.CLEAR_FILTERS,
});

export default { changeFilter, updateFilterValues, clearFilters };
