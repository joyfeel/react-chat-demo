import { call, select, all, put, takeLeading } from 'redux-saga/effects';
import {
    arrayUnion,
    doc,
    setDoc,
    getDoc,
    updateDoc,
} from 'firebase/firestore'
import { chatActions } from './slice';
import { fireStore } from '../../utils/firebaseStore';
import { generateString } from '../../utils/utils';

export function* handleJoinRoom({ payload }) {
    try {
        yield put(chatActions.setLoading(true));

        let { roomCode, userName } = payload;

        if (!userName) {
            userName = yield select((state) => state.chat.userName);
        }

        const roomsRef = doc(fireStore, 'rooms', roomCode);
        const roomSnap = yield call(getDoc, roomsRef);
        const roomSnapData = roomSnap.data()

        if (roomSnap.exists()) {
            window.localStorage.setItem('userName', userName)
            window.localStorage.setItem('roomCode', roomCode)

            yield call(setDoc, roomsRef, {
                ...roomSnapData,
                users: {
                    ...roomSnapData.users,
                    [userName]: {
                        userName,
                    }
                }
            });

            yield put(chatActions.setChatRoom(roomSnapData));
            yield put(chatActions.setRoomCode(roomCode));
            yield put(chatActions.closeModal());
        } else {
            yield put(chatActions.setRoomCode(''));
        }

        yield put(chatActions.setLoading(false));
    } catch (error) {
        yield put(chatActions.setLoading(false));
    }
}

export function* handleCreateRoom({ payload }) {
    try {
        const { userName } = payload;
        yield put(chatActions.setLoading(true));
        const roomCode = generateString(4);
        const roomsRef = doc(fireStore, 'rooms', roomCode);

        const roomDocData = {
            messages: [],
            code: roomCode,
            users: {
                [userName]: {
                    userName,
                }
            },
        }

        yield call(setDoc, roomsRef, roomDocData);
        yield put(chatActions.setRoomCode(roomCode));
        yield call(handleJoinRoom, {
            payload: {
                roomCode
            }
        });
        yield put(chatActions.setLoading(false));
    } catch (error) {
        yield put(chatActions.setLoading(false));
    }
}

export function* handleLeaveRoom() {
    try {
        yield put(chatActions.clearChatRoom());
        yield put(chatActions.setRoomCode(''));
        yield put(chatActions.setUserName(''));
        yield put(chatActions.openModal());

        window.localStorage.removeItem('userName')
        window.localStorage.removeItem('roomCode')
    } catch (error) {

    }
}

export function* handleSendMessage({ payload }) {
    try {
        const { userName, roomCode, content } = payload;
        const roomRef = doc(fireStore, 'rooms', roomCode)
        const roomSnap = yield call(getDoc, roomRef);
        const roomSnapData = roomSnap.data()

        const messageData = {
            userName,
            content,
            createdAt: Date.now(),
        }

        yield call(updateDoc, roomRef, {
            messages: arrayUnion(messageData),
            typing: {
                ...roomSnapData.typing,
                [userName]: false,
            }
        })
    } catch (error) {

    }
}

export function* handleTypingMessage({ payload }) {
    try {
        const { roomCode, userName, typing = false } = payload;
        const roomRef = doc(fireStore, 'rooms', roomCode)

        yield call(updateDoc, roomRef, {
            typing: {
                [userName]: typing,
            }
        })
    } catch (error) {

    }
}

export function* handleRoomSnapshot({ payload }) {
    try {
        const { docData } = payload;
        yield put(chatActions.setLoading(true));
        yield put(chatActions.setChatRoom(docData))
        yield put(chatActions.setLoading(false));
    } catch (error) {
        yield put(chatActions.setLoading(false));
    }
}

export default function* watch() {
    yield all([
        takeLeading(chatActions.createRoom, handleCreateRoom),
        takeLeading(chatActions.joinRoom, handleJoinRoom),
        takeLeading(chatActions.leaveRoom, handleLeaveRoom),
        takeLeading(chatActions.sendMessage, handleSendMessage),
        takeLeading(chatActions.typingMessage, handleTypingMessage),
        takeLeading(chatActions.listenRoomSnapshot, handleRoomSnapshot),
    ]);
}