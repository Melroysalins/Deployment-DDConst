import { TEActionType } from './types';

const teReducer = (state, action) => {
  console.log(state, action);
  switch (action.type) {
    case TEActionType.UPDATE_EVENTS:
      return {
        ...state,
        events: action.payload,
      };

    case TEActionType.UPDATE_RESOURCES:
      return {
        ...state,
        resources: action.payload,
      };
    case TEActionType.BEEP:
      return {
        ...state,
        beep: action.payload,
      };
    default:
      return state;
  }
};

export default teReducer;
