import { createSelector, createSlice } from '@reduxjs/toolkit';

const initialState = {
    userName: window.localStorage.getItem('userName') || '',
    roomCode: window.localStorage.getItem('roomCode') || '',
    chatRoom: {
        code: '',
        messages: [],
        users: {},
        typing: {},
    },
    isOpenModal: false,
    loading: false,
};

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setUserName: (state, action) => {
            state.userName = action.payload;
        },
        setRoomCode: (state, action) => {
            state.roomCode = action.payload;
        },
        setChatRoom: (state, action) => {
            state.chatRoom = {
                ...state.chatRoom,
                ...action.payload
            }
        },
        clearChatRoom: (state) => {
            state.chatRoom = initialState.chatRoom
        },
        openModal: (state) => {
            state.isOpenModal = true;
        },
        closeModal: (state) => {
            state.isOpenModal = false;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        createRoom: () => { },
        joinRoom: () => { },
        leaveRoom: () => { },
        sendMessage: () => { },
        typingMessage: () => { },
        listenRoomSnapshot: () => { },
    },
})

export const makeSelectTyping = () => createSelector((state) => state.chat.chatRoom.typing, (state) => state.chat.userName,
    (typing, userName) => {
        return Object.keys(typing).some((key) => {
            if (key !== userName) {
                return typing[key] === true;
            }

            return false;
        })
    });


export const { actions: chatActions, reducer: chatReducer } = chatSlice;

export default chatSlice.reducer;
