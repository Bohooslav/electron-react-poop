import { put, takeEvery, all } from 'redux-saga/effects';
import { Difficulty } from '../../types';

export function* workerSaga(event: { type: string; difficulty: Difficulty }) {
  yield put({ type: 'SET_DIFFICULTY_FROM_SAGAS', payload: event.difficulty });
}

export default function* rootSaga() {
  yield all([takeEvery('SET_DIFFICULTY', workerSaga)]);
}
