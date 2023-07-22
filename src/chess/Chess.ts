import { PlayerColor } from "./enums/PlayerColor";
import { PieceName } from "./enums/PieceName";
import { Player } from "./players/Player";
import { Piece } from "./pieces/Piece";
import { Row } from "./lines/Row";
import { Column } from "./lines/Column";
import type { Move } from "./moves/Move";
import { Chessboard } from "./Chessboard";
import { PlayerController } from "./players/PlayerController";

const Whites = new Player(PlayerColor.White, "Whites");
const Blacks = new Player(PlayerColor.Black, "Blacks");

// const Rows = [
//     new Row(0, '1', false, true, PlayerColor.White),
//     new Row(1, '2', true, false, PlayerColor.White),
//     new Row(2, '3', false, false),
//     new Row(3, '4', false, false),
//     new Row(4, '5', false, false),
//     new Row(5, '6', false, false),
//     new Row(6, '7', true, false, PlayerColor.Black),
//     new Row(7, '8', false, true, PlayerColor.Black),
// ];
// const Columns = [
//     new Column(0, 'a', PieceName.Rook),
//     new Column(1, 'b', PieceName.Knight),
//     new Column(2, 'c', PieceName.Bishop),
//     new Column(3, 'd', PieceName.Queen),
//     new Column(4, 'e', PieceName.King),
//     new Column(5, 'f', PieceName.Bishop),
//     new Column(6, 'g', PieceName.Knight),
//     new Column(7, 'h', PieceName.Rook),
// ];

export abstract class Chess
{
    players: Player[] = [Whites, Blacks];
    controller: PlayerController;
    chessboard: Chessboard;
    savedMoves: Move[] = [];
    currentMoveIndex: number = 0;
    isChessboardSpun: boolean = false;

    constructor(json: any) {
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
