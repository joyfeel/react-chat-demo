
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Button from '../Button';
import Input from '../Input';
import { chatActions } from '../../features/chat/slice'
import './LobbyModal.scss';

const LobbyModal = () => {
    const { isOpenModal } = useSelector((state) => state.chat)

    const [formError, setFormeError] = useState({
        'userName': false,
        'roomCode': false,
    });

    const { userName, roomCode } = useSelector((state) => state.chat)
    const dispatch = useDispatch()

    const handleChangeUserName = (e) => {
        dispatch(chatActions.setUserName(e.target.value));
    };

    const handleChangeRoomCode = (e) => {
        dispatch(chatActions.setRoomCode(e.target.value));
    }

    const handleCreateRoom = () => {
        if (!userName) {
            setFormeError(formError => {
                return {
                    ...formError,
                    'userName': !userName,
                    'roomCode': false,
                }
            })
            return;
        }

        dispatch(chatActions.createRoom({
            userName,
        }));
        dispatch(chatActions.openModal());
    }

    const handleEnterRoom = () => {
        if (!userName || !roomCode) {
            setFormeError(formError => {
                return {
                    ...formError,
                    'userName': !userName,
                    'roomCode': !roomCode,
                }
            })
            return;
        }

        dispatch(chatActions.joinRoom({
            userName,
            roomCode,
        }));
    }

    useEffect(() => {
        if (roomCode) {
            dispatch(chatActions.joinRoom({
                userName,
                roomCode,
            }));
        }
    }, [])

    if (!isOpenModal) {
        return null;
    }

    return (
        <div className="modal">
            <div className="modal__box">
                <h1 className="modal__title">Lobby</h1>
                <div className="modal__fields">
                    <Input
                        type="text"
                        id="userName"
                        label="User Name"
                        placeholder="Your user name"
                        onChange={handleChangeUserName}
                        value={userName}
                        error={formError['userName']}
                        errorMessage='User name is required.'
                    />
                    <Input
                        type="text"
                        id="roomCode"
                        label="Room Code"
                        placeholder="Your room code"
                        onChange={handleChangeRoomCode}
                        value={roomCode}
                        error={formError['roomCode']}
                        errorMessage='Room code is required.'
                    />
                </div>
                <div className='modal__actions'>
                    <Button onClick={handleCreateRoom}>Create</Button>
                    <Button onClick={handleEnterRoom}>Enter</Button>
                </div>
            </div>
        </div>
    )
}

LobbyModal.displayName = 'Modal';

export default LobbyModal;