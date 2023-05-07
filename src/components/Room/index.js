
import { useState, useEffect, useRef, useTransition } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { doc, onSnapshot } from 'firebase/firestore'
import { fireStore } from '../../utils/firebaseStore';
import { chatActions, makeSelectTyping } from '../../features/chat/slice'
import Button from '../Button';
import Input from '../Input';
import Modal from '../LobbyModal';
import './Room.scss';

const Room = () => {
    const dispatch = useDispatch()
    const scrollPosRef = useRef();
    const { userName, roomCode, chatRoom, loading, isOpenModal } = useSelector((state) => state.chat)
    const typing = useSelector(makeSelectTyping());
    const [message, setMessage] = useState('');

    const handleLeaveRoom = () => {
        dispatch(chatActions.leaveRoom());
    }

    const handleSubmitMessage = (e) => {
        e.preventDefault();
        dispatch(chatActions.sendMessage({
            userName,
            roomCode,
            content: message,
        }));
        setMessage('')
    }

    const handleChangeMessage = (e) => {
        dispatch(chatActions.typingMessage({
            roomCode,
            userName,
            typing: true,
        }));

        setMessage(e.target.value)

        setTimeout(() => {
            dispatch(chatActions.typingMessage({
                roomCode,
                userName,
                typing: false,
            }));
        }, 3000)
    }

    const ChatMessage = (props) => {
        const { message, isMe } = props;
        const { userName, content } = message

        return (
            <div className={`room__message ${isMe ? 'room__message--me' : 'room__message--other'}`}>
                <div className='room__content'>
                    {content}
                </div>
                <div className='room__username'>
                    {userName}
                </div>
            </div >
        );
    }

    console.log(typing)

    useEffect(() => {
        if (chatRoom.code !== '') {
            const roomsRef = doc(fireStore, 'rooms', chatRoom.code);
            onSnapshot(roomsRef, (doc) => {
                if (doc.data()) {
                    dispatch(chatActions.listenRoomSnapshot({
                        docData: doc.data(),
                    }));
                }
            });
        }
    }, [chatRoom.code])

    useEffect(() => {
        scrollPosRef?.current?.scrollIntoView({
            behavior: 'smooth',
        });
    }, [chatRoom.messages.length])

    useEffect(() => {
        dispatch(chatActions.openModal());
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }

    if (isOpenModal) {
        return <Modal />;
    }

    return (
        <div className='room'>
            <div className='room__header'>
                <h1 className='room__title'>Room: {roomCode}</h1>
                <Button onClick={handleLeaveRoom}>Leave Room</Button>
            </div>
            <div className='room__messages'>
                {chatRoom?.messages?.map(message => {
                    return (
                        <ChatMessage
                            key={message.createdAt}
                            message={message}
                            isMe={message.userName === userName}
                        />
                    )
                })}
                <span ref={scrollPosRef} />
            </div>

            {typing ?
                <div className='room__typing'>
                    Someone is typing....
                </div>
                : null
            }
            <form onSubmit={handleSubmitMessage} className='room__form'>
                <Input
                    type='text'
                    placeholder='Message...'
                    value={message}
                    onChange={handleChangeMessage}
                />
                <Button onClick={handleSubmitMessage} type="submit" isDisabled={!message}>Send</Button>
            </form>
        </div>
    );
}
export default Room;