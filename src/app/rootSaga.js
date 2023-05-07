import { all, fork } from "redux-saga/effects";
import chatSagas from "../features/chat/saga";

export default function* rootSaga() {
    yield all([fork(chatSagas)]);
}