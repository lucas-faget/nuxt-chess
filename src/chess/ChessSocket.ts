import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";

import { PlayerColor } from "./enums/PlayerColor";
import type { Move } from "./moves/Move";
import { Chess } from "./Chess";
import type { ChessVariant } from "@/enums/ChessVariant";
import type { Player } from "./players/Player";

export class ChessSocket extends Chess
{
    myPlayerIndex: number;
    socket: Socket;

    constructor(variant: ChessVariant, customJson?: Object, players?: Player[]) {
        super(variant, customJson, players);
        this.myPlayerIndex = 0;

        this.socket = io("http://localhost:8000");

        this.socket.on("connect", () => {
            console.log("Connected to server");
        });

        this.socket.emit("setPlayerCount", this.players.length);
          
        this.socket.on("assignPlayer", (playerIndex: number) => 
        {
            this.myPlayerIndex = playerIndex;
            console.log("I play " + this.players[this.myPlayerIndex].name);
            if (this.players[this.myPlayerIndex].color === PlayerColor.Black) {
                this.isChessboardSpun = true;
            }
            this.controller.calculateMoves(this);
        });

        this.socket.on("move", (move) => 
        {
            this.saveMove(this.controller.getLegalMove(move.fromSquareName, move.toSquareName)!);
        });
    }

    canPlay(): boolean
    {
        return this.itsMyTurn() && this.isCurrentMoveTheLast();
    }

    itsMyTurn(): boolean
    {
        return this.controller.player === this.players[this.myPlayerIndex];
    }

    saveMove(move: Move): void
    {
        if (this.itsMyTurn()) {
            this.socket.emit("move", {
                fromSquareName: move.fromSquare.name,
                toSquareName: move.toSquare.name
            });
        }
        this.goToLastMove();
        move.carryoutMove();
        this.savedMoves.push(move);
        this.currentMoveIndex = this.savedMoves.length;
        this.updateAdvantage(move);
        this.updateCurrentPlayer();
        this.controller.calculateMoves(this);
    }

    deleteLastMove(): void
    {
        /* Disabled */
    }
}
