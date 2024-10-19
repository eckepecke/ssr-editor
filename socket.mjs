import { Server } from "socket.io";

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log(`New user connected: ${socket.id}`);

        // Anslut till ett rum baserat på dokumentets ID
        socket.on('joinRoom', (roomId) => {
            console.log(`${socket.id} joined room: ${roomId}`);
            socket.join(roomId);
        });

        socket.on('documentUpdate', (data) => {
            console.log(`Document update in room ${data.roomId}: `, data.content);
            socket.to(data.roomId).emit('receiveUpdate', data.content);  // Skicka till andra i rummet
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });

    return io;
};

export default initializeSocket;
