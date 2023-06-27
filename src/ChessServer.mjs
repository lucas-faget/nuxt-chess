import { Server } from "socket.io";

export class ChessServer
{
    io;
    maxPlayerCount = 0;
    sockets = [];

    constructor()
    {
        this.io = new Server(8000, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        this.io.on("connection", (socket) => 
        {
            this.sockets.push(socket);

            // For the first player connected
            // Get the total number of player of the game
            if (this.sockets.length === 1) {
                console.log("First player connected");

                socket.on("setPlayerCount", (playerCount) => {
                    this.maxPlayerCount = playerCount;
                })
            }

            // When the lobby is full
            // Assign players randomly
            if (this.sockets.length === this.maxPlayerCount) 
            {
                console.log("Both players connected");

                let randomIndex = Math.floor(Math.random() * this.maxPlayerCount);

                this.sockets.forEach((socket, index) => {
                    this.io.to(socket.id).emit(
                        "assignPlayer", 
                        index === 0 ? randomIndex : (1 - randomIndex)
                    );
                });
            }

            // Listen move event from a socket
            // Send the move to other sockets
            socket.on("move", (move) => {
                console.log("move");
                for (const otherSocket of this.sockets) 
                {
                    if (socket.id !== otherSocket.id) {
                        this.io.to(otherSocket.id).emit("move", move);
                    }
                }
            });
        });
    }
}
