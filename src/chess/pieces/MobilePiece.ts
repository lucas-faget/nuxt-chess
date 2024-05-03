import type { Coordinates } from "../coordinates/Position";
import { PieceName } from "../types/PieceName";
import { Piece } from "./Piece";
import type { Player } from "../players/Player";
import type { Square } from "../squares/Square";
import { Move } from "../moves/Move";
import { Capture } from "../moves/Capture";
import type { Chessboard } from "../chessboards/Chessboard";

export abstract class MobilePiece extends Piece
{
    directions: Coordinates[] = [];

    getMoves(player: Player, fromSquare: Square, chessboard: Chessboard, kingSquare: Square|null): Move[]
    {
        let moves: Move[] = [];
        let toSquare: Square|null = null;

        for (const direction of this.directions) {
            toSquare = fromSquare;
            while (toSquare = chessboard.getSquareByDirection(toSquare, direction)) {
                if (toSquare.isEmpty()) {
                    let move: Move = new Move(fromSquare, toSquare);
                    if (!chessboard.isCheckedIfMoving(player, move, kingSquare)) {
                        moves.push(move);
                    }
                } else {
                    if (toSquare.isOccupiedByOpponent(this.color) && !toSquare.isOccupiedByPieceName(PieceName.King)) {
                        let move: Move = new Capture(fromSquare, toSquare, toSquare.piece);
                        if (!chessboard.isCheckedIfMoving(player, move, kingSquare)) {
                            moves.push(move);
                        }
                    }
                    break;
                }
            }
        }

        return moves;
    }
}
