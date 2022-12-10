export const getSelectValue = (value) => (typeof value === 'string' ? value.split(',') : value);

export const isNotEmpty = (value) => !isEmpty(value);
export const isEmpty = (value) =>
  !value ||
  (Array.isArray(value) && value.length === 0) ||
  (typeof value === 'object' && Object.keys(value).length === 0);

export const dummyArray = (name, count = 10) => [...Array(count).keys()].map((e) => `${name} ${e}`);
