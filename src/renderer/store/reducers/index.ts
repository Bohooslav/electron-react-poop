import { access } from 'fs/promises';

import { FieldSquare, StoreState } from '../../types';

// Get games data for initial state from localStorage
const initial: StoreState = {
  difficulty: 'junior',
  // poops: 5,
  poops: 10,
  width: 9,
  height: 9,
  games: JSON.parse(localStorage.getItem('games') || '[]'),
};

export default function reducer(state: StoreState = initial, action: any) {
  switch (action.type) {
    case 'SET_DIFFICULTY_FROM_SAGAS': {
      return {
        ...state,
        ...action.payload,
      };
    }
    case 'SAVE_GAME_FROM_SAGAS': {
      window.localStorage.setItem('games', JSON.stringify(action.payload));
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return state;
  }
}
