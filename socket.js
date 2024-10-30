const { Server } = require("socket.io");

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: (origin, callback) => {
                const allowedOrigins = [
                    'http://localhost:3000', 
                    'https://jsramverk-eroo23.azurewebsites.net', 
                    'https://www.student.bth.se/~eroo23/editor', 
                    'https://www.student.bth.se/',
                    'https://www.student.bth.se'
                ];

                if (allowedOrigins.includes(origin) || !origin) {
                    callback(null, true);
                } else {
                    console.error('CORS error: Not allowed by CORS socket');
                    callback(new Error('Not allowed by CORS socket'));
                }
            },
            methods: ["GET", "POST", "OPTIONS"]
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

module.exports = initializeSocket;