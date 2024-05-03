import type { Coordinates } from "../coordinates/Position";
import { Direction } from "../coordinates/Direction";
import { PieceName } from "../types/PieceName";
import { Piece } from "./Piece";
import type { Player } from "../players/Player";
import type { Square } from "../squares/Square";
import { Move } from "../moves/Move";
import { Capture } from "../moves/Capture";
import type { Chessboard } from "../chessboards/Chessboard";

export class Knight extends Piece
{
    static Directions: Coordinates[] = [
        Direction.UpUpLeft, Direction.UpUpRight, Direction.UpRightRight, Direction.DownRightRight, 
        Direction.DownDownRight, Direction.DownDownLeft, Direction.DownLeftLeft, Direction.UpLeftLeft
    ];

    getName(): PieceName
    {
        return PieceName.Knight;
    }

    getMoves(player: Player, fromSquare: Square, chessboard: Chessboard, kingSquare: Square|null): Move[]
    {
        let moves: Move[] = [];
        let toSquare: Square|null = null;

        for (const direction of Knight.Directions) {
            if (toSquare = chessboard.getSquareByDirection(fromSquare, direction)) {
                if (toSquare.isEmpty()) {
                    let move: Move = new Move(fromSquare, toSquare);
                    if (!chessboard.isCheckedIfMoving(player, move, kingSquare)) {
                        moves.push(move);
                    }
                } else {
                    if (!toSquare.isOccupiedByAlly(this.color) && !toSquare.isOccupiedByPieceName(PieceName.King)) {
                        let move: Move = new Capture(fromSquare, toSquare, toSquare.piece);
                        if (!chessboard.isCheckedIfMoving(player, move, kingSquare)) {
                            moves.push(move);
                        }
                    }
                }
            }
        }

        return moves;
    }
}
