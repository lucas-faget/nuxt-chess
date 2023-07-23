import { Piece } from "./pieces/Piece";
import type { Move } from "./moves/Move";
import { Chessboard } from "./Chessboard";
import { PlayerController } from "./players/PlayerController";
import type { Player } from "./players/Player";

export abstract class Chess
{
    players: Player[];
    controller: PlayerController;
    chessboard: Chessboard;
    savedMoves: Move[] = [];
    currentMoveIndex: number = 0;
    isChessboardSpun: boolean = false;

    constructor(json: any, players: Player[]) {
        this.players = players;
        this.chessboard = new Chessboard(json);
        this.controller = new PlayerController(this.players[0]);
    }

    abstract canPlay(): boolean;

    isCurrentMoveTheLast(): boolean
    {
        return this.currentMoveIndex === this.savedMoves.length;
    }

    updateCurrentPlayer(): void
    {
        this.controller.setPlayer(this.players[this.savedMoves.length % this.players.length]);
    }

    updateAdvantage(move: Move): void
    {
        if (move.capturedPiece) {
            this.controller.player!.advantage += Piece.valueByPieceName.get(move.capturedPiece.getName())!;
            for (const player of this.players) {
                if (player.color === move.capturedPiece.color) {
                    player.advantage -= Piece.valueByPieceName.get(move.capturedPiece.getName())!;
                }
            }
        }
    }

    getLastMove(): Move|null
    {
        return this.savedMoves[this.savedMoves.length - 1] ?? null;
    }

    abstract saveMove(move: Move): void;

    abstract deleteLastMove(): void

    showFirstMove(): void
    {
        while (this.currentMoveIndex > 0) {
            this.currentMoveIndex--;
            this.savedMoves[this.currentMoveIndex].undoMove();
        }
    }

    showPreviousMove(): void
    {
        if (this.currentMoveIndex > 0) {
            this.currentMoveIndex--;
            this.savedMoves[this.currentMoveIndex].undoMove();
        }
    }

    showNextMove(): void
    {
        if (this.currentMoveIndex < this.savedMoves.length) {
            this.savedMoves[this.currentMoveIndex].carryoutMove();
            this.currentMoveIndex++;
        }
    }

    goToLastMove(): void
    {
        while (this.currentMoveIndex < this.savedMoves.length) {
            this.savedMoves[this.currentMoveIndex].carryoutMove();
            this.currentMoveIndex++;
        }
    }

    spinChessboard(): void
    {
        this.isChessboardSpun = !this.isChessboardSpun;
    }
}
