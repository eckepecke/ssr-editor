import { io } from 'socket.io-client';

let socket;

export const initializeSocket = (SERVER_URL, roomId, setCurrentDocumentContent) => {
    socket = io(SERVER_URL);

    if (roomId) {
        socket.emit('joinRoom', roomId);
    }

    socket.on('receiveUpdate', (newContent) => {
        setCurrentDocumentContent(newContent);
    });
};

export const sendDocumentUpdate = (roomId, newContent) => {
    if (socket) {
        socket.emit('documentUpdate', { roomId, content: newContent });
    }
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
    }
};
