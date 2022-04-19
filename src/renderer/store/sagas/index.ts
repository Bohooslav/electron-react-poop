import { put, takeEvery, all } from 'redux-saga/effects';
import { Difficulty, GameReacord } from '../../types';

export function* setDifficulty(event: {
  type: string;
  difficulty: Difficulty;
}) {
  yield put({ type: 'SET_DIFFICULTY_FROM_SAGAS', payload: event.difficulty });
}

export function* saveGame(event: { type: string; games: GameReacord[] }) {
  yield put({ type: 'SAVE_GAME_FROM_SAGAS', payload: event.games });
}

export default function* rootSaga() {
  yield all([
    takeEvery('SET_DIFFICULTY', setDifficulty),
    takeEvery('SAVE_GAME', saveGame),
  ]);
}
