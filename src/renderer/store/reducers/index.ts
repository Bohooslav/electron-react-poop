import { StoreState } from '../../types';

const initial: StoreState = {
  poops: 10,
  width: 9,
  height: 9,
};

export default function reducer(state: StoreState = initial, action: any) {
  switch (action.type) {
    case 'SET_DIFFICULTY_FROM_SAGAS': {
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return state;
  }
}
