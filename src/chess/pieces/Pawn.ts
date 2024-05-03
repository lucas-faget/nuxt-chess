import type { Coordinates } from "../coordinates/Position";
import { Direction } from "../coordinates/Direction";
import { PieceName } from "../types/PieceName";
import type { PlayerColor } from "../types/PlayerColor";
import { Piece } from "./Piece";
import type { Square } from "../squares/Square";
import type { Player } from "../players/Player";
import { Move } from "../moves/Move";
import { Capture } from "../moves/Capture";
import { Promotion } from "../moves/Promotion";
import { EnPassantCapture } from "../moves/EnPassantCapture";
import type { Chessboard } from "../chessboards/Chessboard";
import { Chess } from "../games/Chess";

export class Pawn extends Piece
{
    constructor(color: PlayerColor)
    {
        super(color);
    }

    getName(): PieceName
    {
        return PieceName.Pawn;
    }

    getMoves(player: Player, fromSquare: Square, chessboard: Chessboard, kingSquare: Square|null, enPassantTarget: string|null): Move[]
    {
        let moves: Move[] = [];
        let toSquare: Square|null = fromSquare;

        toSquare = chessboard.getSquareByDirection(toSquare, player.direction);
        if (toSquare && toSquare.isEmpty()) {
            let move: Move;
            if (chessboard.getSquareByDirection(toSquare, player.direction)) {
                move = new Move(fromSquare, toSquare);
            } else {
                move = new Promotion(fromSquare, toSquare, null);
            }
            if (!chessboard.isCheckedIfMoving(player, move, kingSquare)) {
                moves.push(move);
            }
            if (Pawn.isPawnLine(fromSquare.position, player.direction, chessboard)) {
                toSquare = chessboard.getSquareByDirection(toSquare, player.direction);
                if (toSquare && toSquare.isEmpty()) {
                    let move: Move = new Move(fromSquare, toSquare);
                    if (!chessboard.isCheckedIfMoving(player, move, kingSquare)) {
                        moves.push(move);
                    }
                }
            }
        }

        for (const direction of Pawn.getCaptureDirections(player.direction)) {
            toSquare = chessboard.getSquareByDirection(fromSquare, direction);
            if (toSquare && toSquare.isOccupiedByOpponent(this.color) && !toSquare.isOccupiedByPieceName(PieceName.King)) {
                let move: Move;
                if (chessboard.getSquareByDirection(toSquare, player.direction)) {
                    move = new Capture(fromSquare, toSquare, toSquare.piece);
                } else {
                    move = new Promotion(fromSquare, toSquare, toSquare.piece);
                }
                if (!chessboard.isCheckedIfMoving(player, move, kingSquare)) {
                    moves.push(move);
                }
            }
        }

        return [
            ...moves,
            ...this.getEnPassantCapture(player, fromSquare, chessboard, kingSquare, enPassantTarget)
        ];
    }

    getEnPassantCapture(player: Player, fromSquare: Square, chessboard: Chessboard, kingSquare: Square|null, enPassantTarget: string|null): Move[]
    {
        let moves: Move[] = [];

        if (enPassantTarget) {
            let enPassantTargetSquare: Square|null = null;
            let toSquare: Square|null = null;

            for (const direction of [Direction.Left, Direction.Right]) {
                enPassantTargetSquare = chessboard.getSquareByDirection(fromSquare, direction);
                if (enPassantTargetSquare?.name === enPassantTarget) {
                    toSquare = chessboard.getSquareByDirection(enPassantTargetSquare, player.direction);
                    if (toSquare && toSquare.isEmpty()) {
                        let move: Move = new EnPassantCapture(fromSquare, toSquare, enPassantTargetSquare.piece!, enPassantTargetSquare);
                        if (!chessboard.isCheckedIfMoving(player, move, kingSquare)) {
                            moves.push(move);
                        }
                    }
                }
            }
        }

        return moves;
    }

    static getCaptureDirections(direction: Coordinates): Coordinates[]
    {
        if (Chess.areEqualCoordinates(direction, Direction.Up)) {
            return [Direction.UpLeft, Direction.UpRight];
        } else if (Chess.areEqualCoordinates(direction, Direction.Down)) {
            return [Direction.DownLeft, Direction.DownRight];
        } else if (Chess.areEqualCoordinates(direction, Direction.Right)) {
            return [Direction.UpRight, Direction.DownRight];
        } else if (Chess.areEqualCoordinates(direction, Direction.Left)) {
            return [Direction.UpLeft, Direction.DownLeft];
        } else {
            return [];
        }
    }

    static isPawnLine(position: Coordinates, direction: Coordinates, chessboard: Chessboard): boolean
    {
        if (direction.y === 0 && direction.x !== 0) {
            return (direction.x > 0 && position.x === 1)
                || (direction.x < 0 && position.x === chessboard.ranks.length - 2);
        }
    
        if (direction.x === 0 && direction.y !== 0) {
            return (direction.y > 0 && position.y === 1)
                || (direction.y < 0 && position.y === chessboard.ranks.length - 2);
        }
        
        return false;
    }
}
